// eslint.config.mjs
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import cypressPlugin from 'eslint-plugin-cypress';
import jestPlugin from 'eslint-plugin-jest';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import babelEslintParser from '@babel/eslint-parser';

export default defineConfig([
  // GLOBAL IGNORES
  {
    ignores: [
      'dist',
      'build',
      'node_modules',
      'test-coverage',
      'coverage',
      '**/__tests__/**',
      '**/__tests/',
      'test/**',
      'tests/**',
      'cypress/**',
      '**/test/**',
      '**/tests/__mocks__/**',
      '**/*.test.jsx',
      '**/*.test.js',
      '**/*.spec.jsx',
      '**/*.spec.js',
      '**/*.config.js',
      '**/*setupTests.js'
    ]
  },

  // 1) MAIN JS/JSX (app) - babel parser with JSX
  {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
      parser: babelEslintParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        babelOptions: { presets: ['@babel/preset-react'] }
      },
      globals: {
        ...globals.browser,
        React: 'readonly'
      }
    },

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin
    },

    // Base rules and sensible project overrides
    rules: {
      // include ESLint recommended JS rules
      ...js.configs.recommended.rules,

      // include plugin recommended rule sets if available
      ...(reactPlugin.configs?.recommended?.rules || {}),
      ...(reactHooksPlugin.configs?.recommended?.rules || {}),
      ...(jsxA11yPlugin.configs?.recommended?.rules || {}),

      // project-level preferences
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true, varsIgnorePattern: '^[A-Z_]' }],
      'react/prop-types': 'off', // if you use TS or PropTypes not needed
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'jsx-a11y/label-has-associated-control': ['error', { depth: 3 }],
      'jsx-a11y/anchor-is-valid': ['warn', { components: ['Link'], aspects: ['noHref', 'invalidHref'] }],
      // import rules
      'import/no-unresolved': 'error',
      'import/order': ['warn', { 'newlines-between': 'always', groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']] }]
    },

    settings: {
      react: { version: 'detect' },
      // import/resolver can be customized if you use aliases (vite alias, etc.)
      // Example resolver for node (keeps things fast); if you use alias add plugin-resolver config
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] }
      }
    }
  },

  // 2) JEST / React Testing Library files (unit tests)
  {
    files: ['**/*.{spec,test}.{js,jsx}', '**/__tests__/**', '**/*.{test,spec}.js', '**/*.{test,spec}.jsx'],
    languageOptions: {
      parser: babelEslintParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        babelOptions: { presets: ['@babel/preset-react'] }
      },
      globals: {
        ...jestPlugin.environments.globals.globals,
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      jest: jestPlugin,
      'testing-library': testingLibraryPlugin,
      react: reactPlugin
    },
    rules: {
      // jest recommended + testing-library best practices
      ...(jestPlugin.configs?.recommended?.rules || {}),
      ...(testingLibraryPlugin.configs?.recommended?.rules || {}),

      // tests often import devDeps — allow that
      'import/no-extraneous-dependencies': 'off', // we handle via override to allow dev deps in test files
      'no-unused-expressions': 'off' // chai-style, sometimes used in tests
    }
  },

  // 3) Cypress E2E files
    {
    // only target the actual E2E test specs (adjust to your cypress layout)
    files: ['cypress/e2e/**/*.{js,jsx}', 'cypress/e2e/**/*.cy.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...(cypressPlugin.environments?.globals?.globals || {}),
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        require: 'readonly'
      }
    },
    plugins: {
      cypress: cypressPlugin
    },
    rules: {
      // opt-in: allow certain patterns common in E2E
      'import/no-extraneous-dependencies': 'off'
    }
  },

  // 4) Config / build / script files (allow dev deps)
  {
    files: ['*.config.{js,mjs,cjs}', 'vite.config.{js,mjs,cjs}', 'cypress.config.{js,mjs,cjs}', '.husky/**'],
    languageOptions: {
      parser: babelEslintParser,
      parserOptions: { requireConfigFile: false, ecmaVersion: 'latest', sourceType: 'module' },
    },
    rules: {
      'import/no-extraneous-dependencies': 'off'
    }
  }
]);
