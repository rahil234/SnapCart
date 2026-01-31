import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default defineConfig([
  {
    // Ignore your own config file so ESLint doesn't lint itself
    ignores: ['eslint.config.mjs'],
  },

  {
    // Base ESLint JS rules
    ...eslint.configs.recommended,
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirent ?? process.cwd(),
      },
    },
    rules: {
      // Prettier integration
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 80,
          tabWidth: 2,
          bracketSpacing: true,
          semi: true,
        },
      ],

      /**
       * Naming Convention Rule
       * You must include a "default" selector first when overriding this rule,
       * because TypeScript-ESLint has no defaults if you override it completely.  [oai_citation:2‡Reddit](https://www.reddit.com/r/typescript/comments/nbj7dm/question_how_to_overwrite_the_default/?utm_source=chatgpt.com)
       */
      // '@typescript-eslint/naming-convention': [
      //   'error',
      //   // Default rule — anything not otherwise specified
      //   {
      //     selector: 'default',
      //     format: ['camelCase'],
      //     leadingUnderscore: 'allow',
      //   },
      //
      //   // Class properties: private with underscore
      //   {
      //     selector: 'classProperty',
      //     modifiers: ['private'],
      //     format: ['camelCase'],
      //     leadingUnderscore: 'require',
      //   },
      //
      //   // Class properties: public no underscore
      //   {
      //     selector: 'classProperty',
      //     modifiers: ['public'],
      //     format: ['camelCase'],
      //     leadingUnderscore: 'forbid',
      //   },
      //
      //   // Variables: allow camelCase or UPPER_CASE
      //   {
      //     selector: 'variable',
      //     format: ['camelCase', 'UPPER_CASE'],
      //     leadingUnderscore: 'allow',
      //   },
      //
      //   // Types/interfaces should be PascalCase
      //   {
      //     selector: 'typeLike',
      //     format: ['PascalCase'],
      //   },
      // ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },

  // Prettier recommended config must go last
  eslintPluginPrettierRecommended,
]);
