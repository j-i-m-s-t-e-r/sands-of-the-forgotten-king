// Checks that the map page's layout agrees with the game's compass: wherever one room has a direct
// N/S/E/W exit to another, the map must put them the same way round (west is left, north is up).
// Usage: node tests/run-map.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
global.document = { getElementById: () => ({}), createElement: () => ({}), addEventListener() {} };
global.window = { addEventListener() {} };
vm.runInThisContext(fs.readFileSync(path.join(root, "src", "world-data.js"), "utf8"));
const W = vm.runInThisContext("WORLD");
const t = fs.readFileSync(path.join(root, "tools", "map-template.html"), "utf8");
const V = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] };
let checked = 0; const bad = [];
const sheets = t.match(/\{ id: "s\d"[\s\S]*?(?=\n  \{ id: "s\d"|\n\];)/g) || [];
for (const seg of sheets) {
  const sid = seg.match(/id: "(s\d)"/)[1];
  const [head, edgePart = ""] = seg.split("edges:");
  const nodes = {};
  for (const m of head.matchAll(/\["(\w+)",(\d+),(\d+)\]/g)) nodes[m[1]] = [+m[2], +m[3]];
  for (const m of edgePart.matchAll(/\["(\w+)","(\w+)"/g)) {
    const [a, b] = [m[1], m[2]];
    if (!(a in nodes && b in nodes && W.rooms[a])) continue;
    const dirs = Object.entries(W.rooms[a].exits).filter(([d, to]) => to === b && V[d]).map(([d]) => d);
    if (!dirs.length) continue;
    checked++;
    const dx = nodes[b][0] - nodes[a][0], dy = nodes[b][1] - nodes[a][1];
    const ok = dirs.some(d => (V[d][0] === 0 || dx * V[d][0] > 0) && (V[d][1] === 0 || dy * V[d][1] > 0));
    if (!ok) bad.push(`${sid}: ${a} -> ${b}: the game says ${dirs.join("/")}, the map puts ${b} at dx=${dx}, dy=${dy}`);
  }
}
if (bad.length) { console.error("FAIL: the map disagrees with the game's compass:\n  " + bad.join("\n  ")); process.exit(1); }
console.log("OK: the map agrees with the game's compass on all " + checked + " direct exits");
