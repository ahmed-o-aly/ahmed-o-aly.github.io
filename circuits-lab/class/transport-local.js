// Class traffic between tabs of one browser, for development and automated
// checks without the relay: ?relay=local. Presence is a heartbeat each member
// sends; a member silent for four seconds has left.
export function localTransport() {
  let bc = null, me = null, timer = null, mine = null;
  const seen = new Map(); // id → { payload, at }
  let hooks = null;
  const publish = () => hooks?.onPresence([...seen.values()].map((s) => s.payload));
  const prune = () => {
    const now = Date.now();
    let gone = false;
    for (const [id, s] of seen) if (id !== me && now - s.at > 4000) { seen.delete(id); gone = true; }
    if (gone) publish();
  };
  return {
    name: "local",
    connect(room, id, h) {
      hooks = h;
      me = id;
      bc = new BroadcastChannel(room);
      bc.onmessage = ({ data }) => {
        if (data.type === "presence") { seen.set(data.id, { payload: data.payload, at: Date.now() }); publish(); }
        else if (data.type === "leave") { seen.delete(data.id); publish(); }
        else if (data.type === "broadcast") hooks.onBroadcast(data.event, data.payload);
      };
      timer = setInterval(() => { if (mine) bc.postMessage({ type: "presence", id: me, payload: mine }); prune(); }, 1000);
      setTimeout(() => hooks.onStatus("joined"), 0);
    },
    track(payload) {
      mine = payload;
      seen.set(me, { payload, at: Date.now() });
      bc?.postMessage({ type: "presence", id: me, payload });
      publish();
    },
    send(event, payload) { bc?.postMessage({ type: "broadcast", event, payload }); },
    close() { clearInterval(timer); bc?.postMessage({ type: "leave", id: me }); bc?.close(); bc = null; },
  };
}
