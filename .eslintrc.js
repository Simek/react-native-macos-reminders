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
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@ui/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
