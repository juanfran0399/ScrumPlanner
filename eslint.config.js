import globals from 'globals'
import tsParser from '@typescript-eslint/parser'

export default {
  parser: tsParser,
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'standard',
    'prettier'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: tsParser,
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended']
    },
    {
      files: ['**/*.jsx', '**/*.js'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  ],
  languageOptions: {
    globals: { ...globals.browser, ...globals.node }
  },
  rules: {
    'react/react-in-jsx-scope': 'off'
  }
}
