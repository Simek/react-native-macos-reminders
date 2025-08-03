module.exports = {
  root: true,
  extends: ['universe/native', 'universe/node'],
  rules: {
    'no-restricted-imports': ['error', 'react-native'],
    'react-native/no-inline-styles': 'off',
  },
};
