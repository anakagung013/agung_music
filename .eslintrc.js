module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended'
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 12,
      sourceType: 'module'
    },
    plugins: [
      'react',
      'react-hooks'
    ],
    rules: {
      // Custom rules
      'react/prop-types': 'warn',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }