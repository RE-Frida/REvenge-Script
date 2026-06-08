# REvenge

Frida agent for BSD Brawl.

## Download

Setup + APK on Discord: **https://discord.gg/ZksZaUeDbW**

## Setup

1. Uninstall BlueStacks if you already have it.
2. Run `REvenge_Setup.exe`. It installs the BlueStacks build that works with the mod.
3. Open REvenge, go to Settings, enable Root and ADB.
4. In BlueStacks install the BSD APK (not the official Brawl Stars one).
5. Open BSD inside BlueStacks.

## Repo

```
index.js          Main agent entry point
core/             Offsets, scanner, CSV, libs
features/         Aimbot, autododge, ESP, killaura, etc.
utils/            Flags, config, logger, wall cache
libs/             Math helpers
apk/              Frida-gadget repack for Android arm64
```

## Features

- Aimbot
- Autododge
- Killaura
- ESP
- In-game button UI in the APK build

## BSD APK

The file `bsd_brawl_v67.264.apk` is the BSD Brawl source APK. This is the base APK that gets repacked with the Frida gadget and agent.

**When BSD Brawl gets a new update, you need to replace this file with the new version.** Update the filename in `apk/build.js` (`APK_INPUT` constant) to match the new version.

## Build the APK

Requires Python 3.10+ and Java (JRE 8+).

```bash
pip install frida-gadget --upgrade
cd apk
node build.js
```

Drop the BSD APK in the `apk/` folder first (not included).

The script automatically downloads the latest compiled `agent.js` from GitHub Releases and repacks the APK.

## Build the agent bundle

```bash
npm install -g frida-compile
frida-compile index.js -o agent.js
```

## CI/CD

Every push to `main` triggers the GitHub Actions workflow which:

1. Compiles the agent with `frida-compile`
2. Bumps the patch version
3. Creates a GitHub Release with `agent.js`

## Offsets

`core/offsets.js` is keyed to the current BSD Brawl version. Other versions won't work.

## License

See `LICENSE`. No resell, no rehost, no commercial use.

## Contact

Discord: **https://discord.gg/ZksZaUeDbW** — `3xq9`
