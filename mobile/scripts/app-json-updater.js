/**
 * Custom standard-version updater for app.json.
 * Reads and writes the expo.version field.
 */
module.exports.readVersion = function (contents) {
  return JSON.parse(contents).expo.version;
};

module.exports.writeVersion = function (contents, version) {
  const appJson = JSON.parse(contents);
  appJson.expo.version = version;
  return JSON.stringify(appJson, null, 2) + '\n';
};
