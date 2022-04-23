/**
 * This cli config is needed for development purposes, e.g. for running
 * integration tests during local development or on CI services.
 */

const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const rnmPath = path.resolve(__dirname, 'node_modules/react-native-macos');

module.exports = {
  resolver: {
    extraNodeModules: {
      'react-native': rnmPath,
    },
    sourceExts: ['jsx','js'],
    platforms: ['macos', 'ios'],
    blacklistRE: exclusionList([/node_modules\/react-native\/.*/]),
  },
};
