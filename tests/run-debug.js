// Checks the **debug jump: it must be able to take the player to every room in the game.
// Usage: node tests/run-debug.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const src = path.join(__dirname, "..", "src");
const el = { appendChild() {}, scrollTop: 0, scrollHeight: 0, addEventListener() {}, focus() {}, disabled: false };
global.document = { getElementById: () => el, createElement: () => ({ className: "", textContent: "" }), addEventListener() {}, hidden: false };
global.window = { addEventListener() {} };
global.localStorage = (() => { const s = {}; return { getItem: k => s[k] || null, setItem: (k, v) => { s[k] = v; }, removeItem: k => { delete s[k]; } }; })();
for (const f of ["world-data.js", "game-logic.js", "debug-route.js", "engine.js"]) {
  vm.runInThisContext(fs.readFileSync(path.join(src, f), "utf8"), { filename: f });
}
vm.runInThisContext("init()");
const rooms = Object.keys(vm.runInThisContext("WORLD.rooms"));
const bad = [];
for (const r of rooms) {
  vm.runInThisContext("handleCommand(" + JSON.stringify("**debug : " + r) + ")");
  const here = vm.runInThisContext("state.currentRoomId");
  if (here !== r) bad.push(r + " -> " + here);
}
if (bad.length) { console.error("FAIL: the debug jump missed: " + bad.join(", ")); process.exit(1); }
console.log("OK: the debug jump reaches all " + rooms.length + " rooms");
