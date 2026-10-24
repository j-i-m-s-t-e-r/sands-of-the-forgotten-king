# ENTOMBED — The Ending Script (draft v1)

Voice rules: the Pharaoh is dry, patient and faintly amused. Plain linen, not godlike, not glowing. Never use *alien*, *hologram*, *technology* or *machine*. He answers questions; he does not explain what he is. Conditions are in [BRACKETS].

---

## 1. The Ledge (final room, before the sarcophagus)

**Room text.** The lift settles on a ledge of black stone. The chamber is round and silent. In the centre stands a smooth black sarcophagus with no name and no crest, only a single line cut into the lid: *Knowledge is carried. Possessions are not.* Around the edges the dead have gathered. Voss, holding an empty sack he seems to have forgotten. A man with no head, his hat in his hands. A Roman soldier. A mummy. A coiled cobra. And past them, more than you can count, faces without number, all looking at your empty hands.

**Parser narrowing** (only `ENTER SARCOPHAGUS` advances; everything else is a flavour refusal):
- `GET TREASURE` / `GET ALL` → "There is no treasure."
- Any direction → "You find you do not want to leave."
- `LOOK` → "The others wait. Nobody speaks."
- `EXAMINE VOSS` → "He is holding an empty sack. He does not appear to know it."
- `EXAMINE McDANIELS` → "He holds his hat politely in the place where his head would be."
- `EXAMINE ROMAN` → "He nods once, one soldier to another."
- `EXAMINE CROWD` → "Not a punishment. A queue that never learned it was a queue."
- `ENTER SARCOPHAGUS` → "The lid slides open. Empty, as promised. You climb in. The lid closes."

**The dark** (no score line, no music, just text): "Darkness. You expected a coffin. It does not feel like a coffin. A vibration, but no sensation of movement. Weight no longer seems to mean anything. Then the lid opens."

---

## 2. The Platform

**Room text.** You are standing on a platform of pale stone, and beyond its edge, in every direction, there are stars. Not above you. All around you, below too, as if the platform floats in the middle of a sea of them. A man in plain linen robes stands at the edge with his hands behind his back, as though he has been waiting a while and does not mind.

**Opening.**

> THE PHARAOH: "You took longer than I expected."

[IF the pillars were woken]
> He smiles, faintly. "You woke the pillars on the way. I did say I would see you soon. What things shall we speak of?"

[ELSE]
> "Sit, if you like. There is no hurry here. That is rather the point of here."

*(Then the usual topic hint: "You could ask him about: yourself, the pyramid, the treasure, the others, Hart, going home.")*

---

## 3. Topics (`ASK PHARAOH ABOUT ...`, or `ABOUT ...` after `TALK`)

**yourself / who are you**
> "A man who once had a great deal of stone moved about, for reasons rather more practical than anyone has since given me credit for. Your people have many words for those who travel between worlds. I answer to none of them, and I do not mind which you choose."

**alive / dead**
> "Not by your definition. Nor dead, by it. I stopped finding the words helpful some while ago."

**where from / far**
> "Far away." *(and if asked how far)* "Not in distance."

**the pyramid / tomb**
> "I never wanted worship. Nor monuments, nor gold. Gold is heavy and I have never found it good company. The pyramid was a door with a very particular lock. Most who came wanted gold. Some wanted power. A few wanted to know. Only a person willing to leave with empty hands could ever reach this room."

**the treasure / the mark / gold**
> "You will have noticed the mark on every cup and every jewel. It is not a curse. It is a receipt. It says: this belongs to the house. A guest may take what he is given. A thief takes what he owes, and is surprised to be sent the bill."

**the others / the dead / the crowd**
> "They are not a punishment. They were not killed for wanting. They were stopped by it. It is a distinction they find very tiresome. They watch because I asked them to, and they do it beautifully."

**Voss**
> "The man with the sacks. He asked the Djinn which pearl was biggest. An honest question, and the wrong one. He chose well, by his own lights."

**McDaniels / the headless man**
> "The Victorian. He does ask, sometimes, whether anyone has found it. I tell him it is not my department."

**the Roman** [IF the player talked to the Roman at the Garden]
> "Ah, you met him. He remembered his name. It has made him quite unbearable."

**the Roman** [ELSE]
> "There is a soldier in the garden who has forgotten his own name. He would have liked a visitor."

**the Djinn**
> "My oldest friend and my worst employee. He enjoys the work. He tells me you were polite."

[IF the player was taxed] *add:* "He says the tax was for your own good. It was also for his amusement."

**the pillars** [IF woken]
> "An old courtesy. A way of leaving the lamps on. Do not ask what they are for. You would only choose a name for it, and names are how a mystery gets spoiled."

**the pillars** [ELSE]
> "There is a place beneath the house you did not visit. It is of no consequence. A house has cellars."

**the pearl** [IF swallowed]
> "The smallest one. Yes. It is yours. You were given it, and you swallowed it, and neither of those is theft."

**the pearl** [ELSE]
> "You did not go down to the vault? The pearls are there still, I expect, and the Djinn will be rather hurt. He so enjoys the choosing."

**the lift / the rope**
> "Perfectly safe. It has been tried by experts."

**the door / the curse**
> "A formality. People believe in a trap more readily than a test."

**Hart / Adeline Hart / your teacher**
> "You carry her in your face when you are puzzled. I read faces. It is most of what remains of my trade. Someone taught you to ask what a thing is for before asking what it is worth. That is rarer than the pyramid."

**why wait / how long**
> "Long enough to have read everything. Not long enough to stop hoping someone would arrive and not want any of it."

**return / home / leaving** → goes to the choice (section 4).

**Anything else**
> "That is a longer conversation than we have. Ask me something I can answer without ruining it."

**Nudge.** After the third topic: "Shall we come to it?" and then the choice.

---

## 4. The Choice

> "Will you return?"

The player types `YES` / `RETURN` / `GO HOME`, or `NO` / `STAY`.

---

## 5. YES

> "Then go. Tell the truth to nobody. They will not believe you, and those who do will come with sacks."

[IF the pearl was swallowed]
> "BTW, you can keep the Djinn pearl as a souvenir. Pharaohs don't do poo."

**Dawn.** Cold sand. The smell of camel. The Valley of Forgotten Stones at first light, under a perfectly ordinary sky. The camel regards you with the contempt of an animal that has been kept waiting. Something rolls against your boot: an umbrella, bent but unbroken. You do not remember it being blown anywhere. You open it anyway.

**Epilogue.**
> Pembroke wrote the book. It was the best-reviewed work of Egyptology in a generation, and it said nothing at all about what happened. It was dedicated "to Adeline Hart, who said the treasure was never the point."
> Whitfield was released, the matter of the crate having been traced to a man who had no connection to him at all. He kept the telegram, framed.
> The Museum Board reinstated the funding. Dr. Voss was recorded as lost in the desert. Nobody was told what really happened.

**Score screen.** `SCORE: x/1000. THE END.`

---

## 6. NO

> "Then walk with me. There is a good deal to show you, and I think you have the patience."

You step off the edge of the platform onto nothing that is not also somewhere. The stars make way.

**The final line, as an obituary:**
> Dr. Pembroke was never seen again. His camel was found grazing in the Valley of Forgotten Stones, in perfect health. His umbrella was never recovered. His trunk, stencilled PEMBROKE, was returned to the Museum with a few crumpled shirts and no explanation.

**Score screen.** `SCORE: x/1000. THE END.` (The story simply stops.)
