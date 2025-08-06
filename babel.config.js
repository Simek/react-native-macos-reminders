module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '~': './src',
          '@ui': './src/components/ui',
        },
      },
    ],
  ],
};
