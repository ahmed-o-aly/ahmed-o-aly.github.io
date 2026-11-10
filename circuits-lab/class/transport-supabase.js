// Class traffic over Supabase Realtime: one channel per class, with broadcast for
// benches and hands and presence for who is there and what they are viewing.
// Loaded only when someone joins a class, so solo use never fetches it.
import { createClient } from "@supabase/supabase-js";
import { RELAY } from "./config.js";

let client = null;
export function supabaseTransport() {
  let channel = null;
  return {
    name: "supabase",
    connect(room, id, { onBroadcast, onPresence, onStatus }) {
      client ??= createClient(RELAY.url, RELAY.key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        realtime: { params: { eventsPerSecond: 40 } },
      });
      channel = client.channel(room, { config: { broadcast: { self: false, ack: false }, presence: { key: id } } });
      channel.on("broadcast", { event: "*" }, ({ event, payload }) => onBroadcast(event, payload));
      channel.on("presence", { event: "sync" }, () => {
        // each key may hold several entries while a reconnect overlaps; the last is current
        onPresence(Object.values(channel.presenceState()).map((list) => list[list.length - 1]));
      });
      channel.subscribe((status) => onStatus(status === "SUBSCRIBED" ? "joined" : status === "CLOSED" ? "closed" : status === "CHANNEL_ERROR" || status === "TIMED_OUT" ? "error" : "connecting"));
    },
    track(payload) { return channel?.track(payload); },
    send(event, payload) { channel?.send({ type: "broadcast", event, payload }); },
    close() { if (channel) client.removeChannel(channel); channel = null; },
  };
}
