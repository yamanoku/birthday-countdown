// @ts-check
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['src/main.ts'],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: true,
    },
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/indent": ["error", 2],
  },
});