const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");

const REPO = "RE-Frida/REvenge-Script";
const APK_INPUT = "bsd_brawl_v67.264.apk";
const AGENT_JS = "agent.js";
const CONFIG_SRC = "config.arm64.txt";
const CONFIG_DST = "config.txt";

function run(cmd) {
  execSync(cmd, { stdio: "inherit", cwd: __dirname });
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "revenge-build" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve, reject);
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const request = (u) => {
      https.get(u, { headers: { "User-Agent": "revenge-build" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
        file.on("error", reject);
      }).on("error", reject);
    };
    request(url);
  });
}

async function main() {
  const apkPath = path.join(__dirname, APK_INPUT);
  if (!fs.existsSync(apkPath)) {
    console.error(`ERROR: Place ${APK_INPUT} in the apk folder before building.`);
    process.exit(1);
  }

  try {
    execSync("frida-gadget --version", { stdio: "ignore" });
  } catch {
    console.error("ERROR: frida-gadget not found. Install with: pip install frida-gadget --upgrade");
    process.exit(1);
  }

  console.log(`Fetching latest release from ${REPO}...`);
  const releaseJson = JSON.parse(await fetch(`https://api.github.com/repos/${REPO}/releases/latest`));
  const tag = releaseJson.tag_name;
  console.log(`Latest release: ${tag}`);

  const downloadUrl = `https://github.com/${REPO}/releases/download/${tag}/${AGENT_JS}`;
  const agentPath = path.join(__dirname, AGENT_JS);
  console.log(`Downloading ${AGENT_JS}...`);
  await downloadFile(downloadUrl, agentPath);

  if (!fs.existsSync(agentPath) || fs.statSync(agentPath).size === 0) {
    console.error(`ERROR: Failed to download ${AGENT_JS}`);
    process.exit(1);
  }

  fs.copyFileSync(path.join(__dirname, CONFIG_SRC), path.join(__dirname, CONFIG_DST));
  console.log("Building ARM64 APK...");
  run(`frida-gadget ${APK_INPUT} --arch arm64 --config ${CONFIG_DST} --js ${AGENT_JS} --sign`);
  console.log("Built ARM64 APK for real Android devices.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
