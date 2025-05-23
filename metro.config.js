const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support for web
  isCSSEnabled: true,
});

// Handle TypeScript and other file extensions
config.resolver.sourceExts = [
  'js',
  'jsx',
  'json',
  'ts',
  'tsx',
  'cjs',
  'mjs',
  'd.ts',
];

config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

config.watchFolders = [__dirname + '/src'];

config.resolver.nodeModulesPaths = [__dirname + '/node_modules'];

config.transpilePackages = ['expo-modules-core'];

module.exports = config;
