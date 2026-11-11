// Class traffic over Supabase Realtime: a class channel with presence, and a
// channel per bench for its broadcasts. Loaded only when someone joins a class,
// so solo use never fetches it.
//
// Each connection gets its own client and socket, and a reconnect starts a new
// one: the library hands back an existing channel of the same name, and removing
// one finishes in the background, so reusing a client could pick up a channel
// that is still closing.
import { createClient } from "@supabase/supabase-js";
import { RELAY } from "./config.js";

const statusOf = (s) => (s === "SUBSCRIBED" ? "joined" : s === "CLOSED" ? "closed" : s === "CHANNEL_ERROR" || s === "TIMED_OUT" ? "error" : "connecting");
const newClient = () => createClient(RELAY.url, RELAY.key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: `circuits-class-${Math.random().toString(36).slice(2)}` },
  realtime: { params: { eventsPerSecond: 40 } },
});

export function supabaseTransport() {
  let client = null;
  let channel = null;
  const closing = new Map(); // topic → promise of its removal
  const remove = (ch) => {
    const topic = ch.topic;
    const done = Promise.resolve(client?.removeChannel(ch)).catch(() => {}).finally(() => { if (closing.get(topic) === done) closing.delete(topic); });
    closing.set(topic, done);
  };
  return {
    name: "supabase",
    connect(room, id, { onBroadcast, onPresence, onStatus }) {
      client ??= newClient();
      const ch = client.channel(room, { config: { broadcast: { self: false, ack: false }, presence: { key: id } } });
      channel = ch;
      // a channel this transport has let go of reports nothing more
      ch.on("broadcast", { event: "*" }, ({ event, payload }) => { if (ch === channel) onBroadcast(event, payload); });
      ch.on("presence", { event: "sync" }, () => {
        // each key may hold several entries while a reconnect overlaps; the last is current
        if (ch === channel) onPresence(Object.values(ch.presenceState()).map((list) => list[list.length - 1]));
      });
      ch.subscribe((status) => { if (ch === channel) onStatus(statusOf(status)); });
    },
    openSub(room, { onBroadcast, onStatus }) {
      let live = true, ch = null;
      const mine = client;
      // wait for a channel of the same name to finish closing before opening it again
      const topic = `realtime:${room}`;
      Promise.resolve(closing.get(topic)).then(() => {
        if (!live || mine !== client) return;
        ch = client.channel(room, { config: { broadcast: { self: false, ack: false } } });
        ch.on("broadcast", { event: "*" }, ({ event, payload }) => { if (live) onBroadcast(event, payload); });
        ch.subscribe((status) => { if (live) onStatus(statusOf(status)); });
      });
      return {
        send(event, payload) { if (live && ch) ch.send({ type: "broadcast", event, payload }); },
        close() { live = false; if (ch && mine === client) remove(ch); },
      };
    },
    track(payload) { return channel?.track(payload); },
    send(event, payload) { channel?.send({ type: "broadcast", event, payload }); },
    close() {
      // drop the whole client: a reconnect starts clean
      const old = client;
      channel = null;
      client = null;
      closing.clear();
      if (old) { old.removeAllChannels().catch(() => {}).finally(() => old.realtime.disconnect()); }
    },
  };
}
