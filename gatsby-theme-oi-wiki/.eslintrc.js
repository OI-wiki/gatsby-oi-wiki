module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/prop-types': [0],
    'comma-dangle': [2, 'always-multiline'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
    ],
    '@typescript-eslint/explicit-function-return-type': [0],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/no-explicit-any': [0],
    'react/jsx-curly-brace-presence': [2, 'never'],
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
        '@typescript-eslint/no-unused-vars': [1],
        '@typescript-eslint/ban-ts-comment': [1],
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
