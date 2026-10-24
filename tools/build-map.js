// Builds docs/game-map.html from the real room data (names and exits), so the map never drifts.
// The hand-written room descriptions, sheets and edges live in tools/map-template.html.
// Usage: node tools/build-map.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const src = path.join(__dirname, "..", "src");
const el = { appendChild() {}, addEventListener() {}, focus() {} };
global.document = { getElementById: () => el, createElement: () => ({}), addEventListener() {}, hidden: false };
global.window = { addEventListener() {} };
for (const f of ["world-data.js", "game-logic.js", "engine.js"]) vm.runInThisContext(fs.readFileSync(path.join(src, f), "utf8"));
const R = vm.runInThisContext("WORLD.rooms");
const names = {}, exits = {};
for (const id in R) {
  names[id] = R[id].name;
  exits[id] = Object.entries(R[id].exits).filter(([d, t]) => t !== id).map(([d, t]) => ({ dir: d.toUpperCase(), to: t }));
}
let t = fs.readFileSync(path.join(__dirname, "map-template.html"), "utf8");
t = t.replace("/*GAMEDATA*/", "const GAME = " + JSON.stringify({ names, exits }) + ";");
const outFile = path.join(__dirname, "..", "docs", "game-map.html");
fs.writeFileSync(outFile, t);
console.log(Object.keys(R).length + " rooms written to " + path.relative(process.cwd(), outFile));
