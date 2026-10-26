// Checks the rules that were set from play-testing: hard deaths, the brushed Stone, the gate guard,
// the new room layout and the low-score ending line. Usage: node tests/run-rules.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const src = path.join(__dirname, "..", "src");
const out = [];
const el = { appendChild(n) { out.push(n.textContent || ""); }, scrollTop: 0, scrollHeight: 0, addEventListener() {}, focus() {}, disabled: false };
global.document = { getElementById: () => el, createElement: () => ({ className: "", textContent: "" }), addEventListener() {}, hidden: false };
global.window = { addEventListener() {} };
global.localStorage = (() => { const s = {}; return { getItem: k => s[k] || null, setItem: (k, v) => { s[k] = v; }, removeItem: k => { delete s[k]; } }; })();
for (const f of ["world-data.js", "game-logic.js", "engine.js"]) vm.runInThisContext(fs.readFileSync(path.join(src, f), "utf8"), { filename: f });
vm.runInThisContext("init()");
const ev = c => vm.runInThisContext(c);
let failures = 0;
const check = (name, ok) => { console.log((ok ? "ok   " : "FAIL ") + name); if (!ok) failures++; };
const fresh = (setup) => { ev("restoreFrom(JSON.parse(PRISTINE_JSON));NO_AUTOSAVE=true"); ev(setup); };
const run = c => { out.length = 0; ev("handleCommand(" + JSON.stringify(c) + ")"); return out.join(" "); };
const where = () => ev("state.currentRoomId");

fresh('state.currentRoomId="dunes";currentRoom=WORLD.rooms.dunes;state.score=215;state.flags.hasCamel=true;state.riding=true');
run("n"); check("dunes: the right way works untested", where() === "dunes" && ev("state.duneStage") === 1);
fresh('state.currentRoomId="dunes";currentRoom=WORLD.rooms.dunes;state.score=215;state.flags.hasCamel=true;state.riding=true');
let t = run("s");
check("dunes: one wrong move is a hard death back to the hotel", where() === "hotel" && ev("state.score") === 0 && /YOU HAVE DIED/.test(t));

fresh('state.currentRoomId="valley";currentRoom=WORLD.rooms.valley;state.flags.entranceFound=true;state.flags.hasCamel=true;state.riding=true;state.score=170');
t = run("d");
check("rope: going down with no lamp is a hard death back to the hotel", where() === "hotel" && ev("state.score") === 0 && /YOU HAVE DIED/.test(t));
fresh('state.currentRoomId="valley";currentRoom=WORLD.rooms.valley;state.flags.entranceFound=true;state.flags.hasCamel=true;state.riding=true;state.inventory.push("lamp")');
run("d"); check("rope: with a lamp you arrive at the stairway", where() === "stairway");

fresh('state.currentRoomId="citygate";currentRoom=WORLD.rooms.citygate;state.flags.hasSupplies=true;state.flags.knowsLocation=true');
t = run("w");
check("guard: no camel gets the speech and is stopped", where() === "citygate" && /perish without assistance and a destination/.test(t));

fresh('state.currentRoomId="antechamber";currentRoom=WORLD.rooms.antechamber;state.inventory.push("rosetta","toothbrush","lamp");state.flags.lampLit=true;state.worn.add("rosetta")');
t = run("examine panels"); check("stone: unbrushed, it translates nothing", !/THE HOUSE KEEPS/.test(t) && /cold and dull/.test(t));
t = run("clean stone"); check("stone: brushing makes it glow", /faint but reassuring glow/.test(t));
t = run("examine panels"); check("stone: brushed, it translates", /THE HOUSE KEEPS/.test(t));
t = run("i"); check("stone: it shows as glowing in the inventory", /glowing faintly/.test(t));

fresh('state.currentRoomId="mirrors";currentRoom=WORLD.rooms.mirrors;state.flags.blockCut=true;state.flags.doorUnlocked=true;state.inventory.push("lamp");state.flags.lampLit=true');
run("e"); check("layout: the key door opens on the Hall of Reigns", where() === "reigns");
run("e"); check("layout: the Hall of Reigns leads east to the Serpent Bridge", where() === "serpent");
fresh('state.currentRoomId="garden";currentRoom=WORLD.rooms.garden;state.inventory.push("lamp");state.flags.lampLit=true');
run("e"); check("layout: east of the garden is the burial chamber", where() === "burial");
run("e"); check("layout: east of the burial chamber is the star chart", where() === "starchart");

fresh('state.currentRoomId="platform";currentRoom=WORLD.rooms.platform;state.score=300');
t = ev("GAME.endScore(state)"); check("ending: a low score gets the museum line", /Luck is with you, effendi/.test(t));
fresh('state.currentRoomId="platform";currentRoom=WORLD.rooms.platform;state.score=900');
t = ev("GAME.endScore(state)"); check("ending: a high score does not", !/Luck is with you/.test(t));


// ---- the school: lessons, the offer, and the three endings ----
const PLAT = 'state.currentRoomId="platform";currentRoom=WORLD.rooms.platform;state.score=300';
fresh(PLAT);
t = run("talk pharaoh"); t = run("about going home");
check("ending: without the pillars there is no choice, just the luck speech and the dream in Voss's tent",
  ev("state.flags.ended") && /all the luck in the world/.test(t) && /Voss's tent/.test(t) && !/Will you return/.test(t));
fresh(PLAT);
run("talk pharaoh"); run("about yourself"); run("about where"); run("about how far");
t = run("no"); check("ending: without the pillars, NO does not let you stay", ev("state.flags.ended") && /all the luck in the world/.test(t));
fresh(PLAT + ";state.flags.pillarsAll=true");
t = run("talk pharaoh"); check("pharaoh: with the pillars lit, the topic list grows", /the school.*the rulers.*the curse.*the storm/.test(t));
t = run("about the curse"); check("pharaoh: he tells the story of the curse", /spheres are not stupid/.test(t));
t = run("about going home"); check("pharaoh: the offer shows the second sun, then asks", /second sun/.test(t) && /stick or with a carrot/.test(t) && /Will you return/.test(t) && !ev("state.flags.ended"));
t = run("yes"); check("ending: returning puts you in the valley, the storm gone, the umbrella at your boot",
  ev("state.flags.ended") && /camel brays/.test(t) && /smoke of Cairo/.test(t) && /umbrella/.test(t));
fresh(PLAT + ";state.flags.pillarsAll=true");
run("talk pharaoh"); run("about going home"); t = run("no");
check("ending: staying is unchanged", ev("state.flags.ended") && /Then walk with me/.test(t));
fresh('state.currentRoomId="pgold";currentRoom=WORLD.rooms.pgold;state.inventory.push("orb")');
t = run("put orb on pillar"); check("lessons: the gold orb teaches", /the world is a machine/.test(t) && /language you have ever learned/.test(t));
fresh('state.currentRoomId="ridge";currentRoom=WORLD.rooms.ridge;state.flags.hasCamel=true;state.riding=true;state.flags.mintTea=true');
run("n"); run("s"); run("e"); run("s"); t = run("e");
check("storm: it has laughter, groans and the chink of gold", /groans/.test(t) && /chink/.test(t));


// ---- the milestone and the aftershave ----
fresh('state.currentRoomId="desertroad";currentRoom=WORLD.rooms.desertroad;state.inventory.push("aftershave")');
for (const verb of ["use", "wear", "spray", "squirt", "splash", "apply"]) {
  fresh('state.inventory.push("aftershave")');
  t = run(verb + " aftershave"); check("aftershave: " + verb.toUpperCase() + " works", ev("state.flags.scented") && /limes/.test(t));
}
fresh('state.currentRoomId="desertroad";currentRoom=WORLD.rooms.desertroad;state.inventory.push("aftershave")');
t = run("spray aftershave on milestone"); check("easter egg: aftershave on the milestone", /There is no amount of aftershave that will mask this smell/.test(t) && !ev("state.flags.scented"));
t = run("spray milestone with aftershave"); check("easter egg: the other word order", /Welcome to Egypt/.test(t));
fresh('state.currentRoomId="desertroad";currentRoom=WORLD.rooms.desertroad;state.flags.hasCamel=true;state.flags.scented=true');
run("climb milestone"); run("w"); run("l"); run("l"); run("l");
check("mosquitoes: aftershave always keeps them off at the oasis, even after the milestone", where() === "oasis");

// ---- the boots ----
const OAS = 'state.currentRoomId="oasis";currentRoom=WORLD.rooms.oasis;state.flags.hasCamel=true;state.flags.scented=true;state.inventory.push("wallet")';
fresh('state.currentRoomId="desertroad";currentRoom=WORLD.rooms.desertroad;state.flags.hasCamel=true');
t = run("wash boots"); check("boots: nothing to wash them in on the road", !ev("state.flags.bootsWrecked") && /nothing here to wash/.test(t));
fresh(OAS); t = run("wash boots in pool");
check("boots: washed at the oasis they fall apart and you are barefoot", ev("state.flags.bootsWrecked") && /wet pastry/.test(t) && /barefoot/.test(run("i")));
t = run("give wallet to vendor");
check("boots: the barefoot get German boots with the dates", /German Army kit/.test(t) && /Do not lick them/.test(t) && ev("state.worn.has('germanboots')"));
t = run("lick boots"); check("boots: licking them is a joke", /laughs until he has to sit down/.test(t));
fresh(OAS); t = run("give wallet to vendor"); check("boots: if yours are intact the trade gives none", !ev("state.inventory.includes('germanboots')"));
fresh(OAS + ';state.flags.gaveWallet=true;state.inventory=state.inventory.filter(x=>x!=="wallet")');
run("wash boots in pool"); t = run("ask vendor about boots");
check("boots: washed after the trade, asking the vendor gets them", /German Army kit/.test(t) && ev("state.worn.has('germanboots')"));


// ---- the passport, Kasim's proof, and the guard ----
fresh('');
t = run("open case"); check("passport: it is in the briefcase", ev("state.inventory.includes('passport')") && /your passport/.test(t));
const KAS = 'state.currentRoomId="antiquities";currentRoom=WORLD.rooms.antiquities;state.inventory.push("passport","amulet")';
fresh(KAS); t = run("ask kasim about pyramid");
check("kasim: the first contact is the German line and the demand for proof", /with the German, Voss/.test(t) && /Prove to me you are not with the German/.test(t));
t = run("give amulet to kasim"); check("kasim: a gift is refused before proof", /Prove to me you are not with the German first/.test(t) && !ev("state.flags.gaveAmulet"));
t = run("show passport to kasim"); check("kasim: the passport gets you past it", ev("state.flags.kasimProved") && /British/.test(t) && /show me something I want/.test(t));
t = run("give amulet to kasim"); check("kasim: then the gift works", ev("state.flags.gaveAmulet"));
fresh('state.currentRoomId="citygate";currentRoom=WORLD.rooms.citygate;state.inventory.push("passport");state.flags.hasSupplies=true;state.flags.knowsLocation=true');
t = run("show passport to guard"); check("guard: the passport makes him laugh and means nothing", /Mad Dogs and Englishmen/.test(t) && /means nothing to me/.test(t));
t = run("w"); check("guard: still no camel, still no passage", where() === "citygate");


// ---- Whitfield's custard creams ----
fresh('state.currentRoomId="museum";currentRoom=WORLD.rooms.museum');
t = run("ask curator about supplies");
check("custard creams: Whitfield mentions them and they go in the kit-bag", /custard creams/.test(t) && ev("state.inventory.includes('custardcreams') && state.inKit.has('custardcreams')") && ev("state.biscuits") === 8);
t = run("eat custard cream"); check("custard creams: eaten one at a time", /magnificent/.test(t) && ev("state.biscuits") === 7);
fresh('state.inventory.push("custardcreams");state.inKit.add("custardcreams");state.biscuits=1');
run("eat biscuit"); check("custard creams: the last one uses up the packet", !ev("state.inventory.includes('custardcreams')"));
fresh('state.currentRoomId="valley";currentRoom=WORLD.rooms.valley;state.inventory.push("custardcreams");state.biscuits=3');
run("eat custard cream"); check("custard creams: in the valley they count as a supper", ev("state.flags.nightFed"));


// ---- custard creams as gifts ----
const BIS = 'state.inventory.push("custardcreams");state.inKit.add("custardcreams");state.biscuits=8;state.flags.hasCamel=true;state.riding=true';
fresh('state.currentRoomId="desertroad";currentRoom=WORLD.rooms.desertroad;' + BIS);
t = run("give biscuit to camel"); check("camel: the first biscuit, and she stamps for more", /flat of your hand/.test(t) && /Restraint, Pembroke/.test(t) && ev("state.biscuits") === 7);
t = run("give biscuit to camel"); check("camel: another one directly after just repeats the line", /Restraint, Pembroke/.test(t) && ev("state.biscuits") === 7);
run("look"); t = run("give biscuit to camel"); check("camel: after something else, another is accepted", ev("state.biscuits") === 6 && /duchess/.test(t));
fresh('state.currentRoomId="dunes";currentRoom=WORLD.rooms.dunes;state.flags.camelFed=1;' + BIS);
t = run("give biscuit to camel"); check("dunes: another biscuit carries you to the Bedouin camp", where() === "camp" && /she did not learn it from a book/.test(t) && ev("state.flags.duneStage2"));
fresh('state.currentRoomId="ridge";currentRoom=WORLD.rooms.ridge;' + BIS);
t = run("give biscuit to camel"); check("ridge: fear has made her lose her appetite", /lose its appetite/.test(t) && ev("state.biscuits") === 8);
const BIS2 = 'state.inventory.push("custardcreams");state.biscuits=8';
fresh('state.currentRoomId="platform";currentRoom=WORLD.rooms.platform;' + BIS2);
t = run("give biscuit to pharaoh"); check("biscuit: the Pharaoh has heard legend of them", /heard legend of such delicacies/.test(t) && ev("state.biscuits") === 7);
fresh('state.currentRoomId="antiquities";currentRoom=WORLD.rooms.antiquities;' + BIS2);
t = run("give biscuit to kasim"); check("biscuit: Kasim thanks you sarcastically and declines", /enormous sarcasm/.test(t) && /must decline/.test(t));
fresh('state.currentRoomId="teahouse";currentRoom=WORLD.rooms.teahouse;' + BIS2);
t = run("give biscuit to hassan"); check("biscuit: Hassan orders free coffee and you must drink it", /Free coffee for my friend/.test(t) && /obliged to drink it/.test(t));
fresh('state.currentRoomId="treasury";currentRoom=WORLD.rooms.treasury;' + BIS2);
t = run("give biscuit to djinn"); check("biscuit: the Djinn declines", /no need for such treats in the spirit realm/.test(t) && ev("state.biscuits") === 8);
fresh('state.currentRoomId="museum";currentRoom=WORLD.rooms.museum;' + BIS2);
t = run("give biscuit to whitfield"); check("biscuit: anyone else is suspicious and nonplussed", /deep suspicion/.test(t) && /nonplussed/.test(t) && ev("state.biscuits") === 8);
fresh('state.currentRoomId="camelmarket";currentRoom=WORLD.rooms.camelmarket');
t = run("buy camel"); check("trader: she responds with great favour to treats", /great favour to treats, less so to the whip/.test(t));


// ---- "mentioned" is not "not here" ----
fresh(''); run("look");
t = run("examine photograph"); check("mentions: before it has turned up, the photograph is not here", /You don't see that here/.test(t));
run("examine mirror");
t = run("exam photo"); check("mentions: once the mirror has shown it, a photograph gets 'nothing else to say'", /Nothing else to say about that/.test(t));
t = run("take photograph"); check("mentions: the same for taking it", /Nothing else to say about that/.test(t));
t = run("examine ceiling"); check("mentions: things in the room description too", /Nothing else to say about that/.test(t));
t = run("examine banana"); check("mentions: something never mentioned is still not here", /You don't see that here/.test(t));


// ---- Whitfield's briefing: one scene, one reward, whatever you say first ----
const MUS = 'state.currentRoomId="museum";currentRoom=WORLD.rooms.museum';
for (const q of ["ask whit about pyram", "ask whit about pyra", "ask whit about tele", "ask whitfield about telegram", "ask whit about mission", "ask whit about call", "ask whit about trip", "ask whit about quest", "talk to whit", "talk to whitfield"]) {
  fresh(MUS); t = run(q);
  check("briefing: '" + q + "' gives everything at once for one reward",
    ev("state.score") === 20 && ev("state.inventory.includes('glass') && state.inventory.includes('umbrella') && state.inventory.includes('supplies')") && /Do look inside, Pembroke/.test(t));
}
fresh(MUS); run("ask whit about pyram");
t = run("talk to whit"); check("briefing: talking again does not repeat the greeting or the gifts", /Still here\?/.test(t) && !/Thank God/.test(t) && ev("state.score") === 20);
t = run("ask whit about kasim"); check("briefing: Kasim is a topic he can answer", /rattle his cage/.test(t));
t = run("ask whit about supplies"); check("briefing: supplies afterwards just points at the bag", /look in the bag/.test(t) && ev("state.score") === 20);
fresh(MUS + ';state.flags.hasCamel=false'); t = run("ask whit about trus"); check("topics: four letters are enough for any topic (trus = trustees)", /Trustees pay me to catalogue/.test(t));


// ---- SHOW something to someone who wants it ----
const OAS2 = 'state.currentRoomId="oasis";currentRoom=WORLD.rooms.oasis;state.flags.hasCamel=true;state.flags.scented=true;state.inventory.push("wallet","comb")';
for (const q of ["show wallet to trader", "show wallet to vendor", "show wallet"]) {
  fresh(OAS2); t = run(q);
  check("show: '" + q + "' gets the vendor's reply and nothing changes hands",
    /A fine Indian wallet\. With Indian money\. Not so fine/.test(t) && /happy to trade the dates/.test(t) && ev("state.inventory.includes('wallet')") && !ev("state.flags.gaveWallet"));
}
fresh(OAS2); t = run("show comb"); check("show: something nobody wants gets 'Nobody seems interested'", /Nobody seems interested/.test(t));


// ---- everyone who wants something reacts when it is shown ----
const CAMP = 'state.currentRoomId="camp";currentRoom=WORLD.rooms.camp;state.inventory.push("tarot","teabags");state.inKit.add("tarot")';
fresh(CAMP); t = run("show card to teller"); check("show: the fortune-teller wants her Hanged Man back", /My Hanged Man/.test(t) && ev("state.inventory.includes('tarot')"));
t = run("show card to fort"); check("show: a short form of her name is enough", /My Hanged Man/.test(t));
fresh(CAMP); t = run("show teabags to host"); check("show: the Bedouin host would make mint tea for them", /mint tea until morning/.test(t));
fresh('state.currentRoomId="rugdealer";currentRoom=WORLD.rooms.rugdealer;state.inventory.push("pen")'); t = run("show pen"); check("show: the rug dealer eyes the pen", /could find a fez/.test(t));


// ---- the camp is where you sit down, and the thirst warnings fit where you are ----
fresh('state.currentRoomId="dunes";currentRoom=WORLD.rooms.dunes;state.duneStage=1;state.flags.hasCamel=true;state.riding=true;state.thirst=16');
t = run("w"); check("camp: you get down from the camel and she stays with the herd", where() === "camp" && !ev("state.riding") && /leave her to the goats/.test(t));
run("look"); check("camp: the thirst clock is quiet here, tea and shade and water", ev("state.thirst") === 0);
t = run("w"); check("camp: leaving for the ridge, you climb back on", where() === "ridge" && ev("state.riding") && /climb back up/.test(t));
fresh('state.currentRoomId="desertroad";currentRoom=WORLD.rooms.desertroad;state.flags.hasCamel=true;state.riding=true;state.thirst=17;state.thirstShown=1');
t = run("look"); check("thirst: a rider is told about the reins", /on the reins/.test(t));
fresh('state.currentRoomId="desertroad";currentRoom=WORLD.rooms.desertroad;state.flags.hasCamel=true;state.riding=false;state.thirst=17;state.thirstShown=1');
t = run("look"); check("thirst: someone on foot is not told about the reins", /Your waterskin hangs warm and heavy/.test(t) && !/reins/.test(t));


// ---- what you find in the sack is usable where it lies ----
fresh('state.currentRoomId="valley";currentRoom=WORLD.rooms.valley;state.flags.hasCamel=true;state.riding=true;state.inventory.push("lamp","waterskin","knife");state.skin="clean"');
t = run("light fire"); check("sack: before you have looked, there is nothing to light it with", !ev("state.flags.nightFire"));
run("examine sacks"); run("open meat");
t = run("light fire"); check("sack: after examining the sacks, light fire takes the matches itself", ev("state.flags.nightFire") && /take the book of matches out of the sack first/.test(t));
t = run("cook meat on fire"); check("sack: the meat can be cooked where it lies", ev("state.flags.meatCooked") && !/no meat/.test(t));
t = run("eat meat"); check("sack: and eaten", ev("state.flags.nightFed"));
t = run("make tea"); check("sack: the tea can be brewed without picking it up", ev("state.flags.teaBrewed"));


// ---- the entrance is a weighing floor in a vast cave ----
fresh('state.currentRoomId="valley";currentRoom=WORLD.rooms.valley;state.flags.hasCamel=true;state.riding=true;state.flags.entranceFound=true;state.inventory.push("lamp")');
t = run("d");
check("entrance: the rope leads to a weighing floor in a vast cave, not a bamboo mat",
  where() === "stairway" && /twenty yards/.test(t) && /It was never buried/.test(t) && /you are being weighed/.test(t) && /eight broad steps/.test(t) && !/bamboo|canes/.test(t));
check("entrance: weighed for +5, nothing more yet", ev("state.score") === 5);
t = run("look"); check("entrance: the room is the Weighing Floor", /THE WEIGHING FLOOR/.test(t) && !/bamboo/.test(t));
t = run("u"); check("entrance: you cannot climb the rope back", /You look at your hands/.test(t));
t = run("n"); check("entrance: eight steps up to the antechamber, and the floor sinks behind you for +5",
  where() === "antechamber" && /eight steps/.test(t) && /going down/.test(t) && /no route back/.test(t) && ev("state.score") === 10);
check("entrance: the way back is not even listed", !/Exits:[^\n]*S/.test(run("look")));
t = run("s"); check("entrance: going south finds only the drop", where() === "antechamber" && /There is no way back/.test(t));

// ---- tea first ----
const TEA = 'state.currentRoomId="valley";currentRoom=WORLD.rooms.valley;state.flags.hasCamel=true;state.riding=true;state.inventory.push("lamp","waterskin","matches","teabags");state.inKit.add("teabags");state.skin="clean"';
fresh(TEA); t = run("make tea");
check("tea: making tea first lights the fire for you, and English tea is used", ev("state.flags.nightFire && state.flags.teaBrewed && state.flags.teaEnglish") && /only the means to a cup of tea/.test(t) && /Surrey/.test(t));
t = run("drink tea"); check("tea: English tea is exactly right", /Southampton/.test(t));
fresh(TEA.replace('"matches","teabags"','"teabags"')); t = run("make tea"); check("tea: with nothing to light a fire with, it says so", !ev("state.flags.teaBrewed") && /nothing to light it with/.test(t));


// ---- the pyramid was put away: ridges, doors, and a pre-cut cave ----
fresh('state.currentRoomId="valley";currentRoom=WORLD.rooms.valley;state.flags.hasCamel=true;state.riding=true;state.inventory.push("lamp")');
t = run("look"); check("valley: ridges raked by something colossal, with a seam like a ruled line", /bulldozer/.test(t) && /Impossible here, of course/.test(t) && /ruled line/.test(t) && !/fallen blocks/.test(t));
ev("state.flags.entranceFound=true"); t = run("d");
check("entrance: the roof is a pair of colossal doors, and the pyramid was put away", /two colossal leaves/.test(t) && /They are doors/.test(t) && /It was put away/.test(t) && /the hollow was cut for it/.test(t));
fresh('state.currentRoomId="pcrimson";currentRoom=WORLD.rooms.pcrimson;state.inventory.push("crimsonorb");state.placed=["orb","greenorb","blueorb"]');
t = run("put crimson orb on pillar"); check("pillars: when they all wake, the great doors part", /the great doors begin to part/.test(t));

if (failures) { console.error(failures + " rule check(s) failed"); process.exit(1); }
console.log("OK: all rule checks passed");
