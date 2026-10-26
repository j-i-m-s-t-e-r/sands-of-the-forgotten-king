# Sands of the Forgotten King

A text adventure set in 1930s Egypt, played in the browser. Working title: ENTOMBED.
You are Pembroke, an Egyptologist summoned to Cairo to finish a mission that Whitfield, the
Trustees' man in Egypt, could not: find a pyramid buried to its tip in the sand. 51 rooms,
1000 points, four ways to die, two endings.

## Play it

Open `src/index.html` in a browser. No build step, no server, no dependencies.
The game saves automatically on this device (browser local storage); `SAVE` and `LOAD` also work.
Type `HELP` in the game for the commands.

## Layout

| Path | What it is |
|---|---|
| `src/engine.js` | The generic parser and engine. Knows nothing about Egypt. |
| `src/world-data.js` | Every room, object and character, as pure data. |
| `src/game-logic.js` | The puzzles, dialogue, scoring and endings: everything specific to this story. |
| `src/index.html`, `src/style.css` | The page: amber-on-black terminal, responsive, auto-focusing input box. |
| `docs/design-bible.md` | The design record: every decision, puzzle specification and fix, in order. |
| `docs/ending-script.md` | The full Pharaoh dialogue and both epilogues. |
| `docs/game-map.html` | A map of every room with what each involves (spoilers). Generated. |
| `src/debug-route.js` | Generated. The full-score route, used by the `**debug` jump. Developer only: it is a complete walkthrough, so it is left out of the public build. |
| `tests/` | A scripted playthrough that must finish on 1000/1000, a check of the debug jump, and a check of the rules set from play-testing (hard deaths, the Stone, the guard, the layout). |
| `tools/` | The generators for the map page and for `src/debug-route.js`. |

## Checks and tools

```
npm test             # plays the whole game headlessly (must end on the maximum score), then checks the debug jump
npm run build-map    # regenerates docs/game-map.html from the real room data
npm run build-debug  # regenerates src/debug-route.js after the playthrough lists in tests/ change
npm run package      # builds sands-itch.zip from src/, leaving out debug-route.js
```

## Jumping to any room while you test

Type `**debug : <room>` in the game (also `debug valley`, or `**debug list` for the room names) and
you are taken to that room with the score and inventory a full-score playthrough would have by then,
so you do not have to play through everything before it. It replays the route in `src/debug-route.js`
silently. It only works when the page is opened from a file or from localhost, or when the address
contains `?debug`; on a public site it is switched off.

Run `npm test` after any change to the three game files. If you add points or move a puzzle,
update the two command lists in `tests/` to match, and keep the maximum at 1000.

## Packaging for itch.io

Zip the *contents* of `src/` (so `index.html` is at the root of the zip), leaving out the debug
route, and upload it as an HTML project:

```
npm run package
```

## Adding to the game

- A new room, object or character goes in `src/world-data.js`.
- A new puzzle, line of dialogue or award goes in `src/game-logic.js` (the hooks are `onEnter`,
  `interceptMove`, `handleTopic`, `handleGive`, `afterCommand`, and so on; see existing examples).
- Prices, trades and what a character wants are in tables: `tradeOffers` in `game-logic.js`.
- Anything a character says that includes a price should be a function of the state, so it
  follows the fez.
