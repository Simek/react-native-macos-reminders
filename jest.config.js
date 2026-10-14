module.exports = {
  preset: 'react-native-macos',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^react-native$': 'react-native-macos',
    '^react-native/(.*)$': 'react-native-macos/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-macos|@react-native-macos|@react-native|@rn-macos)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
