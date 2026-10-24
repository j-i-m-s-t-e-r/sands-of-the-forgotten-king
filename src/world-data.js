// Sands of the Forgotten King (working title ENTOMBED) — world data for the Cairo vertical slice (rooms 1-8)
// This file contains NO game logic — only data. The engine (engine.js) reads this.
// Swap/extend this object as the world grows; engine.js should never need to change.

// Prices are spoken, and change with the fez, so dialogue asks the game what they are now.
const PRICE_WORDS = { 5: "five", 8: "eight", 12: "twelve", 15: "fifteen", 20: "twenty", 25: "twenty-five" };
function spoken(n) { return PRICE_WORDS[n] || String(n); }
function localFez(state) { return state.worn.has("fez"); }

const WORLD = {

  startRoom: "hotel",
  maxScore: 1000,

  rooms: {

    hotel: {
      name: "Ravenwood Hotel — Your Room",
      desc: "A ceiling fan turns lazily overhead, ticking at every revolution like a patient clock. The room smells of ship's oil, floor polish and last night's jasmine drifting through the shutters. Your briefcase sits on the writing desk where you dropped it when you fell in off the boat. Beyond the shutters, Cairo is already awake: a tram bell, a donkey in full argument, a muezzin dwindling into the traffic.",
      exits: { n: "tahrir" },
      objects: ["briefcase", "mirror"],
      npcs: []
    },

    tahrir: {
      name: "Tahrir Square",
      desc: "Trams grind and clang past in both directions, scattering pigeons. A newspaper boy bellows headlines you only half-catch, and the air is a stew of coal smoke, horse, frying onions and hot stone. To the north stands the pale bulk of the Museum Annex; south, your hotel; east, the roar of the bazaar; and from the west drifts the smell of mint tea.",
      exits: { n: "museum", s: "hotel", e: "bazaar", w: "teahouse" },
      objects: [],
      npcs: []
    },

    museum: {
      name: "Egyptian Museum Annex",
      desc: "Cool, after the street, and dry as old paper. Dust-caked cases of pottery nobody's catalogued since 1920 line the walls, their glass furred grey, and the air smells of camphor, beeswax and cold stone. Somewhere a ceiling fan clicks like a tapped pencil. A row of crates stencilled MUSEUM — FRAGILE — DO NOT OPEN stands under a tarpaulin in one corner, and half the cases carry labels reading ON LOAN, none of which looks as though it has ever been returned. Curator Whitfield is hunched over a desk buried in correspondence, muttering at a tray of potsherds he is plainly not cataloguing, one ear tilted toward every sound you make.",
      exits: { s: "tahrir" },
      objects: ["crates"],
      npcs: ["curator"]
    },

    teahouse: {
      name: "The Coffee House",
      desc: "Low stools, thick smoke and the steady click of backgammon pieces. The air is sweet with apple tobacco and scorched cardamom, and the water pipes bubble like a pond of slow frogs; light comes through the smoke in lazy blades. A boy in a striped apron weaves between the stools with a brass tray of tiny cups, each holding something black and slow as tar, and every second customer is stirring one with a spoon, in the manner of men doing something unwise. In the corner, a man with a magnificent henna-red beard holds court: Hassan, who has never paid for a rumour in his life because he trades only in other people's.",
      exits: { e: "tahrir", w: "teastall" },
      objects: [],
      npcs: ["hassan"]
    },

    bazaar: {
      name: "Curio Bazaar",
      desc: "Striped awnings turn the light amber, and the street is narrow enough to shake hands across. Stalls lean in from both sides — brass, glass, cheap 'ancient' scarabs by the crate-load — and the noise is a tide of haggling, hammering, a gramophone and a goat. It smells of cumin, hot copper and new leather. A merchant almost small enough to be a glove puppet watches you from a cushion on top of a crate, the way merchants watch anyone who looks like they haven't haggled before. Nearby, a bald man on an upturned crate calls to everyone who passes, in a bright, hopeful tenor.",
      exits: { w: "tahrir", e: "antiquities", n: "rugdealer", s: "blacksmith" },
      objects: ["amulet"],
      npcs: ["merchant", "baldman"]
    },

    antiquities: {
      name: "Antiquities Market",
      desc: "Quieter here, and colder somehow, the bazaar's din shrunk to a murmur behind thick walls. The air smells of old dust, lamp oil and beeswax polish, and glass cabinets glitter in the half-dark. Kasim stands behind the locked one in an immaculate white suit, still as a heron, and doesn't so much greet strangers as assess them.",
      exits: { w: "bazaar", s: "camelmarket" },
      objects: [],
      npcs: ["kasim"]
    },

    camelmarket: {
      name: "Camel Market",
      desc: "Dust, noise, and the outraged bellowing of animals who know exactly what's about to happen to them. The whole yard smells of camel, which is to say hay, musk and something older, and the sun beats straight down on baked earth and drumming hooves. A giant of a man leans on the rail, the nearest camel barely reaching his shoulder, and sizes you up before you've said a word.",
      exits: { n: "antiquities", w: "citygate", s: "docks" },
      objects: [],
      npcs: ["trader"]
    },

    teastall: {
      name: "Tea Merchant's Stall",
      desc: "A stall barely wider than its owner, hung with tins and copper pots that tick as they cool. A samovar the size of a small child steams and mutters at the back, and everything smells of mint, clove and warm metal. A round man in gleaming two-tone shoes, absurdly smart for a stall, beams at you from behind the counter.",
      exits: { e: "teahouse" },
      objects: [],
      npcs: ["teaseller"]
    },

    rugdealer: {
      name: "Rug Dealer's Shop",
      desc: "Rugs everywhere: hung from the beams, stacked to the ceiling, rolled like sleeping animals. Dust hangs in slow gold columns, and the air is wool, rosewater and something faintly sheepy. Your footsteps vanish into the carpet and the street's din comes through muffled, as if through a pillow. The dealer, a monocled man dripping with rings, sits on the tallest pile like a small, prosperous king.",
      exits: { s: "bazaar" },
      objects: [],
      npcs: ["rugdealer"]
    },

    blacksmith: {
      name: "The Blacksmith's",
      desc: "A low arch, a roaring forge, and the clang of someone being thoroughly unsympathetic to a piece of iron. The heat hits you like an open oven door, and the air tastes of coal smoke, hot metal and quenching steam. Sparks tick off the floor. Everything in here is black except the smith's grin and his bare, eyebrowless forehead, which gives him a look of permanent surprise.",
      exits: { n: "bazaar" },
      objects: [],
      npcs: ["smith"]
    },

    docks: {
      name: "The Docks",
      desc: "The Nile at its least romantic: working boats, stacked crates, and gulls with opinions. The river smells of silt, tar and fish; water slaps the hulls, ropes creak, a winch clanks, and somewhere a sailor sings flat. The sunlight off the water is fierce enough to hurt. A vendor wearing three hats at once stands among the rope coils behind a tray of dark glasses, selling the glare back to the people it burns.",
      exits: { n: "camelmarket" },
      objects: ["glassestray"],
      npcs: ["dockvendor"]
    },

    desertroad: {
      name: "The Desert Road",
      desc: (state) => "The road runs out of Cairo like a thread pulled from a hem: packed earth, then loose gravel, then nothing but sand. The last telegraph pole leans behind you, its wires humming faintly in the heat, and a half-buried milestone marks the end of the world. The air smells of dust, hot stone and your camel, who chews nothing with great dignity. The wind hisses along the road, and the sun lies on the back of your neck like a warm hand. You have been travelling for an hour along this road and the heat is draining. "
        + (state.inventory.includes("watch")
          ? "You check your pocketwatch: an hour out from the City Gate, to the minute. "
          : "Without a watch you judge it by the sun and the ache in your thighs: an hour, near enough. ")
        + "The oasis, the last well on the caravan road, lies a further two hours' ride to the west.",
      exits: { e: "citygate", w: "oasis" },
      objects: ["milestone", "pole"],
      npcs: []
    },

    oasis: {
      name: "Oasis Rest Stop",
      desc: (state) => {
        const skin = state.flags.waterskinFull
          ? (state.flags.gaveWallet
            ? "Your waterskin hangs plump and cool against your hip."
            : "Your waterskin hangs plump against your hip, though the water in it is warm as blood now, after the long ride.")
          : "Your waterskin, you notice, is nearly empty; it gurgles when you walk.";
        const hours = state.inventory.includes("watch")
          ? "You check your pocketwatch: three hours since the City Gate. "
          : "By the sun, you have been out about three hours. ";
        const camel = state.flags.hasCamel
          ? (state.flags.camelDrank
            ? "Your camel stands knee-deep at the water's edge, looking enormously pleased with herself. "
            : "Your camel has stopped dead at the water's edge and is staring at the pool with naked longing, then at you, then at the pool. ")
          : "";
        return "A shallow pool lies in a ring of date palms, green as a bottle against the pale sand. Palm fronds clatter in the hot wind, camels slurp noisily at the water, and flies hum over everything; the air is warm, damp and rich with dung, dates and wet earth. Only camels seem to be drinking from this. Draw your own conclusions. " + camel + skin + " " + hours + "From what you remember of the papyrus fragment, this is the last well on the caravan road, and the Shifting Dunes lie about two hours' ride beyond it, to the west. In the shade, a stall of date baskets is kept by a man whose long hair falls down his back with a sheen that would make an Arabian horse jealous.";
      },
      exits: { e: "desertroad", w: "dunes" },
      objects: ["pool", "palms", "stall"],
      npcs: ["oasisvendor"]
    },

    dunes: {
      name: "The Shifting Dunes",
      desc: (state) => {
        const stage = state.duneStage || 0;
        const lead = stage === 0
          ? "The sand here has no memory. Dunes slump and rise in slow folds, smoothing themselves out as you watch, and the wind makes a dry whisper like a hand brushing paper."
          : "The dunes have shifted again, as they do out here, and the way you came has already been smoothed away. Fresh ridges rise ahead, pale and unmarked, and the wind whispers over them like a hand brushing paper.";
        return lead + " The air tastes of dust and hot stone, and black beetles scurry in the troughs, glossy as spilled ink. Which ground will hold is anyone's guess, and nobody who steps out untried comes back to say so. To the south, where the sand slumps, something small and dark lies very still. "
          + (state.stones > 0
            ? "In your pocket the date stones click together, and the vendor's lesson comes back to you: a thrown stone shows you what the sand will do before your boot has to. "
            : (state.dateCount > 0 && state.inventory.includes("dates")
              ? "The basket of dates is heavy on your arm, and the vendor's lesson comes back to you: a thrown date, or the stone of one, shows you what the sand will do before your boot has to. "
              : "You have nothing to test the ground with. The vendor at the oasis spent a date stone on sand just like this, and the beetles showed him everything he needed to know. "))
          + "You have been riding for two hours since the oasis. "
          + (state.inventory.includes("watch") ? "Your pocketwatch says five hours since Cairo. " : "The sun has crawled a long way across the sky since Cairo. ")
          + (stage === 0 ? "Your own tracks lead back east." : "East is the way you came, for as long as the dunes allow.");
      },
      exits: { e: "oasis", n: "dunes", s: "dunes", w: "dunes" },
      objects: ["body"],
      npcs: []
    },

    camp: {
      name: "Bedouin Camp",
      desc: "Black goat-hair tents squat in a hollow out of the wind, their flaps snapping like sails. The air is smoke, cardamom and warm goat, and a bell clanks somewhere among the herd. A fire of dung and thorn burns under a copper pot as big as a man's torso, tended by an old man with a patch over one eye. Across from it stands a small striped tent with a hand-painted sign, and before it a woman in sixteen clashing scarves sits cross-legged, shuffling a deck of cards without ever looking at them.",
      exits: { e: "dunes", w: "ridge" },
      objects: ["pot", "tents", "sign"],
      npcs: ["bedouinhost", "teller"]
    },

    ridge: {
      name: "Sandstorm Ridge",
      desc: (state) => {
        const pos = state.ridgePos || 0;
        if (pos > 0) {
          const lines = [
            "You are in a shallow valley with no features at all. The walls of sand look the same on every side, and the sky is the colour of dirty brass. The wind, out of the south, pours steadily past you toward the north. The grit stings your cheeks and tastes of metal.",
            "The valley goes on, as featureless as before, but the wind has swung round. It comes now out of the west, hard and steady, and the sand hisses past your ankles in the same direction, away to the east.",
            "Still the same pale, shapeless valley. The wind, out of the west, has settled to a low, steady moan, and the light has gone the colour of weak tea."
          ];
          return lines[pos - 1];
        }
        let s = "The ridge is a knife-edge of ochre rock with the world coming apart on both sides of it. A sandstorm is gathering: the horizon has gone the colour of a bruise, the wind lifts grit that stings your cheeks, and everything tastes of metal and dust. The wind comes hard out of the south, pouring over the ridge and away to the north. The heat presses on your skull. ";
        if (state.flags.mintTea) {
          s += "Two things try to draw your eye. To the south, what looks like a line of camels is only dune-shadow, shifting. To the west, a woman and a shimmering pool that you know, with the cool clarity of mint, are not really there. ";
        } else {
          s += "Two things draw the eye. To the south, a line of camels plods across the dunes, their bells almost audible. To the west, a beautiful woman in white is about to step into a shimmering pool, and she glances back at you and smiles. ";
        }
        if (state.flags.advised && state.inventory.includes("umbrella")) s += "Follow the wind, the fortune-teller said, and nodded at the closed umbrella. ";
        s += "The way back east is the camp.";
        return s;
      },
      exits: { e: "camp", n: "ridge", s: "ridge", w: "ridge" },
      objects: [],
      npcs: []
    },

    valley: {
      name: "Valley of Forgotten Stones",
      desc: (state) => {
        const f = state.flags;
        let s = "A long, bowl-shaped valley scattered with fallen blocks, hundreds of yards apart and half-drowned in sand, as if a giant had spilled a box of toys and wandered off. Look closely and the blocks are not natural: each has one face dressed flat, and all the flat faces tilt at the same steep angle, as though they once made a single vast sloping wall that has sunk to its shoulders in the sand.\n\n";
        if (f.entranceFound) {
          return s + "It is morning. The sun is a pale coin on the rim of the valley, and the air is cold, still and clean, smelling of ash and damp stone. To the north rises a ridge shaped exactly like a jackal's ear. Beside the collapsed tent and the ring of cold ash at its foot, a patch of sand has been scraped away by a camel's hooves, and beneath it the top of a stair, black against the pale, leads down. Your camel stands beside it, with the air of an animal who has done her part.";
        }
        s += "It's now becoming dark. Here the air is deathly still and much cooler, smelling of damp stone and old dust, and the only sound is the tick of cooling rock. To the north rises a ridge shaped exactly like a jackal's ear, as the papyrus said. At its foot, someone made camp in a hurry and never came back: a collapsed tent, a weeks-extinguished fire, a stack of empty sacks, an enamel mug. Your camel crouches and lowers her head, exhausted from the sandstorm crossing.\n\nYou would now welcome the warm embrace of the Cairo sun, as you too are spent for the day. Time to start a fire, eat and sleep.";
        if (f.nightFire) s += "\n\nA small fire crackles in the ring of stones, throwing a wavering orange circle against the dark. Your camel has shuffled closer to it.";
        if (f.nightTent) s += " You are sitting in the mouth of the tent, out of the wind.";
        return s;
      },
      exits: { e: "ridge", d: "stairway" },
      objects: ["tent", "fire", "sacks", "mug", "page"],
      npcs: []
    },

    stairway: {
      name: "Buried Entrance Stairway",
      dark: true,
      desc: "A steep stair of black stone drops into the hill, its steps worn into shallow bowls by feet that stopped coming long ago. The walls are not rock but dressed limestone laid in perfect courses, each block fitted so closely that no blade could enter, and they lean inward as they rise, all at the same steady angle: you are going in through the flank of something with four sloping sides, a pyramid buried to its tip. The air is cool, dry and tastes of old stone, and your lamp makes a small gold room in the dark. Behind you, where the bamboo floor ran, there is only a gaping void of splintered canes, and no daylight anywhere above it: the way you came in has gone. Somewhere ahead water ticks, once, and stops. The stair goes on north.",
      exits: { u: "valley", n: "antechamber" },
      objects: [],
      npcs: []
    },

    antechamber: {
      name: "Antechamber of Warnings",
      dark: true,
      desc: "A square room, small and cold, its walls covered from floor to ceiling in carved panels crowded with figures: jackal-headed priests, tiny scribes, a long procession of people carrying things. The stone is smooth as soap where hands have rested on it, and the air smells of cold dust and, very faintly, of struck matches. Your footsteps die at once, as though the room swallowed them. The only way on is north, through a gap beneath a fallen lintel.",
      exits: { s: "stairway", n: "threshold" },
      objects: ["panels"],
      npcs: []
    },

    threshold: {
      name: "Collapsed Threshold",
      dark: true,
      desc: "A great lintel has fallen across the passage and lies tilted on one end, leaving a gap just wide enough to squeeze through sideways. The floor is littered with rubble and the dry bones of small animals, and the dust tastes of lime and tickles the back of your throat. Beside the gap, scratches in the stone: many parallel lines, as though someone counted days, or steps. Beyond the gap the dark opens out into something larger. Something about that gap makes the hair rise on your arms.",
      exits: { s: "antechamber", n: "hall" },
      objects: ["lintel", "scratches"],
      npcs: []
    },

    hall: {
      name: "Hall of Offerings",
      dark: true,
      desc: (state) => {
        let s = "A long hall lined with stone shelves and low altars crowded with offerings: a gold cup and a jeweled collar glint in your lamp among a clutter of lesser things too tarnished to name. Everything is cold and dry, and the air smells of old resin, myrrh and sealed things. A draught whispers down the length of the hall like someone breathing out. Against the far wall stands a stone sarcophagus";
        s += state.flags.openedSarc ? ", its lid pushed aside." : " with its lid a finger's width ajar.";
        s += " A passage leads on to the north.";
        return s;
      },
      exits: { s: "threshold", n: "statues" },
      objects: ["goldcup", "collar", "sarcophagus"],
      npcs: []
    },

    statues: {
      name: "Guardian Statues Corridor",
      dark: true,
      desc: (state) => {
        const pos = state.statuePos || 0;
        let s = "A long corridor of polished black tiles, lined with jackal-headed statues in pairs, taller than a man, their stone eyes catching your lamp. The tiles are slick as glass underfoot, and the air smells of lamp oil and stone dust. ";
        if (pos === 0) s += "One statue near the entrance has its stone jaws open, with something pale wedged between the fangs. ";
        const lines = [
          "The first pair of statues stand either side of you. The one on the left has lowered his stone arm and points, quite deliberately, at a tile to the west.",
          "The second pair rise ahead. The one on the right points his arm at a tile to the east.",
          "The third pair. The left-hand statue points his arm at a tile to the west.",
          "Beyond the last pair the corridor opens to the north, on the sound of dripping water."
        ];
        return s + lines[pos];
      },
      exits: { s: "hall", n: "statues", e: "statues", w: "statues" },
      objects: ["statue"],
      npcs: []
    },

    wellshaft: {
      name: "Well Shaft",
      dark: true,
      desc: (state) => {
        let s = "The corridor ends at the lip of a round shaft, its mouth a black circle ringed with worn stone. A thick rope hangs from an iron ring into the dark, creaking as the air moves up past it, and the air smells of wet stone and long water; far below, something drips. ";
        s += state.flags.netCut
          ? "Overhead, a few frayed strands of rope hang where a net used to be. "
          : "A second, thinner rope runs from the ring up to a net slung overhead, bulging with something that glints. ";
        s += "The only way on is down.";
        return s;
      },
      exits: { s: "statues", d: "flooded" },
      objects: ["rope", "net"],
      npcs: []
    },

    flooded: {
      name: "Flooded Passage",
      dark: true,
      desc: (state) => {
        let s = "A long vaulted passage flooded ankle-deep with black water that smells of iron and old coins. Your lamp turns it to oil. Drips fall from the ceiling in a slow, irregular rhythm, and every step slaps and echoes. Arched openings lead away west and east, and a rope hangs down from the dark above. At the far end of the passage a narrow hole is cut into the floor, a hand's width across, and ";
        const lvl = state.holeLevel || 0;
        if (state.flags.keyFloated && !state.inventory.includes("woodenkey")) s += "a wooden key bobs on the water in it, within reach.";
        else if (state.flags.keyFloated) s += "the water in it has settled, black and still.";
        else s += "something pale and wooden lies far down inside it.";
        return s;
      },
      exits: { w: "whispering", e: "snakepit", u: "wellshaft" },
      objects: ["blackwater", "hole"],
      npcs: []
    },

    whispering: {
      name: "Chamber of Whispering Sand",
      dark: true,
      desc: (state) => {
        let s = "A round chamber floored with fine, pale sand that is never quite still: it creeps in slow ripples toward the walls, and the air is full of a dry, hissing whisper, like a hundred people speaking just below hearing. Four alcoves ring the wall, each carved with an animal's head: a jackal, an ibis, a falcon and a cat. The air smells of dust and cold ash. ";
        if (state.flags.nicheOpen) s += "A narrow niche has opened in the wall, glittering. ";
        s += "A doorway leads back east, and another south.";
        return s;
      },
      exits: { e: "flooded", s: "scribe" },
      objects: ["alcoves", "sand"],
      npcs: []
    },

    snakepit: {
      name: "Snake Pit",
      dark: true,
      desc: "A round pit-room whose floor is a shallow bowl of sand and old bones, and whose walls are crowded with the carved coils of a thousand stone snakes. The air is warm and smells of dust, musk and dry skin, and something very long shifts in the dark with a sound like a rope being drawn over stone. Against the far wall stands a sarcophagus bound with thick, rotting ropes. The way back is west, and a doorway leads south.",
      exits: { w: "flooded", s: "serpent" },
      objects: ["sarcophagus2", "ropes"],
      npcs: ["snake"]
    },

    scribe: {
      name: "Scribe's Alcove",
      dark: true,
      desc: (state) => {
        let s = "A narrow stone cell, no bigger than a lift, with the ceiling lost in the dark. The floor gives under your boots by an inch, the whole flagged slab settling like a see-saw, and then holds: a sprung platform, plainly. A headless skeleton sits against the wall in the rags of a tweed jacket, a leather satchel across his knees. ";
        if (!state.flags.skullTaken) s += "High above, about eight feet off the floor, a crystal skull hangs on a cord and throws your lamplight back in a thousand small rainbows. ";
        s += "The air smells of dust, old tobacco and coppery iron. Doorways lead north and south.";
        return s;
      },
      exits: { n: "whispering", s: "mirrors" },
      objects: ["skeleton", "satchel", "notes", "pickaxe", "skull", "blade", "bladerope"],
      npcs: []
    },

    mirrors: {
      name: "Hall of Mirrors",
      dark: true,
      desc: (state) => {
        const m = state.mirrors || ["n", "n", "n"];
        const full = { n: "north", e: "east", s: "south", w: "west" };
        let s = "A tall, narrow hall, lit by a single blade of daylight that falls from a shaft far above and lands on the first of three bronze mirrors, each on a swivelling mount and polished to a ghost of its old brilliance. The air is warm and dry and smells of hot metal and dust, and every sound rings. At the east end of the hall a smooth block of grey stone fills what must once have been a doorway. In the middle of the floor stands a bronze tripod stand";
        s += state.flags.lensPlaced ? ", with your magnifying glass set in its ring. " : ", empty. ";
        s += "The mirrors face " + m.map(x => full[x]).join(", ") + ". ";
        const p = (function () { const c = ["e", "s", "e"]; let n = 0; while (n < 3 && m[n] === c[n]) n++; return n; })();
        s += [
          "The daylight strikes the first mirror and spills away across the ceiling at a useless angle.",
          "The first mirror throws the beam east across the hall, where it splashes harmlessly on the wall beside the second.",
          "The second mirror throws the beam south, and it lands on the floor beside the third.",
          state.flags.blockCut ? "The beam runs true to where the block used to be." : "The beam runs true: a bright coin of light sits on the grey block, warm, and doing nothing much."
        ][p] + " ";
        if (state.flags.blockCut) s = s.replace("At the east end of the hall a smooth block of grey stone fills what must once have been a doorway.", "At the east end of the hall, a neat glassy-edged doorway has been cut through the block, and a short passage leads on.");
        s += "A doorway leads back north";
        s += state.flags.blockCut ? ", and the cut passage leads east." : ".";
        return s;
      },
      exits: { n: "scribe", e: "burial", s: "mummy" },
      objects: ["mirrors", "block", "stand", "glyphs"],
      npcs: []
    },

    burial: {
      name: "Minor Noble's Burial Chamber",
      dark: true,
      desc: (state) => {
        let s = "A small, square chamber, richly dull with age: painted walls showing the noble's life, a boat, a feast, a long line of servants, all faded to the colour of tea. The air is warm, close, and sweet with old resin and mouse, and your footfalls are swallowed by dust as thick as felt. ";
        if (!state.inventory.includes("mask")) s += "On a low stone stand, a golden funerary mask looks at the ceiling with calm, empty eyes. ";
        s += state.flags.openedSarc28 ? "A sarcophagus lies open beside it. " : "A sarcophagus stands against the wall, its lid shut. ";
        if (!state.inventory.includes("falcon")) s += "A small lapis falcon glints on a shelf. ";
        s += "Doors lead west and east.";
        return s;
      },
      exits: { w: "mirrors", e: "serpent", s: "reigns" },
      objects: ["mask", "sarcophagus3", "falcon"],
      npcs: []
    },

    serpent: {
      name: "Serpent Bridge",
      dark: true,
      desc: "A vaulted hall whose floor is a mosaic of coiled serpents, so lifelike that the gaps between them look like pits. Three stone doors stand side by side in the west wall, and above each, a snake is carved in a different pose: coiled low, reared at the middle, and stretched high. The air is warm, musky, and thick with the smell of dust and old shed skin, and the stones seem faintly to sigh. A path leads back north.",
      exits: { n: "snakepit", w: "burial" },
      objects: ["doors", "lintels"],
      npcs: []
    },

    mummy: {
      name: "Mummy's Chamber",
      dark: true,
      desc: (state) => {
        let s = "A round chamber that ends abruptly in a chasm: the floor simply stops, and beyond the edge a pale glow rises from far below. On the far side, an impossible distance away, green light shows through a ragged arch. A single cedar beam spans the ceiling over the gap, thick as a man's body and black with age, and something dull glints in it, a little way out over the drop. A mummy sits upright on a stone stool at the very edge, facing the drop, as if watching a very slow sunset. The air is cold and dry and tastes of myrrh and old paper. ";
        s += state.flags.swung ? "" : "The only way back is north.";
        return s;
      },
      exits: { n: "mirrors" },
      objects: ["beam", "chasm"],
      npcs: ["mummy"]
    },

    reigns: {
      name: "Hall of Reigns",
      dark: true,
      desc: "A long, lofty hall whose walls are one continuous carved frieze, a king's life from birth to death in thirty panels, painted once in reds and blues and now the colours of old tea. The air is cool, still and smells of beeswax and dust, and your footsteps go on a long way ahead of you. A great seated figure at the far end, hands on knees, has had its face chiselled smooth. Doors lead north and south.",
      exits: { n: "burial", s: "treasury" },
      objects: ["frieze"],
      npcs: []
    },

    treasury: {
      name: "Treasury Vault",
      dark: true,
      desc: (state) => {
        let s = "A low vault heaped with treasure, gold on gold, going up into the dark in drifts and banks, every surface throwing your lamp back at you. The air is warm, metallic and sweet with old oil, and every step is a small avalanche of coins. ";
        s += "At the centre, on a black velvet cushion gone grey with age, rests a silver tray. ";
        if (!state.flags.pearlChosen) s += "On it lie three pearls: one no bigger than a seed, one the size of a marble, and one the size of a cue ball. ";
        if (state.flags.sawTreasury) s += "On top of the heap the Djinn sits cross-legged, polishing a jade nail, not quite looking at you. ";
        s += "Against a golden chest, something in a ruined linen suit sits slumped and very still. The way back is north, and a doorway leads south.";
        return s;
      },
      exits: { n: "reigns", s: "tunnel" },
      objects: ["voss", "vossnotes", "tray", "seedpearl", "marblepearl", "cuepearl", "ingot", "ring"],
      npcs: []
    },

    tunnel: {
      name: "Collapsed Tunnel",
      dark: true,
      desc: (state) => {
        let s = "A low tunnel that was once a handsome corridor, now choked with fallen stone. Dust hangs in your lamplight like smoke, tastes of lime and old rain, and the air is close enough to chew. Broken blocks lie jammed at all angles, and the rubble is packed hard. ";
        if (state.flags.dug) s += "A narrow way has been hacked through it, clear to the south, and a cooler draught breathes up from a dark crack in the floor.";
        else s += "North is the way you came, and the rubble fills the way south. It could be dug.";
        return s;
      },
      exits: { n: "treasury", s: "echoes", d: "tunnel" },
      objects: ["rubble"],
      npcs: []
    },

    garden: {
      name: "Ghost's Garden",
      dark: true,
      desc: (state) => {
        let s = "A cavern garden lit by pale fungus glowing the colour of moonlit milk: pillars of it, shelves of it, great soft domes. Black pools lie still among the growth and hold the glow like mirrors. The air is damp and cool and smells of rain on leaf mould, and the silence is so complete that you can hear your own pulse. A rusted blade, a fragment of a tablet and a small clay votive lie scattered among the fungus. ";
        const loud = state.inventory.filter(id => WORLD.objects[id].marked);
        if (loud.length) {
          s += loud.every(id => state.worn.has(id))
            ? "The silence has thinned, but nobody answers you yet: something you are wearing is still too loud to talk over. "
            : "The place feels watchful, but nobody answers you, as though something you carry were too loud to talk over. ";
        }
        s += "The only way on is east.";
        return s;
      },
      exits: { e: "starchart" },
      objects: ["blade2", "tablet", "votive"],
      npcs: []
    },

    starchart: {
      name: "Star Chart Chamber",
      dark: true,
      desc: (state) => {
        let s = "A circular chamber whose domed ceiling is a map of the night sky, set with thousands of tiny points of crystal that catch your lamp like stars. Two great bronze rings, one inside the other, turn on the dome's rim, the outer marked with stars and the inner with landscapes. The air is cold, dry and still, and smells of polished metal. ";
        const set = v => (v && v !== "none") ? "the " + v : "a blank mark";
        const star = set(state.starRing), land = set(state.landRing);
        s += "The outer ring rests on " + star + ", the inner ring on " + land + ". ";
        s += state.flags.starDoor ? "A thread of silver light falls from the dome onto a door in the north wall, which stands open." : "In the north wall, a stone door waits.";
        s += " Doorways lead west and east.";
        return s;
      },
      exits: { w: "garden", e: "echoes", n: "starchart" },
      objects: ["starring", "landring", "stardoor"],
      npcs: []
    },

    echoes: {
      name: "Chamber of Echoes",
      dark: true,
      desc: (state) => {
        const pos = state.echoPos || "c";
        const at = { c: "the centre of the room", n: "the north wall", e: "the east wall", s: "the south wall", w: "the west wall" }[pos];
        let s = "A perfectly round room, bare as an upturned bowl, with a floor of polished flagstones and a ceiling lost in the dark. Every sound you make comes back to you changed: your breath, the scuff of your boot, the tick of your lamp. The air is dry, still and cold, and smells of nothing at all. You are standing at " + at + ". A doorway in the north wall leads to the tunnel, and one in the west wall to the star chamber. You could walk to any of the four walls. ";
        if (state.flags.echoOpen) s += "In the east wall, a narrow passage stands open.";
        return s;
      },
      exits: { n: "tunnel", w: "starchart", e: "echoes" },
      objects: [],
      npcs: []
    },

    sarchall: {
      name: "Sarcophagus Hall",
      dark: true,
      desc: (state) => {
        let s = "A vast, high hall in which everything is gold. A great gold sarcophagus lies in the centre, and the walls are hung with treasure from floor to ceiling: a crook, a flail, a pectoral the size of a dinner tray. The air is warm and thick with the smell of ancient perfume and hot metal, and your lamp makes the whole room blaze, so that it hurts to look. In the south wall, a black stone doorway holds a single carved eye, watching you. ";
        s += "Doorways lead south to the star chamber and west to the echoes.";
        return s;
      },
      exits: { s: "starchart", w: "echoes", d: "sarchall" },
      objects: ["goldsarc", "crook", "flail", "pectoral", "portal"],
      npcs: []
    },

    longdescent: {
      name: "The Long Descent",
      desc: (state) => {
        const lines = [
          "Down. The crack opens on a steep stair cut in black stone, its steps worn smooth. Your lamp is hardly needed: from far below comes a faint, warm glow. The air is dry and tastes of stone.",
          "Down again. The steps run on and on, and the air has begun to warm. A low hum comes up through the soles of your boots, steady as a held note.",
          "Down. The glow below is steadier now, a deep amber, and your lamp flame leans toward it as if drawn. The hum is no longer in your boots but in your breastbone, and the air smells of a storm that has not yet broken.",
          "Down, and the walls fall away on either side. Below you the stair opens into an enormous space full of slow golden light, and the hum has become a pressure, a vast, patient breath. You cannot see the top of anything, or the bottom."
        ];
        return lines[state.descentStage || 0];
      },
      exits: { u: "tunnel", d: "longdescent" },
      objects: [],
      npcs: []
    },

    stair2: {
      name: "The Lower Stair",
      desc: "The stair broadens into a wide ramp of black stone, the light now bright enough to read by. The walls are glassy and faintly warm, and in them your reflection is stretched and amber. The hum fills your ribs, and the air is warm and still and smells of lightning that has not struck. Your lamp flame leans, quivering, toward the light below.",
      exits: { u: "longdescent", d: "landing" },
      objects: [],
      npcs: []
    },

    landing: {
      name: "The Last Landing",
      desc: "The ramp ends on a broad landing at the lip of the great space. Below you, ringed by a path of black glass perhaps a hundred metres around, four enormous obsidian pillars rise into a darkness that has no ceiling: four hundred feet, and more, tapering up into nothing. They are not lit from outside. A slow golden pulse moves up each of them like a sleeper's breath, and the hum rolls off them in waves. The air is as warm as a bread oven and tastes of metal. They are dormant, you think, but they are not dead. The path of glass leads down to the pillars.",
      exits: { u: "stair2", d: "pgold" },
      objects: [],
      npcs: []
    },

    pgold: {
      name: "The Gold Pillar",
      desc: (state) => "The path of black glass curves away to the east and west. Before you the pillar rises out of a round base of gold-veined stone: a column of polished obsidian thicker than a house, so tall that looking up makes you stagger, warm to the eye as well as the hand. " + (state.placed.includes("orb") ? "It blazes with a steady gold light, and the hum has deepened to a chord." : "At its foot a socket ringed with pale gold glass waits for something round. A slow, dim pulse of gold moves up the stone.") + " The glass path runs east and west, and inward to the heart of the ring to the south. A ramp leads up.",
      exits: { e: "pcrimson", w: "pblue", s: "heart", u: "landing" },
      objects: ["gpillar"],
      npcs: []
    },

    pcrimson: {
      name: "The Crimson Pillar",
      desc: (state) => "The glass path curves on. This pillar rises out of a base of rust-red stone, a black column without a visible top, warm and humming. " + (state.placed.includes("crimsonorb") ? "It burns with a deep crimson light now, slow and strong as a heartbeat." : "At its foot a socket ringed with deep red glass waits for something round. A dim crimson pulse climbs the stone like a slow breath.") + " The glass path runs north and south, and inward to the heart of the ring to the west.",
      exits: { n: "pgold", s: "pgreen", w: "heart" },
      objects: ["cpillar"],
      npcs: []
    },

    pgreen: {
      name: "The Green Pillar",
      desc: (state) => "The glass path curves on, humming under your boots. This pillar rises out of a base of green-veined stone, tall past all sense, warm as a living thing. " + (state.placed.includes("greenorb") ? "It glows a deep, clear green, like sunlight through leaves." : "At its foot a socket ringed with clear green glass waits for something round. A faint green pulse moves up the stone.") + " The glass path runs east and west, and inward to the heart of the ring to the north.",
      exits: { e: "pcrimson", w: "pblue", n: "heart" },
      objects: ["vpillar"],
      npcs: []
    },

    pblue: {
      name: "The Blue Pillar",
      desc: (state) => "The glass path curves on, warm and faintly trembling. This last pillar rises out of a base of blue-veined stone, a black column lost in the dark overhead, humming in a lower key than the rest. " + (state.placed.includes("blueorb") ? "It glows a deep, cool blue, steady as the sky an hour after sunset." : "At its foot a socket ringed with deep blue glass waits for something round. A dim blue pulse climbs the stone like a slow breath.") + " The glass path runs north and south, and inward to the heart of the ring to the east.",
      exits: { n: "pgold", s: "pgreen", e: "heart" },
      objects: ["bpillar"],
      npcs: []
    },

    heart: {
      name: "The Heart of the Ring",
      desc: (state) => "In the centre of the ring of pillars lies an open circle of black glass, smooth as a still pond, in which the four pillars are reflected upside down. The hum is loudest here, vast and patient, felt through every bone, and the warmth presses on your skin like a hand. The air tastes of metal and distance. " + (state.flags.pillarsAll ? "All four pillars burn, gold and crimson and green and blue, and the light of them meets in the air above the glass in a slow, turning column." : "Nothing happens here yet, but it feels very much as though something could."),
      exits: { n: "pgold", e: "pcrimson", s: "pgreen", w: "pblue" },
      objects: [],
      npcs: []
    },

    liftante: {
      name: "Antechamber of the Lift",
      dark: true,
      desc: "A long, plain stone passage, bare as a cellar after the gold of the hall behind you. The air is cold and smells of old coin and wet rope. At its foot, against the wall, lies a heap of old gold: cups, chains, coins, a crown with the stones prised out, left in a pile as though by people who had changed their minds. Beside it, a carved panel shows a small figure setting down bundle after bundle before a great balance. To the north the passage ends at a frame of black timbers and a hanging rope. The way back is up.",
      exits: { u: "sarchall", n: "lift" },
      objects: ["heap", "panel"],
      npcs: []
    },

    lift: {
      name: "Threshold of Judgment",
      dark: true,
      desc: (state) => {
        let s = "The passage ends in a square shaft, its walls black and wet, rising into a dark that has no top. A platform of old planks hangs in the shaft from four stout ropes that vanish upward, and beside it, built into a frame of black timber, stands a wooden balance: in one pan a glass jar of fine red sand, the other pan empty, tied by a rope to the platform. A pointer on the frame swings slowly, and a notch is cut in the timber where it would rest. The air is cold and wet, and smells of old rope and stone. The way back is south.";
        if (state.onLift) s += " You are standing on the platform, which sways very slightly.";
        return s;
      },
      exits: { s: "liftante" },
      objects: ["jar", "balance", "pointer", "liftplat"],
      npcs: []
    },

    ledge: {
      name: "The Ledge",
      desc: "The lift settles on a ledge of black stone. The chamber is round and silent, lit by a faint, even glow with no source. In the centre stands a smooth black sarcophagus with no name and no crest, only a single line cut into the lid: Knowledge is carried. Possessions are not. Around the edges the dead have gathered: Voss, holding an empty sack he seems to have forgotten; a man with no head, his hat in his hands; a Roman soldier; a mummy; a coiled cobra; and past them, more than you can count, faces without number, all looking at your empty hands.",
      exits: {},
      objects: ["blacksarc"],
      npcs: []
    },

    platform: {
      name: "The Platform",
      desc: "You are standing on a platform of pale stone, and beyond its edge, in every direction, there are stars. Not above you: all around you, below too, as if the platform floated in the middle of a sea of them. A man in plain linen robes stands at the edge with his hands behind his back, as though he has been waiting a while and does not mind.",
      exits: {},
      objects: [],
      npcs: ["pharaoh"]
    },

    citygate: {
      name: "City Gate",
      desc: "The old gate marks where Cairo gives up and the desert begins, a worn arch of sun-bleached stone. Behind you: tram bells, frying onions, noise. Ahead: silence, and a hot dry wind that smells of nothing at all, which is somehow worse. Sand ticks against the stone. A gate guard with a scar from brow to jaw leans against it, unbothered by the heat, watching the road west.",
      exits: { e: "camelmarket" },
      objects: [],
      npcs: ["guard"]
    }
  },

  objects: {
    telegram: {
      name: "Telegram",
      aliases: ["telegram", "note", "message"],
      portable: true,
      examinedLabel: "read",
      desc: "Thin, cheap paper, soft and furred at the folds from being read on every day of the voyage, the printed strips pasted on crooked. It reads: PEMBROKE STOP COME TO CAIRO AT ONCE STOP THE UNCATALOGUED SITE WEST OF THE OLD "
        + "CARAVAN ROAD IS REAL STOP I WAS SENT TO FIND IT AND HAVE BEEN DETAINED BY THE LOCAL POLICE OVER A CRATE STOP I CANNOT LEAVE CAIRO "
        + "STOP YOU MUST FINISH WHAT I STARTED STOP EVERYTHING I KNOW IS AT THE MUSEUM ANNEX STOP FIND IT FIRST AND THE TRUSTEES WILL FORGET "
        + "WHATEVER THEY HAVE BEEN SAYING ABOUT YOU STOP VOSS ALREADY SNIFFING ABOUT STOP ROOM BOOKED RAVENWOOD STOP — H. WHITFIELD STOP",
      afterDesc: (state) => {
        const base = "The telegram, again, soft as cloth: PEMBROKE STOP COME TO CAIRO AT ONCE STOP THE UNCATALOGUED SITE WEST OF THE OLD CARAVAN ROAD IS REAL "
          + "STOP I WAS SENT TO FIND IT AND HAVE BEEN DETAINED BY THE LOCAL POLICE OVER A CRATE STOP I CANNOT LEAVE CAIRO STOP YOU MUST FINISH WHAT I "
          + "STARTED STOP EVERYTHING I KNOW IS AT THE MUSEUM ANNEX STOP FIND IT FIRST AND THE TRUSTEES WILL FORGET WHATEVER THEY HAVE BEEN SAYING "
          + "ABOUT YOU STOP VOSS ALREADY SNIFFING ABOUT STOP ROOM BOOKED RAVENWOOD STOP — H. WHITFIELD STOP";
        if (state.flags.askedCuratorPyramid || state.flags.hasSupplies) {
          return base + "\n\n(Whitfield turned out to be exactly where it said he would be, and a good deal more hunted than the wording suggested.)";
        }
        return base + "\n\n(You know it by heart.)";
      }
    },
    trunk: {
      name: "Trunk",
      aliases: ["trunk", "luggage"],
      portable: false,
      noTakeMsg: "It belongs in this room — you're not lugging a steamer trunk into the desert.",
      desc: "Battered leather, rough under your palm and warm where the sun finds it, with brass corners worn smooth by a hundred porters. It smells of ship's oil and old shirts. Mostly empty — a few crumpled shirts you couldn't be bothered to unpack. Stencilled across the lid, in paint gone thin with travel: PEMBROKE."
    },
    mirror: {
      name: "Spotted Mirror",
      aliases: ["mirror", "looking glass", "reflection", "yourself"],
      portable: false,
      noTakeMsg: "It's fixed to the wall, and you'd hardly need it out in the field anyway.",
      desc: (state) => {
        const suit = state.worn.has("jacket")
          ? "a young academic in a linen suit that was pressed in London and has not forgiven you for the ship crossing since"
          : "a young academic in shirtsleeves and a waistcoat, the linen jacket long gone";
        let extras = "";
        if (state.worn.has("fez")) extras += " A red fez sits at a hopeful angle.";
        if (state.worn.has("sunglasses")) extras += " Dark glasses give you the look of a film star or a spy.";
        if (state.inventory.includes("pen")) extras += " A silver pen glints in the breast pocket.";
        if (state.inventory.includes("watch")) extras += " The chain of a pocketwatch loops across the waistcoat.";
        return "Cool, spotted glass, a little greasy where someone has rubbed it with a sleeve, foxed at the edges and hung above the wash-basin. It gives back " + suit
          + " — collar a little wilted, tie knotted with more optimism than symmetry, hair that lost the argument with the Cairo humidity somewhere around Tuesday. Good bones under all of it, and a face that looks perpetually one sentence away from a nervous apology."
          + extras
          + " You look, on the whole, like a man who has read a great deal about danger and experienced remarkably little of it. That is, you suspect, about to change.";
      }
    },
    amulet: {
      name: "Scarab Amulet",
      aliases: ["amulet", "scarab"],
      portable: false,
      price: 20,
      desc: (state) => "Cold, smooth and faintly gritty under your thumb: glazed paste, carved in a hurry and mass-produced for tourists. It smells of nothing at all — but Kasim doesn't need to know that. "
        + (state.inventory.includes("amulet") ? "It cost you rather more than it was worth." : spoken(GAME.priced(state, 20, 12).price).replace(/^./, c => c.toUpperCase()) + " piastres, the merchant says."),
      afterDesc: (state) => "The same scarab amulet, cold and slightly gritty. "
        + (state.inventory.includes("amulet") ? "Still not that impressive up close." : "Still " + spoken(GAME.priced(state, 20, 12).price) + " piastres. Still not that impressive up close.")
    },
    glass: {
      crucial: true,
      name: "Magnifying Glass",
      aliases: ["glass", "magnifying glass", "lens"],
      portable: true,
      desc: "The brass handle is warm and worn smooth by other hands; the lens is cool and glassy, a fine scratch crossing it like a hair. Curator Whitfield's, on indefinite loan."
    },
    papyrus: {
      name: "Papyrus Fragment",
      aliases: ["papyrus", "fragment"],
      portable: false,
      desc: "Dry and light as a dead leaf, it whispers when the air moves it. Faded reed-paper, brittle at the edges and smelling of dust and cedar. Without magnification the marks are just marks."
    },
    supplies: {
      crucial: true,
      container: true,
      name: "Supplies",
      aliases: ["supplies", "provisions", "kit-bag", "kit bag", "kitbag", "rucksack", "bag", "waterskins", "rations"],
      portable: true,
      desc: (state) => {
        const inside = state.inventory.filter(id => state.inKit.has(id)).map(id => WORLD.objects[id].short || WORLD.objects[id].name.toLowerCase());
        const list = inside.length ? " Inside: " + inside.join(", ") + "." : " It is empty.";
        return "A canvas kit-bag, rough, heavy and stiff with old wax, smelling of lamp oil and leather." + list + " Enough, with care, for the crossing and back. Whitfield's, until it wasn't.";
      }
    },
    briefcase: {
      name: "Briefcase",
      aliases: ["briefcase", "case", "attache", "attaché"],
      portable: false,
      noTakeMsg: "Where we're going, you won't need a briefcase.",
      desc: (state) => "Scuffed leather, worn soft at the handle, with brass clasps that are warm from the sun and slightly sticky. The initials on the flap, in gilt long since gone brown, read P. PEMBROKE. "
        + (state.flags.caseOpened
          ? "It is open. Inside, under the blank requisition forms, there is nothing else you need."
          : "The case is ready to open.")
    },
    knife: {
      crucial: true,
      name: "Penknife",
      aliases: ["knife", "penknife", "swiss army knife", "pocketknife"],
      portable: true,
      desc: (state) => state.flags.knifeRepaired
        ? "Cool steel again, honed to a clean edge that whispers against your thumbnail. A Swiss army penknife engraved with the crest of the University of Manchester, mended and sharp, the crest still legible. A good thing to be seen holding."
        : "Cool, smooth steel, worn thin along the edges by use. A Swiss army penknife engraved with the crest of the University of Manchester. The main blade has snapped at the hinge, and the stump bites your thumb. Broken, but not beyond repair."
    },
    jacket: {
      name: "Linen Jacket",
      aliases: ["jacket", "linen jacket", "coat"],
      portable: true,
      wearable: true,
      desc: "Linen, creased, soft as a handkerchief and a little damp at the collar, smelling of ship's laundry and honest sweat. It is the jacket that goes with the suit, and it has survived a sea crossing and several ships' laundries, and looks it."
    },
    fez: {
      name: "Fez",
      aliases: ["fez", "hat"],
      portable: true,
      wearable: true,
      desc: "Rough, close-napped red felt, still warm from a stranger's head, with a silky black tassel that swings against your ear. It makes you look, for better or worse, like you belong."
    },
    sunglasses: {
      name: "Sunglasses",
      aliases: ["sunglasses", "shades", "glasses", "dark glasses", "sun glasses", "my glasses", "my shades", "my sunglasses"],
      portable: true,
      wearable: true,
      desc: "Cool, glassy lenses in thin metal frames that rest weightless on your nose. Round, dark and very modern. They turn the glare into something you can look at."
    },
    wallet: {
      crucial: true,
      name: "Indian Wallet",
      short: "Indian wallet",
      aliases: ["wallet", "leather wallet", "indian wallet"],
      portable: true,
      desc: "Soft old leather, cool and smooth, worn to a gloss at the corners, with a silver elephant embossed on the flap that your thumb finds before your eyes do. It is stuffed with Indian rupees, as much use to you here as a chocolate teapot. Whitfield must have forgotten it in the bag. Or didn't."
    },
    teabags: {
      crucial: true,
      name: "Teabags",
      aliases: ["teabags", "tea bags", "teabag", "english tea"],
      portable: true,
      desc: "A little paper packet of English teabags, dry, light and faintly dusty, smelling of a nursery tea in Surrey. They have no business being in this desert."
    },
    tarot: {
      crucial: true,
      name: "Tarot Card",
      aliases: ["tarot", "tarot card", "card"],
      portable: true,
      desc: "A single tarot card, stiff and slightly greasy with handling, its corners soft as cloth. The Hanged Man dangles by one foot and looks smug about it. The back is painted with tiny stars and, in one corner, a fingerprint in what might be jam."
    },
    lamp: {
      crucial: true,
      name: "Spare Lamp",
      aliases: ["lamp", "oil lamp", "spare lamp"],
      portable: true,
      desc: "A small brass oil lamp, cool, heavy for its size and slick with a skin of oil. A glass chimney, a trimmed wick, a smell of paraffin. Wherever you are going, it is going to be dark."
    },
    waterskin: {
      crucial: true,
      name: "Waterskin",
      aliases: ["waterskin", "water skin", "skin"],
      portable: true,
      desc: (state) => state.flags.waterskinFull
        ? (state.flags.gaveWallet
          ? "A goatskin waterskin, rough and hairy on the outside, slick within, plump and cool and sloshing with clean water."
          : "A goatskin waterskin, rough and hairy on the outside, slick within, plump and sloshing. Whitfield filled it, and the water has gone warm, and smells of goat.")
        : "A goatskin waterskin, rough and hairy on the outside and slick within, hanging limp. It gurgles emptily, and smells faintly sour."
    },
    rations: {
      name: "Rations",
      aliases: ["rations", "tins", "tinned rations", "food"],
      portable: true,
      desc: "A few tins of bully beef and a packet of ship's biscuit, cold, heavy and dented, smelling of oil and old metal. Not tempting. Not yet."
    },
    dates: {
      name: "Dates",
      aliases: ["dates", "date", "basket of dates"],
      portable: true,
      desc: "A little woven basket of dates, dark and shiny, warm from the sun, their skins sticky enough to cling to your fingers. They smell of honey and wood smoke."
    },
    flute: {
      crucial: true,
      name: "Reed Flute",
      aliases: ["flute", "reed flute", "pipe"],
      portable: true,
      desc: "A slim reed flute, smooth as bone and still faintly warm from the teller's hand. Three finger holes, a chewed mouthpiece, and a smell of smoke and something sweet."
    },
    minttea: {
      name: "Mint Tea",
      aliases: ["mint tea", "glass of tea", "glass of mint tea"],
      portable: true,
      desc: "A small glass of mint tea, hot enough to sting your fingertips, green as a pond and sweet enough to stand a spoon in. The steam smells of mint and cardamom."
    },
    milestone: {
      name: "Milestone",
      aliases: ["milestone", "stone"],
      portable: false,
      desc: "Rough limestone, warm as a loaf from the oven, the numerals worn as soft as soap: CAIRO 5. Somebody has scratched a camel into it, badly."
    },
    pole: {
      name: "Telegraph Pole",
      aliases: ["pole", "telegraph pole", "wires"],
      portable: false,
      desc: "Creosoted wood, splintery and faintly sticky in the heat, its wires thrumming like a held note. It is the last one. Past it, the news stops."
    },
    pool: {
      name: "Oasis Pool",
      aliases: ["pool", "oasis", "water", "the pool"],
      portable: false,
      noTakeMsg: "You would need a rather larger waterskin.",
      desc: (state) => state.worn.has("sunglasses")
        ? "Through the dark lenses the glare drops away and the surface turns to glass, and the glass is alive: thousands upon thousands of mosquito larvae, wriggling commas in a living soup, thick as porridge near the edge. The camels do not mind. It is fit only for camels."
        : "Only camels seem to be drinking from this. Draw your own conclusions. The surface glitters too brightly to see into, and the water, where it laps your fingertips, is warm as a bath and faintly slick."
    },
    palms: {
      name: "Date Palms",
      aliases: ["palms", "palm", "date palms", "trees"],
      portable: false,
      desc: "Rough-barked and shaggy, warm as a living animal and sticky where old dates have burst. Their fronds clatter overhead like dry applause."
    },
    stall: {
      name: "Date Stall",
      aliases: ["stall", "baskets", "date stall"],
      portable: false,
      desc: "A lean-to of palm matting over rows of baskets, shady, sticky and thick with the smell of dates and flies. Everything in it is for sale, in a manner of speaking."
    },
    body: {
      name: "Dead Thief",
      aliases: ["body", "thief", "corpse", "dead thief", "dead man"],
      portable: false,
      noTakeMsg: "You would rather not.",
      desc: "The thin man from the Bazaar, unmistakable even now: the limp, the stained waistcoat, the moustache like two commas. He lies on his back in a slump of fine, soft sand that has taken him to the waist, and beetles are already at work. His skin is cold and waxy, and the sand around him sucks at the heel of your boot. He did not look where he was walking."
    },
    pot: {
      name: "Copper Pot",
      aliases: ["pot", "copper pot", "kettle"],
      portable: false,
      noTakeMsg: "It would take two men and a camel.",
      desc: "Huge, battered copper, too hot to touch near the fire and ringing faintly as it simmers. The tea inside smells of mint, smoke and cardamom."
    },
    tents: {
      name: "Goat-hair Tents",
      aliases: ["tents", "goat-hair tents", "bedouin tents"],
      portable: false,
      desc: "Coarse black goat-hair, oily and warm under your palm and smelling of smoke and animal. The flaps snap in the wind like sails."
    },
    sign: {
      name: "Painted Sign",
      aliases: ["sign", "painted sign"],
      portable: false,
      desc: "A board of sun-bleached wood, rough-grained and splintery, painted in three languages: FORTUNES, FORTUNES, and, in English, FORTUNE'S TELLING (SOMETIMES TRUE)."
    },
    tent: {
      name: "Collapsed Tent",
      aliases: ["tent", "collapsed tent", "canvas"],
      portable: false,
      noTakeMsg: "It is a tent. You are not going to carry it anywhere, but you might spend the night in it.",
      desc: (state) => "Sun-rotted canvas, stiff, brittle and rough as old sailcloth, flapping weakly in the still air. It smells of dust and stale tobacco. Whoever left in a hurry never came back to fold it. "
        + (state.flags.nightTent ? "You have propped it up on its one good pole, and it is, just about, a tent." : "With a little effort it could be hauled upright, and someone could crawl inside.")
    },
    fire: {
      name: "Cold Fire",
      aliases: ["fire", "cold fire", "ashes", "ash", "campfire", "logs"],
      portable: false,
      noTakeMsg: "You can't take a fire. You can, however, light one.",
      desc: (state) => state.flags.nightFire
        ? "A ring of blackened stones around a small, steady fire that spits and mutters. The heat is a pleasure on your face, and the smoke smells of old wood and sacking. Your camel has edged as close as she dares."
        : "A ring of blackened stones around a heap of ash, long cold. The ash is as fine and soft as flour and leaves grey on your fingers. Under it lie a few half-burnt logs, dry as bone. Someone fed this fire carefully, and then stopped."
    },
    sacks: {
      name: "Empty Sacks",
      aliases: ["sacks", "empty sacks", "sack", "voss sack", "voss's sack", "voss sacks", "voss's sacks", "bags"],
      portable: false,
      noTakeMsg: "You have no use for forty sacks. Voss thought he did. (What is in them, though...)",
      desc: "Forty folded grain sacks, scratchy and stiff with dust, stacked with a care that seems almost greedy. Forty is a great many sacks to bring to a place that is supposed to be empty. But the bottom one is not empty: someone has packed a camp kit into it. There is a book of matches, a stub of candle, a tin of meat with a German label, and a paper packet of tea."
    },
    mug: {
      name: "Enamel Mug",
      aliases: ["mug", "enamel mug", "cup"],
      portable: false,
      desc: (state) => state.flags.teaBrewed && !state.flags.teaDrunk
        ? "Chipped white enamel, hot enough to sting your fingers, rimmed in blue and full of dark, steaming tea. It smells of smoke, burnt sugar and a library on fire."
        : "Chipped white enamel, cold and light, rimmed in blue and furred inside with dust. A brown ring marks where the last tea dried."
    },
    page: {
      name: "Torn Page",
      aliases: ["page", "torn page", "notes", "paper"],
      portable: true,
      examinedLabel: "read",
      desc: "A page torn from a notebook, yellow, brittle and dry as a leaf, written in a quick, confident slope: \"Day 19. The papyrus was right, and Whitfield will weep when he hears. I have brought forty sacks and a mule's worth of rope, and I do not intend to leave a single cup behind. If the dead object, the dead may keep their objections. — V.\""
    },
    panels: {
      name: "Carved Panels",
      aliases: ["panels", "carvings", "carved panels", "hieroglyphs", "glyphs", "walls", "writing"],
      portable: false,
      hieroglyph: true,
      desc: (state) => {
        let s = "Carved panels crowd every wall. Under your fingertips the stone is cold and finely cut, the edges still crisp as the day they were made. They read like a story: a small figure steps over a threshold; a vast stone door falls behind him; and the same figure, shrunken and anxious, stands before a pair of scales while a jackal-headed god looks on. The hieroglyphs beneath the pictures are beyond you.";
        if (state.worn.has("rosetta")) {
          s += " But the stone at your chest grows warm, and the signs slide into sense: THE HOUSE KEEPS WHAT IS THE HOUSE'S. THE THIEF IS WEIGHED. WALK LIGHTLY OUT.";
        }
        return s;
      }
    },
    lintel: {
      name: "Fallen Lintel",
      aliases: ["lintel", "fallen lintel", "slab", "gap"],
      portable: false,
      desc: "Cold, rough granite, unbelievably heavy; where it fell, it cracked the floor. Above the gap, on the underside of the lintel's old seat, a slot waits in the stonework, exactly as wide as a door and as deep as a grave."
    },
    scratches: {
      name: "Scratch Marks",
      aliases: ["scratches", "scratch marks", "marks", "lines"],
      portable: false,
      desc: "Rows of short parallel scratches, rough under your fingertip, hundreds of them, gouged by something that was not a tool: a fingernail, perhaps, or a belt buckle. They run along the wall and stop, all at once, at the gap."
    },
    goldcup: {
      name: "Gold Cup",
      aliases: ["cup", "gold cup", "goblet"],
      portable: true,
      marked: true,
      desc: "Cold, smooth, heavy gold, chased with a procession of tiny jackals, its weight dragging your wrist down. It smells of dust and faint resin. On the underside of the base a small pyramid is stamped, clean as if it were done this morning."
    },
    collar: {
      name: "Jeweled Collar",
      aliases: ["collar", "jeweled collar", "necklace"],
      portable: true,
      marked: true,
      desc: "A broad collar of gold, lapis and carnelian beads, cool and heavy, tinkling faintly when you lift it, and smelling of resin and old linen. A small pyramid is stamped into the back of the clasp."
    },
    sarcophagus: {
      name: "Stone Sarcophagus",
      aliases: ["sarcophagus", "coffin", "casket", "tomb"],
      portable: false,
      noTakeMsg: "It would take twenty men and a very good reason.",
      desc: (state) => state.flags.openedSarc
        ? (state.flags.gotOrb1
            ? "Open now. The mummy lies with its hands crossed on its chest, wrapped in brown linen as dry and fragile as a wasps' nest. Its hands are empty."
            : "Open now. The mummy lies with its hands crossed on its chest, wrapped in brown linen as dry and fragile as a wasps' nest. Between its fingers, a sphere glows softly.")
        : "A stone sarcophagus, cold and gritty under your palm, its lid a finger's width ajar. Something inside whispers like dry linen when the draught moves. The lid is heavy, but it would move."
    },
    orb: {
      name: "Gold Orb",
      aliases: ["orb", "gold orb", "sphere", "glowing orb"],
      portable: true,
      marked: true,
      desc: "A sphere the size of an apple, smooth and faintly warm, like a held egg, and humming softly against your palm. Its pale gold light pulses slowly, like a sleeper's breath. In its centre, no bigger than a grain of rice, a small pyramid of light floats and turns."
    },
    statue: {
      name: "Jackal Statue",
      aliases: ["statue", "statues", "jackal statue", "open-mouthed statue", "jackal"],
      portable: false,
      noTakeMsg: "It is a statue. It is also three tons.",
      desc: "Black stone, cold and faintly oily under the hand, twice your height, carved with the long muzzle of a jackal. Its jaws are open in a stone snarl, and in the dark between its fangs something pale is wedged. The plinth is rough and carved with deep handholds. It could be climbed."
    },
    rosetta: {
      crucial: true,
      name: "Rosetta Stone",
      aliases: ["rosetta", "rosetta stone", "stone", "stone slab", "translation stone"],
      portable: true,
      wearable: true,
      marked: true,
      desc: (state) => "A flat slab of dark stone the size of a dinner plate, cold and rough on the back and polished on the front, covered in three kinds of tiny writing. A cord of braided leather runs through a hole at the top, as though it has been worn before. A small pyramid is stamped in one corner."
        + (state.flags.stoneCleaned ? " Along the bottom, where the grime has been brushed away, a fourth line shows bright and sharp: I TEACH THE GUEST ALL THE WAY TO THE LAST DOOR. THERE, I AM LEFT BEHIND." : " The finest of the glyphs are clogged with centuries of dust.")
    },
    rope: {
      name: "Thick Rope",
      aliases: ["rope", "thick rope", "big rope", "main rope"],
      portable: false,
      noTakeMsg: "It is the only way down. Leave it where it is.",
      desc: "Thick, hairy, old rope, rough and dry as straw under your palm, creaking faintly as the air moves past it. It smells of dust and rope. It looks sound. It has, after all, been used."
    },
    net: {
      name: "Net",
      aliases: ["net", "thin rope", "thinner rope", "second rope", "rope net"],
      portable: false,
      noTakeMsg: "It is hung far out of reach.",
      desc: (state) => state.flags.netCut
        ? "Nothing is left of it but a few frayed strands."
        : "A fine net of old cord, slung overhead from a thin rope that runs back to the ring, stiff and brittle with age. Something glints in it, heavy enough to make the net sag. The thin rope that holds it runs down to the iron ring, within an arm's reach of where you stand. A sharp edge would part it."
    },
    blackwater: {
      name: "Black Water",
      aliases: ["black water", "passage water", "water", "flood"],
      portable: false,
      noTakeMsg: "It runs through your fingers.",
      desc: "Black and utterly still, cold and slightly oily where it laps your ankles. It tastes, you discover, of iron and old coins, and you spit it out at once. It is not for drinking."
    },
    hole: {
      name: "Narrow Hole",
      aliases: ["hole", "narrow hole", "shaft"],
      portable: false,
      desc: (state) => {
        const lvl = state.holeLevel || 0;
        if (state.flags.keyFloated) return state.inventory.includes("woodenkey") ? "A hand's width across and brimming with black water, still and empty now." : "A hand's width across and now brimming with black water, in which a wooden key bobs gently, within reach.";
        return ["A neat round hole, a hand's width across, cut straight down into the stone. Far down in the black, something pale and wooden lies at the bottom, much too deep to reach.",
                "Some water now lies at the bottom of the hole, and the pale wooden thing looks a little closer.",
                "The water has risen halfway up the hole, and the wooden thing is stirring, as if it might float."][Math.min(lvl, 2)];
      }
    },
    woodenkey: {
      crucial: true,
      name: "Wooden Key",
      aliases: ["key", "wooden key"],
      portable: true,
      desc: "A big, old, hand-carved key of dark wood, dripping and slightly furry with damp, as light in the palm as a bird. It smells of iron and wet stone. The bit is cut in the shape of a small jackal's head. A key this fine was made for one lock only, and a door that grand will not be far away."
    },
    bracelet: {
      name: "Jeweled Bracelet",
      aliases: ["bracelet", "jeweled bracelet"],
      portable: true,
      marked: true,
      desc: "A heavy gold cuff set with carnelians, cold, slightly bent from its fall, and smelling of wet rope. Engraved inside, a small pyramid."
    },
    alcoves: {
      name: "Alcoves",
      aliases: ["alcoves", "alcove", "animal heads"],
      portable: false,
      desc: "Four shallow alcoves ring the wall, each carved with an animal's head, cool and smooth as soap: a jackal, an ibis, a falcon, a cat. From each comes its own hissing whisper. You could listen to any of them."
    },
    sand: {
      name: "Whispering Sand",
      aliases: ["sand", "whispering sand", "floor"],
      portable: false,
      noTakeMsg: "It trickles through your fingers and goes on whispering.",
      desc: "Fine and pale and cool as flour, creeping in slow ripples toward the walls. It is smooth enough to write in."
    },
    niche: {
      name: "Niche",
      aliases: ["niche"],
      portable: false,
      desc: "A narrow niche, cold and dusty, cut into the wall where no niche was before."
    },
    scarab: {
      name: "Lapis Scarab",
      aliases: ["scarab", "lapis scarab", "beetle"],
      portable: true,
      marked: true,
      desc: "A fat lapis beetle as big as a plum, deep blue and flecked with gold, cool and perfectly smooth. Underneath, in the flat of its belly, is a small pyramid."
    },
    sarcophagus2: {
      name: "Roped Sarcophagus",
      aliases: ["sarcophagus", "coffin", "casket"],
      portable: false,
      noTakeMsg: "It would take twenty men and a very good reason.",
      desc: (state) => state.flags.openedSarc25
        ? (state.flags.gotOrb2 ? "Open and empty-handed. The mummy's crossed fingers hold nothing." : "Open. The mummy's crossed fingers hold a sphere that glows a deep, hot crimson.")
        : (state.flags.cutRopes25
            ? "The ropes lie cut around it, but the lid is still shut."
            : "A stone sarcophagus bound round and round with thick, rotting rope, coarse and damp under your hand, knotted over the lid as though to keep something in.")
    },
    ropes: {
      name: "Rotting Ropes",
      aliases: ["ropes", "rotting ropes", "rope", "bindings"],
      portable: false,
      desc: (state) => state.flags.cutRopes25 ? "Coils of cut rope, damp and fibrous." : "Thick old ropes, wound many times round the sarcophagus and knotted over the lid, soft and damp and smelling of cellar. They would be hard to untie. A sharp blade would do it quickly."
    },
    crimsonorb: {
      name: "Crimson Orb",
      aliases: ["orb", "crimson orb", "red orb", "sphere"],
      portable: true,
      marked: true,
      desc: "A sphere the size of an apple, smooth, humming faintly, and warm as a hand. Its light is a deep crimson that pulses slowly. In its centre, no bigger than a grain of rice, a small pyramid of light floats and turns."
    },
    skeleton: {
      name: "Headless Skeleton",
      aliases: ["skeleton", "remains", "bones", "body", "mcdaniels", "eugene"],
      portable: false,
      noTakeMsg: "You would rather not.",
      desc: "A skeleton in the rags of a Victorian tweed jacket, sitting against the wall as if he had just sat down for a rest, one hand still in a pocket. The bones are dry, light and rough as pumice. Where his head should be there is only wall. He has, you notice, no head at all, and nothing nearby to account for it."
    },
    satchel: {
      name: "Leather Satchel",
      aliases: ["satchel", "bag", "leather satchel"],
      portable: false,
      desc: "Cracked brown leather, stiff as bark, the buckles green with age. Inside is a notebook, its pages cockled with damp, and nothing else of any use."
    },
    notes: {
      name: "McDaniels's Notebook",
      aliases: ["notes", "notebook", "diary", "journal", "mcdaniels's notebook", "mcdaniels notebook", "mcdaniels's diary", "victorian notebook", "scribe's notebook"],
      portable: true,
      examinedLabel: "read",
      desc: "A notebook gone soft and brown at the edges, smelling of tobacco and mould, the writing small and cheerful. \"Eugene McDaniels, Esq., F.R.G.S., 1893. Day 41. A remarkable cell. The floor is sprung, plainly: it drops an inch when one steps in. Overhead, a crystal skull on a cord, which is surely meant to be jumped for. There is a blade in the roof, on a line; I should cut the line first. I have no knife, but I have a very good head for heights, and the others who came this way have, I think, been far too timid. Day 42. Going to jump.\" There is no Day 43."
    },
    pickaxe: {
      crucial: true,
      name: "Pickaxe",
      aliases: ["pickaxe", "pick", "pick-axe", "miner's pick"],
      portable: true,
      tooBig: true,
      desc: "A heavy iron pickaxe with an ash handle worn smooth and dark by a sweaty palm, the head rough and flaking with rust. It looks like it has not been used for the job it was bought for."
    },
    skull: {
      name: "Crystal Skull",
      aliases: ["skull", "crystal skull"],
      portable: false,
      marked: true,
      noTakeMsg: "It hangs eight feet off the floor, far out of reach. The room, you suspect, has opinions about how you might get it.",
      desc: "A skull of clear crystal the size of a grapefruit, hung on a cord about eight feet off the floor, glittering and cold. Every facet holds a tiny, upside-down copy of your lamp. Underneath, at the base of the jaw, is a small pyramid."
    },
    blade: {
      name: "Hanging Blade",
      aliases: ["blade", "curved blade", "scythe"],
      portable: false,
      desc: "High in the dark above the skull, a long curved blade hangs on a rope, its edge catching your lamp in a thin, bright line. It is the length of your forearm. The floor beneath you, you realise, is a pressure plate. Scrape marks on the stone around you trace a neat arc at about the height of a man's neck."
    },
    bladerope: {
      name: "Blade Rope",
      aliases: ["blade rope", "line", "cord", "rope"],
      portable: false,
      desc: (state) => state.flags.bladeCut ? "A cut length of rope, dangling." : "A thin, old rope that holds the blade up in the roof, running up into the dark. It could be cut, if you could reach it. It hangs low enough to reach, from here."
    },
    mirrors: {
      name: "Bronze Mirrors",
      aliases: ["mirrors", "mirror", "bronze mirrors", "first mirror", "second mirror", "third mirror"],
      portable: false,
      desc: "Three bronze mirrors on swivelling mounts, each as tall as a man, polished to a ghost of old brilliance. Cool and slightly greasy to touch, they turn with a groan and a tiny shower of green flakes. You can TURN each one to face north, east, south or west."
    },
    block: {
      name: "Stone Block",
      aliases: ["block", "stone block", "grey block", "wall"],
      portable: false,
      desc: (state) => state.flags.blockCut
        ? "A neat, glassy-edged doorway has been cut clean through it, still warm, the stone fused to glass at the edges."
        : "A smooth block of grey stone, cold and very dense, filling a doorway-sized gap in the east wall. It has no seam, no handle and no hinge. Only something very hot could get through it."
    },
    stand: {
      name: "Bronze Stand",
      aliases: ["stand", "tripod", "bronze stand"],
      portable: false,
      desc: (state) => state.flags.lensPlaced
        ? "A bronze tripod whose ring holds your magnifying glass, aimed at the block."
        : "A bronze tripod, cold and green with verdigris, with a round ring at the top about the size of a hand, aimed squarely at the stone block. Something round and glassy belongs in it."
    },
    glyphs: {
      name: "Sun Glyphs",
      aliases: ["glyphs", "sun glyphs", "hieroglyphs", "writing", "carvings"],
      portable: false,
      hieroglyph: true,
      desc: (state) => {
        let s = "A band of tiny glyphs runs around the base of the hall, smooth and shallow under your fingers: a sun disc, then a road, then a sun disc, then more road. The meaning is beyond you.";
        if (state.worn.has("rosetta")) s += " But the stone at your chest grows warm, and the signs slide into sense: THE SUN WALKS EAST, THEN SOUTH, THEN EAST AGAIN.";
        return s;
      }
    },
    mask: {
      crucial: true,
      name: "Funerary Mask",
      aliases: ["mask", "golden mask", "funerary mask"],
      portable: true,
      wearable: true,
      marked: true,
      desc: "Beaten gold, cold, smooth and surprisingly light, with a calm painted face, kohl-rimmed eyes and a rearing cobra on the brow. It is a king's mask, and this was a noble's tomb. Inside the chin, a small pyramid is stamped."
    },
    sarcophagus3: {
      name: "Noble's Sarcophagus",
      aliases: ["sarcophagus", "coffin", "casket"],
      portable: false,
      noTakeMsg: "It would take twenty men and a very good reason.",
      desc: (state) => state.flags.openedSarc28
        ? (state.flags.gotOrb3 ? "Open. A stout mummy in fine linen, its hands empty." : "Open. A stout mummy in finer linen than the hall's, holding between its hands a sphere that glows a deep, cool green.")
        : "A painted stone sarcophagus, smooth, cool and faintly sticky with old resin, the lid shut tight. It looks as though it was packed by someone who cared."
    },
    greenorb: {
      name: "Green Orb",
      aliases: ["orb", "green orb", "sphere"],
      portable: true,
      marked: true,
      desc: "A sphere the size of an apple, humming and cool, glowing a deep clear green like sunlight through a leaf. In its centre, no bigger than a grain of rice, a small pyramid of light floats and turns."
    },
    falcon: {
      name: "Lapis Falcon",
      aliases: ["falcon", "lapis falcon"],
      portable: true,
      marked: true,
      desc: "A hand-sized falcon carved from lapis, its eyes gold, cool and heavy and astonishingly smooth. On the underside of the base, a small pyramid."
    },
    doors: {
      name: "Stone Doors",
      aliases: ["doors", "door", "stone doors", "three doors"],
      portable: false,
      desc: "Three tall stone doors in the west wall, side by side, with no handles, no hinges and no keyholes. Above them, three snakes: one coiled low, one reared at the middle, one stretched high. The stone is cold and faintly vibrating, as if something behind it were breathing."
    },
    lintels: {
      name: "Snake Carvings",
      aliases: ["lintels", "carvings", "snakes", "snake carvings", "hieroglyphs", "writing"],
      portable: false,
      hieroglyph: true,
      desc: (state) => {
        let s = "Each lintel carries a carved snake and a short line of tiny hieroglyphs: the low one coiled tight, the middle reared with its hood spread, the high one stretched and swaying. The writing is beyond you.";
        if (state.worn.has("rosetta")) s += " But the stone at your chest grows warm, and the signs slide into sense: THE LOW ONE IS HUNGRY. THE HIGH ONE IS ANGRY. THE MIDDLE ONE IS COURTEOUS.";
        return s;
      }
    },
    beam: {
      name: "Cedar Beam",
      aliases: ["beam", "cedar beam", "wooden beam", "timber"],
      portable: false,
      desc: (state) => state.flags.sawHook && !state.flags.gotHook
        ? "A great black beam of cedar, rough, cold and dry as bone under your fingertips, spanning the ceiling out over the chasm. Near the end above you, half buried in the wood, an iron hook is set like a tooth, rusted into place but loose enough to work free."
        : "A great black beam of cedar, rough, cold and dry as bone under your fingertips, running out over the gulf from the ceiling above you. The wood is sound. It would take a man's weight. Something dull glints in it near the far end, just at the edge of the lamplight."
    },
    chasm: {
      name: "Chasm",
      aliases: ["chasm", "void", "gulf", "drop", "edge"],
      portable: false,
      noTakeMsg: "You would need a bigger bag.",
      desc: "The floor ends in a clean edge, and past it there is nothing: a long pale glow far below, cold air rising, and a faint sweet smell of fungus. Across the gap, a ragged arch glows green, much too far to jump. Dropping a pebble would not tell you anything; you would not hear it land."
    },
    hook: {
      crucial: true,
      name: "Iron Hook",
      aliases: ["hook", "iron hook"],
      portable: true,
      desc: "A stout iron hook as long as your hand, rough with rust and cold as a coin, with a ring at the shank for a line. It has held up a good deal in its time."
    },
    bandages: {
      crucial: true,
      name: "Mummy Bandages",
      aliases: ["bandages", "bandage", "linen", "wrappings", "mummy bandages"],
      portable: true,
      desc: "A long coil of brown linen strips, dry, light and faintly greasy, smelling of myrrh. They are very strong, for something so old, and they go on for a long way."
    },
    grapnel: {
      crucial: true,
      name: "Bandage Line",
      aliases: ["line", "bandage line", "grapnel", "rope"],
      portable: true,
      desc: "The iron hook, knotted fast to a long, twisted rope of mummy bandage. It looks absurd. It also looks as though it would hold."
    },
    frieze: {
      name: "Carved Frieze",
      aliases: ["frieze", "carvings", "timeline", "panels", "hieroglyphs", "walls", "writing", "carved frieze"],
      portable: false,
      hieroglyph: true,
      desc: (state) => {
        let s = "Thirty carved panels run the length of the hall, a king's life from the cradle to the throne to a very long, plain, undecorated ending. The stone is smooth and cool under your fingers, the figures small and lively. The hieroglyphs beneath them are beyond you.";
        if (state.worn.has("rosetta")) {
          s += " But the stone at your chest grows warm, and the signs slide into sense. PANEL ONE: ON THE NIGHT THE KING WAS BORN, THE JACKAL STAR STOOD OVER THE RIVER. PANEL TWELVE: HE ASKED FOR NO MONUMENT. HIS PEOPLE BUILT ONE ANYWAY. PANEL THIRTY: HE WENT AWAY, AND LEFT A DOOR.";
        }
        return s;
      }
    },
    voss: {
      name: "Dr. Voss",
      aliases: ["voss", "body", "corpse", "man", "remains", "dr voss", "doctor voss", "skeleton", "skull"],
      portable: false,
      noTakeMsg: "You would rather not.",
      desc: "Dr. Voss, or what the dry air has left of him, sits slumped against a golden chest in the rags of a very good linen suit. He is mostly bone now, with leathery strips of skin still clinging to the ribs and the backs of the hands, and a few tufts of grey hair on the skull. His jaw hangs wide, and wedged deep inside it, so tightly that the bone has cracked around it, is a pearl as big as a cue ball, white and flawless, the one clean thing in the vault. His pockets are stuffed with small gold things. The leather of his hands feels like old parchment, and he smells of dust and nothing else."
    },
    vossnotes: {
      name: "Voss's Notebook",
      aliases: ["notebook", "notes", "voss's notebook", "voss notebook", "voss's diary", "journal", "diary"],
      portable: true,
      examinedLabel: "read",
      desc: "A notebook gone stiff and brown at the corners, the cover clammy, the writing a quick, confident slope that gets steadily worse. \"Day 31. The Djinn is, I confess, a charming fellow, in a ghastly sort of way. He offers a tray of pearls and the house's hospitality, which he says I am not to refuse. I am a scientist, and I shall take the finest specimen, as one does.\" The last page is written in large, triumphant capitals, pressed so hard the pen has torn the paper: \"If you are reading this, I assume these pages are looking back at you, Howard Whitfield. Know that I, Dietmar Voss, have beaten you AGAIN to this most precious prize and surely, only bad luck will have prevented me becoming the greatest explorer of them all. I FEAR NOTHING!\" The rest is mostly illegible, apart from sketches of star patterns, of centurions, and a lot of German text about arks, or something."
    },
    tray: {
      name: "Silver Tray",
      aliases: ["tray", "silver tray", "cushion"],
      portable: false,
      noTakeMsg: "It is not the tray you want.",
      desc: "A silver tray on a black velvet cushion that has gone grey and soft as moss. The silver is cold and smooth and tarnished to the colour of a storm cloud. Three shallow dimples hold three pearls, and a fourth, empty, holds nothing at all."
    },
    seedpearl: {
      noGetAll: true,
      name: "Seed Pearl",
      aliases: ["seed pearl", "small pearl", "smallest pearl", "tiny pearl", "seed"],
      portable: true,
      desc: "A seed pearl no bigger than a lentil, round, creamy and perfect, cool and smooth as a drop of milk."
    },
    marblepearl: {
      noGetAll: true,
      name: "Marble Pearl",
      aliases: ["marble pearl", "middle pearl", "medium pearl", "marble"],
      portable: true,
      desc: "A pearl the size of a marble, heavy, glossy and pale pink, cool and slightly slippery."
    },
    cuepearl: {
      noGetAll: true,
      name: "Cue-ball Pearl",
      aliases: ["cue-ball pearl", "cue ball pearl", "large pearl", "big pearl", "biggest pearl", "largest pearl", "cue ball", "cue-ball"],
      portable: true,
      desc: "A pearl the size of a billiard ball, white, flawless and enormous, and cold as a skull. It is the most valuable object you have ever seen."
    },
    ingot: {
      name: "Gold Ingot",
      aliases: ["ingot", "gold ingot", "bar", "gold bar"],
      portable: true,
      marked: true,
      desc: "A heavy bar of soft yellow gold, cold, dense and slightly greasy to the touch, much heavier than it looks. On one end, a small pyramid is stamped."
    },
    ring: {
      name: "Ruby Ring",
      aliases: ["ring", "ruby ring", "ruby"],
      portable: true,
      marked: true,
      desc: "A fat gold ring set with a ruby the size of a thumbnail, cool and heavy, red as a drop of blood in the lamplight. Inside the band, a small pyramid."
    },
    rubble: {
      name: "Rubble",
      aliases: ["rubble", "stones", "blocks", "debris", "fallen stone"],
      portable: false,
      noTakeMsg: "There is rather a lot of it.",
      desc: (state) => state.flags.dug
        ? "A narrow, ragged way hacked through the packed stone, dusty and sharp-edged under your hand."
        : "Broken blocks wedged at all angles, packed hard with dirt and grit, cold and sharp to the touch. Bare hands would get nowhere. Something with an iron head would."
    },
    blade2: {
      name: "Rusted Blade",
      aliases: ["rusted blade", "blade", "sword", "gladius"],
      portable: false,
      desc: "A short, broad sword, orange with rust and furred with fungus, the edge rough as a file. Near the hilt, the metal still holds a faint stamp: XXII. It is cold and gritty, and flakes away under your thumb."
    },
    tablet: {
      name: "Tablet Fragment",
      aliases: ["tablet", "tablet fragment", "fragment", "wax tablet"],
      portable: false,
      desc: "A fragment of a wooden writing tablet, gone soft and furry with damp, its wax long since cracked into scales. On it, in a scratchy hand, one word is still legible: RUFUS."
    },
    votive: {
      name: "Clay Votive",
      aliases: ["votive", "clay votive", "pot", "little pot"],
      portable: false,
      desc: "A small red clay votive pot, glossy and smooth as a river pebble under your fingers, with a tiny relief of a god on the side. Pressed into the base before it was fired: ARRETIVM."
    },
    starring: {
      name: "Star Ring",
      aliases: ["star ring", "outer ring", "stars ring", "ring of stars"],
      portable: false,
      desc: "The outer bronze ring, wide as a cart wheel, cold and slightly greasy and covered with verdigris, marked with four star shapes in turn: the JACKAL, the IBIS, the FALCON and the LION. You can TURN it to any of them."
    },
    landring: {
      name: "Land Ring",
      aliases: ["land ring", "inner ring", "landscape ring", "ring of lands"],
      portable: false,
      desc: "The inner bronze ring, cold and smooth with use, marked with four scenes in turn: the RIVER, the DESERT, the MOUNTAIN and the SEA. You can TURN it to any of them."
    },
    stardoor: {
      name: "Stone Door",
      aliases: ["door", "stone door", "north door"],
      portable: false,
      desc: (state) => state.flags.starDoor ? "The door stands open, cold stone sliding on bronze, on a passage north into a hall that glints." : "A heavy stone door set in the north wall, cold, smooth and utterly blank. It has no handle and no lock. It seems to be waiting for something above."
    },
    crook: {
      name: "Golden Crook",
      aliases: ["crook", "golden crook", "shepherd's crook"],
      portable: true,
      marked: true,
      desc: "A gold crook as long as your forearm, warm from the blazing hall, its stripes of blue glass cool under your thumb. Near the handle, a small pyramid."
    },
    flail: {
      name: "Golden Flail",
      aliases: ["flail", "golden flail"],
      portable: true,
      marked: true,
      desc: "A short gold rod with three heavy, beaded gold thongs, cold and awkward in the hand and swinging with a soft clink. On the butt, a small pyramid."
    },
    pectoral: {
      name: "Royal Pectoral",
      aliases: ["pectoral", "royal pectoral", "breastplate"],
      portable: true,
      marked: true,
      desc: "A broad gold pectoral the size of a dinner tray, set with lapis, carnelian and turquoise in the form of a winged scarab, heavy as a stone and cold on your arm. On the back, a small pyramid."
    },
    portal: {
      name: "Black Doorway",
      aliases: ["portal", "doorway", "black doorway", "eye", "black door"],
      portable: false,
      noTakeMsg: "It is a doorway.",
      desc: "A tall doorway of polished black stone, cold and glassy and slick as the inside of a bell, with a single great eye carved above the lintel. The eye is painted with a rearing cobra on the brow. It is looking at you. It is looking, in particular, at your face."
    },
    sarcophagus4: {
      name: "Hidden Sarcophagus",
      aliases: ["sarcophagus", "coffin", "casket"],
      portable: false,
      noTakeMsg: "It would take twenty men and a very good reason.",
      desc: (state) => state.flags.openedSarc4
        ? (state.flags.gotOrb4 ? "Open. A mummy in blue-grey linen, its hands empty." : "Open. A mummy in blue-grey linen, a sphere of deep, cold blue glowing between its fingers.")
        : (state.flags.cutRopes4 ? "The ropes lie cut around it, but the lid is shut." : "A narrow sarcophagus in the hidden recess, bound with thick black rope, cold and gritty under your hand, the lid shut tight.")
    },
    ropes4: {
      name: "Black Ropes",
      aliases: ["ropes", "black ropes", "rope", "bindings"],
      portable: false,
      desc: (state) => state.flags.cutRopes4 ? "Coils of cut black rope." : "Thick black ropes wound round the sarcophagus and knotted over the lid, stiff with age. A sharp blade would part them."
    },
    blueorb: {
      name: "Blue Orb",
      aliases: ["orb", "blue orb", "sphere"],
      portable: true,
      marked: true,
      desc: "A sphere the size of an apple, humming and cold as a pebble from a stream, glowing a deep, still blue like the sky an hour after sunset. In its centre, no bigger than a grain of rice, a small pyramid of light floats and turns."
    },
    goldsarc: {
      name: "Gold Sarcophagus",
      aliases: ["sarcophagus", "gold sarcophagus", "great sarcophagus", "coffin"],
      portable: false,
      noTakeMsg: "It would take a hundred men and a very good reason.",
      desc: "An immense sarcophagus of beaten gold, cold, polished and flawless, carved with a calm, closed-eyed face. The lid is sealed with a heavy golden seal stamped with a single small pyramid. It has no name on it and no titles. It looks as though it has been waiting for a very particular person."
    },
    gpillar: {
      name: "Gold Pillar",
      aliases: ["pillar", "gold pillar", "socket", "base", "column"],
      portable: false,
      noTakeMsg: "It is a pillar. It is four hundred feet tall.",
      desc: "Polished obsidian, glassy, smooth and faintly warm under your palm, with a deep hum you feel in your teeth. It is hard to say what it is made of, or what it is for. The socket at its foot, ringed with pale gold glass, is exactly the size of an apple."
    },
    cpillar: {
      name: "Crimson Pillar",
      aliases: ["pillar", "crimson pillar", "red pillar", "socket", "base", "column"],
      portable: false,
      noTakeMsg: "It is a pillar. It is four hundred feet tall.",
      desc: "Polished obsidian, glassy and warm under your palm, humming. It is hard to say what it is made of, or what it is for. The socket at its foot, ringed with deep red glass, is exactly the size of an apple."
    },
    vpillar: {
      name: "Green Pillar",
      aliases: ["pillar", "green pillar", "socket", "base", "column"],
      portable: false,
      noTakeMsg: "It is a pillar. It is four hundred feet tall.",
      desc: "Polished obsidian, glassy and warm under your palm, humming. It is hard to say what it is made of, or what it is for. The socket at its foot, ringed with clear green glass, is exactly the size of an apple."
    },
    bpillar: {
      name: "Blue Pillar",
      aliases: ["pillar", "blue pillar", "socket", "base", "column"],
      portable: false,
      noTakeMsg: "It is a pillar. It is four hundred feet tall.",
      desc: "Polished obsidian, glassy and warm under your palm, humming in a low key. It is hard to say what it is made of, or what it is for. The socket at its foot, ringed with deep blue glass, is exactly the size of an apple."
    },
    heap: {
      name: "Heap of Old Gold",
      aliases: ["heap", "gold", "pile", "old gold", "coins", "crown"],
      portable: false,
      noTakeMsg: "Nobody who left this ever came back for it. Take the hint.",
      desc: "A tumbled heap of cups, chains, coins and a crown with its stones prised out, cold and dusty, dull with the grey bloom of gold nobody has touched in a long time. Every piece, you notice, carries the same small stamp. It was left here on purpose, by people who understood."
    },
    panel: {
      name: "Carved Panel",
      aliases: ["panel", "carved panel", "carving"],
      portable: false,
      desc: "A carved panel, cool and smooth. A small figure sets down bundle after bundle before a great balance, and above each bundle is stamped a tiny pyramid. At the end of the row the figure walks away with empty hands, and the balance stands level."
    },
    jar: {
      name: "Jar of Red Sand",
      aliases: ["jar", "sand", "red sand", "glass jar"],
      portable: false,
      noTakeMsg: "It is fixed to the balance, and you suspect it is not for you to carry.",
      desc: "A glass jar, sealed with wax, cool and smooth, full to the shoulder with fine red sand. It sits in one pan of the balance with the patient air of a thing that was filled very carefully, once, to a precise weight. You have seen this sand before: it ran through a hole in a bamboo floor, a long way above you, and was caught in glass."
    },
    balance: {
      name: "Wooden Balance",
      aliases: ["balance", "scales", "scale", "wooden balance", "frame"],
      portable: false,
      desc: "A great wooden balance in a frame of black timber, the beam as thick as a man's thigh, polished by centuries of damp. One pan holds the jar of sand. The other pan hangs empty, tied by a thick rope to the platform. Whatever stands on the platform is being weighed against the jar."
    },
    pointer: {
      name: "Pointer",
      aliases: ["pointer", "needle", "notch", "gauge"],
      portable: false,
      desc: (state) => {
        if (!state.onLift) return "A long wooden pointer on the frame, swinging slowly, with a notch cut in the timber beside it. At the moment it hangs a little to one side of the notch, waiting.";
        const heavy = state.inventory.some(id => WORLD.objects[id].marked);
        return heavy
          ? "The pointer has swung far past the notch, and hangs there, trembling. Whatever you are carrying is a great deal more than the jar."
          : "The pointer rests exactly on the notch, perfectly still.";
      }
    },
    liftplat: {
      name: "Platform",
      aliases: ["platform", "lift", "planks", "elevator"],
      portable: false,
      noTakeMsg: "It is a lift. You could get on it.",
      desc: "A platform of old, grey planks hung in the shaft from four stout ropes, cold, damp and a little furred with age. It looks as though it would take a man. It is not obvious that it would take a man and his luggage."
    },
    blacksarc: {
      name: "Black Sarcophagus",
      aliases: ["sarcophagus", "black sarcophagus", "sarc", "coffin", "casket", "tomb", "box", "lid", "inscription"],
      portable: false,
      noTakeMsg: "It would take twenty men and a very good reason.",
      desc: "A smooth sarcophagus of black stone, cool, slick and unmarked, with no name, no titles and no boasts. Only one line is cut into the lid: Knowledge is carried. Possessions are not. The lid has slid open. It is empty."
    },
    crates: {
      name: "Crates",
      aliases: ["crates", "crate", "tarpaulin", "labels", "cases"],
      portable: false,
      noTakeMsg: "They are not yours, and they are heavier than they look.",
      desc: "Rough pine, splintery and warm from the sun through the window, stencilled in three languages and packed round with straw that smells of dust and, faintly, of something expensive. The labels say ON LOAN. The lids say otherwise: the nails have been drawn and put back so many times that the wood around them is soft as cheese. Whatever is in them is, officially, somewhere else."
    },
    cairomap: {
      name: "Map of Cairo",
      aliases: ["map", "map of cairo", "cairo map", "street map"],
      portable: true,
      desc: "A folded tourist map of Cairo, crisp paper that crackles at the creases and still smells of the ship's bookstall where you bought it. In a florid hand, someone has lettered the quarters you need:\n\n[[map]]"
        + "                    MUSEUM ANNEX\n"
        + "                         |\n"
        + "  TEA STALL - COFFEE HOUSE - TAHRIR SQUARE - BAZAAR - ANTIQUITIES\n"
        + "                         |      (rugs N, smith S)         |\n"
        + "                      HOTEL                    GATE - CAMEL MARKET\n"
        + "                                                           |\n"
        + "                                                        DOCKS\n[[/map]]\n\n"
        + "The Gate marks the edge of the city, and the desert beyond it is left blank, as maps of the desert tend to be."
    },
    compass: {
      name: "Pocket Compass",
      aliases: ["compass", "pocket compass"],
      portable: true,
      desc: (state) => {
        const r = state.currentRoomId;
        const base = "A brass pocket compass, cool and heavy as a coin, with a scratched glass lid and a catch that clicks like a tongue. ";
        if (["longdescent", "stair2", "landing", "pgold", "pcrimson", "pgreen", "pblue"].includes(r)) {
          return base + "The needle will not settle. It turns, slowly and steadily, round and round, as though the place were pulling at it.";
        }
        if (r === "heart") return base + "The needle is spinning steadily, faster than you have ever seen a needle go, and the whole case hums faintly against your palm.";
        if (r === "ridge" && (state.ridgePos || 0) > 0) return base + "The needle lurches, wanders, and settles with great confidence on the south-west. You are quite sure that is wrong.";
        if (r === "ridge") return base + "The needle trembles uncertainly in the wind, and cannot quite make up its mind about north.";
        if (r === "valley") return base + "The needle turns slowly, round and round, as though something beneath the sand were pulling at it.";
        return base + "The needle trembles, and then settles on north, with all the stubbornness of a good Englishman.";
      }
    },
    comb: {
      name: "Comb",
      aliases: ["comb", "pocket comb"],
      portable: true,
      desc: "A black pocket comb, smooth and slightly oily, with three teeth missing. It has fought the Cairo humidity, and lost."
    },
    toothbrush: {
      name: "Toothbrush",
      aliases: ["toothbrush", "tooth brush"],
      portable: true,
      desc: "A bone-handled toothbrush, smooth and a little damp, its bristles splayed like a tiny, tired shrub. When you test it with a thumb, it tastes faintly of the ship. It would get into very small places."
    },
    aftershave: {
      name: "Aftershave",
      aliases: ["aftershave", "after shave", "bottle", "cologne", "bay rum"],
      portable: true,
      desc: "A small glass bottle of bay rum aftershave, cool and slick, the label peeling, bought from the ship's barber on the second night out. It smells of limes, cloves and wild optimism, and strongly enough to put off a camel."
    },
    glassestray: {
      name: "Tray of Dark Glasses",
      aliases: ["tray", "glasses", "shades", "sunglasses", "dark glasses", "sun glasses", "pair of glasses", "stall"],
      portable: false,
      noTakeMsg: "The vendor's hand drifts, without any hurry, to the tray. \"Not for taking, effendi. For trading.\" His eyes rest, meaningfully, on your jacket.",
      desc: "A flat tray lined with faded velvet, crowded with pairs of dark glasses in thin metal frames, each pair cool, round and perfectly clear when you hold it up to the sun. The vendor's hand rests near them, and his eyes rest, with great patience, on your jacket."
    },
    occupant: {
      name: "Mummy",
      aliases: ["mummy", "body", "corpse", "remains", "occupant", "dead man"],
      portable: false,
      noTakeMsg: "It is a mummy: heavy, dry and quite dead, and no part of it is yours to carry. It does not look as though it appreciates the suggestion.",
      desc: (state) => {
        const r = state.currentRoomId;
        const kit = {
          hall:    { linen: "brown linen as dry and fragile as a wasps' nest", orb: "gold", gone: state.flags.gotOrb1 },
          snakepit:{ linen: "black-brown linen, stiff with age", orb: "crimson", gone: state.flags.gotOrb2 },
          burial:  { linen: "fine linen, finer than the hall's, over a stout frame", orb: "green", gone: state.flags.gotOrb3 },
          echoes:  { linen: "blue-grey linen, cool to the touch", orb: "blue", gone: state.flags.gotOrb4 }
        }[r] || { linen: "old brown linen", orb: "pale", gone: true };
        return "A mummy in " + kit.linen + ", lying on its back with its hands crossed on its chest. The wrappings are papery and faintly gritty under your fingertip, and it smells of resin, spice and old linen. "
          + (kit.gone ? "Its crossed hands are empty now. " : "Between its fingers a sphere of " + kit.orb + " light glows steadily. ")
          + "It is perfectly, unmistakably still. It does not look pleased, though, in the way something without a face can look displeased.";
      }
    },
    matches: {
      name: "Book of Matches",
      aliases: ["matches", "match", "matchbook", "book of matches", "box of matches"],
      portable: true,
      desc: "A cardboard book of matches, soft and slightly damp, the cover printed in gothic type: HOTEL ADLON, BERLIN. A handful are left. They smell of sulphur and, faintly, of Voss's pipe."
    },
    candle: {
      name: "Candle Stub",
      aliases: ["candle", "candle stub", "stub"],
      portable: true,
      desc: "A stub of white candle, waxy and cool, thumb-smooth, burned down to two inches. It smells of tallow and old churches. It would burn for an hour, or until you needed it, whichever came first."
    },
    tinmeat: {
      name: "Tin of Meat",
      aliases: ["tin", "tin of meat", "meat", "german tin", "tinned meat", "rindfleisch"],
      portable: true,
      desc: (state) => state.flags.meatCooked
        ? "The open tin, and beside it, on a flat stone at the fire's edge, a strip of dark meat, browned and crackling, giving off a smell of salt, smoke and almost-roast-beef. The stone is hot enough to sting. The cheerful cow on the label looks, if anything, smug."
        : (state.flags.tinOpened
          ? "The open tin: dark meat in a pale lake of fat, cold and heavy, smelling of cellars, salt and iron. German army markings are stamped on the lid, and a date: JULI 1925. It would, you think, want cooking."
          : "A squat, cold, dented tin with a German label: RINDFLEISCH, it says, above a drawing of a very cheerful cow. Stamped into the lid are German army markings, an eagle over HEERESVERPFLEGUNG, and a date: JULI 1925. It is, you reflect, aged to perfection. It is heavier than it looks, and when you shake it, something inside slides about with a slow, fatty thud.")
    },
    germantea: {
      name: "German Teabags",
      aliases: ["german teabags", "german tea", "german tea bags", "voss's tea", "tea packet", "packet of tea"],
      portable: true,
      desc: "A small paper packet of German tea, dry and crinkly, with a spiky gothic label. It smells of smoked wood, burnt sugar and, very faintly, of Voss's pipe. Whitfield would call it treason. Egad."
    },
    flatstone: {
      name: "Flat Stone",
      aliases: ["stone", "flat stone", "plate", "hot stone", "flat rock"],
      portable: false,
      noTakeMsg: "It is hot, and it is not going anywhere. It is your plate.",
      desc: "A flat grey stone the size of a dinner plate, pale on top and sooty underneath, lying at the edge of the fire. One side is warm to the touch and the other too hot to hold, which makes it, in the circumstances, a plate."
    },
    umbrella: {
      name: "Umbrella",
      aliases: ["umbrella", "brolly"],
      portable: true,
      tooBig: true,
      desc: "A cool bone handle, smooth and yellowed with age, and stiff black cloth that smells of rain and camphor. A big, old-fashioned umbrella, heavier than it looks. Whitfield's, like most of the useful things in your life lately. There is no rain in the desert, but a black dome that size would throw a very respectable circle of shade."
    },
    pen: {
      name: "Silver Pen",
      aliases: ["pen", "silver pen", "fountain pen"],
      portable: true,
      desc: "Cool, smooth silver, slim as a cigarette and warm where your pocket has held it. A fountain pen that has signed a great many requisition forms and lost every argument with the museum board."
    },
    watch: {
      name: "Pocketwatch",
      aliases: ["watch", "pocketwatch", "pocket watch"],
      portable: true,
      desc: "Warm from your pocket, its ticking a tiny pulse you can feel in your palm. A pocketwatch on a chain, the case worn smooth by years of thumbing. It runs four minutes slow and always has."
    }
  },

  npcs: {
    curator: {
      name: "Curator Whitfield",
      room: "museum",
      desc: "Tweed in Cairo heat, with an old-fashioned hearing aid clipped to one ear and a wire running down to a battery in his waistcoat. He keeps tilting his good ear toward you, and the hearing aid whistles whenever he turns his head. He smells of pipe tobacco and camphor, and appears to be losing an argument with his own institution.",
      greet: (state) => (state.flags.askedCuratorPyramid && state.flags.hasSupplies)
        ? "\"Pembroke. Still here? You ought to be gone. What more can I tell you?\""
        : "\"Pembroke. Thank God. Shut the door. I am, officially, cataloguing Ptolemaic pottery. Unofficially, I have been a good deal busier. Don't sit, there is no time. Listen.\"",
      topics: ["pyramid", "voss", "supplies", "trustees"]
    },
    hassan: {
      firstMeet: "\"Are you with Voss, effendi? He drank my coffee for a week and paid me in promises. He tried to swindle me out of a month of gossip. I have not seen him lately.\"",
      name: "Hassan",
      room: "teahouse",
      desc: "A magnificent beard dyed henna-red, oiled and braided with a single bead, falling to his belt. Missing one front tooth, which somehow makes him more convincing, not less. He smells of apple tobacco and rosewater, and his laugh sounds like pebbles in a tin.",
      greet: "\"What do you seek of Hassan, effendi?\"",
      topics: ["pyramid", "Voss", "coffee"]
    },
    merchant: {
      firstMeet: "\"You are not with Voss, are you? He tried to swindle me out of a whole crate of scarabs and I have not seen him lately. I am not sorry.\"",
      name: "The Merchant",
      room: "bazaar",
      desc: "Almost glove-puppet size: a tiny, round-faced man enthroned on a cushion on top of a crate so he can see over his own counter. His voice is a brass band, and he smells of cloves and hot copper. He sells everything and believes in none of it.",
      greet: (state) => state.inventory.includes("amulet") || state.flags.gaveAmulet
        ? "\"You have my scarab already, my friend. Anything else? And watch your pockets, effendi — this Bazaar is full of clever hands.\""
        : "\"For you, my friend — " + (localFez(state) ? "I see the fez, so a local price" : "special price") + ". The scarab's yours for " + spoken(GAME.priced(state, 20, 12).price) + " piastres, if you're buying. And watch your pockets, effendi — this Bazaar is full of clever hands.\"",
    },
    kasim: {
      firstMeet: "\"Are you with Voss? He tried to walk out of here with a Ptolemaic seal up his sleeve. I have not seen him lately.\"",
      name: "Kasim",
      room: "antiquities",
      desc: "Tall, thin and immaculate in a white suit without a speck of dust on it, with a steely, unblinking gaze the colour of a gun barrel. He makes no sound at all when he moves, and smells faintly of beeswax and lemon oil. Doesn't trust much.",
      greet: "\"I don't sell to tourists. Bring me something worth my trust, and we'll talk.\"",
      topics: ["pyramid"]
    },
    trader: {
      firstMeet: "\"You with Voss? He tried to swindle me out of a camel. I have not seen him lately, nor the camel.\"",
      name: "The Camel Trader",
      room: "camelmarket",
      desc: "A giant of a man who has to duck under his own awning. He is missing two fingers on the left hand, has a voice like gravel being poured, and smells of hay and camel. He has strong opinions about which of his animals is 'the good one.'",
      greet: (state) => state.flags.hasCamel
        ? "\"She is outside, friend, and she is not patient. What else do you want of me?\""
        : (localFez(state) ? "\"Ah, a man in a fez! A local price for you, then: " : "\"") + spoken(GAME.priced(state, 25, 15).price).replace(/^./, c => c.toUpperCase()) + " piastres and she's yours — best camel in the market. Spits only sometimes.\"",
    },
    teaseller: {
      name: "The Tea Seller",
      room: "teastall",
      desc: "Round, unhurried and visibly the happiest man in Cairo, in gleaming two-tone shoes, cream and chestnut leather, that cost more than his stall. He hums as he pours, and smells of mint and clove.",
      greet: (state) => "\"Tea, effendi! Drinking tea is the best thing to do anywhere in Egypt. Staying hydrated is essential here, and tea makes it a pleasure. " + spoken(GAME.priced(state, 8, 5).price).replace(/^./, c => c.toUpperCase()) + " piastres a glass" + (localFez(state) ? ", and for a man in a fez I do not even pretend to haggle" : "") + ".\"",
      topics: ["tea", "teabags"]
    },
    rugdealer: {
      name: "The Rug Dealer",
      room: "rugdealer",
      desc: "Plump and bejewelled, with a ring on every finger and a gold-rimmed monocle he keeps screwing into one eye to look at things, at present your breast pocket. His silk shirt rustles when he breathes, and he smells of rosewater.",
      greet: "\"Welcome, welcome! Nothing in here you can afford, effendi, I can see it from your face. But that silver pen of yours has a lovely line to it...\"",
      topics: ["rugs", "pen"]
    },
    smith: {
      name: "The Blacksmith",
      room: "blacksmith",
      desc: "Forearms like fence posts, a leather apron scorched black, and a grin that has seen a great many broken things. His eyebrows were burnt off years ago, which gives him a look of permanent surprise. It is hot as a stove to stand near him, and he smells of coal smoke and iron.",
      greet: "\"Broken things are my trade, effendi. A man with a broken knife about his person surely has something that needs mending? And a man holding a good knife is a man thieves leave alone.\"",
      topics: ["knife", "repair"]
    },
    dockvendor: {
      name: "The Dock Vendor",
      room: "docks",
      desc: "Sun-creased and squinting, wearing three hats stacked on his head and the only pair of dark glasses on the Nile that he isn't selling. His voice is a rasp worn down by river wind, and he smells of fish and tar.",
      greet: (state) => state.flags.gaveJacket
        ? "\"A fair trade, effendi. Wear them at any water, and you see what it hides.\""
        : "\"English jacket! Good cloth. Give me the jacket, effendi, and I give you these shades for it. Wear them at any water, and you see what it hides.\"",
      topics: ["sunglasses", "jacket"]
    },
    oasisvendor: {
      name: "The Oasis Vendor",
      room: "oasis",
      desc: "A man whose black hair falls in a river down the whole length of his back, with a sheen that would make an Arabian horse jealous, and a wooden cooking spoon permanently tucked behind one ear. His shirt hangs open over a broad brown chest, on which someone has tattooed, in faded blue ink, an elephant with its trunk raised. He hums off-key, a little flat, and smells of dates and wood smoke.",
      greet: "\"Welcome, traveller! Dates, honey, shade. The pool is for the camels. As for you — what is in that bag of yours? A man with a bag like that has something to trade.\"",
      topics: ["dates", "water", "trade"]
    },
    bedouinhost: {
      name: "The Bedouin Host",
      room: "camp",
      desc: "A very old man with a patch over one eye and a copper pot as big as his torso, which he stirs with the dignity of a priest. His robe is spotless, his one eye misses nothing, and he smells of smoke, cardamom and goat.",
      greet: "\"Sit, guest. The first cup is always welcome. The second is for talking.\"",
      topics: ["tea", "the ridge"]
    },
    teller: {
      name: "The Fortune-Teller",
      room: "camp",
      desc: "A woman wrapped in sixteen scarves of clashing colours, with a single gold tooth that flashes when she laughs, which is often, and sounds like a hinge. She shuffles a deck of cards without ever looking at it, and the deck, you notice, is one card short. She smells of incense and orange peel.",
      greet: "\"Sit, sit! Tell me your future, and I will tell you whether it is correct.\"",
      topics: ["future", "cards", "flute"]
    },
    snake: {
      name: "The Snake",
      room: "snakepit",
      desc: "A snake as thick as your thigh and about as long as a tram, in coils the colour of old gold, with a face of surprising refinement and a pair of tiny wire spectacles perched on the scales above its nostrils. Its tongue flickers like a conductor's baton. It smells of warm stone and dust, and speaks in a dry, polite hiss.",
      greet: "\"Ssso. A visitor. How rare, and how rude of me not to ask: a riddle, perhaps? What do you owe to those you take from?\"",
      topics: ["riddle", "debt"]
    },
    mummy: {
      name: "The Mummy",
      room: "mummy",
      desc: "A mummified priest sitting upright on a stone stool, wrapped in linen the colour of weak tea. One socket still holds a single glittering lapis eye, and a reed pen is tucked behind where an ear used to be. His voice is the sound of paper being slowly unfolded, and he smells of myrrh and old books.",
      greet: "\"Ah. A visitor who breathes. I have not had news in some centuries. Tell me: what is Egypt now? Who rules? What year is it?\"",
      topics: ["egypt", "king", "year", "crossing"]
    },
    ghost: {
      name: "The Ghost",
      room: "garden",
      desc: "A pale, translucent Roman in a dented bronze cuirass and a single sandal, a laurel wreath crooked over one ear, holding his own helmet under his arm like a man waiting for a tram. He cannot stop polishing it with the hem of his tunic. He smells, faintly, of rain on bronze, and speaks slowly, as if each word were coming from a long way off.",
      greet: "\"Salve. You will forgive me. I seem to have mislaid my name.\"",
      topics: ["blade", "tablet", "votive", "name"]
    },
    pharaoh: {
      name: "The Pharaoh",
      room: "platform",
      desc: "An old man in plain linen robes, tall, barefoot, wearing a single plain bronze ring and the kind of eyes that have read a great many books twice. He is not glowing and he is not godlike. He has the look of a man who has been very patient for very long, and is mildly amused that it has paid off. He smells of dust and distant rain.",
      greet: "He inclines his head and waits, with great patience, for you to choose.",
      topics: ["yourself", "the pyramid", "the treasure", "the others", "Hart", "going home"]
    },
    baldman: {
      name: "The Bald Man",
      room: "bazaar",
      desc: "A completely bald head, polished to the shine of an egg, above an enormous waxed moustache whose points curl past his ears like a ram's horns. He sits on an upturned crate with the air of a man whose entire dignity is concentrated in his upper lip. He smells of beeswax and bay oil, and his voice is a bright, hopeful tenor.",
      greet: "\"Excuse me! Excuse me, effendi! Does anyone, anyone at all, have a comb?\"",
      topics: ["comb", "thief"]
    },
    guard: {
      name: "The Gate Guard",
      room: "citygate",
      desc: "A white scar runs from brow to jaw across his sun-black face, through one eyebrow and out the other side of a nose that has been broken at least twice. He speaks in a low, dry voice and smells of leather and pipe smoke. He has been waving people through this gate for thirty years and has opinions on all of them.",
      greet: (state) => GAME.gateReport(state),
      topics: ["west", "supplies"]
    }
  }
};
