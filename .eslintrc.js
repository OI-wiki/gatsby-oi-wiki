module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react'
  ],
  rules: {
    "react/prop-types": [0],
    "comma-dangle": [2, "always-multiline"]
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}
