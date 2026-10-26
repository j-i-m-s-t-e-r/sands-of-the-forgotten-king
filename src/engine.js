// Generic text-adventure engine. Knows about rooms/objects/npcs/verbs.
// Knows NOTHING about Egypt — all game-specific behaviour lives in GAME (game-logic.js).
// Reuse this file as-is for a different game; only WORLD and GAME should change.

const DIR_WORDS = { n: "n", north: "n", s: "s", south: "s", e: "e", east: "e", w: "w", west: "w",
                    u: "u", up: "u", d: "d", down: "d", descend: "d" };
const VERBS = ["look", "inventory", "score", "examine", "read", "open", "get", "take",
               "talk", "ask", "give", "put", "buy", "hire", "sit", "wait", "help",
               "wear", "remove", "drink", "show", "wave", "hold", "point", "use",
               "drop", "throw", "eat", "water", "restart", "climb", "cut", "light", "extinguish",
               "jump", "play", "listen", "write", "turn", "pour", "fill", "unlock", "answer", "say",
               "unwrap", "tie", "swing", "clap", "shout", "push", "dig", "go", "walk", "yes", "knock",
               "place", "insert", "board", "stand", "enter", "leave", "step", "no", "return", "stay", "save", "load", "clean", "brush", "scrub", "apply", "splash", "spray", "squirt", "wash", "rinse", "lick", "taste",
               "toss", "lob", "chuck", "feed", "lead", "let", "trade", "swap", "exchange", "barter", "mount", "ride", "dismount", "swallow", "surrender", "close", "furl", "make", "build", "brew", "boil", "kindle", "cook", "fry", "roast", "grill", "start", "sleep", "rest", "doze", "nap", "share"];

// Natural phrasings a player might type instead of a verb+noun command. Checked
// against the whole input line (not just the first word) before normal parsing.
const WARES_QUERY_PHRASES = ["for sale", "what do you sell", "what can i buy",
                              "what have you got", "what are you selling"];

function isWaresQuery(input) {
  const norm = input.toLowerCase().replace(/[?!.]/g, "").trim();
  return WARES_QUERY_PHRASES.some(p => norm.includes(p));
}

// Any room object carrying a `price` field is "for sale" here — generic and
// data-driven, so a future shop room works automatically without engine changes.
// If a word could mean two or more items you can pick up or carry, ask which one.
// One match (the usual case: "amulet" is only the scarab amulet) just works.
const AMBIG_SKIP = new Set(["all", "everything", "it", "them"]);
function ambiguityPool(verb, segment) {
  const room = currentRoom ? currentRoom.objects : [];
  const inv = state.inventory;
  if (verb === "get" || verb === "take") return room;
  if (["drop", "give", "show", "wear", "remove"].includes(verb)) return inv;
  if (["put", "place", "insert"].includes(verb)) return segment === 0 ? inv : room.concat(inv);
  return room.concat(inv);
}
function ambiguousItems(phrase, pool) {
  if (!phrase || AMBIG_SKIP.has(phrase)) return null;
  const items = Array.from(new Set(pool)).filter(id => WORLD.objects[id] && (WORLD.objects[id].portable || state.inventory.includes(id)));
  const np = normName(phrase);
  if (items.some(id => normName(WORLD.objects[id].name) === np)) return null;   // a full name is specific enough
  const single = np.indexOf(" ") === -1;
  const hits = items.filter(id => {
    const o = WORLD.objects[id];
    if (!single) return o.aliases.some(a => normName(a) === np);
    return o.aliases.some(a => normName(a) === np) || normName(o.name).split(" ").includes(np);
  });
  // a longer, more specific alias that names exactly one of them settles it ("voss notebook")
  if (!single) return hits.length > 1 ? hits : null;
  return hits.length > 1 ? hits : null;
}
function findAmbiguity(verb, rest) {
  if (!["get", "take", "drop", "give", "show", "put", "place", "insert", "wear", "remove", "examine", "read", "x"].includes(verb)) return null;
  const segs = rest.split(/\s+(?:to|on|onto|in|into|with|at|from)\s+/i);
  const limit = (verb === "give" || verb === "show") ? 1 : Math.min(segs.length, 2);
  for (let i = 0; i < limit; i++) {
    const phrase = segs[i].toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(w => w && !["the", "a", "an", "my", "your"].includes(w)).join(" ");
    const hits = ambiguousItems(phrase, ambiguityPool(verb, i));
    if (hits) return { phrase, ids: hits };
  }
  return null;
}
function askWhich(amb, line) {
  const names = amb.ids.map(id => (/^[A-Za-z.]+'s /.test(WORLD.objects[id].name) ? "" : "the ") + WORLD.objects[id].name);
  const list = names.length === 2 ? names.join(" or ") : names.slice(0, -1).join(", ") + " or " + names[names.length - 1];
  state.pendingDisambig = { line: line, word: amb.phrase, options: amb.ids };
  print(`Which ${amb.phrase}? ${list.charAt(0).toUpperCase() + list.slice(1)}?`);
}

function doListWares() {
  const wares = currentRoom.objects.filter(id => {
    const obj = WORLD.objects[id];
    return obj && obj.price !== undefined && !state.inventory.includes(id);
  });
  const extra = GAME.extraWares ? GAME.extraWares(state, state.currentRoomId) : [];
  if (!wares.length && !extra.length) { print("Nothing here is currently for sale."); return; }
  extra.forEach(x => print(`${x[0]} — ${x[1]} piastres`));
  wares.forEach(id => {
    const obj = WORLD.objects[id];
    const price = (GAME.priceFor ? GAME.priceFor(state, id) : obj.price);
    print(`${obj.name} — ${price} piastres`);
  });
}

// Lets the player type an unambiguous prefix instead of a full verb ("exam" -> "examine").
// Requires 3+ letters and exactly one candidate match, so short/ambiguous input
// (e.g. "ta", which could mean "take" or "talk") is left alone rather than guessed at.
function resolveVerb(typed) {
  if (typed.length < 3) return typed;
  const matches = VERBS.filter(v => v.startsWith(typed));
  return matches.length === 1 ? matches[0] : typed;
}

let state = null;
let currentRoom = null;
let history = [];
let historyPos = 0;
let ROOM_TEXT = "";          // what has been said in this room so far, to tell "mentioned" from "not here"
let SILENT = false;          // while true, print() writes nothing (used to replay a route)
let NO_AUTOSAVE = false;     // while true, autosave is paused
let PRISTINE_JSON = null;    // the fresh game, kept so a debug jump can start from scratch

function $(id) { return document.getElementById(id); }

function addLine(text, cls) {
  if (SILENT) return;
  const out = $("output");
  const line = document.createElement("div");
  line.className = "line" + (cls ? " " + cls : "");
  line.textContent = text;
  out.appendChild(line);
}

// Text wrapped in [[map]] ... [[/map]] is shown as a fixed-width block so diagrams stay aligned.
// Remember the prose printed in this room (descriptions and the results of things you did), not the echo of
// your own commands or short system replies.
function rememberText(text) {
  const t = String(text);
  if (/^\s*>/.test(t) || t.length < 60) return;
  ROOM_TEXT = (ROOM_TEXT + " " + t.toLowerCase()).slice(-20000);
}

// Is the thing the player typed something this room has already mentioned (in its description, or in a
// result such as the photograph tucked into a mirror frame)?
function mentionedHere(word) {
  const STOP = new Set(["the", "a", "an", "my", "your", "it", "that", "this", "them", "all", "everything", "some", "one", "here", "there"]);
  const toks = String(word || "").toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(t => t.length >= 3 && !STOP.has(t));
  if (!toks.length) return false;
  const main = toks[toks.length - 1].replace(/'s$/, "");
  if (main.length < 3) return false;
  for (const w of new Set(ROOM_TEXT.split(/[^a-z']+/))) {
    if (w.length >= 3 && (w.startsWith(main) || (w.length >= 4 && main.startsWith(w)))) return true;
  }
  return false;
}

function notSeen(word) {
  return mentionedHere(word) ? "Nothing else to say about that." : "You don't see that here.";
}

function print(text) {
  rememberText(text);
  const parts = String(text).split(/\[\[map\]\]|\[\[\/map\]\]/);
  if (parts.length === 3) {
    addLine(parts[0]);
    addLine(parts[1].replace(/^\n+|\n+$/g, ""), "map");
    addLine(parts[2]);
  } else {
    addLine(text);
  }
  const out = $("output");
  out.scrollTop = out.scrollHeight;
}

function focusInput() {
  const el = $("input");
  if (!el) return;
  try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }
}

function submitInput() {
  const input = $("input");
  const val = input.value;
  input.value = "";
  if (val.trim()) {
    history.push(val);
    historyPos = history.length;
  }
  handleCommand(val);
  focusInput();
}

// "Voss's notebook", "voss notebook" and "Voss's  Notebook" are the same name; "note" is not inside "notebook".
function normName(s) {
  return String(s).toLowerCase().replace(/['\u2019]s\b/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}
function containsWords(phrase, alias) { return (" " + phrase + " ").includes(" " + alias + " "); }

function findObjectId(word) {
  word = word.toLowerCase().trim();
  if (!word) return null;
  const nw = normName(word);
  // Things that are actually here (in the room or carried) win over the rest of the world.
  const present = new Set([...(currentRoom ? currentRoom.objects : []), ...(state ? state.inventory : [])]);
  const exact = (id) => WORLD.objects[id].aliases.includes(word) || WORLD.objects[id].aliases.some(a => normName(a) === nw);
  const loose = (id) => WORLD.objects[id].aliases.some(a =>
    containsWords(nw, normName(a)) || (word.length >= 3 && a.startsWith(word)));
  const ids = Object.keys(WORLD.objects);
  const here = ids.filter(id => present.has(id));
  for (const id of here) if (exact(id)) return id;
  for (const id of ids) if (exact(id)) return id;
  for (const id of here) if (loose(id)) return id;
  for (const id of ids) if (loose(id)) return id;
  return null;
}

// Does object `id` answer to `word`? (same looseness as findObjectId)
function answersTo(id, word) {
  word = word.toLowerCase().trim();
  const nw = normName(word);
  return WORLD.objects[id].aliases.some(a => a === word || normName(a) === nw || containsWords(nw, normName(a)) || (word.length >= 3 && a.startsWith(word)));
}

// Edit distance that counts swapping two neighbouring letters as one slip ("kaism" -> "kasim").
function editDistance(a, b) {
  const d = [];
  for (let i = 0; i <= a.length; i++) { d[i] = [i]; }
  for (let j = 0; j <= b.length; j++) { d[0][j] = j; }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

// Last resort when a name matches nobody: forgive a small typo, but only for people standing here.
function fuzzyNpcHere(word) {
  const lim = word.length >= 6 ? 2 : word.length >= 4 ? 1 : 0;
  if (!lim || !currentRoom) return null;
  let best = null, bestD = 99;
  for (const id of currentRoom.npcs) {
    const names = WORLD.npcs[id].name.toLowerCase().replace(/^the\s+/, "").split(/\s+/).concat([id]);
    for (const nw of names) {
      const dist = editDistance(word, nw);
      if (dist <= lim && dist < bestD) { best = id; bestD = dist; }
    }
  }
  return best;
}

// Generic words people use for "the person standing here" ("talk to merchant" at the Tea Merchant's Stall).
const ROLE_WORDS = ["man", "fellow", "guy", "woman", "lady", "person", "merchant", "seller", "vendor", "dealer", "owner",
  "shopkeeper", "stallholder", "trader", "salesman", "keeper", "him", "her"];

// When someone is not found, say who IS here, so the player can see what went wrong.
function notHere() {
  const here = currentRoom ? currentRoom.npcs.map(id => WORLD.npcs[id].name) : [];
  if (!here.length) return "There is no one here to talk to.";
  return "They're not here. (" + here.join(" and ") + (here.length > 1 ? " are" : " is") + " here.)";
}

function findNpcId(word) {
  word = word.toLowerCase().trim().replace(/^(the|a|an)\s+/, "");
  if (!word) return null;
  const matches = (id) => {
    const npc = WORLD.npcs[id];
    return npc.name.toLowerCase().includes(word) || id === word;
  };
  // People in this room first, so "vendor" means the vendor standing here.
  for (const id of (currentRoom ? currentRoom.npcs : [])) if (matches(id)) return id;
  if (currentRoom && currentRoom.npcs.length === 1 && ROLE_WORDS.includes(word)) return currentRoom.npcs[0];
  for (const id in WORLD.npcs) if (matches(id)) return id;
  return fuzzyNpcHere(word);
}

function roomObjectsHere() {
  return currentRoom.objects.filter(id => !state.inventory.includes(id));
}

// Has this object been examined/read/opened at least once? Used both to
// decide which description to show and to annotate room/inventory listings.
function isExamined(objId) {
  return state.examined.has(objId);
}

function markExamined(objId) {
  const already = isExamined(objId);
  state.examined.add(objId);
  return already;
}

// A dark room needs a lit lamp that the player is carrying.
function isDark() {
  return !!(currentRoom && currentRoom.dark && !(GAME.hasLight && GAME.hasLight(state)));
}

function describeRoom() {
  if (isDark()) {
    print(`\n${currentRoom.name.toUpperCase()}`);
    print("It is pitch dark. You cannot see a thing, only feel the cold of the stone and hear it tick as it settles. You need a light.");
    return;
  }
  print(`\n${currentRoom.name.toUpperCase()}`);
  const desc = typeof currentRoom.desc === "function" ? currentRoom.desc(state) : currentRoom.desc;
  print(desc);

  const objs = roomObjectsHere();
  if (objs.length) {
    const listed = objs.map(id => {
      const obj = WORLD.objects[id];
      const tag = isExamined(id) ? ` (${obj.examinedLabel || "examined"})` : "";
      return obj.name + tag;
    });
    print("You can see: " + listed.join(", "));
  }
  if (currentRoom.npcs.length) {
    currentRoom.npcs.forEach(id => print(`${WORLD.npcs[id].name} is here.`));
  }
  let keys = Object.keys(currentRoom.exits);
  if (GAME.visibleExits) keys = GAME.visibleExits(state, state.currentRoomId, keys);
  if (keys.length) print("Exits: " + keys.map(d => d.toUpperCase()).join(", "));
  else if (GAME.noExitsText) { const why = GAME.noExitsText(state, state.currentRoomId); if (why) print("Exits: " + why); }
}


// ---------- Saving and loading ----------
const SAVE_AUTO = "entombed_autosave";
const SAVE_MANUAL = "entombed_save";

function snapshot() {
  const s = Object.assign({}, state);
  ["examined", "metNpcs", "worn", "inKit"].forEach(k => { s[k] = Array.from(state[k]); });
  const rooms = {};
  for (const id in WORLD.rooms) rooms[id] = { objects: WORLD.rooms[id].objects.slice(), npcs: WORLD.rooms[id].npcs.slice() };
  const portable = {};
  for (const id in WORLD.objects) portable[id] = !!WORLD.objects[id].portable;
  return { state: JSON.parse(JSON.stringify(s)), rooms, portable };
}

function writeSave(key) {
  try { localStorage.setItem(key, JSON.stringify(snapshot())); return true; }
  catch (err) { return false; }
}

function readSave(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
  catch (err) { return null; }
}

function restoreFrom(snap) {
  ROOM_TEXT = "";
  const s = snap.state;
  ["examined", "metNpcs", "worn", "inKit"].forEach(k => { s[k] = new Set(s[k]); });
  state = s;
  for (const id in snap.rooms) {
    if (!WORLD.rooms[id]) continue;
    WORLD.rooms[id].objects = snap.rooms[id].objects;
    WORLD.rooms[id].npcs = snap.rooms[id].npcs;
  }
  for (const id in snap.portable) if (WORLD.objects[id]) WORLD.objects[id].portable = snap.portable[id];
  currentRoom = WORLD.rooms[state.currentRoomId];
  history = [];
}

function doSave() {
  print(writeSave(SAVE_MANUAL) ? "Game saved." : "Saving isn't available here.");
}

function doLoad() {
  const snap = readSave(SAVE_MANUAL) || readSave(SAVE_AUTO);
  if (!snap) { print("There is no saved game to load."); return; }
  restoreFrom(snap);
  print("\nGame loaded.");
  describeRoom();
}

function autoSave() {
  if (NO_AUTOSAVE || state.flags.gameOver) return;
  writeSave(SAVE_AUTO);
}


// ---------- Debug: jump to any room with the best-score inventory for it ----------
// Type  **debug : valley   (also "debug valley", "**debug list").  It replays the full-score route,
// silently, up to the first time you stand in that room. It works when the page is opened from a
// file or from localhost, or when the address contains ?debug; on a public site it is switched off.
function debugAllowed() {
  if (typeof location === "undefined") return true;            // headless tests
  const host = location.hostname || "";
  return location.protocol === "file:" || host === "localhost" || host === "127.0.0.1" || /[?&#]debug\b/.test(location.href);
}

function debugNorm(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\b(the|of|a)\b/g, " ").replace(/\s+/g, " ").trim();
}

function debugFindRoom(arg) {
  const ids = Object.keys(WORLD.rooms);
  const raw = arg.toLowerCase().trim();
  if (ids.includes(raw)) return [raw];
  const q = debugNorm(arg);
  if (!q) return [];
  let hit = ids.filter(id => debugNorm(WORLD.rooms[id].name) === q || debugNorm(id) === q);
  if (hit.length) return hit;
  hit = ids.filter(id => debugNorm(id).startsWith(q));
  if (hit.length) return hit;
  return ids.filter(id => { const n = debugNorm(WORLD.rooms[id].name); return n.includes(q) || (n.length > 3 && q.includes(n)); });
}

function doDebug(arg) {
  if (typeof DEBUG_ROUTE === "undefined" || !PRISTINE_JSON) { print("[debug] No route file is loaded."); return; }
  const ids = Object.keys(WORLD.rooms);
  if (!arg || /^(list|help|\?)$/i.test(arg)) {
    print("[debug] **debug : <room> takes you to that room with the best-score inventory for it. Rooms: " + ids.join(", ") + ".");
    return;
  }
  const hits = debugFindRoom(arg);
  if (!hits.length) { print(`[debug] No room matches "${arg}". Try **debug list.`); return; }
  if (hits.length > 1) { print("[debug] Which room? " + hits.map(id => id + " (" + WORLD.rooms[id].name + ")").join("; ")); return; }
  const target = hits[0];
  restoreFrom(JSON.parse(PRISTINE_JSON));
  let steps = 0;
  SILENT = true; NO_AUTOSAVE = true;
  try {
    if (state.currentRoomId !== target) {
      for (const c of DEBUG_ROUTE) {
        handleCommand(c); steps++;
        if (state.currentRoomId === target) break;
      }
    }
  } finally { SILENT = false; NO_AUTOSAVE = false; }
  state.pendingNpc = null; state.pendingDisambig = null; state.pendingGive = null; state.pendingThrow = null;
  state.pendingSwing = false; state.pendingJump = false; state.pendingSleep = false;
  print(`[debug] Jumped to ${WORLD.rooms[target].name} (${steps} route commands replayed). Score ${state.score}/${WORLD.maxScore}.`);
  describeRoom();
}

// Enter a room: set it, describe it, then give the story a chance to react.
function goTo(roomId, describe) {
  ROOM_TEXT = "";
  state.currentRoomId = roomId;
  currentRoom = WORLD.rooms[roomId];
  state.pendingNpc = null;
  if (GAME.prepareRoom) GAME.prepareRoom(state, roomId);
  if (describe !== false) describeRoom();
  if (GAME.onEnter) { const extra = GAME.onEnter(state, roomId); if (extra) print(extra); }
  autoSave();
}

function move(dir) {
  // Story-specific movement (puzzle rooms, gates) is handled by GAME.interceptMove.
  const special = GAME.interceptMove ? GAME.interceptMove(state, dir) : null;
  if (special) {
    if (special.text) print(special.text);
    if (special.moveTo) goTo(special.moveTo, special.describe !== false);
    else if (special.describe) describeRoom();
    return;
  }

  const target = currentRoom.exits[dir];
  if (!target) { print("You can't go that way."); return; }
  goTo(target, true);
}

function doLook() { describeRoom(); }

function doInventory() {
  if (!state.inventory.length) { print("You're not carrying anything."); return; }
  const label = (id) => {
    const obj = WORLD.objects[id];
    const tags = [];
    if (state.worn.has(id)) tags.push("worn");
    if (isExamined(id)) tags.push(obj.examinedLabel || "examined");
    const extra = GAME.inventoryTag ? GAME.inventoryTag(state, id) : null;
    if (extra) tags.push(extra);
    return obj.name + (tags.length ? ` (${tags.join(", ")})` : "");
  };
  const loose = state.inventory.filter(id => !state.inKit.has(id));
  const inside = state.inventory.filter(id => state.inKit.has(id));
  const listed = loose.map(id => {
    if (WORLD.objects[id].container && inside.length) {
      return label(id) + " [containing: " + inside.map(label).join(", ") + "]";
    }
    return label(id);
  });
  print("You are carrying: " + listed.join(", "));
  if (GAME.inventoryExtras) GAME.inventoryExtras(state).forEach(line => print(line));
  print(`Money: ${state.money} piastres`);
}

function doScore() {
  print(`Score: ${state.score}/${WORLD.maxScore}`);
}

// EXAMINE / READ / OPEN all funnel through here. First interaction with an
// object can trigger a GAME-side effect (flags, score); repeat interactions
// show an alternate description if one's defined, so the world reflects
// what the player has already done.
function doExamine(target) {
  // "Your camel" is always the player's own animal, even where other camels are lying about.
  if (GAME.examineSpecial && /^(my |your |the )?camel$/i.test((target || "").trim())) {
    const mine = GAME.examineSpecial(state, target);
    if (mine) { print(mine); return; }
  }
  if (!target) { print("Examine what?"); return; }
  if (isDark()) {
    const id = findObjectId(target);
    if (!(id && state.inventory.includes(id))) { print("It is too dark to see anything."); return; }
  }
  const objId = findObjectId(target);
  if (objId && (state.inventory.includes(objId) || roomObjectsHere().includes(objId))) {
    const obj = WORLD.objects[objId];
    const alreadyExamined = markExamined(objId);
    let text = (alreadyExamined && obj.afterDesc) ? obj.afterDesc : obj.desc;
    if (typeof text === "function") text = text(state);
    print(text);
    if (!alreadyExamined && GAME.onExamine) {
      const extra = GAME.onExamine(state, objId);
      if (extra) print(extra);
    }
    return;
  }
  // "Your camel" beats "the Camel Trader" when the player actually has one.
  const special = GAME.examineSpecial ? GAME.examineSpecial(state, target) : null;
  if (special && /^(my |your |the )?camel$/i.test(target.trim())) { print(special); return; }
  const npcId = findNpcId(target);
  if (npcId && currentRoom.npcs.includes(npcId)) {
    print(WORLD.npcs[npcId].desc);
    return;
  }
  if (special) { print(special); return; }
  print(notSeen(target));
}

// Lower-case name for use in a sentence (objects may override with `short`).
function shortName(id) {
  const o = WORLD.objects[id];
  return o.short || o.name.toLowerCase();
}

// Once the player has the kit-bag, things they pick up go into it, unless
// they are too big (umbrella, pickaxe) or are the bag itself.
function autoStow(objId) {
  const o = WORLD.objects[objId];
  if (!state.inventory.includes("supplies")) return false;
  if (objId === "supplies" || o.container || o.tooBig || state.worn.has(objId)) return false;
  state.inKit.add(objId);
  return true;
}

function doGet(target) {
  if (!target) { print("Get what?"); return; }
  if (GAME.getUnseen) { const unseen = GAME.getUnseen(state, target); if (unseen) { print(unseen); return; } }
  if (GAME.handleExchange && !/^(on|onto|in|into|off)\b/i.test(target)) {
    const swap = GAME.handleExchange(state, "get", target);
    if (swap) { print(swap); return; }
  }
  if (/^(on|onto|in|into)\b/i.test(target) && GAME.handleBoard) { print(GAME.handleBoard(state, target) || "You can't get on that."); return; }
  if (/^off\b/i.test(target) && GAME.handleDisembark) { print(GAME.handleDisembark(state, target) || "You are not on anything."); return; }
  if (isDark() && !/\s(from|out of)\s/i.test(target)) {
    // The one thing you can always find in the dark is your own lamp.
    const lampHere = roomObjectsHere().includes("lamp") && answersTo("lamp", target);
    if (!lampHere) { print("You can't see to take anything. You need a light."); return; }
  }
  const from = target.match(/^(.+?)\s+(?:from|out of)\s+(.+)$/i);
  if (from) {
    const id = findObjectId(from[1].trim());
    if (id && state.inKit.has(id)) {
      state.inKit.delete(id);
      print(`You take the ${shortName(id)} out of the kit-bag.`);
    } else {
      print("It isn't in there.");
    }
    return;
  }
  if (target.trim().toLowerCase() === "all") {
    const here = roomObjectsHere();
    const portableHere = here.filter(id => WORLD.objects[id].portable && !WORLD.objects[id].noGetAll);
    const fixedHere = here.filter(id => !WORLD.objects[id].portable);
    if (!portableHere.length && !fixedHere.length) { print("There's nothing here worth taking."); return; }
    portableHere.forEach(id => {
      state.inventory.push(id);
      currentRoom.objects = currentRoom.objects.filter(o => o !== id);
      print(`Taken: ${WORLD.objects[id].name}` + (autoStow(id) ? " (stowed in the kit-bag)" : ""));
      if (GAME.onGet) { const x = GAME.onGet(state, id); if (x) print(x); }
    });
    if (!portableHere.length) { print("There's nothing here you can take with you."); }
    if (fixedHere.length) {
      const names = fixedHere.map(id => WORLD.objects[id].name.toLowerCase()).join(", ");
      print(`(Leaving the ${names} where ${names.indexOf(",") !== -1 || / and /.test(names) || /s$/.test(names) ? "they belong" : "it belongs"}.)`);
    }
    return;
  }
  let objId = findObjectId(target);
  if (!objId || !roomObjectsHere().includes(objId)) {
    // e.g. "orb" while already carrying another orb: look for one lying here.
    const alt = roomObjectsHere().find(id => answersTo(id, target));
    if (alt) objId = alt;
  }
  if (!objId) { const unseen = GAME.getUnseen ? GAME.getUnseen(state, target) : null;
    if (unseen) { print(unseen); return; }
    print(notSeen(target)); return; }
  if (!roomObjectsHere().includes(objId)) { const held = findObjectId(target);
    if (held && state.inventory.includes(held)) {
      const nm = WORLD.objects[held].name;
      const plural = /[^s]s$/i.test(nm);
      print(state.inKit.has(held) ? `The ${nm.toLowerCase()} ${plural ? "are" : "is"} already in your kit-bag.` : `You already have the ${nm.toLowerCase()}.`);
      return;
    }
    print(notSeen(target)); return; }
  const obj = WORLD.objects[objId];
  if (!obj.portable) {
    print(obj.noTakeMsg || `The ${obj.name.toLowerCase()} belongs right where it is — no reason to take it.`);
    return;
  }
  if (GAME.canGet) { const blocked = GAME.canGet(state, objId); if (blocked) { print(blocked); return; } }
  state.inventory.push(objId);
  currentRoom.objects = currentRoom.objects.filter(o => o !== objId);
  print(`Taken: ${obj.name}` + (autoStow(objId) ? " (stowed in the kit-bag)" : ""));
  if (GAME.onGet) { const x = GAME.onGet(state, objId); if (x) print(x); }
}

// The first time the player interacts with an NPC, show their one-time
// first-meeting line (if they have one) before anything else.
function maybeFirstMeet(npcId) {
  if (state.metNpcs.has(npcId)) return;
  state.metNpcs.add(npcId);
  const npc = WORLD.npcs[npcId];
  if (npc.firstMeet) print(npc.firstMeet);
}

function doTalk(target) {
  const npcId = findNpcId(target);
  if (!npcId || !currentRoom.npcs.includes(npcId)) {
    const inert = GAME.talkToObject ? GAME.talkToObject(state, target) : null;
    print(inert || notHere());
    return;
  }
  const npc = WORLD.npcs[npcId];
  maybeFirstMeet(npcId);
  print(typeof npc.greet === "function" ? npc.greet(state) : npc.greet);
  if (GAME.onTalk) { const extra = GAME.onTalk(state, npcId); if (extra) print(extra); }
  state.pendingNpc = npcId;
  const topicList = (GAME.topicsFor && GAME.topicsFor(state, npcId)) || npc.topics;
  if (topicList && topicList.length) {
    print(`(You could ask ${npc.name} about: ${topicList.join(", ")}.)`);
  }
}

// A topic typed as the first four or more letters of a listed topic ("pyra" for "pyramid") means that topic.
function expandTopic(npcId, topic) {
  const npc = WORLD.npcs[npcId];
  const list = (GAME.topicsFor && GAME.topicsFor(state, npcId)) || (npc && npc.topics) || [];
  const words = new Set();
  list.forEach(t => String(t).toLowerCase().split(/\s+/).forEach(w => { if (w.length >= 4) words.add(w); }));
  return String(topic || "").split(/(\s+)/).map(tok => {
    const t = tok.toLowerCase().replace(/[^a-z']/g, "");
    if (t.length < 4 || words.has(t)) return tok;
    const hits = [...words].filter(w => w.startsWith(t));
    return hits.length === 1 ? hits[0] : tok;
  }).join("");
}

function doAsk(rest) {
  // "ask about dates" with one person here means that person; with several, ask which.
  const lead = rest.match(/^about\s+(.+)$/i);
  if (lead) {
    const here = currentRoom.npcs;
    if (here.length === 1) rest = WORLD.npcs[here[0]].name.toLowerCase().replace(/^the /, "") + " about " + lead[1];
    else if (here.length > 1) { print("Ask whom? (" + here.map(id => WORLD.npcs[id].name).join(" or ") + ")"); return; }
    else { print("There is no one here to ask."); return; }
  }
  const aboutIdx = rest.toLowerCase().indexOf(" about ");
  if (aboutIdx === -1) {
    const npcId = findNpcId(rest.trim());
    if (npcId && currentRoom.npcs.includes(npcId)) {
      const npc = WORLD.npcs[npcId];
      state.pendingNpc = npcId;
      if (npc.topics && npc.topics.length) {
        print(`Ask ${npc.name} about what? Try: ${npc.topics.join(", ")}.`);
      } else {
        print(`Ask ${npc.name} about what, specifically?`);
      }
    } else {
      print("Ask them about what, specifically?");
    }
    return;
  }
  const who = rest.slice(0, aboutIdx).trim();
  const topic = rest.slice(aboutIdx + 7).trim();
  const npcId = findNpcId(who);
  if (!npcId || !currentRoom.npcs.includes(npcId)) {
    const inert = GAME.talkToObject ? GAME.talkToObject(state, who) : null;
    print(inert || notHere());
    return;
  }
  state.pendingNpc = npcId;
  maybeFirstMeet(npcId);
  const response = GAME.handleTopic(state, npcId, expandTopic(npcId, topic));
  print(response || `"I know nothing of this," ${WORLD.npcs[npcId].name} says.`);
}

function doGive(rest) {
  if (/camel/i.test(rest) && /water|drink|skin/i.test(rest)) { doWater("camel"); return; }
  if (/camel/i.test(rest) && /biscuit|custard|cream|treat/i.test(rest)) { print(GAME.feedCamelBiscuit(state)); return; }
  if (/biscuit|custard|cream/i.test(rest) && /\b(djinn|genie)\b/i.test(rest) && GAME.giveBiscuitDjinn) {
    const dj = GAME.giveBiscuitDjinn(state);
    if (dj && state.inventory.includes("custardcreams")) { print(dj); return; }
  }
  const toIdx = rest.toLowerCase().indexOf(" to ");
  if (toIdx === -1) {
    const here = currentRoom.npcs;
    if (here.length === 1 && rest.trim()) { doGive(rest.trim() + " to " + WORLD.npcs[here[0]].name.toLowerCase().replace(/^the /, "")); return; }
    if (rest.trim() && here.length > 1) {
      state.pendingGive = rest.trim();
      const oid = findObjectId(rest.trim());
      print("Give " + (oid ? "the " + WORLD.objects[oid].name.toLowerCase() : "it") + " to whom? (" + here.map(id => WORLD.npcs[id].name).join(" or ") + ")");
      return;
    }
    print("Give it to whom?");
    return;
  }
  const objWord = rest.slice(0, toIdx).trim();
  const npcWord = rest.slice(toIdx + 4).trim();
  const objId = findObjectId(objWord);
  const npcId = findNpcId(npcWord);
  if (!npcId || !currentRoom.npcs.includes(npcId)) { print(notHere()); return; }
  if (!objId || !state.inventory.includes(objId)) { print("You don't have that."); return; }
  print(GAME.handleGive(state, objId, npcId));
}

function doPut(rest) {
  const m = rest.match(/^(.+?)\s+(?:in|into|on|onto)\s+(.+)$/i);
  if (!m) { print("Put what where?"); return; }
  const objId = findObjectId(m[1].trim());
  if (!objId || !state.inventory.includes(objId)) { print("You don't have that."); return; }
  const targetId = findObjectId(m[2].trim());
  const target = targetId ? WORLD.objects[targetId] : null;
  if (target && target.container && state.inventory.includes(targetId)) {
    if (objId === targetId) { print("That would be quite a trick."); return; }
    if (WORLD.objects[objId].tooBig) { print("It's too big."); return; }
    state.inKit.add(objId);
    print(`You put the ${shortName(objId)} in the kit-bag.`);
    return;
  }
  const result = GAME.handlePut ? GAME.handlePut(state, objId, m[2].trim()) : null;
  print(result || "That doesn't go there.");
}

function doWear(target) {
  if (!target) { print("Wear what?"); return; }
  const objId = findObjectId(target);
  if (!objId || !state.inventory.includes(objId)) { print("You don't have that."); return; }
  const obj = WORLD.objects[objId];
  if (!obj.wearable) {
    const other = GAME.handleWearOther ? GAME.handleWearOther(state, objId) : null;
    print(other || "You can't wear that.");
    return;
  }
  if (state.worn.has(objId)) { print("You're already wearing that."); return; }
  state.worn.add(objId);
  print((GAME.handleWear && GAME.handleWear(state, objId)) || `You put on the ${obj.name.toLowerCase()}.`);
}

function doRemove(target) {
  if (!target) { print("Take off what?"); return; }
  const objId = findObjectId(target);
  if (!objId || !state.inventory.includes(objId)) { print("You don't have that."); return; }
  if (!state.worn.has(objId)) { print("You're not wearing that."); return; }
  const blocked = GAME.canRemove ? GAME.canRemove(state, objId) : null;
  if (blocked) { print(blocked); return; }
  state.worn.delete(objId);
  print((GAME.handleRemove && GAME.handleRemove(state, objId)) || `You take off the ${WORLD.objects[objId].name.toLowerCase()}.`);
}

function doDrink(rest) {
  print((GAME.handleDrink && GAME.handleDrink(state, rest)) || "You can't drink that.");
}

// SHOW / WAVE / HOLD / POINT / USE <item> (an optional "to/at <target>" is ignored)
function doUse(verb, rest) {
  // "spray the milestone with aftershave" means "spray aftershave on the milestone"
  const wm = rest.match(/^(.+?)\s+with\s+(.+)$/i);
  if (wm && /^(spray|squirt|splash|apply)$/.test(verb)) rest = wm[2] + " on " + wm[1];
  const word = rest.replace(/\s+(to|at|on)\s+.*$/i, "").trim();
  if (!word) { print(`${verb.charAt(0).toUpperCase() + verb.slice(1)} what?`); return; }
  const objId = findObjectId(word);
  if (!objId || !state.inventory.includes(objId)) { print("You don't have that."); return; }
  const result = GAME.handleUse ? GAME.handleUse(state, verb, objId, rest) : null;
  print(result || (verb === "show" ? "Nobody seems interested." : "Nothing much happens."));
}

// Everything the pyramid has stamped, worn or carried: what would fail the weigh-in at the lift.
function doDropTreasure() {
  const marked = state.inventory.filter(id => WORLD.objects[id].marked);
  if (!marked.length) { print("You are carrying nothing that bears the pyramid's mark."); return; }
  const kept = [];
  marked.forEach(id => {
    const blocked = GAME.canDrop ? GAME.canDrop(state, id) : null;
    if (blocked) { kept.push(id); return; }
    if (state.worn.has(id)) { state.worn.delete(id); print(`You take off the ${WORLD.objects[id].name.toLowerCase()}.`); }
    dropOne(id, true);
  });
  if (kept.length) {
    print("You keep " + kept.map(id => WORLD.objects[id].name).join(", ") + ", because you will need " + (kept.length > 1 ? "them" : "it") + " yet. If you are quite sure, DROP TREASURE again.");
  }
}

function doDrop(target) {
  if (!target) { print("Drop what?"); return; }
  const dropMsg = GAME.dropTest ? GAME.dropTest(state, target) : null;
  if (dropMsg) { print(dropMsg); return; }
  const t = target.trim().toLowerCase();
  if (/^((all|everything|the|my|all the|all my)\s+)?(treasure|treasures|marked|marked treasure|marked things|stamped|stamped things|loot|valuables)$/.test(t)) { doDropTreasure(); return; }
  if (t === "all" || t === "everything") {
    // At the lift, in the antechamber and in the garden, "all" also means what you are wearing that is marked.
    if (GAME.surrenderZone && GAME.surrenderZone(state)) doDropTreasure();
    const items = state.inventory.filter(id => !state.worn.has(id));
    if (!items.length) { if (!state.inventory.length) print("You have nothing to drop."); return; }
    const keep = [];
    const go = [];
    items.forEach(id => {
      const blocked = GAME.canDrop ? GAME.canDrop(state, id) : null;
      if (blocked) keep.push({ id, msg: blocked }); else go.push(id);
    });
    go.forEach(id => dropOne(id, true));
    const needed = keep.filter(k => /^(Something tells you|The voice at the edge)/.test(k.msg));
    const other = keep.filter(k => !needed.includes(k));
    other.forEach(k => print(`${WORLD.objects[k.id].name}: ${k.msg}`));
    if (needed.length) {
      print("You keep " + needed.map(k => WORLD.objects[k.id].name).join(", ") + ", because you will need " + (needed.length > 1 ? "them" : "it") + " yet. If you are quite sure, DROP ALL again.");
    }
    return;
  }
  let objId = findObjectId(target);
  if (!objId || !state.inventory.includes(objId)) {
    const alt = state.inventory.find(id => answersTo(id, target));
    if (alt) objId = alt;
  }
  if (!objId || !state.inventory.includes(objId)) { print("You don't have that."); return; }
  if (state.worn.has(objId)) { print("You are wearing that. Take it off first."); return; }
  dropOne(objId, false);
}

function dropOne(objId, quiet) {
  const obj = WORLD.objects[objId];
  const blocked = GAME.canDrop ? GAME.canDrop(state, objId) : null;
  if (blocked) { print(blocked); return; }
  state.inventory = state.inventory.filter(i => i !== objId);
  state.inKit.delete(objId);
  currentRoom.objects.push(objId);
  print(`Dropped: ${obj.name}`);
  if (obj.container) {
    // Everything inside spills out onto the floor with it.
    const spilled = state.inventory.filter(i => state.inKit.has(i));
    spilled.forEach(i => {
      state.inventory = state.inventory.filter(x => x !== i);
      state.inKit.delete(i);
      currentRoom.objects.push(i);
      if (GAME.onDrop) { const x = GAME.onDrop(state, i); if (x) print(x); }
    });
    if (spilled.length) print("Its contents spill out: " + spilled.map(i => WORLD.objects[i].name).join(", ") + ".");
  }
  if (GAME.onDrop) { const extra = GAME.onDrop(state, objId); if (extra) print(extra); }
}

function doThrow(rest) {
  print((GAME.handleThrow && GAME.handleThrow(state, rest)) || "You can't throw that.");
}

function doEat(rest) {
  print((GAME.handleEat && GAME.handleEat(state, rest)) || "You can't eat that.");
}

function doWater(rest) {
  print((GAME.handleWater && GAME.handleWater(state, rest)) || "There's nothing to water here.");
}

function doClimb(rest) {
  if (/\b(lift|platform|camel)\b/i.test(rest) && GAME.handleBoard) { print(GAME.handleBoard(state, rest) || "You can't climb that."); return; }
  print((GAME.handleClimb && GAME.handleClimb(state, rest)) || "You can't climb that.");
}

function doCut(rest) {
  print((GAME.handleCut && GAME.handleCut(state, rest)) || "You can't cut that.");
}

function doLight(verb, rest) {
  print((GAME.handleLight && GAME.handleLight(state, verb, rest)) || "You can't do that.");
}

function doGeneric(name, rest, fallback) {
  const h = GAME["handle" + name];
  print((h && h.call(GAME, state, rest)) || fallback);
}

// ANSWER / SAY: reply to whoever you are talking to, same as "ABOUT ...".
function doAnswer(rest) {
  if (!rest.trim()) { print("Say what?"); return; }
  if (GAME.handleSay) { const r = GAME.handleSay(state, rest); if (r) { print(r); return; } }
  if (!state.pendingNpc || !currentRoom.npcs.includes(state.pendingNpc)) { print("There is nobody to answer."); return; }
  const npc = WORLD.npcs[state.pendingNpc];
  const response = GAME.handleTopic(state, state.pendingNpc, expandTopic(state.pendingNpc, rest.replace(/^(that|it is|it's)\s+/i, "").trim()));
  print(response || `"I know nothing of this," ${npc.name} says.`);
}

function doBuy(rest) {
  print(GAME.handleBuy(state, rest));
}

function handleCommandInner(raw) {
  let input = raw.trim();
  const dbg = input.match(/^\s*\*{0,2}\s*debug\b\s*:?\s*(.*)$/i);
  if (dbg && debugAllowed()) { doDebug(dbg[1].trim()); return; }
  if (!input) return;
  print(`\n> ${input}`);

  if (!state.flags.gameOver && GAME.preCommand) {
    const pre = GAME.preCommand(state, input);
    if (pre && typeof pre === "object" && pre.rewrite) input = pre.rewrite;   // same action, said another way
    else if (pre) { print(pre); return; }
  }

  if (state.flags.gameOver) {
    if (/^load$/i.test(input)) {
      doLoad();
    } else if (/^restart$/i.test(input)) {
      if (typeof location !== "undefined" && location.reload) location.reload();
      else print("Refresh the page to restart.");
    } else {
      print("The game is over. Type RESTART to begin again, or LOAD to return to your last save.");
    }
    return;
  }

  if (isWaresQuery(input)) { doListWares(); return; }

  // The player is answering "In what direction?"
  if (state.pendingThrow) {
    const item = state.pendingThrow;
    state.pendingThrow = null;
    const dm = input.toLowerCase().match(/\b(north|south|east|west|n|s|e|w)\b/);
    if (dm && input.trim().split(/\s+/).length <= 4) { doThrow(item + " " + dm[1]); return; }
  }

  // The player is answering "Give it to whom?"
  if (state.pendingGive) {
    const what = state.pendingGive;
    state.pendingGive = null;
    const who = input.replace(/^(to|the)\s+/i, "").replace(/^(the)\s+/i, "").trim();
    const npc = findNpcId(who);
    if (npc && currentRoom.npcs.includes(npc)) { doGive(what + " to " + who); return; }
  }

  // The player is answering "Which amulet?": a word or two is enough ("lapis", "the green one").
  if (state.pendingDisambig) {
    const pd = state.pendingDisambig;
    state.pendingDisambig = null;
    const words = input.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(w => w && !["the", "a", "an", "one", "my"].includes(w));
    if (words.length && words.length <= 3) {
      const hits = pd.options.filter(id => {
        const nm = normName(WORLD.objects[id].name).split(" ");
        return words.every(w => nm.includes(normName(w)));
      });
      if (hits.length === 1) {
        const completed = pd.line.replace(new RegExp("\\b" + pd.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i"), WORLD.objects[hits[0]].name.toLowerCase());
        handleCommandInner(completed);
        return;
      }
    }
  }

  // Continuation of a pending "ask about what?" exchange — the player answers
  // with just "about <topic>" instead of repeating "ask <npc> about <topic>".
  if (state.pendingNpc && /^about\s+/i.test(input)) {
    const topic = input.replace(/^about\s+/i, "").trim();
    const npc = WORLD.npcs[state.pendingNpc];
    if (!npc || !currentRoom.npcs.includes(state.pendingNpc)) {
      print("They're not here anymore.");
      state.pendingNpc = null;
    } else {
      const response = GAME.handleTopic(state, state.pendingNpc, expandTopic(state.pendingNpc, topic));
      print(response || `"I know nothing of this," ${npc.name} says.`);
    }
    return;
  }

  const parts = input.split(/\s+/);
  const verb = resolveVerb(parts[0].toLowerCase());
  const rest = parts.slice(1).join(" ");

  if (DIR_WORDS[verb]) { move(DIR_WORDS[verb]); return; }

  const amb = findAmbiguity(verb, rest);
  if (amb) { askWhich(amb, input); return; }

  switch (verb) {
    case "look": case "l": doLook(); return;
    case "inventory": case "inv": case "i": doInventory(); return;
    case "score": doScore(); return;
    case "examine": case "x": case "read": doExamine(rest); return;
    case "open": {
      const m = rest.match(/^(.*?)\s+(?:with|using|by)\s+(.+)$/i);
      const objPart = m ? m[1] : rest;
      const tool = m ? m[2].toLowerCase() : "";
      const id = findObjectId(objPart);
      if (id && (state.inventory.includes(id) || roomObjectsHere().includes(id)) && GAME.handleOpen) {
        const r = GAME.handleOpen(state, id, tool);
        if (r) { print(r); return; }
      }
      doExamine(objPart); return;
    }
    case "drop": doDrop(rest); return;
    case "surrender": doDropTreasure(); return;
    case "close": case "furl": doGeneric("Close", rest, "You can't close that."); return;
    case "make": case "build": case "brew": case "boil": case "kindle": case "cook": case "fry": case "roast": case "grill": case "start":
      doGeneric("Make", (verb === "brew" || verb === "boil") && !/tea|brew/.test(rest) ? "tea " + rest : (verb === "kindle" || verb === "build" || verb === "start") && !rest ? "fire" : rest, "You can't make that."); return;
    case "sleep": case "rest": case "doze": case "nap": doGeneric("Sleep", rest, "You are not tired enough to sleep here."); return;
    case "share": if (/camel/i.test(rest) || /water/i.test(rest)) { doWater("camel"); return; } print("Share what?"); return;
    case "throw": case "toss": case "lob": case "chuck": doThrow(rest); return;
    case "feed": case "lead": case "let":
      if (/camel/i.test(rest)) {
        if (/biscuit|custard|cream|treat/i.test(rest)) { print(GAME.feedCamelBiscuit(state)); return; }
        doWater("camel"); return;
      }
      print(verb === "let" ? "Let what?" : "You can't do that."); return;
    case "eat": case "swallow": doEat(rest); return;
    case "water": doWater(rest); return;
    case "climb": doClimb(rest); return;
    case "jump": doGeneric("Jump", rest, "You jump on the spot. Nothing happens, and you feel faintly foolish."); return;
    case "play": doGeneric("Play", rest, "You can't play that."); return;
    case "listen": doGeneric("Listen", rest, "You listen. Nothing much."); return;
    case "write": doGeneric("Write", rest, "You can't write that here."); return;
    case "turn": doGeneric("Turn", rest, "You can't turn that."); return;
    case "pour": doGeneric("Pour", rest, "You can't pour that."); return;
    case "fill": doGeneric("Fill", rest, "You can't fill that."); return;
    case "unlock": doGeneric("Unlock", rest, "There is nothing here to unlock."); return;
    case "answer": case "say": doAnswer(rest); return;
    case "unwrap": doGeneric("Unwrap", rest, "You can't unwrap that."); return;
    case "tie": doGeneric("Tie", rest, "You can't tie that."); return;
    case "swing": doGeneric("Swing", rest, "There is nothing here to swing on."); return;
    case "clap": doGeneric("Clap", rest, "You clap. Nothing much comes of it."); return;
    case "shout": doGeneric("Shout", rest, "You shout. It does not help."); return;
    case "push": doGeneric("Push", rest, "Nothing happens."); return;
    case "knock": doGeneric("Push", rest, "Nothing answers."); return;
    case "dig": doGeneric("Dig", rest, "There is nothing here to dig."); return;
    case "yes": doGeneric("Yes", rest, "That was not a question."); return;
    case "go": case "walk": {
      const wallMatch = rest.match(/^(?:to\s+)?(?:the\s+)?(north|south|east|west|centre|center|middle)(?:\s+wall)?$/i);
      if (wallMatch && GAME.handleGoTo) {
        const r = GAME.handleGoTo(state, wallMatch[1].toLowerCase());
        if (r) { print(r); return; }
      }
      const dirWord = rest.trim().toLowerCase().replace(/^(to\s+)?(the\s+)?/, "");
      if (DIR_WORDS[dirWord]) { move(DIR_WORDS[dirWord]); return; }
      print("Go where? Try a direction."); return;
    }
    case "cut": doCut(rest); return;
    case "light": case "extinguish": doLight(verb, rest); return;
    case "clean": case "brush": case "scrub": doGeneric("Clean", rest, "You can't clean that."); return;
    case "apply": case "splash": case "spray": case "squirt": doUse(verb, rest); return;
    case "wash": case "rinse": doGeneric("Wash", rest, "You can't wash that."); return;
    case "lick": case "taste": doGeneric("Taste", rest, "You decide against it."); return;
    case "trade": case "swap": case "exchange": case "barter": print(GAME.handleTrade(state, rest)); return;
    case "mount": case "ride": print(GAME.handleMount(state)); return;
    case "dismount": print(GAME.handleDismount(state)); return;
    case "save": doSave(); return;
    case "load": doLoad(); return;
    case "restart":
      if (typeof location !== "undefined" && location.reload) { location.reload(); }
      else { print("Refresh the page to restart."); }
      return;
    case "get": doGet(rest); return;
    case "take":
      if (/^off\s+/i.test(rest)) { doRemove(rest.replace(/^off\s+/i, "")); return; }
      doGet(rest); return;
    case "talk": {
      let target = rest.replace(/^to\s+/i, "").replace(/^with\s+/i, "");
      if (target.toLowerCase().indexOf(" about ") !== -1) { doAsk(target); return; }
      doTalk(target.trim());
      return;
    }
    case "ask": doAsk(rest); return;
    case "give": doGive(rest); return;
    case "buy": doBuy(rest); return;
    case "put":
      if (/^on\s+/i.test(rest)) { doWear(rest.replace(/^on\s+/i, "")); return; }
      doPut(rest); return;
    case "wear": doWear(rest); return;
    case "place": case "insert": doPut(rest); return;
    case "board": case "stand": doGeneric("Board", rest, "There is nothing here to board."); return;
    case "enter": doGeneric("Enter", rest, "You can't enter that."); return;
    case "leave": case "step": doGeneric("Disembark", rest, "You are not on anything."); return;
    case "no": case "stay": doGeneric("No", rest, "That was not a question."); return;
    case "return": doGeneric("Yes", rest, "Return to what?"); return;
    case "remove": doRemove(rest); return;
    case "drink": doDrink(rest); return;
    case "show": case "wave": case "hold": case "point": case "use": doUse(verb, rest); return;
    case "hire":
      print(GAME.handleHireCamel(state)); return;
    case "sit":
      print("You sit for a moment. Nothing happens, but it's a nice chair."); return;
    case "wait": case "z":
      print("Time passes."); return;
    case "help":
      print("Move with N, S, E, W, U, D. Look around with LOOK; EXAMINE things to learn more, including how they feel. GET and DROP things; INVENTORY shows what you carry. TALK to people, ASK <name> ABOUT <subject>, or answer with ABOUT <subject>. GIVE, BUY, WEAR, REMOVE, PUT, OPEN, CLIMB, CUT, DIG, TURN, POUR, FILL, LIGHT and EXTINGUISH your lamp, PLAY, LISTEN, CLAP, SHOUT, JUMP and THROW all work too. You can type the first few letters of a word. SCORE shows your score. SAVE and LOAD keep your place (the game also saves itself as you go). Use the up and down arrow keys to recall earlier commands.");
      return;
    default:
      print("I don't understand that.");
  }
}

// A hard death: forget everything, clear the automatic save, and begin again in the hotel.
function doHardReset() {
  try { localStorage.removeItem(SAVE_AUTO); } catch (err) { /* nothing to clear */ }
  const hasManual = !!readSave(SAVE_MANUAL);
  restoreFrom(JSON.parse(PRISTINE_JSON));
  print("\nA Cairo morning, 1936. You arrived last night off the boat from London with a headache, a hotel room, and a telegram you have read so many times on the voyage that it has gone soft at the folds.\n");
  if (hasManual) print("(A game you saved yourself, with SAVE, can still be loaded: type LOAD.)");
  describeRoom();
}

function handleCommand(raw) {
  if (!raw.trim()) return;
  const before = state.currentRoomId;
  handleCommandInner(raw);
  if (state.hardReset) { doHardReset(); return; }
  if (GAME.afterCommand && !state.flags.gameOver) {
    const extra = GAME.afterCommand(state, before, raw);
    if (extra) print(extra);
  }
  if (state.forceMove && !state.flags.gameOver) {
    const dest = state.forceMove;
    state.forceMove = null;
    goTo(dest, true);
  }
}

function init() {
  state = GAME.initialState();
  state.currentRoomId = WORLD.startRoom;
  state.inventory = (GAME.startInventory || []).slice();
  state.metNpcs = new Set();
  state.worn = new Set(GAME.startWorn || []);
  state.inKit = new Set();
  state.examined = new Set();
  state.pendingNpc = null;
  currentRoom = WORLD.rooms[state.currentRoomId];
  PRISTINE_JSON = JSON.stringify(snapshot());

  print("SANDS OF THE FORGOTTEN KING");
  let canSave = true;
  try { localStorage.setItem("sotfk_probe", "1"); localStorage.removeItem("sotfk_probe"); } catch (err) { canSave = false; }
  if (canSave) {
    print("Your progress saves automatically on this device, in this browser. Type SAVE to save at any moment, and LOAD to return to a saved game.");
  } else {
    print("Saving is not available in this browser, so your progress will be lost if you close or reload the page.");
    $("hint").textContent = "Saving is unavailable in this browser, so progress is lost if you close the page. Type HELP for commands.";
  }
  if (readSave(SAVE_MANUAL) || readSave(SAVE_AUTO)) print("(A saved game was found. Type LOAD to continue it.)");
  print("A Cairo morning, 1936. You arrived last night off the boat from London with a headache, a hotel room, and a telegram you have read so many times on the voyage that it has gone soft at the folds.\n");
  describeRoom();

  const input = $("input");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      submitInput();
    } else if (e.key === "ArrowUp") {
      if (historyPos > 0) {
        historyPos--;
        input.value = history[historyPos];
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (historyPos < history.length - 1) {
        historyPos++;
        input.value = history[historyPos];
      } else {
        historyPos = history.length;
        input.value = "";
      }
      e.preventDefault();
    }
  });

  // Keep the cursor in the command box without the player ever having to click it.
  $("send").addEventListener("click", submitInput);
  window.addEventListener("load", focusInput);
  window.addEventListener("focus", focusInput);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) focusInput(); });
  document.addEventListener("click", () => {
    const sel = window.getSelection ? String(window.getSelection()) : "";
    if (!sel) focusInput();           // do not steal focus while the player is selecting text
  });
  document.addEventListener("keydown", (e) => {
    if (document.activeElement !== input && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) focusInput();
  });
  focusInput();
  setTimeout(focusInput, 50);
  setTimeout(focusInput, 400);
}

window.addEventListener("DOMContentLoaded", init);
