module.exports = {
  "extends": [
    '@react-native-community',
    'plugin:react-native-a11y/basic',
    'plugin:prettier/recommended',
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "plugins": ["@typescript-eslint", "react", "prettier", 'prefer-smart-quotes', 'unused-imports'],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {
    'react-native-a11y/has-accessibility-hint': 'off',
    'react-native-a11y/has-valid-accessibility-state': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'prefer-smart-quotes/prefer': ['error', 'all'],
    'unused-imports/no-unused-imports': 'error',
    "import/no-unresolved": 0,
    "react/jsx-filename-extension": [1, {
      "extensions": [
        ".ts",
        ".tsx"
      ]
    }],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "import/extensions": ["error", "never"],
    "react/prop-types": 0,
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"]
  }
}
