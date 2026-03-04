/**
 * Syncs the version from package.json into app.json after a version bump.
 * Run automatically via the "postversion" npm script.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const pkgPath = path.join(rootDir, 'package.json');
const appJsonPath = path.join(rootDir, 'app.json');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

const newVersion = pkg.version;
const oldVersion = appJson.expo.version;

if (oldVersion === newVersion) {
  console.log(`app.json version already at ${newVersion} — no update needed.`);
  process.exit(0);
}

appJson.expo.version = newVersion;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n', 'utf8');

console.log(`app.json version synced: ${oldVersion} → ${newVersion}`);
