import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier Rule: Report Prettier issues as ESLint errors
      'prettier/prettier': 'error',

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-explicit-any': ['error'],
      // '@typescript-eslint/explicit-function-return-type': ['warn'],

      // General ESLint rules
      'no-console': 'warn',
      'no-unused-vars': 'off', // Disable the base rule to avoid conflicts with TypeScript rule

      // Additional Recommended Rules
      eqeqeq: ['error', 'always'], // Enforce strict equality
      curly: ['error', 'all'], // Enforce consistent brace style for all control statements
      semi: ['error', 'always'], // Enforce semicolon usage
      quotes: ['error', 'single'], // Enforce single quotes
    },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
