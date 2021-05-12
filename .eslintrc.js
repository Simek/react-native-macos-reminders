module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['plugin:prettier/recommended', '@react-native-community'],
  rules: {
    'react-native/no-inline-styles': 'off',
  },
};
