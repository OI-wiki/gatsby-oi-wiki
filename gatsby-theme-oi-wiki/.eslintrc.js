/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    process: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'graphql',
  ],
  rules: {
    'react/prop-types': [0],
    'comma-dangle': [2, 'always-multiline'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
    ],
    '@typescript-eslint/explicit-function-return-type': [0],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/no-explicit-any': [0],
    'react/jsx-curly-brace-presence': [2, 'never'],
    'graphql/template-strings': ['error', {
      env: 'relay',
      tagName: 'graphql',
      schemaJsonFilepath: path.resolve(__dirname, 'src/__generated__/gatsby-introspection.json'),
    }],
  },
  ignorePatterns: ['.eslintrc.js'],
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn', {allowExpressions: true}],
        '@typescript-eslint/ban-ts-comment': [1],
        'no-undef': 'off'
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
