const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for more file extensions
config.resolver.assetExts.push(
  // Adds support for additional asset files
  'db', 'mp3', 'ttf', 'obj', 'png', 'jpg'
);

// NativeWind support
config.resolver.alias = {
  '@': './src',
};

module.exports = config;