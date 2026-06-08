# apk

Frida-gadget repack of BSD Brawl for Android arm64.

## Files

- `build.js` — cross-platform build script
- `build.bat` — Windows wrapper
- `build.sh` — Linux/macOS wrapper
- `config.arm64.txt` — gadget config
- `package.json`

## BSD APK

The file `bsd_brawl_v67.264.apk` is the BSD Brawl source APK. This is the base APK that gets repacked with the Frida gadget and agent.

**When BSD Brawl gets a new update, you need to replace this file with the new version.** Update the filename in `build.js` (`APK_INPUT` constant) to match the new version.

## Build

Requires Python 3.10+ and Java (JRE 8+).

```
pip install frida-gadget --upgrade
node build.js
```

Or use the wrappers:

```
build.bat        # Windows
./build.sh       # Linux/macOS
```

The script automatically downloads the latest compiled `agent.js` from GitHub Releases and repacks the APK with frida-gadget.

## In-game UI

Button coords are in `createAllButtons()` inside the agent source. Change the `(x, y)` passed to each `createButton(...)`.

Anything the game ships in `sc/ui.sc` is reachable from the agent: buttons, panels, popups, text fields, animations, icons, the whole UI. Open `sc-ui/ui.sc` in `sc-ui/sc-editor.jar` to browse it:

```
java -jar sc-ui/sc-editor.jar
```

File → Open → `sc-ui/ui.sc`. Pick any export name from the tree and call it from the agent with `StringTable_getMovieClip("sc/ui.sc", "<name>", true)`. The 3rd arg of `MovieClip_gotoAndStopFrameIndex` is the frame you want shown.

## Offsets

Current version only.
