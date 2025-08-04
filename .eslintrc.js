module.exports = {
  root: true,
  extends: ['universe/native', 'universe/node'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          'react-native',
          {
            name: 'react',
            importNames: ['default'],
            message: 'Use named imports instead.',
          },
        ],
      },
    ],
    'react-native/no-inline-styles': 'off',
  },
};
