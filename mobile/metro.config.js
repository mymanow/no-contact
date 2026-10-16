const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);
// tailwind.config.js lit ../replica/design/tokens.json
config.watchFolders = [path.resolve(__dirname, "../replica/design")];
module.exports = withNativeWind(config, { input: "./global.css" });
