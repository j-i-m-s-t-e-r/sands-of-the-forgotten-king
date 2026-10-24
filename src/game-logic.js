// Sands of the Forgotten King (working title ENTOMBED) — game-specific logic (topics, trades, puzzle triggers, ending).
// engine.js calls into GAME for anything Egypt-specific so engine.js stays generic
// and reusable for a completely different game later.

const GAME = {

  // Items the player starts with.
  startInventory: ["pen", "watch", "jacket"],
  startWorn: ["jacket"],

  initialState() {
    return {
      money: 50,
      score: 0,
      flags: {
        readTelegram: false,
        sawMentorPhoto: false,
        askedCuratorPyramid: false,
        askedHassanPyramid: false,
        hasAmulet: false,
        gaveAmulet: false,
        knowsLocation: false,
        hasCamel: false,
        hasSupplies: false,
        knifeRepaired: false,
        gavePen: false,
        gaveJacket: false,
        thiefActive: false,
        thiefDone: false,
        watchStolen: false,
        teaDrunk: false,
        gaveWallet: false,
        waterskinFull: true,
        camelDrank: false,
        ate: false,
        duneStage1: false,
        duneStage2: false,
        gotFlute: false,
        gaveTeabags: false,
        gaveTarot: false,
        advised: false,
        mintTea: false,
        umbrellaLost: false,
        reachedValley: false,
        tinOpened: false,
        meatCooked: false,
        entranceFound: false,
        sandstormSolved: false,
        weighed: false,
        lampLit: false,
        sealed: false,
        sawMummy: false,
        noticedMark: false,
        openedSarc: false,
        gotOrb1: false,
        gotStone: false,
        corridorDone: false,
        netCut: false,
        reachedShaft: false,
        keyFloated: false,
        firstPour: false,
        braceletPlaced: false,
        doorUnlocked: false,
        serpentDone: false,
        snakeSolved: false,
        cutRopes25: false,
        openedSarc25: false,
        gotOrb2: false,
        nicheOpen: false,
        heardAll: false,
        wroteSand: false,
        bladeCut: false,
        skullTaken: false,
        lensPlaced: false,
        mirrorsAligned: false,
        mummyTold: false,
        gotBandages: false,
        sawHook: false,
        gotHook: false,
        tied: false,
        swung: false,
        pearlChosen: false,
        swallowedPearl: false,
        sawTreasury: false,
        fragBlade: false,
        fragTablet: false,
        fragVotive: false,
        askedBlade: false,
        askedTablet: false,
        askedVotive: false,
        remembered: false,
        gotClue: false,
        dug: false,
        starSet: false,
        landSet: false,
        starDoor: false,
        hollowFound: false,
        echoOpen: false,
        cutRopes4: false,
        openedSarc4: false,
        gotOrb4: false,
        ringSeen: false,
        pillarsAll: false,
        figureSeen: false,
        taxed: false,
        caseOpened: false,
        scented: false,
        gaveComb: false,
        stoneCleaned: false,
        caseNudged: false,
        gardenLeaveWarned: false,
        portalOpen: false,
        ended: false,
        blockCut: false,
        openedSarc28: false,
        gotOrb3: false,
        gameOver: false
      },
      statuePos: 0,
      skin: "clean",
      holeLevel: 0,
      mirrors: ["n", "n", "n"],
      heard: [],
      starRing: "none",
      landRing: "none",
      echoPos: "c",
      pendingSwing: false,
      pendingJump: false,
      pendingSleep: false,
      thirst: 0,
      thirstShown: 0,
      dateCount: 0,
      duneSafe: {},
      duneBad: {},
      riding: false,
      descentStage: 0,
      onLift: false,
      oasisClock: 0,
      dropWarned: [],
      removeWarned: [],
      stoneRemind: 0,
      liftClock: 0,
      choicePending: false,
      pTopics: [],
      surrendered: [],
      placed: [],
      stones: 0,
      duneStage: 0,
      ridgePos: 0
    };
  },

  award(state, amount, reason) {
    state.score = Math.min(state.score + amount, WORLD.maxScore);
    return `\n[+${amount} points — ${reason}]`;
  },

  // Called when the player TALKs to or ASKs an NPC about a topic.
  // Returns a line of output, or null if this engine has no special handling
  // (engine.js falls back to the NPC's generic greet/desc in that case).
  handleTopic(state, npcId, topic) {
    topic = (topic || "").toLowerCase();

    if (npcId === "curator") {
      if (topic.includes("suppl") || topic.includes("provision") || topic.includes("water") || topic.includes("food")) {
        if (!state.flags.hasSupplies) {
          state.flags.hasSupplies = true;
          if (!state.inventory.includes("supplies")) state.inventory.push("supplies");
          if (!state.inventory.includes("umbrella")) state.inventory.push("umbrella");
          ["wallet", "teabags", "tarot", "lamp", "waterskin", "rations"].forEach(id => {
            if (!state.inventory.includes(id)) state.inventory.push(id);
            state.inKit.add(id);
          });
          return "\"Ah — that.\" He glances at the door, like the words cost him something. \"I was sent to make the "
            + "crossing myself, you understand. The Trustees were quite specific. Had it all arranged — waterskins, rations, a decent lamp. Then some "
            + "very officious men from the local police took an interest in a crate of mine that turned out to have "
            + "rather more opium in it than the manifest suggested. Not mine, I'll have you know — but try explaining "
            + "provenance to a man with a truncheon. Provenance, as you may have gathered, has never been my strong suit. I'm confined to Cairo until it's sorted out, which is why you are here, and why I am very sorry about it.\"\n\n"
            + "He pushes a canvas kit-bag across the desk. \"Take it. And for heaven's sake get a camel — you'll not "
            + "manage all this on foot, still less in your arms.\"\n\nHe presses a large black umbrella on you as well. \"I'm not expecting rain, but you should expect some sun.\""
            + this.award(state, 10, "received supplies from Whitfield");
        }
        return "\"You've got everything I can spare. Don't lose it in a card game.\"";
      }
      if (topic.includes("pyramid") || topic.includes("tomb") || topic === "") {
        if (!state.flags.askedCuratorPyramid) {
          state.flags.askedCuratorPyramid = true;
          if (!state.inventory.includes("glass")) state.inventory.push("glass");
          return "\"A pyramid, dear boy: buried to its tip in the sand somewhere west of the old caravan road, and nobody has catalogued it. There's a dealer, Kasim, out past the bazaar — bought a papyrus fragment last month he won't shut up about. He won't sell to me, not any longer: the police know my face. Here—\" he presses a magnifying glass into your hand. \"You'll need this more than I will.\""
            + this.award(state, 10, "learned about Kasim");
        }
        return "\"I've told you what I know. Go rattle Kasim's cage, not mine.\"";
      }
      if (topic.includes("voss")) {
        return "\"Voss.\" He says the name like it tastes bad. \"Yes. He's here. Rather better at it than I am, which I find hard to forgive. Move quickly.\"";
      }
      if (topic.includes("trustee") || topic.includes("museum") || topic.includes("british") || topic.includes("crate") || topic.includes("loan")) {
        return "\"The Trustees pay me to catalogue things,\" he says, with great dignity. \"They are not curious about how the things come to be in the catalogue. It is a very civilised arrangement.\" He steps, as he says it, rather casually in front of the crates.";
      }
      return "Whitfield shrugs. \"Not my department.\"";
    }

    if (npcId === "hassan") {
      if (topic.includes("coffee") || topic.includes("tea") || topic.includes("drink") || topic.includes("cup")) {
        return "\"Coffee? The boy will bring you a cup, effendi. I would not, myself, but the boy will. Hassan does not carry trays. Hassan carries news.\" He waves a ringed hand at the stools. \"Sit. BUY a cup. A man talks better with something hot in his hand, even if it is a mistake.\"";
      }
      if (topic.includes("voss") || topic.includes("german") || topic.includes("explorer")) {
        return "\"The German? Speaks lies in many languages.\" Hassan examines a fingernail. \"He was here about two weeks ago. He probably knows something you don't. Whitfield in the museum won't talk to him.\"";
      }
      if (topic.includes("pyramid") || topic.includes("tomb") || topic.includes("kasim") || topic.includes("antiquit") || topic.includes("gift") || topic === "") {
        if (!state.flags.askedHassanPyramid) {
          state.flags.askedHassanPyramid = true;
          return "Hassan leans in. \"Kasim, the antiquities man. Doesn't trust strangers — but he trusts gifts. A pretty trinket loosens a stubborn tongue.\""
            + this.award(state, 10, "picked up a useful rumour");
        }
        return "\"I've already sold you my best rumour today.\"";
      }
      return "Hassan spreads his hands. \"Ask me about something I'd actually know.\"";
    }

    if (npcId === "kasim") {
      if (topic.includes("pyramid") || topic.includes("tomb") || topic.includes("papyrus") || topic.includes("fragment") || topic.includes("scrap")) {
        if (!state.flags.gaveAmulet) {
          return "\"I sell antiques, not gossip. And I don't sell antiques to strangers either.\"";
        }
        if (state.flags.knowsLocation) {
          return "\"I've shown you all I have. The rest is your problem now.\"";
        }
        if (!state.inventory.includes("glass")) {
          return "Kasim unlocks the glass cabinet with a key from his waistcoat and lays a brittle scrap of papyrus on the counter, the one Whitfield told you about. The marks are too faded to make out with the naked eye. You would need something to magnify them.";
        }
        state.flags.knowsLocation = true;
        return "Kasim unlocks the glass cabinet with a key from his waistcoat, lays a brittle scrap of papyrus on the counter, and steps back. \"Look. Do not touch.\"\n\nYou hold the magnifying glass over the papyrus. Faint lines resolve into a survey mark — a valley, a ridge shaped like a jackal's ear, a distance in old measures from the last well on the caravan road west. At the foot of the scrap, almost rubbed away, is a tiny drawing: a triangle with a doorway at its base, and an oval cartouche the glass cannot quite resolve.\n\n\"Whatever you find out there,\" Kasim says quietly, \"you did not get the location from me. And a word of advice, since you have been polite: that place is said to close behind its visitors.\""
          + this.award(state, 20, "deciphered the papyrus — you know where the pyramid is");
      }
      return "Kasim says nothing. He's waiting for you to be more interesting.";
    }

    if (npcId === "guard") return this.gateReport(state);

    if (npcId === "teaseller") {
      const teabagHint = "His nose twitches toward your kit-bag. \"But what is that I smell? English tea! Rubbish, effendi, I would not serve it to a goat. But the Bedouin, out in the desert beyond the dunes, are mad for it. Take it to them, and they will trade you a glass of their own mint tea: the real thing, which clears a man's head even in a sandstorm.\"";
      if (topic.includes("tea") && !topic.includes("bag")) {
        const base = "He beams. \"Tea! The best thing to do anywhere in Egypt. Staying hydrated is essential here, effendi, and I would tell you so even if I did not sell it.\"";
        return state.inventory.includes("teabags") ? base + " " + teabagHint : base;
      }
      if (topic.includes("bag") || topic.includes("english") || topic.includes("kit") || topic.includes("suppl")) {
        if (state.inventory.includes("supplies") || state.inventory.includes("teabags")) return teabagHint.replace("But what is that I smell? ", "Ah, that. ");
        return "He looks at your empty hands, politely. \"Bring me the bag, and I will tell you what is in it.\"";
      }
      return null;
    }

    if (npcId === "rugdealer") {
      if (topic.includes("rug") || topic.includes("carpet") || topic.includes("price") || topic.includes("buy")) {
        return "\"Everything here is beyond you, effendi, and I say it with love.\" His eyes drift, once more, to your breast pocket. \"The pen, though. The pen I could talk about.\"";
      }
      if (topic.includes("pen")) {
        if (state.inventory.includes("pen")) return this.handleGive(state, "pen", "rugdealer");
        return "He looks at your pocket, finds it empty, and sighs.";
      }
      return null;
    }

    if (npcId === "smith") {
      if (topic.includes("knife") || topic.includes("repair") || topic.includes("broken") || topic.includes("mend")) {
        if (state.flags.knifeRepaired) return "\"It is mended, effendi. Hold it where thieves can see it.\"";
        if (state.inventory.includes("knife")) return this.handleGive(state, "knife", "smith");
        return "\"Bring me what is broken, effendi. I mend what I can hold. A man like you must own something with a blade snapped off.\"";
      }
      return null;
    }

    if (npcId === "dockvendor") {
      if (/sunglass|shade|glass|jacket|trade|buy|price|cost|pay|money|dark/.test(topic)) {
        if (state.flags.gaveJacket) return "\"A fair trade, effendi. Remember: wear them at any water.\"";
        if (state.inventory.includes("jacket")) return "\"Money? No, no, effendi. What would I do with money? I want that English jacket: good cloth. Give me the jacket, and the shades are yours. Wear them at any water, and you see what it hides.\"";
        return "\"I want an English jacket, effendi. Good cloth. You had one.\"";
      }
      return null;
    }

    if (npcId === "pharaoh") return this.pharaohTopic(state, topic);

    if (npcId === "mummy") {
      if (/chasm|cross|across|beam|gap|drop|edge|other side|far side/.test(topic)) {
        return "\"Cross? Of course you wish to cross. Everyone does, in the end.\" He does not turn his head. \"Look up, living one, and look closely. Some things hang where they were left. And you will need something long, and something to fasten it to, and the nerve to let go of the ground. Once across, you cannot come back.\"";
      }
      if (/egypt|king|year|news|pharaoh|england|english|date|cairo|world|rule/.test(topic)) {
        if (state.flags.mummyTold) return "\"I have had my news, thank you. Take the linen. I find I do not miss it.\"";
        state.flags.mummyTold = true;
        return "You tell him: that Egypt is a kingdom again, of a sort, with a king who is not a pharaoh, and English advisers who are not exactly advisers; that there are trams in Cairo; and that the year is 1936 by the Christian count. The mummy listens with his one bright eye, and sighs a long, dusty sigh. \"A king with foreign blood and foreign masters. Tch. It was ever thus. Thank you, living one. I may as well pay you in kind. Take my wrappings, if they are any use. I have no further need of modesty.\""
          + this.award(state, 10, "told the mummy the news");
      }
      return null;
    }

    if (npcId === "ghost") {
      const f = state.flags;
      const done = () => f.askedBlade && f.askedTablet && f.askedVotive;
      const piece = (examined, asked, line) => {
        if (!f[examined]) return "\"A thing? There are many things lying about this garden, friend. Look at them first, and ask me again.\"";
        if (f[asked]) return "\"Yes, yes, I remember that much. There is more, I am sure of it.\"";
        f[asked] = true;
        let out = line + this.award(state, 5, "helped the ghost remember");
        if (done() && !f.remembered) {
          f.remembered = true;
          out += "\n\nHe stops polishing. \"Rufus. Arretium. The twenty-second. Wait — I have it. Gaius Valerius Rufus, of Arretium, of the twenty-second legion, sent to look for a tomb and finding it, which was the whole of his mistake!\" He bows so deeply that his wreath falls off, and passes straight through the floor, and he retrieves it quite unembarrassed."
            + this.award(state, 15, "gave the Roman back his name");
        }
        return out;
      };
      if (/blade|sword/.test(topic)) return piece("fragBlade", "askedBlade", "\"The twenty-second. Legio XXII. Yes. I marched with the twenty-second, long ago, in the sand.\"");
      if (/tablet|fragment|word|rufus/.test(topic)) return piece("fragTablet", "askedTablet", "\"Rufus. They called me Rufus. The red one. I had hair, once, the colour of a new brick.\"");
      if (/votive|pot|arret/.test(topic)) return piece("fragVotive", "askedVotive", "\"Arretium. The red pots! My mother's town, all kilns and smoke. I would know that smell anywhere.\"");
      if (/name|who/.test(topic)) {
        return f.remembered
          ? "\"Gaius Valerius Rufus, of Arretium. I had it all along, you know. I had simply put it somewhere.\""
          : "\"My name. Yes, I had one. It is in the garden somewhere, I think. I keep stepping on it.\"";
      }
      if (/mark|pyramid|house|treasure|lift|rope|basket|weigh|last|danger/.test(topic)) {
        if (!f.remembered) return "\"My head is full of mist. Ask me when I know who I am.\"";
        const clue = "\"Every cup I took bore a little pyramid. I thought it the maker's stamp, as a potter marks his pots at Arretium. It is not. It is a receipt. Near the end of the house there is a basket on a rope. It weighs you, and everything you carry, and it is not interested in your reasons. Do not take the house's things into it. I did, once. The rope is very long.\"";
        if (!f.gotClue) { f.gotClue = true; return clue + this.award(state, 10, "heard the Roman's warning"); }
        return clue;
      }
      return null;
    }

    if (npcId === "baldman") {
      if (/comb/.test(topic)) {
        return state.flags.gaveComb ? "\"My moustache is a work of art once more. I think of you each morning.\"" : "\"A comb, effendi! A comb! My moustache is in a terrible state, and I cannot think, I cannot do anything, with it like this.\"";
      }
      if (/thief|watch|pocket|steal|thin/.test(topic)) {
        const f = state.flags;
        const live = f.thiefActive && !f.thiefDone;
        if (live && !f.thiefWarned) { f.thiefWarned = true; state.thiefClock = -1; }   // the next two turns are yours
        if (f.gaveComb) {
          return live
            ? "\"The thin man, behind you. He takes, quick, quick, and then your watch is his. A blade, shown openly, and he is gone. Do not forget.\""
            : "\"The thin man waits two breaths, and takes. A blade, shown openly, and he is gone. Do not forget.\"";
        }
        return live
          ? "\"The thin man in the stained waistcoat? He has been at your back since you arrived, effendi, and his eyes are on that watch chain. I could tell you what he fears, but I cannot think properly with my moustache in this state. A comb, perhaps?\""
          : "\"Ah, I know a great many things, effendi. But I cannot think properly with my moustache in this state. A comb, perhaps?\"";
      }
      return null;
    }

    if (npcId === "snake") {
      if (/debt|repay|return|pay|back|owe|restor|give/.test(topic)) {
        if (state.flags.snakeSolved) return "\"You have answered already, and I am quite satisfied. The middle road, remember.\"";
        state.flags.snakeSolved = true;
        return "The snake's tongue flickers, delighted. \"A debt. Sssplendid. Rare, in a visitor, to know that taking creates one.\" It inclines its head. \"In return: when you come to the bridge of my cousins, be courteous. The low is hungry and the high is angry. Take the middle road, and the middle note.\""
          + this.award(state, 15, "answered the snake's riddle");
      }
      if (/riddle|question|ask/.test(topic)) return "\"What do you owe to those you take from?\" The snake waits, with great patience.";
      return "\"Not that, I think,\" says the snake, kindly. \"Consider what taking creates, visitor. Try again. Take your time. I have a great deal.\"";
    }

    if (npcId === "oasisvendor") {
      if (topic.includes("date") || topic.includes("food") || topic.includes("eat")) {
        if (!state.flags.gaveWallet) return "\"The finest dates in all of Egypt, my friend, and certainly the only dates at this oasis. Ha! Trade me something I might want.\"";
        if (state.inventory.includes("dates") && state.dateCount > 0) return "\"You have dates already, my friend. Eat! Eat!\"";
        state.inventory.push("dates");
        state.dateCount = 6;
        return "He tuts, laughs, and presses another basket on you. \"The oasis does not run out of dates.\"";
      }
      if (topic.includes("water") || topic.includes("pool") || topic.includes("drink")) {
        if (state.flags.gaveWallet) return "\"Your skin is full, my friend. Drink from that, not from the pool. The pool is for the camels.\"";
        return "\"The pool is for the camels, my friend. For a man there is the jug. For people who trade.\"";
      }
      if (topic.includes("trade") || topic.includes("bag") || topic.includes("wallet") || topic.includes("leather") || topic.includes("elephant")) {
        if (!state.flags.gaveWallet && /wallet|leather|elephant/.test(topic) && state.inventory.includes("wallet")) {
          return "His eyes light up, and one hand strays to his chest. \"THAT. Give it to me, and the oasis is yours.\"";
        }
        if (!state.flags.gaveWallet) return "\"What do I want? Look at me, my friend. Look at me properly. What does a man like me love?\"";
        return "\"We have traded, you and I. A man could not ask for better.\"";
      }
      return null;
    }

    if (npcId === "bedouinhost") {
      if (/ridge|storm|sand|west|valley|wind|compass|pyramid|danger|dangerous|safe/.test(topic)) {
        return "He watches you over the rim of the pot with his one eye. \"Do not go over the Sandstorm Ridge, guest. The winds there are treacherous, and a man cannot hold a direction in them. Even the finest compass lies to its master beyond the ridge.\" He shrugs, a very old shrug. \"Of course, you will go. Guests always do.\"";
      }
      if (topic.includes("tea")) {
        if (state.flags.gaveTeabags) return "\"The tea of guests, with honour,\" he says, and looks pleased with himself.";
        if (state.inventory.includes("teabags")) return "He sniffs the air toward your kit-bag. \"English tea. Rubbish, in the pot. But in a glass, with mint, from my hands... give it to me, guest, and I will make you the real thing.\"";
        return "\"You have no tea? Sit anyway. The first cup is always welcome.\"";
      }
      return null;
    }

    if (npcId === "teller") {
      if (topic.includes("future") || topic.includes("card") || topic.includes("tarot")) {
        if (state.inventory.includes("tarot") && !state.flags.gaveTarot) {
          return "Her gold tooth flashes. \"You have a card in that bag. One of mine. It smells of me.\"";
        }
        return "She tells you your future in a dozen vague, flattering words, several of which, you suspect, are true.";
      }
      if (topic.includes("flute")) return "\"Keep it. Where you are going, snakes appreciate good manners and a decent tune.\"";
      return null;
    }

    return null;
  },

  handleGive(state, objId, npcId) {
    if (objId === "amulet" && npcId === "kasim") {
      if (!state.inventory.includes("amulet")) {
        return "You don't have that.";
      }
      state.inventory = state.inventory.filter(o => o !== "amulet");
      state.flags.gaveAmulet = true;
      return "Kasim turns the amulet over, unimpressed by the craftsmanship but visibly softened by the gesture. \"Hm. Ask me about the pyramid, then — quickly, before I change my mind.\""
        + this.award(state, 15, "earned Kasim's trust");
    }
    if (objId === "comb" && npcId === "baldman") {
      state.inventory = state.inventory.filter(o => o !== "comb");
      state.inKit.delete("comb");
      state.flags.gaveComb = true;
      return "He takes the comb in both hands, like a relic. He does not so much comb his moustache as conduct it, with long, tender, trembling strokes, until the points stand out like the horns of a happy ram. \"Effendi, you have saved a life, or at least a moustache.\" He lowers his voice. \"Now, a favour for a favour. The thin man in the stained waistcoat, who limps? He takes things. He waits until you have been standing in the Bazaar two breaths, and then, quick, quick, your watch is his. He is afraid of one thing only. A blade, shown openly.\""
        + (state.flags.thiefActive && !state.flags.thiefDone && !state.flags.thiefWarned ? (state.flags.thiefWarned = true, state.thiefClock = -1, "") : "")
        + this.award(state, 5, "gave the bald man a comb");
    }
    if (objId === "pen" && npcId === "rugdealer") {
      state.inventory = state.inventory.filter(o => o !== "pen");
      state.inventory.push("fez");
      state.worn.add("fez");
      state.flags.gavePen = true;
      return "He takes the pen between two fingers, holds it to the light, and nods as though it has agreed to something. \"A fine trade.\" A red felt fez lands in your hands, and before you can object he claps it on your head himself and tilts it to the correct angle. \"Keep it on in the market, effendi. Everyone gives a local his local price.\""
        + this.award(state, 10, "traded the pen for a fez");
    }
    if (objId === "jacket" && npcId === "dockvendor") {
      state.inventory = state.inventory.filter(o => o !== "jacket");
      state.worn.delete("jacket");
      state.inventory.push("sunglasses");
      state.flags.gaveJacket = true;
      WORLD.rooms.docks.objects = WORLD.rooms.docks.objects.filter(id => id !== "glassestray");
      return "The vendor drapes your jacket over his arm as if it were a flag he had captured. \"Good cloth.\" You are handed a pair of dark glasses. \"Wear them at any water, effendi, and you see what it hides.\""
        + this.award(state, 10, "traded the jacket for sunglasses");
    }
    if (objId === "knife" && npcId === "smith") {
      if (state.flags.knifeRepaired) return "\"It is mended already, effendi.\"";
      const p = this.priced(state, 10, 6);
      if (state.money < p.price || !this.canSpare(state, p.price)) {
        return `\"${p.price} piastres to mend it,\" the blacksmith says. \"But from the look of your purse, you need that money for more important things first, effendi.\"`;
      }
      state.money -= p.price;
      state.flags.knifeRepaired = true;
      return p.line + "He turns the knife over, grunts, and works it at the forge for ten minutes while you watch the sparks. \"A man with a knife in his hand is a man thieves leave alone.\" It comes back sharp and whole, the crest still legible."
        + this.award(state, 10, "had the knife repaired");
    }
    if (objId === "wallet" && npcId === "oasisvendor") {
      state.inventory = state.inventory.filter(o => o !== "wallet");
      state.inKit.delete("wallet");
      state.flags.gaveWallet = true;
      this.setSkin(state, "clean");
      if (!state.inventory.includes("dates")) { state.inventory.push("dates"); state.dateCount = 6; }
      return "He turns the wallet over in his hands, strokes the silver elephant with a reverent thumb, and tucks it inside his robe where no one will ever find it. \"A good trade. A very good trade.\" He takes your waterskin, sniffs the warm water in it, and with a tut of professional disgust pours it out onto the sand and refills it from his clay jug: cold, clean water, so cold it makes the goatskin sweat. Then he eats a date with great ceremony, and flicks the stone onto the sand beyond the palms. At once a dozen black beetles pour out of the ground, a glossy, clicking tide, and strip it clean in seconds. \"Do not walk where the beetles are,\" he says, quite casually, as if remarking on the weather. A basket of dates lands in your hands."
        + this.award(state, 15, "traded the wallet at the oasis");
    }
    if ((objId === "teabags" || objId === "supplies") && npcId === "teaseller") {
      return "The Tea Seller sniffs the packet and recoils, delighted and appalled in equal measure. \"English tea! Not for me, effendi. I am a man of mint and cardamom. Keep it. Out in the desert beyond the dunes, the Bedouin would trade you the real thing for it, and a glass of their mint tea clears a man's head even in a sandstorm.\"";
    }
    if (objId === "teabags" && npcId === "bedouinhost") {
      state.inventory = state.inventory.filter(o => o !== "teabags");
      state.inKit.delete("teabags");
      state.flags.gaveTeabags = true;
      state.inventory.push("minttea");
      return "The old man takes the packet between two fingers as if it might bite, sniffs it, sighs, and drops a pinch into the great copper pot along with a fistful of fresh mint. A moment later a small glass is pressed into your hand."
        + " He watches you take the first sip, then looks west, over the rim of the pot. \"Do not go over the Sandstorm Ridge, guest. The winds there are treacherous, and a man cannot hold a direction in them. Even the finest compass lies to its master beyond the ridge.\" He shrugs, a very old shrug. \"Of course, you will go. Guests always do.\""
        + this.award(state, 10, "swapped the teabags for mint tea");
    }
    if (objId === "tarot" && npcId === "teller") {
      state.inventory = state.inventory.filter(o => o !== "tarot");
      state.inKit.delete("tarot");
      state.flags.gaveTarot = true;
      state.flags.advised = true;
      return "The teller snatches the card, stares at it, and bursts into a laugh like a hinge. \"The Hanged Man! My Hanged Man! The thief took him in Cairo, and I have been shuffling a short deck ever since.\" She kisses it, presses it to her forehead, and slips it into the deck. Then she catches your wrist. \"You will meet a wind on the ridge. Follow the wind.\" Her gold tooth flashes, and she nods, very slightly, at the closed umbrella under your arm."
        + this.award(state, 15, "returned the Hanged Man");
    }
    const f = state.flags;
    const refusals = {
      curator: "Whitfield takes it, turns it over like a customs officer, and hands it back. \"Very kind, dear boy, but no. Not what I'm after.\"",
      hassan: "Hassan peers at it with one raised eyebrow. \"For me? No, effendi. A man should give me what he wants me to have, and you do not seem to want me to have this.\"",
      merchant: "The Merchant weighs it in one tiny hand, sniffs, and passes it back. \"Not for trade, effendi. Bring me a price, or bring me nothing.\"",
      kasim: "Kasim's gaze travels from the offering to your face, and stays there. He lays it on the counter, slides it back across the wood, and says nothing at all. Whatever he is waiting for says something about the giver, and this does not.",
      trader: "The Trader's two remaining fingers wave it away. \"Money talks, friend. That only mumbles.\"",
      teaseller: "The Tea Seller hums, turns it over, and returns it. \"A kind thought, effendi, but I sell tea, and for tea I take money.\"",
      rugdealer: "The Rug Dealer screws in his monocle, studies it, and unscrews it again. \"No. Not that. Is there nothing about you that I would actually want?\"",
      smith: "The Blacksmith looks at it, then at his own scorched hands. \"I mend things, effendi. I do not collect them. Bring me something that is broken.\"",
      dockvendor: "The Dock Vendor tries on a hat, then looks at the offering, then at the hat again. \"No. Not for me. But a man who had a jacket he no longer needed...\"",
      guard: "The Guard looks at it, then at you, and puts a hand on his belt. \"No presents, effendi. Not of that sort.\"",
      oasisvendor: f.gaveWallet ? "\"No, no, my friend. We have traded, I am a content man.\"" : "He sniffs it, shrugs, and hands it back. \"Not that, my friend. Look at me. What does a man like me want?\"",
      bedouinhost: "The Host turns it over, sets it on the rug, and goes back to stirring his vast copper pot. \"A kind gift. But a man who has crossed the sand is waiting for tea.\"",
      teller: f.gaveTarot ? "\"Enough gifts. You will make me proud, and a woman my age should not be proud.\"" : "She holds it at arm's length, laughs like a hinge, and hands it back. \"Pretty. But I am missing a card, my dear, not a trinket.\"",
      snake: "The Snake regards it with polite incomprehension. \"I do not eat that. I do not wear it. I cannot think what it is for.\"",
      mummy: "\"Keep it, living one. I have no use for things any longer. News, now, is a different matter.\"",
      ghost: "\"Not that, friend, not that.\" He peers at it, his helmet under his arm. \"The things I have lost are lying about this garden. Look about you.\"",
      baldman: f.gaveComb ? "\"No more, no more. I am a satisfied man.\"" : "\"Very kind, effendi, but my moustache needs a comb, and only a comb.\"",
      pharaoh: "He glances at it, smiles faintly, and does not take it. \"Keep it, for as long as you are able.\""
    };
    if (refusals[npcId]) return refusals[npcId];
    const nm = (WORLD.npcs && WORLD.npcs[npcId] && WORLD.npcs[npcId].name) || "They";
    return nm + " looks at it politely and hands it back. It is not what they were hoping for.";
  },

  // Price helpers. While the fez is worn, sellers give the local price.
  priced(state, tourist, local) {
    if (state.worn.has("fez")) {
      return { price: local, line: "\"I like your fez. I give you local price.\"\n" };
    }
    return { price: tourist, line: "" };
  },

  // Money the player must keep back so the critical path stays affordable
  // (amulet and camel), so extras can never soft-lock the game. While the fez
  // is worn the local prices apply, and the fez can't be taken off until the
  // shopping is done (see handleRemove), so that assumption always holds.
  reserve(state) {
    const local = state.worn.has("fez");
    let need = 0;
    if (!state.inventory.includes("amulet") && !state.flags.gaveAmulet) need += local ? 12 : 20;
    if (!state.flags.hasCamel) need += local ? 15 : 25;
    return need;
  },
  canSpare(state, price) {
    return state.money - price >= this.reserve(state);
  },

  // Things sold by name rather than as objects (a glass of tea).
  extraWares(state, roomId) {
    if (roomId === "teahouse") return [["Cup of coffee", this.priced(state, 2, 1).price]];
    if (roomId === "teastall") return [["Glass of tea", this.priced(state, 8, 5).price]];
    return [];
  },

  // Price shown in "what's for sale" listings.
  priceFor(state, id) {
    if (id === "amulet") return this.priced(state, 20, 12).price;
    return WORLD.objects[id].price;
  },

  handleTea(state) {
    const room = state.currentRoomId;
    if (room === "teahouse") return "The boy with the tray gives you a look of mild offence. \"Tea, effendi? Tea is for the stall to the west. Here, we drink coffee.\"";
    if (room !== "teastall") return "Nobody's selling tea here. The Tea Stall, west of the Coffee House, would.";
    const p = this.priced(state, 8, 5);
    if (state.money < p.price || !this.canSpare(state, p.price)) {
      return `\"${p.price} piastres, effendi, but you should spend it on what you need first. Tea will wait for you.\"`;
    }
    state.money -= p.price;
    let out = p.line + "You drink it standing at the counter: hot, sweet, and flavoured with something green. You feel better hydrated than you have any right to.";
    if (!state.flags.teaDrunk) {
      state.flags.teaDrunk = true;
      out += this.award(state, 5, "stayed hydrated");
    }
    return out;
  },

  // Coffee, at the Coffee House: cheap, dreadful, and worth no points at all.
  handleCoffee(state) {
    if (state.currentRoomId !== "teahouse") return "Nobody's selling coffee here. The Coffee House, back in Cairo, would.";
    const p = this.priced(state, 2, 1);
    if (state.money < p.price || !this.canSpare(state, p.price)) {
      return `The boy with the tray holds up ${p.price} fingers, eyes your purse, and then, kindly, lowers them. \"Spend it on what you need first, effendi. The coffee will wait for you. It always does.\"`;
    }
    state.money -= p.price;
    const again = state.flags.coffeeDrunk;
    state.flags.coffeeDrunk = true;
    return p.line + (again
      ? "The boy brings a second cup, and you drink it for reasons you will examine later. It is exactly as bad as the first."
      : "The boy with the tray puts a small cup in front of you before you have finished asking, takes your coins, and is gone. The coffee is marginally more fluid than tar, and somehow tastes worse: bitter, burnt and gritty, with a sweetness that arrives too late to help. You finish it out of politeness, and a sense of having paid. Your heart begins, at once, to knock on the inside of your ribs.");
  },

  handleDrink(state, what) {
    what = (what || "").toLowerCase();
    if (!what.trim() || /^(from )?(the |my )?(water ?skin|skin|flask)$/.test(what.trim())) what = "water";
    const f = state.flags;
    const wasThirsty = (state.thirst || 0) >= 12;
    if (/coffee/.test(what)) return this.handleCoffee(state);
    if (what.includes("mint") || (what.includes("tea") && state.inventory.includes("minttea"))) {
      if (!state.inventory.includes("minttea")) return "You have no mint tea.";
      state.inventory = state.inventory.filter(i => i !== "minttea");
      f.mintTea = true;
      state.thirst = 0; state.thirstShown = 0;
      return "You drink it in slow sips: hot, green, sweet, and astonishingly clear-headed. The heat of the desert seems to step back half a pace."
        + this.award(state, 5, "drank the mint tea");
    }
    if (state.currentRoomId === "valley" && /tea|mug/.test(what) && !state.inventory.includes("minttea")) {
      if (!f.teaBrewed) return state.inventory.includes("germantea") ? "It is a dry packet. You would have to brew it first." : "You have no tea.";
      if (f.teaDrunk) return "The mug is empty.";
      f.teaDrunk = true;
      state.thirst = 0; state.thirstShown = 0;
      return "You drink it. It tastes like boiled boot polish, with undertones of cardboard and regret. Egad. It is also, undeniably, hot, and by the bottom of the mug you have almost stopped shivering.";
    }
    if (what.includes("tea")) return this.handleTea(state);
    const poolish = /pool|oasis|lake|from the/.test(what);
    if (what.includes("water") || poolish) {
      if (what.includes("water") && !poolish && state.inventory.includes("waterskin") && state.skin === "dirty") {
        return "The skin holds only black, iron-tasting water from the passage. You would rather not.";
      }
      if (what.includes("water") && !poolish && state.inventory.includes("waterskin") && f.waterskinFull) {
        state.thirst = 0; state.thirstShown = 0;
        return (f.gaveWallet
          ? "You drink from the waterskin: cool, clean, and tasting faintly of goat."
          : "You drink from the waterskin: warm, flat, and tasting a good deal of goat and leather. It wets your throat, which is all you ask of it.")
          + (wasThirsty ? " The world steadies, the horizon stops swaying, and the camel's ears swing back to attention." : "");
      }
      if (state.currentRoomId === "oasis") {
        if (state.worn.has("sunglasses")) {
          return "You kneel and lean toward the pool, and through the dark lenses you see exactly what lives in it. You straighten up again, slowly, and decide that you are not that thirsty.";
        }
        return this.die(state,
          "You kneel and cup your hands. For a moment the water is warm, soft and wonderful. Then something in it moves, and then something in you does. By evening you are shivering in the shade of a palm. By morning you are not shivering at all.",
          "Ancient proverb: Where the camel drinks, the wise man frowns.");
      }
      return "You have nothing to drink.";
    }
    return null;
  },

  handleEat(state, what) {
    what = (what || "").toLowerCase();
    // "swallow it" / "swallow" / "swallow my choice" mean the pearl you are holding
    if (state.currentRoomId === "treasury" && state.flags.pearlHeld && state.inventory.includes(state.flags.pearlHeld)
        && /^(it|that|this|choice|my choice|the choice|your choice|the pearl|my pearl)?$/.test(what.trim())) {
      return this.choosePearl(state, state.flags.pearlHeld);
    }
    if (/pearl/.test(what) && state.currentRoomId === "treasury" && state.flags.pearlHeld && state.inventory.includes(state.flags.pearlHeld)) {
      return this.choosePearl(state, state.flags.pearlHeld);
    }
    if (/pearl/.test(what) && state.currentRoomId === "treasury") {
      const id = /seed|small/.test(what) ? "seedpearl" : /marble|middle|medium/.test(what) ? "marblepearl" : /cue|big|large/.test(what) ? "cuepearl" : null;
      if (!id) return "Which pearl: the seed, the marble or the cue ball?";
      if (!WORLD.rooms.treasury.objects.includes(id)) return "The tray is empty. The Djinn has taken the rest.";
      WORLD.rooms.treasury.objects = WORLD.rooms.treasury.objects.filter(o => o !== id);
      state.inventory.push(id);
      return this.choosePearl(state, id);
    }
    if (what.includes("date")) {
      if (!state.inventory.includes("dates") || !(state.dateCount > 0)) return "You have no dates.";
      this.useDate(state);
      state.stones = (state.stones || 0) + 1;
      if (state.currentRoomId === "valley") state.flags.nightFed = true;
      let out = "After tasting one of the best dates in Egypt, you have a sticky date stone in your hand.";
      if (!state.flags.ate) { state.flags.ate = true; out += this.award(state, 10, "ate at the oasis"); }
      return out;
    }
    if (state.currentRoomId === "valley" && /ration|tin|biscuit|food|meat|beef|bully|supper|dinner/.test(what)) {
      const f = state.flags;
      if (f.entranceFound) return "You are not hungry. You slept like the dead and ate like the living.";
      const tin = /tin|meat|rindfleisch|cow/.test(what) && state.inventory.includes("tinmeat");
      if (/meat|rindfleisch/.test(what) && !tin) return "You have no meat. The sacks, perhaps.";
      if (tin) {
        if (!f.tinOpened) return "It is a sealed tin. You would have to open it first.";
        if (!f.meatCooked) return this.poison(state);
        f.nightFed = true;
        return "You eat the meat off the flat stone with your fingers, burning them, and do not care. It is salty, smoky, rich and astonishingly good: whatever fifteen years in a tin did to it, it did it in your favour. It is, you decide, aged to perfection.";
      }
      f.nightFed = true;
      return "You open a tin of bully beef, and eat it with the penknife's one good point, and then a ship's biscuit, which is hard enough to chip a tooth and just as welcome. " + (f.nightFire ? "The fire warms the beef a little, which does it no harm." : "It is cold, and so are you.");
    }
    if (/ration|tin|biscuit|food/.test(what)) return "You are not hungry enough yet. Save the rations for the crossing.";
    return null;
  },

  handleWater(state, what) {
    if (!/camel/.test((what || "").toLowerCase())) return null;
    if (!state.flags.hasCamel) return "You don't have a camel.";
    if (state.currentRoomId === "valley") {
      if (state.skin !== "clean") return "You have no water left to share.";
      state.flags.sharedWater = true;
      this.setSkin(state, "empty");
      return "You tip what is left of your water into the dented enamel mug, and then into your cupped hands, again and again, until the skin is flat and she has drunk every drop. She exhales a long, grateful gust that smells of grass she has never seen.";
    }
    if (state.currentRoomId !== "oasis") return "There is no water here fit for a camel.";
    if (state.flags.camelDrank) return "She has drunk enough, and says so with a long, wet belch.";
    state.flags.camelDrank = true;
    return "You slide down and lead the camel to the pool. She drinks like a bellows, for a very long time, with the air of an animal making a point. When she has finished, you scramble back up."
      + this.award(state, 10, "watered the camel");
  },

  // One date out of the basket (eaten, or lost to the beetles). The basket goes when it is empty.
  useDate(state) {
    state.dateCount = Math.max(0, (state.dateCount || 0) - 1);
    if (state.dateCount === 0) state.inventory = state.inventory.filter(i => i !== "dates");
  },

  // DROP STONE / DATE is not a test: it just lands at your feet.
  dropTest(state, target) {
    const t = (target || "").toLowerCase().trim().replace(/^(a |an |the |my |one |some )/, "");
    if (/^(date ?stones?|stones?)$/.test(t) && state.stones > 0 && !state.inventory.includes("rosetta")) {
      return state.currentRoomId === "dunes"
        ? "The date stone lands at your own feet. Try harder."
        : "You decide to hang on to your date stones. They might have a use.";
    }
    if (/^dates?$/.test(t) && state.inventory.includes("dates") && state.currentRoomId === "dunes") {
      return "The date lands at your own feet. Try harder.";
    }
    return null;
  },

  handleThrow(state, rest) {
    const r = (rest || "").toLowerCase();
    const bare = /^\s*(north|south|east|west|n|s|e|w)\s*$/.test(r);
    const wantsDate = /\bdates?\b/.test(r) && !/stone|pit/.test(r);
    const wantsStone = /stone|pit/.test(r);
    if (!wantsDate && !wantsStone && !(bare && state.currentRoomId === "dunes")) return null;
    const item = wantsDate ? "date" : wantsStone ? "stone" : (state.stones > 0 ? "stone" : "date");
    if (item === "stone" && !(state.stones > 0)) return "You have no date stones. (Eating a date leaves you one.)";
    if (item === "date" && !(state.dateCount > 0 && state.inventory.includes("dates"))) return "You have no dates.";
    if (state.currentRoomId !== "dunes") {
      return item === "stone"
        ? "You think better of it. Those might be useful where the sand is treacherous."
        : "You think better of it. It is a perfectly good date.";
    }
    const m = r.match(/\b(north|south|east|west|n|s|e|w)\b/);
    if (!m) { state.pendingThrow = item; return "In what direction?"; }
    const d = { north: "n", south: "s", east: "e", west: "w" }[m[1]] || m[1];
    const stage = state.duneStage || 0;
    state.duneSafe = state.duneSafe || {};
    state.duneBad = state.duneBad || {};
    const safe = stage === 0 ? ["n", "e"] : ["w", "e"];
    const what = item === "stone" ? "stone" : "date";
    if (safe.includes(d)) {
      state.duneSafe[stage + d] = true;
      return item === "stone"
        ? "You lob the stone out over the sand. It lands, and lies there, untouched. Nothing stirs. You wade out, pick it up and come back: the ground holds."
        : "You lob the date out over the sand. It lands, sticky side down, and lies there, untouched. Nothing stirs. You wade out, brush it off and come back: the ground holds.";
    }
    if (state.duneBad[stage + d]) return "You have already seen what lives under that slope. You do not need to see it again.";
    state.duneBad[stage + d] = true;
    if (item === "stone") state.stones -= 1; else this.useDate(state);
    return "The " + what + " has barely landed before the sand comes alive: black beetles pour out of the slope, a glossy, clicking tide, and swarm over it. In seconds there is nothing but a dimple in the sand. Bad ground. ("
      + (item === "stone" ? "Date stones left: " + state.stones : "Dates left: " + (state.dateCount || 0)) + ".)";
  },

  // A lit lamp gives light whether it is carried or lying in the room.
  hasLight(state) {
    if (!state.flags.lampLit) return false;
    if (state.inventory.includes("lamp")) return true;
    const room = WORLD.rooms[state.currentRoomId];
    return !!(room && room.objects.includes("lamp"));
  },

  // Never let the player drop their only light and be left helpless in the dark.
  canDrop(state, objId) {
    const room = WORLD.rooms[state.currentRoomId];
    if (!room.dark || !state.flags.lampLit) return this.crucialWarning(state, objId);
    if (state.currentRoomId === "treasury" && this.isPearl(objId) && state.flags.pearlHeld === objId && !state.flags.swallowedPearl) {
      return "The Djinn raises a single jade nail. \"Do not offend the house by refusing its hospitality.\"";
    }
    const holdsLamp = objId === "lamp" || (WORLD.objects[objId].container && state.inventory.includes("lamp") && state.inKit.has("lamp"));
    if (holdsLamp) return "Not here. You would be left in the dark.";
    return this.crucialWarning(state, objId);
  },

  // Gentle brake on throwing away things the story still needs. The first attempt
  // warns; a second attempt goes through. The Ghost's Garden and the lift area are free.
  crucialWarning(state, objId) {
    const o = WORLD.objects[objId];
    if (!o || !o.crucial) return null;
    if (["garden", "liftante", "lift"].includes(state.currentRoomId)) return null;
    if (state.dropWarned.includes(objId)) return null;
    state.dropWarned.push(objId);
    if (objId === "rosetta") return "The voice at the edge of your mind goes quiet. The Stone teaches the guest all the way to the last door, and only there is it left behind. If you are quite sure, drop it again.";
    return "Something tells you that you will want that later. If you are quite sure, drop it again.";
  },

  handleLight(state, verb, rest) {
    const r = (rest || "").toLowerCase();
    if (verb === "light" && /fire|match|logs|wood|campfire|tinder/.test(r)) return this.lightFire(state);
    if (r && !/lamp|light/.test(r)) return "You can't do that to that.";
    if (!state.inventory.includes("lamp")) return "You have no lamp.";
    if (verb === "light") {
      if (state.flags.lampLit) return "The lamp is already lit.";
      state.flags.lampLit = true;
      return "You trim the wick and light the lamp. A small gold flame steadies, and the dark steps back.";
    }
    if (!state.flags.lampLit) return "The lamp isn't lit.";
    state.flags.lampLit = false;
    return "You pinch out the flame. The dark closes round you like a fist.";
  },

  // The Djinn appears whenever hieroglyphs are read without the Stone.
  // Empty-handed: a dry warning. Carrying marked treasure: a tax of one piece.
  djinn(state) {
    const marked = state.inventory.filter(id => WORLD.objects[id].marked);
    let out = "\nThe air behind you turns cold and smells of struck matches. When you turn, a tall, impossibly thin figure of blue-grey smoke is leaning against the wall, in a gold waistcoat and a turban the size of a pumpkin, his long, sorrowful face turned to the carvings, the nails on his hands two inches of polished jade. He does not look at you. ";
    if (marked.length) {
      const id = marked[0];
      state.inventory = state.inventory.filter(i => i !== id);
      state.inKit.delete(id);
      state.worn.delete(id);
      state.flags.taxed = true;
      out += "\"No free lunches,\" he says, in a voice like a cello, \"even if you are lucky.\" A jade nail flicks, and your " + WORLD.objects[id].name.toLowerCase() + " is simply not in your hands any more. \"Theft never pays,\" he adds, to the wall, and is not there either.";
    } else {
      out += "\"Theft never pays,\" he says, in a voice like a cello, and is simply not there any more.";
    }
    state.flags.djinnMet = true;
    return out;
  },

  choosePearl(state, id) {
    state.inventory = state.inventory.filter(i => i !== id);
    state.inKit.delete(id);
    const room = WORLD.rooms.treasury;
    if (id === "seedpearl") {
      state.flags.pearlChosen = true;
      state.flags.swallowedPearl = true;
      state.flags.pearlHeld = null;
      room.objects = room.objects.filter(o => !["seedpearl", "marblepearl", "cuepearl"].includes(o));
      return "You put the seed pearl on your tongue and swallow. It goes down with a small, cool, smooth slip and sits in you like a drop of milk. The Djinn, who has been watching with an expression of weary hope, lets out a long breath. \"The smallest,\" he says. \"They almost never. Keep it. It is, so to speak, yours now.\" A jade nail flicks at the tray, and the other two pearls are simply not there any more. Against the chest, Voss looks on in what might be envy."
        + this.award(state, 20, "chose the smallest pearl");
    }
    const big = id === "cuepearl";
    return this.die(state,
      big
        ? "You put the great white pearl to your lips, and open your mouth as wide as it will go, and then wider. \"The house is generous,\" says the Djinn, quietly, \"but it does not choose for its guests.\" It does not go down. Nothing goes down. The last thing you see is Voss, against the chest, nodding slowly, as one man to another."
        : "You put the pink pearl in your mouth. It is a good deal bigger than it looked. You swallow, and it does not so much go down as stop, and sit, and stay. \"A middling ambition,\" says the Djinn, \"and a middling throat.\" The vault begins, quite gently, to go dark.",
      "Ancient proverb: Big pearl, small throat.");
  },

  isPearl(id) { return id === "seedpearl" || id === "marblepearl" || id === "cuepearl"; },

  canGet(state, objId) {
    if (this.isPearl(objId) && state.flags.pearlHeld && state.flags.pearlHeld !== objId) {
      return "The Djinn does not look up from his nail. \"One,\" he says.";
    }
    return null;
  },

  onGet(state, objId) {
    if (this.isPearl(objId)) {
      state.flags.pearlHeld = objId;
      return "The Djinn glances up from his nail for the first time. \"In order to proceed, guest, you must now swallow your choice. Do not offend the house by refusing its hospitality.\"";
    }
    if (objId === "blueorb") { state.flags.gotOrb4 = true; return "The mummy's fingers close on nothing. Somewhere in the walls, a long, slow echo of a clap fades away."; }
    if (objId === "hook") { state.flags.gotHook = true; return this.award(state, 5, "worked the hook free"); }
    if (objId === "crimsonorb") { state.flags.gotOrb2 = true; return "The mummy's fingers close on nothing. Somewhere in the pit, something very long stops moving."; }
    if (objId === "greenorb") { state.flags.gotOrb3 = true; return "The stout mummy's hands fall open, empty. The painted servants on the wall seem, for a moment, to watch you go."; }
    if (objId === "pickaxe") return this.award(state, 5, "took the pickaxe");
    if (objId === "glass") { state.flags.lensPlaced = false; return null; }
    if (objId === "orb") {
      state.flags.gotOrb1 = true;
      return "The mummy's fingers close on nothing. Somewhere in the hall the draught stops for a moment, as though something were holding its breath.";
    }
    return null;
  },

  handleClimb(state, rest) {
    const r = (rest || "").toLowerCase();
    if (/statue|jackal|plinth/.test(r) && state.currentRoomId === "statues") {
      if ((state.statuePos || 0) !== 0) return "The open-mouthed statue is back at the entrance.";
      if (state.flags.gotStone) return "You have already taken what was in its mouth. The statue looks, if anything, relieved.";
      state.flags.gotStone = true;
      state.inventory.push("rosetta");
      return "You find the handholds with your fingertips and haul yourself up the plinth, the stone gritty under your knees, until your face is level with the jackal's. Its breath is cold and smells of old spice. Wedged crosswise between the fangs is a flat slab of dark stone on a leather cord. You work it free, and the jaws, you could swear, relax a little. As your fingers close on it, a voice that is not quite a voice, very far away, says something in a tongue you have never learned and understand perfectly: \"Welcome, guest.\" The sound dwindles, as though it were reaching for somewhere it could not quite find. It would be clearer, you think, if the cord were round your neck. You climb down."
        + this.award(state, 20, "took the Rosetta Stone");
    }
    if (/rope/.test(r) && state.currentRoomId === "wellshaft") return "The rope is the way down. Use D.";
    return null;
  },

  handleCut(state, rest) {
    const r = (rest || "").toLowerCase();
    if (state.currentRoomId === "scribe" && /rope|cord|line|blade/.test(r)) {
      if (state.flags.bladeCut) return "You have already cut it.";
      if (!state.inventory.includes("knife")) return "You have nothing to cut it with.";
      if (!state.flags.knifeRepaired) return "The blade of your knife is snapped. It will not cut a thing.";
      state.flags.bladeCut = true;
      return "You reach up, find the thin line in the dark, and saw through it. It parts with a twang. High in the roof the blade swings down on its pivot, whistles harmlessly past the wall, and clangs into a slot in the stonework. Whatever it was set to do, it will not now do it."
        + this.award(state, 10, "disarmed the blade");
    }
    if (state.currentRoomId === "echoes" && /rope|bind|bound|sarcoph/.test(r) && state.flags.echoOpen) {
      if (state.flags.cutRopes4) return "The ropes are already cut.";
      if (!state.inventory.includes("knife")) return "You have nothing to cut them with.";
      if (!state.flags.knifeRepaired) return "The blade of your knife is snapped. It will not cut a thing.";
      state.flags.cutRopes4 = true;
      return "You saw through the black ropes one by one, and they fall away in stiff coils. The recess breathes out, once, a draught of cold, dry air."
        + this.award(state, 5, "cut the black ropes");
    }
    if (state.currentRoomId === "snakepit" && /rope|bind|bound|sarcoph/.test(r)) {
      if (state.flags.cutRopes25) return "The ropes are already cut.";
      if (!state.inventory.includes("knife")) return "You have nothing to cut them with.";
      if (!state.flags.knifeRepaired) return "The blade of your knife is snapped. It will not cut a thing.";
      state.flags.cutRopes25 = true;
      return "You saw through the rotting ropes one by one, and they fall away in damp, fibrous coils. Somewhere in the walls, a thousand stone snakes seem to lean in a fraction closer."
        + this.award(state, 5, "cut the ropes");
    }
    if (state.currentRoomId === "wellshaft" && /rope|net/.test(r)) {
      if (/thick|big|main/.test(r)) return "That is your only way down. You are not that bold.";
      if (state.flags.netCut) return "You already cut it. The net is long gone.";
      if (!state.inventory.includes("knife")) return "You have nothing to cut it with.";
      if (!state.flags.knifeRepaired) return "The blade of your knife is snapped. It will not cut a thing.";
      state.flags.netCut = true;
      return "You reach the thin rope where it runs down to the ring, set the penknife against it, and saw. It parts with a twang, and overhead the net comes down in a rush and falls past you into the shaft. A long moment later, far below, something heavy lands with a muffled clank, and the echo goes on for some time."
        + this.award(state, 5, "cut the net loose");
    }
    return null;
  },

  setSkin(state, v) {
    state.skin = v;
    state.flags.waterskinFull = (v === "clean");
  },

  handleFill(state, rest) {
    if (!/skin|water|flask/.test((rest || "").toLowerCase())) return null;
    if (!state.inventory.includes("waterskin")) return "You have no waterskin.";
    const here = state.currentRoomId;
    if (here !== "flooded") {
      if (here === "oasis") {
        if (state.flags.gaveWallet && state.skin !== "clean") {
          this.setSkin(state, "clean");
          return "The Oasis Vendor takes your skin without a word, shakes out whatever is left in it, and refills it from his clay jug, shaking his glossy head at the waste.";
        }
        return state.flags.gaveWallet
          ? "The vendor's jug has done all the good it is going to do. The skin is full of clean water, and you would be mad to put anything from that pool into it."
          : "You tilt the waterskin toward the pool. The Oasis Vendor's hand closes on your wrist, quite gently. \"Not from there, my friend. That is for camels. Camels do not mind.\" He nods at the clay jug beside him, which is beaded with cold. \"For a man with something to trade, I have water of a different sort.\"";
      }
      if (here === "docks") return "The Nile here is silt, tar and fish. You would not put that in your mouth, and the waterskin would never forgive you.";
      const city = ["hotel", "tahrir", "museum", "teahouse", "bazaar", "antiquities", "camelmarket", "teastall", "rugdealer", "blacksmith", "citygate"];
      if (city.includes(here)) {
        return state.skin === "clean"
          ? "The waterskin is full already. Whitfield saw to that much, and there is nothing in Cairo you would want to add to it."
          : "There is nothing here to fill it from.";
      }
      return "There is nothing here to fill it from.";
    }
    if (state.skin === "clean") return "It is full of good water already. Pour that out first, or you will spoil it.";
    if (state.skin === "dirty") return "It is already full of the black water.";
    this.setSkin(state, "dirty");
    return "You hold the waterskin under the black water until it stops burbling. It comes up heavy, cold and foul.";
  },

  handlePour(state, rest) {
    const r = (rest || "").toLowerCase();
    if (!/skin|water/.test(r)) return null;
    if (!state.inventory.includes("waterskin")) return "You have no waterskin.";
    if (state.skin === "empty") return "The waterskin is empty.";
    const clean = state.skin === "clean";
    const intoHole = /hole|into|in /.test(r) && state.currentRoomId === "flooded";
    if (!intoHole) {
      this.setSkin(state, "empty");
      return state.currentRoomId === "flooded"
        ? "You pour it out on the floor, where it simply joins the rest of the flood."
        : "You pour the water onto the ground. The sand drinks it at once.";
    }
    this.setSkin(state, "empty");
    state.holeLevel = (state.holeLevel || 0) + 1;
    let out = clean ? "You wince as good water goes down a hole. " : "";
    const lvl = state.holeLevel;
    if (lvl === 1) {
      out += "The water vanishes down the hole with a long gargle. Far below, there is a small, wet slap, and a creak of old wood.";
      if (!state.flags.firstPour) { state.flags.firstPour = true; out += this.award(state, 5, "started to fill the hole"); }
    } else if (lvl === 2) {
      out += "The hole swallows it again, but more slowly this time. The water at the bottom has risen: you can hear it lapping something hollow.";
    } else if (!state.flags.keyFloated) {
      state.flags.keyFloated = true;
      WORLD.rooms.flooded.objects.push("woodenkey");
      out += "This time the water does not vanish. It rises, brimming, to the lip of the hole, and with it, turning slowly, a big wooden key comes bobbing up out of the dark.";
      out += this.award(state, 15, "floated the key");
    } else {
      out += "The hole is full already.";
    }
    return out;
  },

  handleUnlock(state, rest) {
    const r = (rest || "").toLowerCase();
    if (!/door|lock|chamber/.test(r)) return null;
    const room = state.currentRoomId;
    const atDoor = (room === "mirrors" && state.flags.blockCut) || (room === "serpent" && state.flags.serpentDone);
    if (!atDoor) return "There is no lock here that you can find.";
    if (state.flags.doorUnlocked) return "The door is already unlocked.";
    if (!state.inventory.includes("woodenkey")) return "You have nothing to unlock it with.";
    state.flags.doorUnlocked = true;
    return "A heavy wooden door, black with age, stands at the end of the passage, with a keyhole in the shape of a small jackal's head. You fit the key. It turns with a groan like a sigh, and the door swings inward on the smell of old resin."
      + this.award(state, 10, "unlocked the burial chamber");
  },

  handleListen(state, rest) {
    if (state.currentRoomId !== "whispering") return null;
    const r = (rest || "").toLowerCase();
    const frags = {
      jackal: "Out of the jackal's alcove, the whisper: \"...WHAT THE PYRAMID...\"",
      ibis: "From the ibis, a dry, papery voice: \"...MARKS...\"",
      falcon: "From the falcon, high and thin: \"...THE PYRAMID...\"",
      cat: "From the cat, soft and final: \"...KEEPS.\""
    };
    const key = Object.keys(frags).find(k => r.includes(k));
    if (!key) return "Which alcove? The jackal, the ibis, the falcon or the cat?";
    let out = frags[key];
    if (!state.heard.includes(key)) {
      state.heard.push(key);
      out += this.award(state, 5, "heard a whisper");
      if (state.heard.length === 4 && !state.flags.heardAll) {
        state.flags.heardAll = true;
        out += "\n\nThe four whispers settle in your head in a different order from the one they came in, like a sentence that has been waiting a very long time to be said. The sand ripples, as if expecting an answer.";
      }
    }
    return out;
  },

  handleSay(state, rest) {
    if (state.currentRoomId !== "whispering") return null;
    if (!/pyramid|marks|keeps/.test((rest || "").toLowerCase())) return null;
    return this.handleWrite(state, "in the sand " + rest);
  },

  // When a room has no visible exits, say why instead of printing nothing.
  noExitsText(state, roomId) {
    if (roomId === "valley") return "None. Without your umbrella, return would be suicide.";
    return null;
  },

  // Exits shown in the room listing: hide any that are not open yet.
  visibleExits(state, roomId, keys) {
    const f = state.flags;
    if (roomId === "tunnel") return keys.filter(k => !((k === "s" || k === "d") && !f.dug));
    if (roomId === "echoes") return ["n", "s", "e", "w"];
    if (roomId === "stairway") return keys.filter(k => k !== "u");
    if (roomId === "mirrors") return keys.filter(k => !(k === "e" && !f.blockCut));
    if (roomId === "starchart") return keys.filter(k => !(k === "n" && !f.starDoor));
    if (roomId === "serpent") return keys.filter(k => !(k === "w" && !f.serpentDone));
    if (roomId === "valley") return keys.filter(k => k === "d" && f.entranceFound);
    if (roomId === "lift") return state.onLift ? [] : keys;
    if (roomId === "citygate") return keys.concat(["w"]);
    return keys;
  },

  handleWrite(state, rest) {
    if (state.currentRoomId !== "whispering") return "There is nothing here to write on.";
    const r = (rest || "").toLowerCase();
    if (!/sand|floor|in /.test(r) && r.split(/\s+/).length < 3) return "Write what, and where? The sand would take it.";
    if (/pyramid/.test(r) && /marks/.test(r) && /keeps/.test(r)) {
      if (state.flags.nicheOpen) return "The sand has already given up its secret.";
      state.flags.nicheOpen = true;
      state.flags.wroteSand = true;
      WORLD.rooms.whispering.objects.push("niche", "scarab");
      return "You kneel and write the sentence in the sand with one finger. The words settle, and the whispering stops all at once, like a crowd that has been given what it asked for. Then, in the wall, with a long dry sigh, a narrow niche opens, and something deep blue glitters in it."
        + this.award(state, 15, "answered the whispers");
    }
    return "You write it in the sand. The sand swallows your words, whispers them back mangled and faintly insulted, and smooths itself flat.";
  },

  handleJump(state, rest) {
    if (state.currentRoomId !== "scribe") return null;
    if (state.flags.skullTaken) return "There is nothing left to jump for.";
    if (!state.flags.bladeCut && !state.pendingJump) {
      state.pendingJump = true;
      return "The floor beneath you is not quite level. Under your weight it dips, very slightly, like the pan of a balance, and something overhead creaks. Jump anyway? (Type JUMP again to confirm.)";
    }
    state.pendingJump = false;
    if (state.flags.bladeCut) {
      state.flags.skullTaken = true;
      state.inventory.push("skull");
      WORLD.objects.skull.portable = true;
      return "You crouch, spring, and snatch the cord. The floor drops with a click and the blade, harmlessly, sags in its cut line. You land with the crystal skull in your hands: cold, heavy, and full of tiny upside-down lamps.";
    }
    return this.die(state,
      "You crouch, spring, and your fingertips brush the crystal. The floor goes down with a click. Something whistles through the dark above you in a long, flat arc, and then, quite suddenly, you are no longer thinking about the skull, or about anything.",
      "Ancient proverb: Protect ya neck.");
  },

  // ---- Hall of Mirrors ----
  beamProgress(state) {
    const c = ["e", "s", "e"], m = state.mirrors || [];
    let n = 0;
    while (n < 3 && m[n] === c[n]) n++;
    return n;
  },

  checkBeam(state) {
    const f = state.flags;
    const p = this.beamProgress(state);
    let out = "";
    if (p === 3 && !f.mirrorsAligned) {
      f.mirrorsAligned = true;
      out += "\n" + this.award(state, 10, "aligned the mirrors").trim();
    }
    if (p === 3 && f.lensPlaced && !f.blockCut) {
      f.blockCut = true;
      out += "\nThe beam runs down the line of mirrors and through the lens, and gathers into a point of white fire on the block. There is a hiss, a smell of hot glass, and a thin thread of smoke. The grey stone runs like wax, and a neat, glassy-edged doorway opens, glowing orange and then dull red as it cools. Beyond it, a short passage leads east."
        + this.award(state, 10, "cut through the stone");
    }
    return out;
  },

  handleTurn(state, rest) {
    if (state.currentRoomId === "starchart") {
      const r = (rest || "").toLowerCase();
      const isStar = /star|outer/.test(r), isLand = /land|inner/.test(r);
      if (!isStar && !isLand) return "Turn which ring? The star ring (outer) or the land ring (inner)?";
      const starVals = ["jackal", "ibis", "falcon", "lion"], landVals = ["river", "desert", "mountain", "sea"];
      if (isStar) {
        const v = starVals.find(x => r.includes(x));
        if (!v) return "Turn it to which star? The jackal, the ibis, the falcon or the lion?";
        state.starRing = v;
        const txt = v === "jackal"
          ? "The outer ring grinds round and the jackal locks home. High in the dome, a knot of crystal stars brightens into the long-muzzled shape of a jackal."
          : "The outer ring grinds round to the " + v + ". " + (/^[aeiou]/.test(v) ? "An " : "A ") + v + "-shaped knot of stars kindles overhead, and nothing else happens.";
        return txt + this.checkStars(state);
      }
      const v = landVals.find(x => r.includes(x));
      if (!v) return "Turn it to which land? The river, the desert, the mountain or the sea?";
      state.landRing = v;
      const txt = v === "river"
        ? "The inner ring clicks to the river, and a long silver ribbon of light unrolls across the dome."
        : "The inner ring clicks to the " + v + ". A pale wash of light spreads across the dome in the shape of the " + v + ", and fades, unanswered.";
      return txt + this.checkStars(state);
    }
    if (state.currentRoomId !== "mirrors") return null;
    const r = (rest || "").toLowerCase();
    const idxMap = { first: 0, one: 0, "1": 0, second: 1, two: 1, "2": 1, third: 2, three: 2, "3": 2 };
    const im = r.match(/\b(first|second|third|one|two|three|1|2|3)\b/);
    if (!im) return "Which mirror? The first, second or third?";
    const dm = r.match(/\b(north|south|east|west|n|s|e|w)\b/);
    if (!dm) return "Turn it which way? North, east, south or west?";
    const d = { north: "n", south: "s", east: "e", west: "w" }[dm[1]] || dm[1];
    const i = idxMap[im[1]];
    if (state.mirrors[i] === d) return "It already faces that way.";
    state.mirrors[i] = d;
    const full = { n: "north", e: "east", s: "south", w: "west" };
    const beam = [
      "The beam strikes the first mirror and spills away across the ceiling at a useless angle.",
      "The first mirror throws the beam east across the hall, where it splashes harmlessly on the wall beside the second.",
      "The second mirror throws the beam south, and it lands on the floor beside the third.",
      "The beam runs true to the block: a bright coin of light, warm, and doing nothing much."
    ][this.beamProgress(state)];
    return "You swing the " + ["first", "second", "third"][i] + " mirror round with a groan until it faces " + full[d] + ". " + beam + this.checkBeam(state);
  },

  // ---- Serpent Bridge ----
  handlePlay(state, rest) {
    if (!state.inventory.includes("flute")) return "You have nothing to play.";
    const r = (rest || "").toLowerCase();
    if (state.currentRoomId !== "serpent") return "You play a note. It goes nowhere in particular, which is not a bad fate for a note on a reed.";
    if (state.flags.serpentDone) return "The cobra at the middle door sways, nods politely, and waits for you to go through.";
    const note = /\b(low|deep|bottom)\b/.test(r) ? "low" : /\b(middle|mid|centre|center)\b/.test(r) ? "middle" : /\b(high|top|shrill)\b/.test(r) ? "high" : null;
    if (!note) return "You raise the flute. Which note: low, middle or high?";
    if (note === "middle") {
      state.flags.serpentDone = true;
      return "You play the middle note, soft and courteous. The middle door breathes out a long, low sigh, and a cobra the colour of dark honey rises from the crack and begins to sway, its hood spreading and closing in time to your tune. It dips its head to you, politely, and glides to the middle door, which swings open on a short passage west. The cobra waits there, nodding, as if to say: after you."
        + this.award(state, 20, "charmed the cobra");
    }
    state.forceMove = "antechamber";
    const door = note === "low"
      ? "You play the low note. The low door grinds open a crack on a breath of cold, damp air, and nothing comes out at all."
      : "You play the high note, thin and shrill. The high door cracks open on a long, thin whistle of wind, and nothing comes out at all.";
    return door + " The mosaic floor does the opposite of holding. It tips under you like a tray, and you slide, and drop, and fall a long way through the dark. Somewhere above you a voice like a cello is laughing, richly, delightedly, and as you fall the laughter thins and frays at the edges and turns into a hiss, a dry, mocking approximation of a snake: sss, sss-sss-sss. You land on cold stone in the Antechamber of Warnings, with a smell of struck matches in your nose and the hiss still dying in your ears.";
  },

  prepareRoom(state, roomId) {
    if (roomId === "garden") {
      const carrying = state.inventory.some(id => WORLD.objects[id].marked);
      WORLD.rooms.garden.npcs = carrying ? [] : ["ghost"];
    }
  },

  handleUnwrap(state, rest) {
    if (state.currentRoomId !== "mummy" || !/mummy|bandage|linen|wrapping|priest/.test((rest || "").toLowerCase())) return null;
    if (!state.flags.mummyTold) return "The mummy fixes you with his one lapis eye. \"I think not. Pay me first, living one, in news.\"";
    if (state.flags.gotBandages) return "There is precious little of him left to unwrap, and he looks, if anything, cold.";
    state.flags.gotBandages = true;
    state.inventory.push("bandages");
    return "You unwind the linen from his arms and shoulders, strip after strip, dry and light as moth wings. He sits through it with enormous dignity, a thin brown figure in a loose, pleasing breeze. By the end you hold a coil of bandage as long as a boat's painter. \"Do mind the draught,\" says the mummy."
      + this.award(state, 10, "unwrapped the mummy");
  },

  handleTie(state, rest) {
    const r = (rest || "").toLowerCase();
    if (!/bandage|line|hook|linen/.test(r)) return null;
    if (state.flags.tied) return "You have already tied it.";
    if (!state.inventory.includes("hook") || !state.inventory.includes("bandages")) return state.inventory.includes("bandages") ? "You have a line of sorts, but nothing to fasten it to. Whatever glints in the beam over the chasm may have something to offer." : "You have nothing to tie, and nothing to tie it to.";
    state.inventory = state.inventory.filter(i => i !== "hook" && i !== "bandages");
    state.inKit.delete("hook"); state.inKit.delete("bandages");
    state.inventory.push("grapnel");
    state.flags.tied = true;
    return "You knot the bandage strips end to end, twisting them as you go into a rope as thick as your thumb, and make it fast to the ring of the hook with a bowline learned in a better life. It looks absurd. It also looks as though it would hold."
      + this.award(state, 5, "made a line");
  },

  handleSwing(state, rest) {
    if (state.currentRoomId !== "mummy") return "There is nothing here to swing on.";
    if (!state.inventory.includes("grapnel")) {
      return state.inventory.includes("hook")
        ? "You have a hook, but nothing to hold it by. Something long and strong, perhaps, tied to it."
        : "You have nothing to swing on. The beam is far above the chasm, and something would have to be tied to it.";
    }
    if (!state.pendingSwing) {
      state.pendingSwing = true;
      return "You look at the beam, and at the drop. The mummy, without turning his head: \"Once across, living one, you cannot come back. The line will not hold twice.\" Swing anyway? Type SWING (or YES) again to confirm. Anything else will cancel it.";
    }
    state.pendingSwing = false;
    state.inventory = state.inventory.filter(i => i !== "grapnel");
    state.flags.swung = true;
    state.forceMove = "garden";
    return "You loop the bandage line over the beam, hook it fast, back up three paces, and run at the edge. For a long, sick moment there is nothing under you at all, and the pale glow rushes up and past. Then the line takes your weight with a jerk that rattles your teeth, you swing out over the gulf in a long, slow arc, and let go at the top. You land on your hands and knees on soft, damp, mossy ground, under green light. Behind you, with a soft, tired sound, the hook slips its loop, and the line falls, curling, into the chasm."
      + this.award(state, 10, "swung across the chasm");
  },

  handleYes(state) {
    if (state.pendingSwing) return this.handleSwing(state, "");
    if (state.pendingJump) return this.handleJump(state, "");
    if (state.pendingSleep) return this.handleSleep(state);
    if (state.choicePending && state.currentRoomId === "platform") return this.endYes(state);
    return null;
  },

  handleDig(state, rest) {
    if (state.currentRoomId !== "tunnel") return null;
    if (state.flags.dug) return "The way is already clear.";
    if (!state.inventory.includes("pickaxe")) return "Bare hands would get nowhere. You would need something with an iron head.";
    state.flags.dug = true;
    return "You swing the pickaxe, and the packed stone answers with a shower of sparks and a deafening clang. You swing again, and again, wrenching blocks free and rolling them aside in clouds of lime dust, until a narrow, ragged way stands open to the south. A cooler draught breathes up from a dark crack in the floor, warm at the bottom, and humming faintly."
      + this.award(state, 10, "dug through the rubble");
  },

  // ---- Star Chart rings ----
  checkStars(state) {
    const f = state.flags;
    let out = "";
    if (state.starRing === "jackal" && !f.starSet) { f.starSet = true; out += this.award(state, 10, "found the jackal star"); }
    if (state.landRing === "river" && !f.landSet) { f.landSet = true; out += this.award(state, 10, "found the river"); }
    if (state.starRing === "jackal" && state.landRing === "river" && !f.starDoor) {
      f.starDoor = true;
      out += "\nThe jackal stands over the river. For a long moment the whole dome holds its breath, and then a single thread of silver light drops from the zenith onto the door in the north wall. With a long, grinding sigh, the door slides aside on a hall that glints."
        + this.award(state, 10, "opened the star door");
    }
    return out;
  },

  // ---- Chamber of Echoes ----
  handleGoTo(state, where) {
    if (state.currentRoomId !== "echoes") return null;
    const map = { north: "n", south: "s", east: "e", west: "w", centre: "c", center: "c", middle: "c" };
    state.echoPos = map[where];
    return where === "centre" || where === "center" || where === "middle"
      ? "You walk back to the centre of the room."
      : "You walk across the polished flags to the " + where + " wall and stand with your back to it.";
  },

  echoText(state, verb) {
    if (state.currentRoomId !== "echoes") return null;
    const f = state.flags;
    const pos = state.echoPos || "c";
    if (pos === "c") {
      return "You " + verb + ". The echo comes back from every side at once: crisp from the north and the west, and a little late and hollow from the east and the south.";
    }
    if (pos === "e") {
      let out = "You " + verb + " with your back to the east wall. The echo comes back almost at once, but hollow as a drum, and a faint draught stirs your hair. There is a space behind this wall.";
      if (!f.hollowFound) { f.hollowFound = true; out += this.award(state, 10, "found the hollow wall"); }
      return out;
    }
    if (pos === "s") return "You " + verb + " with your back to the south wall. The echo is crisp and flat: solid stone, a long way thick.";
    return "You " + verb + " beside the " + (pos === "n" ? "north" : "west") + " wall. The echo is crisp and flat. Solid stone.";
  },

  handleClap(state) { return this.echoText(state, "clap"); },
  handleShout(state) { return this.echoText(state, "shout"); },

  handlePush(state, rest) {
    if (state.currentRoomId !== "echoes") return null;
    const wm = (rest || "").toLowerCase().match(/\b(north|south|east|west)\b/);
    if (wm) state.echoPos = { north: "n", south: "s", east: "e", west: "w" }[wm[1]];
    if (state.echoPos !== "e") return "The wall does not so much as shiver.";
    if (state.flags.echoOpen) return "It is open already.";
    state.flags.echoOpen = true;
    WORLD.rooms.echoes.objects.push("sarcophagus4", "ropes4");
    return "You lean on the east wall, and a section of it pivots inward with a groan of old stone, on a narrow passage running east. In a recess beside it stands a narrow sarcophagus bound in black rope."
      + this.award(state, 10, "opened the hidden passage");
  },

  treasureValue(id) {
    const v = { goldcup: 3, collar: 3, bracelet: 3, scarab: 4, skull: 5, mask: 5, falcon: 3, ingot: 4, ring: 4, crook: 5, flail: 5, pectoral: 6, rosetta: 5, orb: 4, crimsonorb: 4, greenorb: 4, blueorb: 4 };
    return v[id] || 0;
  },

  // Treasure scores only when it is surrendered: dropped in the Antechamber of the Lift or at the lift.
  onDrop(state, objId) {
    const room = state.currentRoomId;
    const o = WORLD.objects[objId];
    if (!o || !o.marked) return null;
    if (room !== "liftante" && room !== "lift") return null;
    let out = "";
    if (!state.surrendered.includes(objId)) {
      state.surrendered.push(objId);
      const val = this.treasureValue(objId);
      if (val) out += this.award(state, val, "surrendered the " + o.name.toLowerCase());
    }
    if (state.onLift) {
      state.liftClock = -1;
      out += "\nThe platform creaks upward a little, and the rope hums a half-tone lower.";
    }
    return out || null;
  },

  markedCarried(state) {
    return state.inventory.filter(id => WORLD.objects[id].marked).length;
  },

  handleBoard(state, rest) {
    if (/camel/.test((rest || "").toLowerCase())) return this.handleMount(state);
    if (/tent|canvas/.test((rest || "").toLowerCase())) return this.enterTent(state);
    if (state.currentRoomId !== "lift") return null;
    if (!/lift|platform|plank|on|in/.test((rest || "").toLowerCase())) return null;
    if (state.onLift) return "You are already on the platform.";
    state.onLift = true;
    state.liftClock = -1;
    const n = this.markedCarried(state);
    return "You step onto the platform, and the old planks take your weight with a groan. The balance shivers, and the rope tied to the empty pan draws taut. "
      + (n > 0
        ? "The pointer swings far past the notch, and the ropes overhead begin to groan like something alive. Whatever you are carrying is a great deal more than the jar."
        : "The pointer swings, wavers, and comes to rest exactly on the notch. The ropes overhead begin to hum, very softly, on a single note.")
      + " Nothing happens yet. GET OFF will take you back.";
  },

  handleDisembark(state, rest) {
    if (!state.onLift) return state.riding ? this.handleDismount(state) : "You are not on anything.";
    state.onLift = false;
    state.liftClock = 0;
    return "You step back onto the stone of the passage. The platform sighs, and settles, and the ropes go quiet.";
  },

  handleEnter(state, rest) {
    if (/tent|canvas/.test((rest || "").toLowerCase())) return this.enterTent(state);
    if (state.currentRoomId === "ledge" && (!(rest || "").trim() || /sarc|coffin|casket|tomb|box/.test((rest || "").toLowerCase()))) {
      state.flags.enteredSarc = true;
      state.forceMove = "platform";
      return "The lid is already open. You climb in, and lie down, and the lid slides shut.\n\nDarkness. You expected a coffin, and this is not a coffin. There is a vibration, but no sensation of movement. Weight no longer seems to mean anything. Then the lid opens."
        + this.award(state, 5, "entered the sarcophagus");
    }
    return null;
  },

  // The Ledge: only a few things work here, but every sensible way of saying them must.
  preCommand(state, raw) {
    if (state.currentRoomId !== "ledge") return null;
    const r = raw.trim().toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
    if (/^(i|inventory|score|help|save|load|restart)\b/.test(r)) return null;
    const sarc = /\b(sarc\w*|coffin|casket|tomb|box|lid|inscription|writing)\b/;

    // getting in: with or without naming the sarcophagus ("enter", "enter sarc", "get in", "lie down")
    const enterish = /^(enter|get in|get into|get inside|climb in|climb into|climb inside|step in|step into|go in|go into|lie in|lie down|lie|board|use)\b\s*/;
    if (enterish.test(r)) {
      const rest = r.replace(enterish, "").replace(/^(in|inside|into|down)\b\s*/, "").replace(/^(the|a)\s+/, "").trim();
      if (!rest || sarc.test(rest) || /^(in|it)$/.test(rest)) return { rewrite: "enter sarcophagus" };
      return "You find you have no wish to do anything but enter the sarcophagus.";
    }
    if (/^(open|lift|push|slide|move|touch|close|shut)\b/.test(r) && !/\b(voss|roman|soldier|mummy|cobra|snake|crowd)\b/.test(r)) {
      return "The lid has already slid open, and the sarcophagus is empty. It is waiting for you.";
    }
    if (/^(l|look)$/.test(r)) return "The others wait. Nobody speaks.";
    if (/^(x|examine|look at|l at|inspect|read|check|study|look)\b/.test(r)) {
      if (/\b(voss|sack)\b/.test(r)) return "He is holding an empty sack. He does not appear to know it.";
      if (/mcdaniels|headless|no head|victorian|\bhat\b/.test(r)) return "He holds his hat politely in the place where his head would be.";
      if (/roman|soldier|centurion/.test(r)) return "He nods once, one soldier to another.";
      if (/mummy/.test(r)) return "The mummy inclines its head a fraction of an inch. It has the air of someone who has been looking forward to this.";
      if (/cobra|snake/.test(r)) return "The cobra lowers its hood, a courtesy between professionals.";
      if (/crowd|dead|faces|others|watchers/.test(r)) return "Not a punishment. A queue that never learned it was a queue.";
      if (sarc.test(r)) return WORLD.objects.blacksarc.desc;
      return "Nothing here demands your attention but the sarcophagus.";
    }
    if (/^(talk|speak|ask|say|shout|call|greet)\b/.test(r)) return "Nobody speaks. They are waiting for you to go first.";
    if (/^(get|take|grab|pick)\b/.test(r)) return "There is no treasure.";
    if (/^(n|s|e|w|u|d|north|south|east|west|up|down|go|walk|run|leave)\b/.test(r)) return "You find you do not want to leave.";
    return "You find you have no wish to do anything but enter the sarcophagus.";
  },

  // ---- the Pharaoh ----
  pharaohTopic(state, topic) {
    const f = state.flags;
    const t = topic.toLowerCase();
    const say = (key, text) => {
      let out = text;
      if (!state.pTopics.includes(key)) {
        state.pTopics.push(key);
        out += this.award(state, 1, "listened");
      }
      if (state.pTopics.length === 3 && !state.choicePending) {
        state.choicePending = true;
        out += "\n\nHe tilts his head. \"Shall we come to it?\"";
      }
      return out;
    };
    if (/return|home|leave|leaving|go back|choice|stay/.test(t)) {
      state.choicePending = true;
      return "\"Home is the question I came to ask you.\" He turns a little, so that the stars are behind him. \"Will you return?\"";
    }
    if (/how far|distance/.test(t)) return say("far", "\"Not in distance.\"");
    if (/where|from|come from|origin/.test(t)) return say("where", "\"Far away.\"");
    if (/alive|dead|death|die/.test(t)) return say("alive", "\"Not by your definition. Nor dead, by it. I stopped finding the words helpful some while ago.\"");
    if (/yourself|who are|you\b|himself|king|pharaoh|alien|travel|world/.test(t) && !/voss|hart|djinn|roman|pillar|pearl/.test(t)) return say("self", "\"A man who once had a great deal of stone moved about, for reasons rather more practical than anyone has since given me credit for. Your people have many words for those who travel between worlds. I answer to none of them, and I do not mind which you choose.\"");
    if (/pyramid|tomb|house|door|lock|curse/.test(t)) return say("pyramid", "\"I never wanted worship. Nor monuments, nor gold. Gold is heavy and I have never found it good company. The pyramid was a door with a very particular lock. Most who came wanted gold. Some wanted power. A few wanted to know. Only a person willing to leave with empty hands could ever reach this room.\"");
    if (/treasure|mark|gold|stamp|thief|theft/.test(t)) return say("treasure", "\"You will have noticed the mark on every cup and every jewel. It is not a curse. It is a receipt. It says: this belongs to the house. A guest may take what he is given. A thief takes what he owes, and is surprised to be sent the bill.\"");
    if (/others|crowd|ghosts|dead ones|watch/.test(t)) return say("others", "\"They are not a punishment. They were not killed for wanting. They were stopped by it. It is a distinction they find very tiresome. They watch because I asked them to, and they do it beautifully.\"");
    if (/voss/.test(t)) return say("voss", "\"Voss was another thief. A clever thief, but in the end, a thief.\"");
    if (/mcdaniels|headless|victorian/.test(t)) return say("mcd", "\"The Victorian. He does ask, sometimes, whether anyone has found it. I tell him it is not my department.\"");
    if (/roman|soldier|rufus/.test(t)) return say("roman", f.remembered ? "\"Ah, you met him. He remembered his name. It has made him quite unbearable.\"" : "\"There is a soldier in the garden who has forgotten his own name. He would have liked a visitor.\"");
    if (/djinn|genie/.test(t)) return say("djinn", "\"My oldest friend and my worst employee. He enjoys the work. He tells me you were polite.\"" + (f.taxed ? " \"He says the tax was for your own good. It was also for his amusement.\"" : ""));
    if (/pillar|orb|ring/.test(t)) return say("pillars", f.pillarsAll ? "\"An old courtesy. A way of leaving the lamps on. Do not ask what they are for. You would only choose a name for it, and names are how a mystery gets spoiled.\"" : "\"There is a place beneath the house you did not visit. It is of no consequence. A house has cellars.\"");
    if (/pearl/.test(t)) return say("pearl", f.swallowedPearl ? "\"The smallest one. Yes. It is yours. You were given it, and you swallowed it, and neither of those is theft.\"" : "\"You did not go down to the vault? The pearls are there still, I expect, and the Djinn will be rather hurt. He so enjoys the choosing.\"");
    if (/lift|rope|basket|balance|jar|sand/.test(t)) return say("lift", "\"Perfectly safe. It has been tried by experts.\"");
    if (/hart|teacher|adeline/.test(t)) return say("hart", "\"You carry her in your face when you are puzzled. I read faces. It is most of what remains of my trade. Someone taught you to ask what a thing is for before asking what it is worth. That is rarer than the pyramid.\"");
    if (/wait|long|time/.test(t)) return say("wait", "\"Long enough to have read everything. Not long enough to stop hoping someone would arrive and not want any of it.\"");
    return "\"That is a longer conversation than we have. Ask me something I can answer without ruining it.\"";
  },

  endScore(state) {
    return `\n\nFINAL SCORE: ${state.score}/${WORLD.maxScore}\n\n— THE END —`;
  },

  endYes(state) {
    const f = state.flags;
    state.choicePending = false;
    f.gameOver = true; f.ended = true;
    let t = "\"Then go. Tell the truth to nobody. They will not believe you, and those who do will come with sacks.\"";
    if (f.swallowedPearl) t += "\n\n\"BTW, you can keep the Djinn pearl as a souvenir. Pharaohs don't do poo.\"";
    t += "\n\nCold sand. The smell of camel. The Valley of Forgotten Stones at first light, under a perfectly ordinary sky. The camel regards you with the contempt of an animal that has been kept waiting. Something rolls against your boot: an umbrella, bent but unbroken. You do not remember it being blown anywhere. You open it anyway.";
    t += "\n\nPembroke wrote the book. It was the best-reviewed work of Egyptology in a generation, and it said nothing at all about what happened. It was dedicated \"to Adeline Hart, who said the treasure was never the point.\" Whitfield was released, the matter of the crate having been traced to a man he insisted he had never met. He kept the telegram, framed, and went on cataloguing, and a number of things continued to go missing from Cairo. The Trustees reinstated Pembroke's funding and never asked where anything had come from. Dr. Voss was recorded as lost in the desert. Nobody was told what really happened.";
    t += this.award(state, 10, "went home");
    return t + this.endScore(state);
  },

  endNo(state) {
    const f = state.flags;
    state.choicePending = false;
    f.gameOver = true; f.ended = true;
    let t = "\"Then walk with me. There is a good deal to show you, and I think you have the patience.\"\n\nYou step off the edge of the platform onto nothing that is not also somewhere. The stars make way.";
    t += "\n\nDr. Pembroke was never seen again. His camel was found grazing in the Valley of Forgotten Stones, in perfect health. His umbrella was never recovered. His trunk, stencilled PEMBROKE, was returned to the Museum with a few crumpled shirts and no explanation.";
    t += this.award(state, 10, "stayed");
    return t + this.endScore(state);
  },

  handleNo(state) {
    if (state.choicePending && state.currentRoomId === "platform") return this.endNo(state);
    return null;
  },

  handleClean(state, rest) {
    const r = (rest || "").toLowerCase();
    if (!/stone|rosetta|glyph|slab/.test(r)) return null;
    if (!state.inventory.includes("rosetta")) return "You don't have the stone.";
    if (!state.inventory.includes("toothbrush")) return "You have nothing fine enough to get into the glyphs.";
    if (state.flags.stoneCleaned) return "It is as clean as a stone is going to get.";
    state.flags.stoneCleaned = true;
    return "You work the bristles into the glyphs one by one, with the tender concentration of a man restoring a Rembrandt with a toothbrush. Centuries of grime lift in a fine grey dust. Along the bottom, where the writing was too small to see, a fourth line shows bright and sharp, and, now that you have the knack of it, it reads: I TEACH THE GUEST ALL THE WAY TO THE LAST DOOR. THERE, I AM LEFT BEHIND. You look at the Stone for a long moment. It is, after all, stamped with the pyramid mark like everything else the house keeps, but it is a teacher first, and a teacher is not left behind until the lesson is done. Keep it on until the last door."
      + this.award(state, 5, "cleaned the Stone");
  },

  // The mummy inside an opened sarcophagus is a real thing in the room (inert: it never moves).
  addOccupant(state) {
    const room = WORLD.rooms[state.currentRoomId];
    if (!room.objects.includes("occupant")) room.objects.push("occupant");
  },

  // TALK TO / ASK something that is here but cannot answer.
  talkToObject(state, target) {
    const t = (target || "").toLowerCase();
    if (/mummy|body|corpse|remains|occupant/.test(t) && WORLD.rooms[state.currentRoomId].objects.includes("occupant")) {
      return "The mummy does not stir. It is not that kind of mummy, and you have the distinct impression it would like to be left alone.";
    }
    return null;
  },

  // ---- the night in the Valley of Forgotten Stones: a fire, a meal, a tent, and sleep ----
  resetNight(state) {
    const f = state.flags;
    f.nightFire = false; f.nightFed = false; f.nightTent = false;
    f.teaBrewed = false; f.teaDrunk = false; f.sharedWater = false;
    state.pendingSleep = false;
  },

  lightFire(state) {
    const f = state.flags;
    if (state.currentRoomId !== "valley") return "There is nothing here worth lighting a fire for.";
    if (f.entranceFound) return "It is morning, and the fire is a ring of cold ash. You have no more need of it.";
    if (f.nightFire) return "The fire is burning well.";
    const matches = state.inventory.includes("matches");
    const lamp = state.flags.lampLit && state.inventory.includes("lamp");
    if (!matches && !lamp) return "You have nothing to light it with. Voss left a stack of sacks, and men like Voss never travelled light.";
    f.nightFire = true;
    if (!WORLD.rooms.valley.objects.includes("flatstone")) WORLD.rooms.valley.objects.push("flatstone");
    return "You scrape the ash aside, tear a strip off one of the sacks for tinder, and build the half-burnt logs up around it. "
      + (matches ? "The first match dies in the still air. The second takes." : "You touch the lamp's flame to the sacking.")
      + " The flame hesitates, catches, and climbs, and a wavering circle of orange light pushes back the dark. Your camel lifts her head and shuffles a little closer to it.";
  },

  brewTea(state) {
    const f = state.flags;
    if (state.currentRoomId !== "valley") return "There is nowhere here to boil water.";
    if (f.entranceFound) return "It is morning. The tea can wait for another life.";
    if (!f.nightFire) return "You would need a fire to boil water.";
    if (!state.inventory.includes("germantea")) return "You have no tea to brew.";
    if (state.skin !== "clean") return "You have no clean water to brew it with.";
    if (f.teaBrewed) return "The tea is brewed already, and steaming in the mug.";
    f.teaBrewed = true;
    return "You fill the enamel mug from your waterskin, set it on the stones at the edge of the fire, and drop in a German teabag. The water steams, darkens, and presently smells like a smoked ham in a library.";
  },

  enterTent(state) {
    const f = state.flags;
    if (state.currentRoomId !== "valley") return null;
    if (f.entranceFound) return "You have slept there already, and the morning is no place for tents.";
    if (f.nightTent) return "You are in the tent already.";
    f.nightTent = true;
    return "You haul the sagging canvas upright on its one good pole and crawl in under it. It smells of mould, stale tobacco and Voss, but it breaks the wind. "
      + (f.nightFire ? "The fire throws a warm orange wedge through the flap." : "It is cold in here, and getting colder.");
  },

  handleSleep(state) {
    const f = state.flags;
    if (state.currentRoomId !== "valley") return "You are not tired enough to sleep here, and the desert is no place to close your eyes.";
    if (f.entranceFound) return "It is morning. You have slept enough for one lifetime.";
    if (!f.nightTent) return "You cannot sleep out in the open: the cold would find you before sleep did. There is a tent, of sorts.";
    const ready = f.nightFire && f.nightFed;
    if (!ready && !state.pendingSleep) {
      state.pendingSleep = true;
      const lack = !f.nightFire && !f.nightFed ? "a fire and a meal" : (!f.nightFire ? "a fire" : "a meal");
      return "The cold is already in your bones. Without " + lack + ", you do not think you would wake. Sleep anyway? (SLEEP again to confirm.)";
    }
    state.pendingSleep = false;
    if (!ready) return this.freeze(state);
    f.slept = true;
    f.entranceFound = true;
    state.thirst = 0; state.thirstShown = 0;
    state.forceMove = "valley";
    return "You pull the canvas around you and close your eyes, and the valley dreams you.\n\n"
      + "Ghosts come to the edge of the firelight and stand there, patient, with their hands open. A column of Roman soldiers marches past without a sound, eyes front, and one of them, at the very end, looks at you and almost smiles. Gold pours across the sand like water, and drains away. Overhead the stars slide sideways, one by one, and rearrange themselves into a shape you almost recognise; and from the middle of the valley floor, thick as an oak and quite silent, a beam of light rises straight up into them.\n\n"
      + "Something wet and whiskery nudges your ear. It is morning, thin and gold and cold, and the fire is a ring of ash. Your camel is standing over you, and she has had quite enough of waiting. She stalks across the valley to the foot of the jackal-ear ridge and begins to paw at one patch of sand, steadily, with the air of an animal who knows exactly what is under it. Under the sand there is stone: dressed, flat, and cut with a step. The top of a stair, going down."
      + this.award(state, 10, "found the entrance");
  },

  freeze(state) {
    this.resetNight(state);
    state.duneStage = 0; state.ridgePos = 0; state.thirst = 0; state.thirstShown = 0;
    state.forceMove = "dunes";
    return "You close your eyes, just for a moment. The cold comes in from the edges, gently at first, and then it is simply everywhere, and then it is nowhere, and you do not feel the dawn.\n\n"
      + "You come to with a gasp in the Shifting Dunes, flat on your back in warm, dry air, with your breath still smoking and every bone remembering a night that, apparently, did not happen. The camel is beside you, looking worried. Everything you carried is still with you. The dunes, smooth and patient, are waiting to be crossed again.";
  },

  cookMeat(state) {
    const f = state.flags;
    if (state.currentRoomId !== "valley") return "There is nothing here to cook on.";
    if (!state.inventory.includes("tinmeat")) return "You have no meat to cook.";
    if (!f.nightFire) return "You would need a fire.";
    if (!f.tinOpened) return "The tin is sealed. You would have to open it first.";
    if (f.meatCooked) return "The meat is cooked already, and waiting on its stone.";
    f.meatCooked = true;
    return "You tip the meat out onto a flat stone at the fire's edge, and use it as a plate. The fat spits, the meat hisses and darkens, and a smell rises that is, against all odds, wonderful: salt, smoke and something almost like roast beef. After a few minutes it is browned and crackling.";
  },

  // A night that ends badly: you come to back in the dunes, with everything you carried.
  nightDeath(state, text) {
    this.resetNight(state);
    state.duneStage = 0; state.ridgePos = 0; state.thirst = 0; state.thirstShown = 0;
    state.forceMove = "dunes";
    return text + "\n\nYou come to with a gasp in the Shifting Dunes, flat on your back in warm, dry air, with your breath still smoking and every bone remembering a night that, apparently, did not happen. The camel is beside you, looking worried. Everything you carried is still with you. The dunes, smooth and patient, are waiting to be crossed again.";
  },

  poison(state) {
    return this.nightDeath(state, "You eat it, because you are hungry, and because it is 1936 and surely a tin is a tin. For about an hour you feel marvellous. Then the cramps arrive, and the long, sweating, shivering night that follows teaches you exactly how the German army of 1925 feels about you. You do not see the dawn.");
  },

  // MAKE / BUILD / START / KINDLE / BREW / BOIL / COOK
  handleMake(state, rest) {
    const r = (rest || "").toLowerCase();
    if (/meat|tin|beef|supper|dinner|food|rindfleisch/.test(r)) return this.cookMeat(state);   // before "fire": "cook meat on fire"
    if (/tea|brew/.test(r)) return this.brewTea(state);
    if (/fire|blaze|camp ?fire/.test(r) || !r) return this.lightFire(state);
    return "You can't make that.";
  },


  // Where dropping everything marked is exactly what the game is asking for.
  surrenderZone(state) { return ["garden", "liftante", "lift"].includes(state.currentRoomId); },

  // GET something the room mentions but that is not yet a thing you can pick up.
  getUnseen(state, target) {
    const t = (target || "").toLowerCase();
    if (state.currentRoomId === "statues" && !(state.statuePos > 0) && !state.inventory.includes("rosetta") && /stone|pale|thing|something|slab|fang|jaw/.test(t)) {
      return "It is wedged between the fangs of a statue twice your height, far out of reach from the floor. The plinth is rough, with deep handholds.";
    }
    return null;
  },

  handleOpen(state, objId, tool) {
    if (objId === "tinmeat") {
      if (state.flags.tinOpened) return "The tin is open already.";
      if (!state.inventory.includes("knife")) return "You have nothing to open it with.";
      if (tool && !/knife|penknife|blade|opener/.test(tool)) return "That won't open a tin.";
      state.flags.tinOpened = true;
      return "The main blade of your penknife is snapped, but the little hooked tin-opener on its back is intact. You saw it round the lid with a squeal of old metal, and peel the lid back. The meat is dark, in a pale lake of fat, and smells of cellars, salt and iron.";
    }
    if (objId === "briefcase") {
      if (state.flags.caseOpened) return "The case is open already.";
      state.flags.caseOpened = true;
      if (!state.inventory.includes("telegram")) state.inventory.push("telegram");
      if (!state.inventory.includes("knife")) state.inventory.push("knife");
      ["cairomap", "compass", "comb", "toothbrush", "aftershave"].forEach(id => { if (!state.inventory.includes(id)) state.inventory.push(id); });
      return "The clasps spring open with the little sigh of a thing that has been opened too often. Under the blank requisition forms lie the things you packed in a hurry: your telegram, soft as cloth from being read on every day of the voyage; the penknife you have carried since Manchester, its main blade snapped at the hinge; a folded map of Cairo; a pocket compass; a comb; a toothbrush; and a bottle of aftershave from the ship's barber. You take them all.";
    }
    if (objId === "umbrella") {
      if (state.currentRoomId === "ridge") {
        this.loseUmbrella(state);
        state.ridgePos = 0;
        let out = "You thumb the catch and the umbrella bursts open like a black flower. Atop the camel, the winds pull at your umbrella like a rough sail, and almost instinctively the camel requires no additional guidance, and proceeds with an eerie certainty. Head down, she lengthens her stride over ground you will never be able to retrace, the storm shrieking past on every side. Then the wind lets go of the umbrella and keeps it, and it wheels away over the ridge like a small black bird and is gone. The camel slows, snorts, and carries you down into a bowl of still, hot air." + this.ridgeAfter(state);
        if (!state.flags.sandstormSolved) {
          state.flags.sandstormSolved = true;
          out += this.award(state, 25, "followed the wind");
        }
        state.forceMove = "valley";
        return out;
      }
      if (this.desertRooms.includes(state.currentRoomId)) {
        if (state.umbrellaUp) return "The umbrella is open already, and doing its best.";
        state.umbrellaUp = true;
        return "You thumb the catch and hold the umbrella over your head, and the sun is abruptly somewhere else. A small, warm circle of black shade, smelling of camphor, travels with you. There is not a cloud in the sky, and it is the most useful thing you have done all day. The heat steps back half a pace, and the camel looks, if anything, jealous.";
      }
      return "You open the umbrella: a black dome that smells of camphor. It is rather nice, but nobody is looking. You close it again.";
    }
    if (objId === "sarcophagus2") {
      if (state.flags.openedSarc25) return "It is open already.";
      if (!state.flags.cutRopes25) return "The ropes are knotted too tightly to shift by hand. You would need something sharp.";
      state.flags.openedSarc25 = true;
      this.addOccupant(state);
      WORLD.rooms.snakepit.objects.push("crimsonorb");
      return "With the ropes gone, the lid slides aside easily. Inside lies a mummy in black-brown linen, and between its crossed fingers, a sphere glows a deep, hot crimson. A long, slow rustling goes round the walls of the pit."
        + this.award(state, 10, "opened the roped sarcophagus");
    }
    if (objId === "sarcophagus4") {
      if (state.flags.openedSarc4) return "It is open already.";
      if (!state.flags.cutRopes4) return "The black ropes are knotted too tightly to shift by hand. You would need something sharp.";
      state.flags.openedSarc4 = true;
      this.addOccupant(state);
      WORLD.rooms.echoes.objects.push("blueorb");
      return "With the ropes gone, the lid slides aside. Inside lies a mummy in blue-grey linen, and between its crossed fingers a sphere glows a deep, cold blue."
        + this.award(state, 10, "opened the hidden sarcophagus");
    }
    if (objId === "goldsarc") {
      return "The lid is sealed with a heavy golden seal stamped with a single small pyramid. Whatever it holds, the house has no intention of sharing it with you.";
    }
    if (objId === "sarcophagus3") {
      if (state.flags.openedSarc28) return "It is open already.";
      state.flags.openedSarc28 = true;
      this.addOccupant(state);
      WORLD.rooms.burial.objects.push("greenorb");
      return "The lid is stiff with old resin but gives with a crack. Inside lies a stout mummy in finer linen than the hall's, and between its hands, a sphere glows a deep, cool green."
        + this.award(state, 5, "opened the noble's sarcophagus");
    }
    if (objId === "sarcophagus" && state.currentRoomId === "hall") {
      if (state.flags.openedSarc) return "It is open already.";
      state.flags.openedSarc = true;
      this.addOccupant(state);
      WORLD.rooms.hall.objects.push("orb");
      return "You set your shoulder to the lid and push. It grinds aside with a shriek of stone on stone, and a breath of dry, spiced air rolls out. Inside lies a mummy in brown linen as fragile as a wasps' nest, its hands crossed on its chest. Between its fingers, a sphere of pale gold light glows steadily. The mummy does not stir. It does not look pleased, though, in the way something without a face can look displeased."
        + this.award(state, 10, "opened the sarcophagus");
    }
    return null;
  },

  handleClose(state, rest) {
    if (/umbrella|brolly/.test((rest || "").toLowerCase()) && state.inventory.includes("umbrella")) {
      if (!state.umbrellaUp) return "The umbrella is closed already.";
      state.umbrellaUp = false;
      return "You furl the umbrella, and the sun comes back all at once, like a slap.";
    }
    return null;
  },

  loseUmbrella(state) {
    state.umbrellaUp = false;
    state.inventory = state.inventory.filter(i => i !== "umbrella");
    state.inKit.delete("umbrella");
    state.worn.delete("umbrella");
    state.flags.umbrellaLost = true;
  },

  die(state, text, epitaph) {
    state.flags.gameOver = true;
    return text + "\n\n*** YOU HAVE DIED ***\n\n" + epitaph + "\n\nType RESTART to begin again, or LOAD to return to your last save.";
  },

  inventoryExtras(state) {
    const lines = [];
    if (state.flags.hasCamel) lines.push(state.riding ? "You are riding: Camel (" + (state.flags.camelDrank ? "watered" : "thirsty") + ")" : "Camel: waiting outside");
    if (state.inventory.includes("dates") && state.dateCount > 0) lines.push("Dates in the basket: " + state.dateCount);
    if (state.stones > 0) lines.push("Date stones: " + state.stones);
    return lines;
  },

  // ---- the camel: ridden wherever a camel can go, left outside where she cannot ----
  rideable: ["tahrir", "camelmarket", "citygate", "docks", "desertroad", "oasis", "dunes", "camp", "ridge", "valley"],

  camelTransition(state, roomId) {
    if (!state.flags.hasCamel) return "";
    const ok = this.rideable.includes(roomId);
    if (ok && !state.riding) {
      state.riding = true;
      return "\nYou untether the camel and climb back up. She rises under you in three alarming stages.";
    }
    if (!ok && state.riding) {
      state.riding = false;
      return ["stairway", "antechamber"].includes(roomId)
        ? "\nYou slide down from the camel and leave her at the head of the stair. She sits down in the sand with the air of a camel who has seen this before."
        : "\nYou slide down from the camel and tether her outside. She gives you a look.";
    }
    return "";
  },

  handleMount(state) {
    if (!state.flags.hasCamel) return "You don't have a camel.";
    if (state.riding) return "You are already on her back.";
    if (!this.rideable.includes(state.currentRoomId)) return "She is tethered outside. You would have to go back out to her.";
    state.riding = true;
    return "You scramble onto the camel's back, and she rises under you in three alarming stages, until you are sitting far higher than anyone has a right to.";
  },

  handleDismount(state) {
    if (!state.riding) return "You are not riding anything.";
    state.riding = false;
    return "You slide down from the camel. She regards the ground with suspicion. You will climb back on when you move on.";
  },

  examineSpecial(state, word) {
    const w = (word || "").toLowerCase();
    if (/^(the )?(mummy|body|corpse|remains)$/.test(w.trim())) {
      const shut = { hall: !state.flags.openedSarc, snakepit: !state.flags.openedSarc25, burial: !state.flags.openedSarc28, echoes: !state.flags.openedSarc4 };
      if (shut[state.currentRoomId]) return "The lid is shut, or nearly. Whatever lies inside, you cannot see it yet.";
    }
    if (/camel/.test(w) && state.flags.hasCamel && !this.rideable.includes(state.currentRoomId)) {
      return "She is outside, tethered, no doubt composing a complaint.";
    }
    if (/camel/.test(w) && state.flags.hasCamel) {
      const mood = state.flags.camelDrank
        ? "She has drunk deeply, and looks smug about it."
        : "Her mouth is dry and foamy, and her lower lip droops.";
      return (state.riding ? "Beneath you, your camel turns her head and regards you down a very long nose with the weary scorn of the overworked. Her coat is coarse and prickly-soft under your hand, warm as an oven, and she smells of hay and hot animal. " : "Your camel regards you down a very long nose with the weary scorn of the overworked.") + mood;
    }
    return null;
  },

  onTalk(state, npcId) {
    // Whitfield briefs you in one go: the pyramid, Kasim, the glass, and the supplies. No need to know what to ask.
    if (npcId === "curator" && (!state.flags.askedCuratorPyramid || !state.flags.hasSupplies)) {
      const parts = [];
      if (!state.flags.askedCuratorPyramid) parts.push(this.handleTopic(state, "curator", "pyramid"));
      if (!state.flags.hasSupplies) parts.push(this.handleTopic(state, "curator", "supplies").replace('"Ah — that." He glances', "He glances"));
      return parts.join("\n\n");
    }
    if (npcId === "teller" && !state.flags.gotFlute) {
      state.flags.gotFlute = true;
      state.inventory.push("flute");
      return "You half laugh, but before you can finish the other half of your laugh, she presses a finger to your lips. A half-shocked, half-surprised look flashes in her eyes.\n\n\"I already see some of your future.\" She then presses a reed flute with three finger holes into your hand. \"Where you are going, you will need to ask snakes politely. Keep it.\""
        + this.award(state, 5, "was given a flute");
    }
    return null;
  },

  // The Stone describes the situation in each room. The solutions live only in the glyph
  // translations the player has to find and examine (Antechamber, Mirrors, Serpent Bridge, Reigns).
  stoneHints: {
    wellshaft: "Two ropes hang here, guest, and only one of them is for climbing.",
    flooded: "A thirst older than the pyramid, and water that was never meant for drinking.",
    whispering: "A puzzle for the ears, traveller.",
    snakepit: "An old creature with a long memory, guest, and a great fondness for questions.",
    scribe: "A floor that sinks and a blade that waits.",
    mirrors: "A puzzle for the eyes, traveller. The light is patient.",
    burial: "A noble sleeps here. The great keep their faces, even in death.",
    serpent: "Three voices, traveller, and each has its mood.",
    mummy: "He has not had a visitor in an age.",
    reigns: "A king's life, told in stone, from his birth to his going away.",
    treasury: "The house offers a guest a gift here. Choose wisely.",
    tunnel: "An old fall of stone closes the way, guest. The house is in no hurry.",
    starchart: "Two rings, one for the sky and one for the land. Each remembers a single night, and a single place.",
    echoes: "A room that answers back, traveller.",
    sarchall: "A great eye watches the doorway. It has only ever admitted kings.",
    landing: "Four lights, guest, and each had a place of its own.",
    lift: "The house weighs its guests, and it is exact."
  },

  onEnter(state, roomId) {
    const base = (this.onEnterMain(state, roomId) || "") + this.camelTransition(state, roomId);
    let hint = "";
    const f = state.flags;
    if (state.worn.has("rosetta") && this.stoneHints[roomId] && !f["hint_" + roomId]) {
      f["hint_" + roomId] = true;
      hint = "\nThe Stone murmurs in your head, in that tongue you have never learned and understand perfectly: \"" + this.stoneHints[roomId] + "\"";
    } else if (state.inventory.includes("rosetta") && !state.worn.has("rosetta") && WORLD.rooms[roomId].dark && (state.stoneRemind || 0) < 3) {
      state.stoneRemind = (state.stoneRemind || 0) + 1;
      hint = "\nThe Stone, in your pack, is silent. You have the odd impression that it would speak more clearly if it hung round your neck.";
    }
    return (base || hint) ? (base || "") + hint : null;
  },

  onEnterMain(state, roomId) {
    const f = state.flags;
    if (roomId === "platform") {
      return "\n\"You took longer than I expected.\" " + (f.pillarsAll
        ? "He smiles, faintly. \"You woke the pillars on the way. I did say I would see you soon. What things shall we speak of?\""
        : "He gestures at the nothing beside him. \"Sit, if you like. There is no hurry here. That is rather the point of here. What things shall we speak of?\"");
    }
    if (roomId === "landing" && !f.ringSeen) {
      f.ringSeen = true;
      return this.award(state, 10, "found the pillars");
    }
    if (roomId === "heart" && f.pillarsAll && !f.figureSeen) {
      f.figureSeen = true;
      return "\nThe column of light above the glass thickens, and takes the shape of a figure: an old man in plain robes, tall, calm, made of soft gold light. He does not look at you. But a voice is simply there, inside your head, patient and faintly amused, as if from a very long way off: \"I will see you soon.\" Then the figure unravels like smoke, and the light of the pillars settles to a steady glow, and the hum goes on, but gentler, as though something vast had just gone back to sleep."
        + this.award(state, 16, "woke the pillars");
    }
    if (roomId === "treasury" && !f.sawTreasury) {
      f.sawTreasury = true;
      return "A tall, impossibly thin figure of blue-grey smoke is sitting cross-legged on top of the heap, in a gold waistcoat and a turban the size of a pumpkin, polishing a jade nail on his sleeve. \"The house's purse,\" says the Djinn, in a voice like a cello. \"You may take one pearl and only one.\" He goes back to his nail.";
    }
    if (roomId === "hall" && !f.sawMummy) {
      f.sawMummy = true;
      return "Something shuffles in the dark at the far end of the hall, slow and dragging, and stops dead when your lamp turns toward it." + this.award(state, 5, "glimpsed something moving");
    }
    if (roomId === "valley" && !f.reachedValley) {
      f.reachedValley = true;
      return this.award(state, 10, "reached the Valley of Forgotten Stones").trim();
    }
    return null;
  },

  // Movement that needs story logic. Return {text?, moveTo?, describe?} or null.
  interceptMove(state, dir) {
    const room = state.currentRoomId;
    const f = state.flags;

    if (WORLD.rooms[room].dark && !this.hasLight(state)) {
      return { text: "You can't risk stumbling about in the pitch dark. You need a light." };
    }

    if (room === "hotel" && dir === "n" && !f.caseOpened && !f.caseNudged) {
      f.caseNudged = true;
      return { text: "You have your hand on the door when you realise you have not so much as looked in your briefcase. Everything you came here with is in it. Probably best to see what is there before you go." };
    }

    if (room === "citygate" && dir === "w") return this.tryLeaveCairo(state);

    if (room === "oasis" && dir === "w") {
      state.duneStage = 0;
      return {
        text: f.camelDrank ? undefined : "Your camel plants her feet and gives you a long, reproachful look. Then, with enormous reluctance, she follows. She is thirsty, and she will not forget this.",
        moveTo: "dunes"
      };
    }

    if (room === "dunes") {
      const stage = state.duneStage || 0;
      state.duneSafe = state.duneSafe || {};
      state.duneBad = state.duneBad || {};
      // Only the wrong slopes sink you. The right way works whether or not you tested it: testing just tells you in advance.
      const sink = (known) => {
        state.duneStage = 0;
        return { text: (known
          ? "You step out onto the slope you watched swallow your stone. It lets go at once, soft as porridge, and you go down: ankle, knee, waist, chest, with black beetles pouring over your arms and the light turning brown, then black, then nothing at all."
          : "You step out onto the sand without trying it first. For a moment it holds. Then the whole slope lets go, soft as porridge, and you go down: ankle, knee, waist, chest, with black beetles pouring over your arms and the light turning brown, then black, then nothing at all.")
          + "\n\nYou come to coughing sand on the Desert Road, flat on your back, with your camel regarding you down her long nose with the weary scorn of the overworked. The dunes lie to the west, smooth and quiet, as though nothing had happened.", moveTo: "desertroad" };
      };
      if (dir === "e") {
        if (stage === 1) { state.duneStage = 0; return { text: "You retrace your steps, and the dunes slump shut behind you.", describe: true }; }
        return { moveTo: "oasis" };
      }
      if (stage === 0 && dir === "n") {
        const tested = state.duneSafe["0n"];
        state.duneStage = 1;
        let t = tested
          ? "You step out onto the ground you tested. It holds. The beetles ignore you, and the slope gives way to the next ridge."
          : "You step out onto the sand without trying it first, and, by some small miracle, it holds. The beetles ignore you, and the slope gives way to the next ridge.";
        if (!f.duneStage1) { f.duneStage1 = true; t += this.award(state, 10, "found firm ground in the dunes"); }
        return { text: t, describe: true };
      }
      if (stage === 1 && dir === "w") {
        const tested = state.duneSafe["1w"];
        let t = (tested
          ? "The ground you tested holds all the way"
          : "The sand you did not test holds, all the way, by what feels like sheer luck")
          + ", and the dunes fall away to show smoke and the glint of copper: a bell, voices, the smell of goat.";
        if (!f.duneStage2) { f.duneStage2 = true; t += this.award(state, 10, "crossed the Shifting Dunes"); }
        return { text: t, moveTo: "camp" };
      }
      if (dir === "n" || dir === "s" || dir === "w") return sink(!!state.duneBad[stage + dir]);
    }

    if (room === "camp") {
      if (dir === "e") {
        state.duneStage = 1;
        return { text: "You retrace the path you tested, and the dunes close up behind you.", moveTo: "dunes" };
      }
      if (dir === "w") {
        let t;
        if (state.inventory.includes("minttea")) {
          state.inventory = state.inventory.filter(i => i !== "minttea");
          f.mintTea = true;
          t = "You gulp down the tea before you go, since it would only spill: hot, green, sweet, and astonishingly clear-headed."
            + this.award(state, 5, "drank the mint tea");
        }
        state.ridgePos = 0;
        return { text: t, moveTo: "ridge" };
      }
    }

    if (room === "ridge") {
      const pos = state.ridgePos || 0;
      const seq = ["n", "n", "e", "e"];
      if (dir === seq[pos]) {
        if (pos === 3) {
          state.ridgePos = 0;
          let t = "At the last step the wind shifts, the storm lets go all at once, and the ground tilts gently down into a bowl of still, hot air.";
          if (state.inventory.includes("umbrella")) {
            this.loseUmbrella(state);
            t = "At the last step the wind finds your umbrella and rips it out of your hands. It wheels away over the dunes like a small black bird, and is gone. Then the storm lets go all at once, and the ground tilts gently down into a bowl of still, hot air.";
          }
          t += this.ridgeAfter(state);
          if (!f.sandstormSolved) { f.sandstormSolved = true; t += this.award(state, 25, "crossed Sandstorm Ridge"); }
          return { text: t, moveTo: "valley" };
        }
        state.ridgePos = pos + 1;
        const steps = [
          "You turn the camel's back on both of the lovely lies and ride north, with the wind shoving you along from behind. The ridge falls away, and the wind scours the ground bare of anything to steer by.",
          "North again, and the world has narrowed to a corridor of hissing sand. The wind keeps its hand between your shoulder blades, and the camel plods on, trusting it, and so do you.",
          "You bear east, with the wind, which has swung round behind you, pushing the camel along like a hand between the shoulder blades."
        ];
        return { text: steps[pos], describe: true };
      }
      if (pos === 0) {
        if (dir === "e") return { moveTo: "camp" };
        if (dir === "s") {
          if (f.mintTea) return { text: "You know better. Dune-shadow and nothing more. You stay where you are." };
          return { text: "You turn the camel toward the camels. The camels turn out to be dunes, and the dunes turn out to be a circle, and the circle ends at a familiar ridge of ochre rock.", describe: true };
        }
        if (dir === "w") {
          if (f.mintTea) return { text: "No woman, no pool. Mint-cold and clear-headed, you decline to chase her." };
          return { text: "You rein the camel after her, and she steps into the pool and the pool ripples away to plain sand, and the sand slopes, and slopes, and you find yourself back on the ridge with grit in your teeth.", describe: true };
        }
      }
      state.ridgePos = 0;
      return { text: "You strike out against the wind, or across it, and wander the featureless sand until, with a lurch, the ridge rears up in front of you again. You have gone in a circle.", describe: true };
    }

    if (room === "valley") {
      if (dir === "e") return { text: "You turn the camel toward the ridge, and the wall of flying sand rises up to meet you, red and roaring. Without your umbrella, going back through that would be suicide." };
      if (dir === "d") {
        if (!f.entranceFound) return { text: "There is no way down that you can find." };
        if (!state.inventory.includes("lamp")) return { text: "You can't go down into that without a light. You will need a lamp." };
        f.lampLit = true;
        if (f.weighed) {
          return { text: "You tie the camel to a fallen block again and pick your way down over the broken bamboo, the lamp swinging.", moveTo: "stairway" };
        }
        f.weighed = true;
        return {
          text: "You tie the camel to a fallen block. She regards you with the sorrowful dignity of an animal that has seen this sort of thing before. You light the spare lamp, and its small gold circle holds back the dark.\n\n"
            + "The stair begins with a floor of bamboo: rows upon rows of pale canes laid side by side across a gap, running away from you left to right into the gloom. You step onto them. They give a dry, whispering creak, then a crack, then another. The first canes you cross are thin as pencils and snap beneath your boots like bones, and you run, the lamp swinging, feeling each cane go as your foot leaves it. Then the canes under you are thick as wrists, and they hold.\n\n"
            + "You stop, heart pounding, and look back. Behind you, where the thin canes broke, a ragged hole gapes in the matting. Through it red sand is trickling, a fine, deliberate thread, and below the hole a glass vessel set in a niche in the wall is catching every grain. It fills. There is a small click, and the glass seals itself, slides back into the stone, and is gone. Whatever that was, it seems to be finished with you.\n\n"
            + "Then the rest of it goes. With a long, dry, tearing sigh the whole run of matting behind you gives way, cane after cane, and drops into the dark below, until where you ran there is only a gaping void of splintered bamboo. You raise the lamp. Beyond the void there is nothing: the dark has closed over the stair's mouth, with no sky, no sun and no sign of the ledge you stepped from. Whatever way out there is from here, it is not behind you."
            + this.award(state, 5, "crossed the bamboo")
            + (f.sealedPoints ? "" : (f.sealedPoints = true, f.sealed = true, this.award(state, 5, "was sealed in"))),
          moveTo: "stairway"
        };
      }
    }

    if (room === "treasury" && (dir === "s" || (dir === "n" && f.pearlHeld)) && !f.swallowedPearl) {
      return { text: f.pearlHeld
        ? "The Djinn's smoke thickens across the way, and he does not look up from his nail. \"You must swallow your choice before you go on, guest. Do not offend the house by refusing its hospitality.\""
        : "The Djinn's smoke thickens across the doorway south, and he does not look up from his nail. \"You may take one pearl, and only one. Do not offend the house by refusing its hospitality.\"" };
    }

    if (room === "stairway" && dir === "u") {
      return { text: "You hold the lamp out over the edge. Below the gaping void there is only dark, and a faint rattle of canes still settling a long way down. The stair's mouth is gone from sight: there is no sky, no ledge and no rope, and nothing in reach you could climb. Whatever way out there is, it lies ahead, through the pyramid." };
    }

    if (room === "threshold" && dir === "n") {
      return { text: "You turn sideways and squeeze through the gap, the stone cold against your chest and back. Beyond it the dark opens out into something larger.", moveTo: "hall" };
    }

    if (room === "threshold" && dir === "n__old") {
      f.sealed = true;
      let t = "You turn sideways and squeeze through the gap, the stone cold against your chest and back. As your heel clears the edge there is a click somewhere above you, then a long, grinding rumble, and a slab of stone as big as a door drops out of the lintel's slot and slams across the passage behind you. Dust fills the air. When it clears there is nothing where the gap was but smooth, blank stone. There is no going back.";
      if (!f.sealedPoints) { f.sealedPoints = true; t += this.award(state, 5, "was sealed in"); }
      return { text: t, moveTo: "hall" };
    }


    if (room === "statues") {
      const seq = ["w", "e", "w"];
      const pos = state.statuePos || 0;
      if (dir === "s") { state.statuePos = 0; return { moveTo: "hall" }; }
      if (dir === "n" || dir === "e" || dir === "w") {
        if (pos < 3 && dir === seq[pos]) {
          state.statuePos = pos + 1;
          const steps = [
            "You step onto the tile the statue indicates, gingerly. It holds. The next pair of statues comes into the light.",
            "East this time. The tile is cold and solid under your foot.",
            "West again, and the third tile holds. Ahead, the corridor ends in an opening."
          ];
          return { text: steps[pos], describe: true };
        }
        if (pos === 3 && dir === "n") {
          state.statuePos = 0;
          let t = "You walk the last few yards on plain, safe tile, and the statues fall away behind you.";
          if (!f.corridorDone) { f.corridorDone = true; t += this.award(state, 10, "crossed the statue corridor"); }
          return { text: t, moveTo: "wellshaft" };
        }
        state.statuePos = 0;
        return { text: "The tile tilts under your foot with a grinding click, and the whole polished floor becomes a slope. You slide helplessly down the length of the corridor on your back and fetch up in a heap at the entrance. Your dignity takes rather longer to arrive.", describe: true };
      }
    }

    if (room === "wellshaft" && dir === "d") {
      let t = "You test the thick rope, wind it twice around your wrist, and lower yourself over the lip into the dark. The cold comes up to meet you, wet and smelling of long water, and the lamplight shrinks to a coin above your head. Then your boots find water, and a floor, and you are standing in a flooded passage with the rope swinging gently beside you.";
      if (!f.reachedShaft) { f.reachedShaft = true; t += this.award(state, 10, "went down the Well Shaft"); }
      if (f.netCut && !f.braceletPlaced) {
        f.braceletPlaced = true;
        WORLD.rooms.flooded.objects.push("bracelet");
        t += "\n\nSomething glints in the shallows near your feet: the net's cargo, a gold bracelet, lying where it fell.";
      }
      return { text: t, moveTo: "flooded" };
    }

    if (room === "mirrors" && dir === "e") {
      if (!f.blockCut) return { text: "The grey block fills the doorway, solid as a mountain. Something very hot would be needed to get through it." };
      if (!f.doorUnlocked) return { text: "You walk the short cut passage to a heavy wooden door, black with age. In its centre is a keyhole in the shape of a small jackal's head. It is locked. A key would open it: UNLOCK DOOR." };
      return { moveTo: "burial" };
    }
    if (room === "longdescent") {
      const st = state.descentStage || 0;
      if (dir === "d") {
        if (st < 3) { state.descentStage = st + 1; return { describe: true }; }
        return { moveTo: "stair2" };
      }
      if (dir === "u") {
        if (st > 0) { state.descentStage = st - 1; return { text: "You climb back up a long way.", describe: true }; }
        return { moveTo: "tunnel" };
      }
    }
    if (room === "stair2" && dir === "u") { state.descentStage = 3; return { moveTo: "longdescent" }; }

    if (room === "tunnel") {
      if (dir === "s" && !f.dug) return { text: "Rubble fills the way south, packed hard. It would have to be dug." };
      if (dir === "d") {
        if (!f.dug) return { text: "There is no way down that you can find." };
        state.descentStage = 0;
        return { text: "You squeeze down through the crack. Warm air rises past you, humming faintly, and a long stair begins.", moveTo: "longdescent" };
      }
    }
    if (room === "starchart") {
      if (dir === "n") {
        if (!f.starDoor) return { text: "The stone door in the north wall is shut, and blank, and waiting." };
        return { moveTo: "sarchall" };
      }
    }
    if (room === "echoes") {
      const pos = state.echoPos || "c";
      const names = { n: "north", s: "south", e: "east", w: "west" };
      if (!names[dir]) return null;
      if (pos === dir) {
        if (dir === "n") { state.echoPos = "c"; return { moveTo: "tunnel" }; }
        if (dir === "w") { state.echoPos = "c"; return { moveTo: "starchart" }; }
        if (dir === "e") {
          if (!f.echoOpen) return { text: "The east wall is smooth stone. You can't go that way." };
          state.echoPos = "c";
          return { moveTo: "sarchall" };
        }
        return { text: "The south wall is smooth, solid stone. You can't go that way." };
      }
      state.echoPos = dir;
      return { text: pos === "c"
        ? "You walk across the polished flags to the " + names[dir] + " wall and stand with your back to it."
        : "You cross the room to the " + names[dir] + " wall." };
    }
    if (room === "garden" && dir === "e" && !f.gardenLeaveWarned) {
      const left = WORLD.rooms.garden.objects.filter(id => WORLD.objects[id].marked || WORLD.objects[id].crucial);
      if (left.length) {
        f.gardenLeaveWarned = true;
        const names = left.map(id => "the " + WORLD.objects[id].name.toLowerCase()).join(", ");
        return { text: "You hesitate at the way out. Lying among the fungus are things you set down: " + names + ". Something tells you that you will want them again. Go east again if you are sure." };
      }
    }
    if (room === "garden" && dir !== "e") return { text: "The only way on is east." };
    if (room === "sarchall" && dir === "d") {
      if (!state.worn.has("mask")) {
        return { text: "The great carved eye above the doorway watches you, unblinking. \"Only kings pass,\" sighs the stone, with the weary courtesy of a thing that has said it many times." };
      }
      let t = "You step up to the black doorway with the golden mask on your face. The eye above it widens, and the cobra on its brow lowers its hood in a slow salute. The black stone is not a wall any more: it is a stair, going down into a darkness that smells of dry stone, cold gold and, very faintly, of stars.";
      if (!f.portalPassed) { f.portalPassed = true; t += this.award(state, 10, "passed the portal"); }
      return { text: t, moveTo: "liftante" };
    }
    if (room === "liftante" && dir === "n") {
      if (!f.djinnWarned) {
        f.djinnWarned = true;
        return { text: "You walk toward the timber frame. A voice like a cello, from somewhere behind your left shoulder, and very dry: \"Ask yourself what you carry that is not yours.\" When you turn, there is only a faint smell of struck matches.", moveTo: "lift" };
      }
      return { moveTo: "lift" };
    }
    if (room === "lift" && dir === "s" && state.onLift) return { text: "You are standing on the platform. You would have to get off first." };
    if (room === "ledge") return { text: "You find you do not want to leave." };
    return null;
  },

  handleWear(state, objId) {
    if (objId === "fez") return "You settle the fez on your head. It fits better than it has any right to.";
    if (objId === "sunglasses") return "The glare drops away. Cairo looks like a film of itself.";
    if (objId === "jacket") return "You shrug the jacket back on.";
    if (objId === "rosetta") {
      let out = "You hang the stone around your neck on its leather cord. It is heavy and cold for a moment, and then warm, as if it had recognised you. The faraway voice is suddenly close, as clear as if someone stood at your shoulder, in the same tongue you have never learned and understand completely: \"Welcome, guest. Be at ease. We will teach you what you need.\"";
      if (!state.flags.wornStone) { state.flags.wornStone = true; out += this.award(state, 10, "wore the Stone"); }
      return out;
    }
    return null;
  },

  handleRemove(state, objId) {
    return null;
  },

  // Return a string to block taking something off, or null to allow it.
  canRemove(state, objId) {
    if (objId === "rosetta" && !["garden", "liftante", "lift"].includes(state.currentRoomId) && !state.removeWarned.includes("rosetta")) {
      state.removeWarned.push("rosetta");
      return "The voice grows faint, as though a door were closing. The Stone helps only while it hangs at your neck, and it helps all the way to the last door. Take it off anyway? Type REMOVE again to confirm.";
    }
    if (objId === "fez" && this.reserve(state) > 0) {
      return "You would rather keep the fez on while you are still shopping. Everyone in the market is treating you as a local.";
    }
    return null;
  },

  // SHOW / WAVE / HOLD / POINT / USE <item>
  handleUse(state, verb, objId, rest) {
    if (objId === "comb") {
      return state.currentRoomId === "hotel"
        ? "You run the comb through your hair in front of the spotted mirror. The humidity wins, but you feel you have made a point."
        : "You run the comb through your hair. It does not help, but it is a comfort.";
    }
    if (objId === "teabags") {
      return "You think about making a cup, but you have no kettle, no cup and no time. Somebody out in the desert will want these a great deal more than you do.";
    }
    if (objId === "toothbrush") {
      if (/stone|rosetta|glyph/.test((rest || "").toLowerCase())) return this.handleClean(state, rest);
      return "You give your teeth a quick, defiant scrub. The taste of a very long voyage fades. A little.";
    }
    if (objId === "aftershave") {
      const already = state.flags.scented;
      state.flags.scented = true;
      if (already) return "You are already smelling powerfully of limes and cloves. There is such a thing as too much.";
      if (state.currentRoomId === "snakepit") return "You splash a little on. \"Limes,\" says the Snake, with delicate disgust. \"And cloves. You smell like an unfortunate pudding.\"";
      return "You splash a little on. It stings, and you smell, immediately and powerfully, of limes and expectation.";
    }
    if (objId === "compass") return "You hold the compass flat on your palm and look at it. " + WORLD.objects.compass.desc(state).replace(/^.*?cool and heavy as a coin, with a scratched glass lid and a catch that clicks like a tongue\. /, "");
    if (objId === "cairomap") return WORLD.objects.cairomap.desc;
    if (objId === "knife") {
      if (!state.flags.knifeRepaired) return "The main blade is snapped at the hinge. You would only embarrass yourself.";
      if (state.currentRoomId === "bazaar" && state.flags.thiefActive) {
        state.flags.thiefActive = false;
        state.flags.thiefDone = true;
        return "You flick the blade open and hold it where he can see it. The thin man discovers an urgent engagement elsewhere."
          + this.award(state, 5, "saw off the thief");
      }
      return "You wave the knife about. Nobody is impressed, but nobody is approaching either.";
    }
    return null;
  },

  // Called by the engine after every command. Returns text to print, or null.
  afterCommand(state, before, raw) {
    const room = state.currentRoomId;
    const f = state.flags;
    if (state.pendingSwing && !/^\s*(swing|yes|y)\b/i.test(raw)) state.pendingSwing = false;
    if (state.pendingJump && !/^\s*(jump|yes|y)\b/i.test(raw)) state.pendingJump = false;
    if (state.pendingSleep && !/^\s*(sleep|rest|doze|nap|yes|y)\b/i.test(raw)) state.pendingSleep = false;
    // Thirst: every action in the desert dries you out. Drink (from the waterskin) before it gets worse.
    if (this.desertRooms.includes(room) && !f.gameOver) {
      if (room !== "valley" && !/^\s*(i|inv|inventory|score|help|save|load|look|l|restart)\b/i.test(raw)) {   // the night in the valley has its own pressures
        const shaded = state.umbrellaUp && state.inventory.includes("umbrella");
        state.thirstHalf = !state.thirstHalf;
        if (!shaded || state.thirstHalf) state.thirst = (state.thirst || 0) + 1;   // in the shade, only every other action counts
      }
      const t = state.thirst, shown = state.thirstShown || 0;
      if (t >= 24) {
        state.thirst = 0; state.thirstShown = 0; state.duneStage = 0; state.ridgePos = 0; state.oasisClock = 0;
        state.forceMove = "desertroad";
        return "The reins slip from your fingers altogether, and the world slides sideways. The camel, with nobody to guide her, wanders off the firm ground onto a slope of loose sand, and it lets go beneath her: she sinks to her knees, to her chest, to her neck, with you on her back, and the whole slow, soft, silent slide of it closes over your head.\n\nYou come to on the Desert Road, flat on your back, with a mouthful of sand and the camel standing over you, looking, for the first time in your acquaintance, apologetic. The oasis, the dunes and everything beyond them are a long way west again. Your waterskin is still at your hip.";
      }
      if (t >= 21 && shown < 3) { state.thirstShown = 3; return "Your sight narrows to a tunnel with sparkling edges, and the reins have slipped almost out of your hand. Beneath you the camel's ears swivel, uncertain, feeling the slack. If you do not drink now, she will choose her own way."; }
      if (t >= 17 && shown < 2) { state.thirstShown = 2; return "The world tips, and rights itself, and tips again. Your fingers have gone stupid on the reins, and your lips have cracked. Your waterskin hangs warm and heavy at your hip. Drink."; }
      if (t >= 12 && shown < 1) { state.thirstShown = 1; return "The sun has found the back of your skull. Your tongue is thick in your mouth, and the horizon has begun, very gently, to sway. You ought to drink something." + (state.inventory.includes("umbrella") && !state.umbrellaUp ? " Whitfield's umbrella, held over you, would at least keep the sun off." : ""); }
    } else if (state.thirst) { state.thirst = 0; state.thirstShown = 0; }
    if (room === "oasis" && !f.gameOver) {
      if (before !== "oasis") {
        state.oasisClock = 0;
        return f.scented
          ? "A cloud of mosquitoes lifts off the pool and whines toward you, gets a lungful of limes and cloves, and thinks better of it."
          : "A cloud of mosquitoes lifts off the pool and whines toward you, bright with interest. They do not look as though anything short of a very powerful smell would put them off.";
      }
      if (!f.scented) {
        state.oasisClock = (state.oasisClock || 0) + 1;
        if (state.oasisClock === 1) return "A mosquito finds your ear, and then your neck, and then, with a precision you almost admire, the back of your hand.";
        if (state.oasisClock === 2) return "You slap at your face, your arms, your ankles. The whine is becoming a roar. You are being eaten alive.";
        if (state.oasisClock >= 3) {
          state.oasisClock = 0;
          state.forceMove = "desertroad";
          return "The mosquitoes win. You flee back along the road, slapping and swearing and leaving a long, pale trail of dust, until the whining dies away behind you.";
        }
      }
    }
    if (state.onLift && room === "lift" && !f.gameOver) {
      state.liftClock += 1;
      if (state.liftClock >= 2) {
        state.onLift = false;
        if (this.markedCarried(state) > 0) {
          return this.die(state,
            "The ropes take the strain, and the platform lifts, and goes on lifting. Too far, too fast: the pointer slams past its stop, and a long way above you the rope runs out of rope. There is a moment of absolute stillness, in which you have time to notice that the planks are no longer under your feet, and a longer moment after that.",
            "Ancient proverb: Load the rope, and the rope will answer.");
        }
        let t = "The ropes begin to sing, one soft, clear note, and the platform lifts, smooth and certain, and balances against the jar as exactly as a hand finding a hand. You rise past wet black stone, and the dark, and the cold, and the long, long silence, and then the platform stops, quite gently, level with a ledge.";
        t += this.award(state, 30, "rode the lift");
        state.forceMove = "ledge";
        return t;
      }
    }
    if (room === "garden") {
      const carrying = state.inventory.some(id => WORLD.objects[id].marked);
      const here = WORLD.rooms.garden.npcs.includes("ghost");
      if (carrying && here) {
        WORLD.rooms.garden.npcs = [];
        state.pendingNpc = null;
        return "The ghost flickers, wrinkles his nose as if at a smell, and fades into the fungus-light. The garden falls silent. Your pockets, it seems, are too loud.";
      }
      if (!carrying && !here) {
        WORLD.rooms.garden.npcs = ["ghost"];
        const left = WORLD.rooms.garden.objects.filter(id => WORLD.objects[id].marked || WORLD.objects[id].crucial);
        return "A pale figure gathers out of the fungus-light, as if the garden had just exhaled, and stands blinking at you, polishing a helmet."
          + (left.length ? " He glances at the things you have set down among the fungus, and then at you. \"A guest who forgets his own luggage,\" he says mildly, \"is a long time remembering where he left it.\"" : "");
      }
    }
    if (f.thiefActive && room !== "bazaar") { f.thiefActive = false; f.thiefWarned = false; return null; }
    if (room === "bazaar" && !f.thiefDone) {
      if (!f.thiefActive) {
        if (before !== "bazaar" && state.inventory.includes("watch")) {
          f.thiefActive = true;
          state.thiefStalk = 0;
          state.thiefClock = 0;
          // A player who has already befriended the bald man is warned straight away.
          f.thiefWarned = !!f.gaveComb;
          return "A thin man in a stained waistcoat, limping slightly beneath a moustache like two commas, drifts closer through the crowd with his eyes on your watch chain."
            + (f.gaveComb ? " From his crate, the bald man gives a tiny, significant cough. Two breaths, he mouths, and mimes a blade." : "");
        }
        return null;
      }
      // Stalking: he is watching, not yet moving. After a few moments he closes in, and says so.
      if (!f.thiefWarned) {
        state.thiefStalk = (state.thiefStalk || 0) + 1;
        if (state.thiefStalk >= 4) {
          f.thiefWarned = true;
          state.thiefClock = 0;
          return "The thin man is at your elbow now, close enough to smell his hair oil, and his fingers are already drifting toward your watch chain. You have perhaps two breaths.";
        }
        return null;
      }
      // Warned: two further turns, then he strikes. Showing a blade, or leaving the Bazaar, ends it.
      state.thiefClock = (state.thiefClock || 0) + 1;
      if (state.thiefClock === 1) {
        return f.gaveComb
          ? "The thin man is at your elbow. One breath, the bald man mouths, holding up a finger."
          : "The thin man's hand is almost in your pocket. One breath.";
      }
      if (state.thiefClock >= 2) {
        f.thiefActive = false;
        f.thiefDone = true;
        f.watchStolen = true;
        state.inventory = state.inventory.filter(i => i !== "watch");
        return "A bump, an apology in three languages, and the thin man is gone into the crowd. So is your pocketwatch.";
      }
    }
    return null;
  },

  // PUT <item> IN/ON <target>. Return a string, or null for the generic refusal.
  handlePut(state, objId, targetWord) {
    targetWord = (targetWord || "").toLowerCase();
    if (objId === "tinmeat" && /stone|fire|plate|flame|embers/.test(targetWord) && state.currentRoomId === "valley") return this.cookMeat(state);
    const orbRoom = { orb: "pgold", crimsonorb: "pcrimson", greenorb: "pgreen", blueorb: "pblue" };
    if (orbRoom[objId] && /pillar|socket|base|plinth|column/.test(targetWord)) {
      const room = state.currentRoomId;
      if (!["pgold", "pcrimson", "pgreen", "pblue"].includes(room)) return "There is nothing here for it to sit in.";
      if (orbRoom[objId] !== room) return "You set the orb to the socket. It will not seat: the glass ring is the wrong colour, and the orb's hum turns sour in your hand. It belongs to another pillar.";
      state.inventory = state.inventory.filter(i => i !== objId);
      state.inKit.delete(objId);
      state.placed.push(objId);
      let out = "The orb drops into the socket as if it had been poured there. For a moment nothing happens. Then the glass ring takes the colour, the pulse in the stone quickens to a steady beat, and the pillar lights from the foot to a height you cannot see, the hum deepening into a chord."
        + this.award(state, 12, "woke a pillar");
      if (state.placed.length === 4) {
        state.flags.pillarsAll = true;
        out += "\n\nAs the last pillar lights, the four notes lock together into one great, low sound that you feel in every bone, and then, quite suddenly, it falls silent. Something, at the heart of the ring, has changed.";
      }
      return out;
    }
    if (objId === "glass" && /stand|tripod|ring/.test(targetWord) && state.currentRoomId === "mirrors") {
      if (state.flags.lensPlaced) return "It is already there.";
      state.inventory = state.inventory.filter(i => i !== "glass");
      WORLD.rooms.mirrors.objects.push("glass");
      state.flags.lensPlaced = true;
      return "You set the magnifying glass in the ring of the tripod. It settles with a small click, a round pool of light in the bronze, aimed at the block." + this.award(state, 5, "set the lens") + this.checkBeam(state);
    }
    if (objId === "umbrella" && /bag|kit|rucksack|pack|suppl/.test(targetWord)) {
      return "It's too big.";
    }
    return null;
  },

  // ---- Exchanges: GET, BUY, TRADE, SWAP and EXCHANGE all mean the same thing wherever a swap is required ----
  tradeOffers: [
    { npc: "rugdealer",   pay: "pen",     done: "gavePen",     words: ["fez", "hat", "cap", "tarboosh"],
      want: "\"A fez? For the pen, effendi. Only for the pen.\"" },
    { npc: "dockvendor",  pay: "jacket",  done: "gaveJacket",  words: ["sunglasses", "shades", "glasses", "dark glasses", "sun glasses"],
      want: "\"I want an English jacket, effendi. Good cloth. You had one.\"" },
    { npc: "oasisvendor", pay: "wallet",  done: "gaveWallet",  prompt: true, words: ["dates", "date", "waterskin", "water skin", "water", "clean water", "jug", "drink"],
      want: "\"The finest dates in all of Egypt, my friend, and certainly the only dates at this oasis. Ha!\" He spreads his hands. \"Trade me something I might want.\"" },
    { npc: "bedouinhost", pay: "teabags", done: "gaveTeabags", words: ["mint tea", "tea"],
      want: "\"For English tea, guest. The kind in the little bags.\"" },
    { npc: "smith",       pay: "knife",   done: "knifeRepaired", words: ["repair", "knife repair", "mended knife", "repaired knife"],
      want: "\"Bring me something that is broken, effendi.\"" },
    { npc: "baldman",     pay: "comb",    done: "gaveComb",    words: [], want: "" },
    { npc: "teller",      pay: "tarot",   done: "gaveTarot",   words: [], want: "" },
    { npc: "kasim",       pay: "amulet",  done: "gaveAmulet",  words: [], want: "" }
  ],

  roomNpcs(state) { return WORLD.rooms[state.currentRoomId].npcs; },

  cleanWant(s) { return (s || "").toLowerCase().trim().replace(/^(a|an|the|some|my)\s+/, "").replace(/^(a|an|the|some)\s+/, ""); },

  // Barter: the thing wanted is paid for with an item. Returns text, or null if this is not a barter good here.
  barter(state, what) {
    what = this.cleanWant(what);
    if (!what || what === "all") return null;
    const here = this.roomNpcs(state);
    const offer = this.tradeOffers.find(o => here.includes(o.npc) && o.words.includes(what));
    if (!offer) return null;
    if (offer.npc === "oasisvendor" && state.flags.gaveWallet && /date/.test(what) && !state.inventory.includes("dates")) {
      return this.handleTopic(state, "oasisvendor", "dates");
    }
    if (state.flags[offer.done]) {
      const owned = state.inventory.some(id => WORLD.objects[id] && WORLD.objects[id].aliases.includes(what));
      return owned ? null : "\"We have traded already, effendi.\"";
    }
    if (offer.prompt || !state.inventory.includes(offer.pay)) return offer.want;
    return this.handleGive(state, offer.pay, offer.npc);
  },

  // GET / TAKE: anything that is really a purchase or a swap goes through the exchange.
  handleExchange(state, verb, what) {
    what = this.cleanWant(what);
    if (!what || what === "all") return null;
    const room = state.currentRoomId;
    if (/^(amulet|scarab|scarab amulet)$/.test(what) && room === "bazaar" && !state.inventory.includes("amulet")) return this.handleBuy(state, "amulet");
    if (/camel/.test(what) && room === "camelmarket") return this.handleBuy(state, "camel");
    if (/\bcoffee\b|^cup$|^brew$/.test(what) && room === "teahouse") return this.handleCoffee(state);
    if ((/\btea\b/.test(what) || what === "glass of tea" || what === "glass") && (room === "teahouse" || room === "teastall")) return this.handleTea(state);
    return this.barter(state, what);
  },

  // TRADE / SWAP / EXCHANGE / BARTER, in any of the forms a player would try.
  handleTrade(state, rest) {
    const r = this.cleanWant(rest);
    const here = this.roomNpcs(state);
    if (!here.length) return "There is no one here to trade with.";
    const offerFor = npc => this.tradeOffers.find(o => o.npc === npc);
    const doOffer = (o) => (o.npc === "oasisvendor" && state.flags.gaveWallet && !state.inventory.includes("dates"))
      ? this.handleTopic(state, "oasisvendor", "dates")
      : state.flags[o.done]
      ? "\"We have traded already, effendi.\""
      : ((!o.prompt && state.inventory.includes(o.pay)) ? this.handleGive(state, o.pay, o.npc) : (o.want || "\"I have nothing for you, effendi.\""));
    const offerItem = (o, id) => state.flags[o.done] ? "\"We have traded already, effendi.\"" : this.handleGive(state, id, o.npc);
    if (!r) {
      const o = here.map(offerFor).find(x => x);
      return o ? doOffer(o) : "Trade what? Try TRADE <what you have>, or TRADE <what you want>.";
    }
    let m = r.match(/^(.+?)\s+for\s+(.+)$/);
    if (m) {
      const gave = this.cleanWant(m[1]), want = this.cleanWant(m[2]);
      if (/^(money|piastres|coins|cash)$/.test(gave)) return this.handleExchange(state, "trade", want) || "Nobody here is selling that.";
      const offer = this.tradeOffers.find(o => here.includes(o.npc) && o.words.includes(want));
      if (offer) {
        const gaveId = findObjectId(gave);
        if (offer.prompt) {
          if (gaveId && state.inventory.includes(gaveId)) return offerItem(offer, gaveId);
          return offer.want;
        }
        if (gaveId && gaveId !== offer.pay && state.inventory.includes(gaveId)) return "\"Not that, effendi. " + (offer.want ? offer.want.replace(/^"/, "") : "That is not what I want.");
        return doOffer(offer);
      }
      return "Nobody here has that to trade.";
    }
    m = r.match(/^(?:with|to)\s+(.+)$/);
    if (m) {
      const npc = findNpcId(m[1]);
      if (!npc || !here.includes(npc)) return notHere();
      const o = offerFor(npc);
      return o ? doOffer(o) : "They have nothing to trade.";
    }
    const asGood = this.handleExchange(state, "trade", r);
    if (asGood) return asGood;
    const whoHere = findNpcId(r);
    if (whoHere && here.includes(whoHere)) {
      const o = offerFor(whoHere);
      return o ? doOffer(o) : "They have nothing to trade.";
    }
    const id = findObjectId(r);
    if (id && state.inventory.includes(id)) {
      const o = this.tradeOffers.find(x => here.includes(x.npc) && x.pay === id);
      if (o) return offerItem(o, id);
      const p = this.tradeOffers.find(x => here.includes(x.npc) && x.prompt);
      return p ? this.handleGive(state, id, p.npc) : "Nobody here wants that.";
    }
    return "Nobody here has that to trade, and you do not have it to offer.";
  },

  handleBuy(state, what) {
    const swapped = this.barter(state, what);
    if (swapped) return swapped;
    what = (what || "").toLowerCase();
    if (what.includes("suppl") || what.includes("provision") || what.includes("water") || what.includes("food")) {
      return "Nobody's selling that here — but Whitfield, back at the Museum, might be worth asking.";
    }
    if (what.includes("amulet") || what.includes("scarab")) {
      if (state.currentRoomId !== "bazaar") return "Nobody's selling that here.";
      if (state.inventory.includes("amulet")) return "You've already got one.";
      const p = this.priced(state, 20, 12);
      if (state.money < p.price) return `\"${p.price} piastres,\" the merchant says, \"and don't insult me with less.\" You don't have it.`;
      state.money -= p.price;
      state.inventory.push("amulet");
      WORLD.objects.amulet.portable = true;
      WORLD.rooms.bazaar.objects = WORLD.rooms.bazaar.objects.filter(id => id !== "amulet");
      return p.line + `You hand over ${p.price} piastres for a scarab amulet that cost about four to make.`
        + this.award(state, 10, "bought the amulet");
    }
    if (what.includes("camel")) {
      return this.handleHireCamel(state);
    }
    if (/\bcoffee\b|^(a )?cup$|^brew$/.test(what)) return this.handleCoffee(state);
    if (what.includes("tea") || ((state.currentRoomId === "teahouse" || state.currentRoomId === "teastall") && what.includes("glass"))) {
      return this.handleTea(state);
    }
    if (state.currentRoomId === "rugdealer" && (what.includes("rug") || what.includes("carpet"))) {
      return "\"Everything here is beyond you, effendi, and I say it with love.\"";
    }
    return "Nobody's selling that here.";
  },

  handleHireCamel(state) {
    if (state.currentRoomId !== "camelmarket") return "Nobody's selling camels here.";
    if (state.flags.hasCamel) return state.riding ? "You are already sitting on her." : "You already have a camel. She is waiting outside.";
    const p = this.priced(state, 25, 15);
    if (state.money < p.price) return `\"${p.price},\" the trader says, \"and that's for the good one.\" You count your money and come up short.`;
    state.money -= p.price;
    state.flags.hasCamel = true;
    state.riding = true;
    return p.line + `${p.price} piastres changes hands. The trader nods at an irritable-looking camel. \"She spits. Only sometimes.\" He makes her kneel, you climb aboard, and she rises under you in three alarming stages, until you are sitting far above the market with the dizzy feeling of being rather magnificent. She smells of hay and hot animal, and her coat is coarse and warm under your hands.`
      + this.award(state, 15, "hired a camel");
  },

  // Called by the engine the FIRST time any object is examined/opened/read.
  // Return a bonus line of output (score, flavor) or null for nothing extra.
  onExamine(state, objId) {
    // Voss's sacks are not empty: the camp kit comes into view.
    if (objId === "sacks") {
      const room = WORLD.rooms.valley;
      ["matches", "candle", "tinmeat", "germantea"].forEach(id => {
        if (!room.objects.includes(id) && !state.inventory.includes(id)) room.objects.push(id);
      });
    }
    const obj = WORLD.objects[objId];
    if (obj && obj.hieroglyph) {
      let out = "";
      if (!state.worn.has("rosetta")) out += this.djinn(state);
      return out + this.award(state, 10, "read the carvings");
    }
    if (obj && obj.marked && !state.flags.noticedMark) {
      state.flags.noticedMark = true;
      return "\nThe little pyramid is neat and deliberate, stamped as if with a seal. Whatever this is, it belongs to the house." + this.award(state, 5, "noticed the pyramid mark");
    }
    if (objId === "telegram") {
      state.flags.readTelegram = true;
      return "\nVoss. Of course it's Voss. You have read this so many times that you could recite it in your sleep, and have, according to the man in the next cabin." + this.award(state, 5, "studied the telegram");
    }
    if (objId === "body") {
      if (state.flags.watchStolen) {
        state.flags.watchStolen = false;
        state.inventory.push("watch");
        return "\nIn his stiffening hand, your pocketwatch, still ticking. You prise it out. \"Looks like stealing things does not end well around here,\" you mutter."
          + this.award(state, 5, "recovered the pocketwatch");
      }
      return "\nHis pockets are empty. \"Looks like stealing things does not end well around here,\" you mutter, to nobody.";
    }
    if (objId === "beam" && !state.flags.sawHook) {
      state.flags.sawHook = true;
      WORLD.rooms.mummy.objects.push("hook");
      return "\nBut looking more closely, near the end above you, half buried in the wood like a tooth, you see an iron hook, rusted into place but loose enough to work free.";
    }
    if (objId === "voss") return this.award(state, 10, "found Dr. Voss");
    if (objId === "vossnotes") return this.award(state, 10, "read Voss's notebook");
    if (objId === "blade2") { state.flags.fragBlade = true; return null; }
    if (objId === "tablet") { state.flags.fragTablet = true; return null; }
    if (objId === "votive") { state.flags.fragVotive = true; return null; }
    if (objId === "notes") {
      return this.award(state, 10, "read McDaniels's notebook");
    }
    if (objId === "page") {
      return this.award(state, 10, "read Voss's torn page");
    }
    if (objId === "mirror") {
      state.flags.sawMentorPhoto = true;
      return "\nTucked into the corner of the frame is a small photograph, corners soft with handling — "
        + "Professor Adeline Hart, the woman who taught you your first field methods and told you, more "
        + "than once, that the treasure was never the point. You've been trying to prove her right ever "
        + "since, though Cairo has a way of testing that."
        + this.award(state, 5, "found a photograph tucked in the mirror frame");
    }
    return null;
  },

  // Called whenever the player tries to move west out of the city gate.
  // What the player remembers of an hour in the storm, whichever way they crossed.
  ridgeAfter(state) {
    return "\n\n" + (state.inventory.includes("watch")
        ? "You check your pocketwatch with a shaking hand: you have been in the storm for an hour and a quarter, though it feels like many hours more, and the shadows are growing long. "
        : "By the angle of the light, you judge that you have been in the storm well over an hour, though it feels like many hours more, and the shadows are growing long. ")
      + "You think to check your compass, but its needle spun, wandered and sulked the whole way across. The route you took would be impossible to trace back, let alone to chart.\n\n"
      + "You crossed it in near-blindness, but you saw things in the flying sand: fragments of skeletons, human and camel, half-buried and scoured pale; momentary glints of forgotten metal in the desert floor; and, among the rushing of the wind, whispers that were not quite voices. It is no surprise that so few have come this way, and that the pyramid is still a ghostly rumour.";
  },

  desertRooms: ["desertroad", "oasis", "dunes", "camp", "ridge", "valley"],

  // The Gate Guard says, in character, what the crossing still lacks. Matches the checks in tryLeaveCairo.
  gateReport(state) {
    const f = state.flags;
    const parts = [];
    parts.push(f.hasSupplies
      ? "That kit-bag will do for food and water; I know whose it is, and I have said nothing."
      : "I see no food and no water. Nothing for a crossing.");
    parts.push(f.hasCamel ? "The camel is yours, I see." : "You have no camel.");
    parts.push(f.knowsLocation ? "And you know where you are going, which is more than most." : "And you have no notion where you are going.");
    if (f.hasSupplies && f.hasCamel && f.knowsLocation) {
      return "\"West is desert,\" he says. \"Desert doesn't care if you're ready. But you look as ready as a man can be. Go when you like.\"";
    }
    return "\"West is desert. Desert doesn't care if you're ready.\" He counts on scarred fingers. \"" + parts.join(" ") + " Put that right, and I will stand aside.\"";
  },

  tryLeaveCairo(state) {
    if (state.flags.hasCamel && state.flags.knowsLocation && state.flags.hasSupplies) {
      const leaveBonus = this.award(state, 15, "left Cairo");
      return {
        text: "The guard studies you a moment longer, then steps aside without a word.\n\n"
          + "You lead the camel out through the gate. Cairo's noise falls away behind you, block by block, "
          + "until there's nothing left but wind.\n"
          + leaveBonus,
        moveTo: "desertroad"
      };
    }
    const missing = [];
    if (!state.flags.knowsLocation) missing.push("you don't actually know where you're going");
    if (!state.flags.hasCamel) missing.push("you don't have a camel");
    if (!state.flags.hasSupplies) missing.push("you're carrying no food or water for the crossing");
    return {
      text: "The guard doesn't move. \"West is desert,\" he says again, like it explains everything. "
        + "Might be worth admitting: " + missing.join(" and ") + ".",
      blocked: true
    };
  }
};
