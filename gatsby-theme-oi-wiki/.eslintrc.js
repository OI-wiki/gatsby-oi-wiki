const path = require('path')

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:promise/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    MathJax: 'readonly',
    process: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react',
    'graphql',
  ],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'semi': ['error', 'never', { 'beforeStatementContinuationChars': 'always' }],
    'react/prop-types': [0],
    'comma-dangle': [2, 'always-multiline'],
    'no-unused-vars': 'warn',
    'react/jsx-curly-brace-presence': [2, 'never'],
    'graphql/template-strings': ['error', {
      env: 'relay',
      tagName: 'graphql',
      schemaJsonFilepath: path.resolve(__dirname, 'src/__generated__/gatsby-introspection.json'),
    }],
    'promise/always-return': 'off',
    'promise/catch-or-return': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      plugins: [
        '@typescript-eslint',
      ],
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
        '@typescript-eslint/ban-ts-comment': [1],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
        ],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/no-explicit-any': [0],
      },
    },
    {
      files: [
        '.eslintrc.js',
        'gatsby-config.js',
        'gatsby-node.js',
        'gatsby-ssr.js',
      ],
      env: {
        node: true,
      },
      extends: [
        'plugin:node/recommended',
      ],
      rules: {
        'node/no-unsupported-features/node-builtins': ['error', {
          'version': '>=16.0.0',
        }],
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
