// Plays the whole game from a list of commands, with no browser, and checks the result.
// Usage: node tests/run-playthrough.js [--verbose]
// It loads the three game files the same way the page does, feeds in the commands from
// part1-cairo-to-valley.txt and part2-pyramid-to-ending.txt, and expects to finish on
// the maximum score without dying.
const fs = require("fs"), path = require("path"), vm = require("vm");
const src = path.join(__dirname, "..", "src");
const out = [];
const el = { appendChild(n) { out.push(n.textContent); }, scrollTop: 0, scrollHeight: 0, addEventListener() {}, focus() {}, disabled: false };
global.document = { getElementById: () => el, createElement: () => ({ className: "", textContent: "" }), addEventListener() {}, hidden: false };
global.window = { addEventListener() {} };
global.localStorage = (() => { const s = {}; return { getItem: k => s[k] || null, setItem: (k, v) => { s[k] = v; }, removeItem: k => { delete s[k]; } }; })();
for (const f of ["world-data.js", "game-logic.js", "engine.js"]) {
  vm.runInThisContext(fs.readFileSync(path.join(src, f), "utf8"), { filename: f });
}
vm.runInThisContext("init()");
const read = f => fs.readFileSync(path.join(__dirname, f), "utf8").split("\n").map(l => l.trim()).filter(Boolean);
const commands = [...read("part1-cairo-to-valley.txt"), ...read("part2-pyramid-to-ending.txt")];
for (const c of commands) { out.push(">>> " + c); vm.runInThisContext("handleCommand(" + JSON.stringify(c) + ")"); }
const text = out.join("\n");
if (process.argv.includes("--verbose")) console.log(text);
const max = vm.runInThisContext("WORLD.maxScore");
const m = text.match(/FINAL SCORE: (\d+)\/(\d+)/);
const died = /YOU HAVE DIED/.test(text);
if (!m || died || Number(m[1]) !== max) {
  console.error(died ? "FAIL: the playthrough died." : "FAIL: expected FINAL SCORE " + max + "/" + max + ", got " + (m ? m[0] : "no ending"));
  process.exit(1);
}
console.log("OK: " + commands.length + " commands, " + m[0]);
