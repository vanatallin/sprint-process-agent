import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import functional from 'eslint-plugin-functional';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import type { Linter } from 'eslint';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      '*.min.js',
      'postcss.config.js',
      'tests/**/*.js',
      'vite.config.ts',
      'tailwind.config.ts',
      'eslint.config.ts',
      'backend/node_modules/',
      'backend/dist/'
    ]
  },

  // Base ESLint recommended
  eslint.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommendedTypeChecked,

  // Vue recommended
  ...(vue.configs['flat/recommended'] as Linter.Config[]),

  // Functional plugin
  functional.configs.externalVanillaRecommended,
  functional.configs.stylistic,

  // Prettier (must be last to override other formatting rules)
  prettier,

  // Global settings for all files
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      },
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json', './backend/tsconfig.json'],
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      functional
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],

      // Immutability rules
      'functional/prefer-immutable-types': ['error', {
        enforcement: 'Immutable',
        ignoreInferredTypes: true,
        ignoreClasses: true,
        ignoreNamePattern: ['^mut', '^_mutable', '^mutable'],
        ignoreTypePattern: [
          'Request', 'Response', 'S3Client', 'S3ClientConfig', 'SSMClient', 'Anthropic', 'Error', 'Date',
          'SprintHealthAnalysis', 'QualityResult', 'ActionItem', 'JiraSprintData', 'JiraTicket', 'JiraWorkload',
          'StaleTicket', 'WorkloadPerson', 'WorkloadAnalysis', 'CompletionPrediction', 'QualityIssue',
          'ScopeCreepItem', 'MissingRequirement', 'JiraComment', 'ClaudeMessageOptions', 'ClaudeContentBlock',
          'ClaudeResponse', 'StorageResult', 'StorageHealthCheck', 'LambdaEvent', 'LambdaResponse',
          'SprintReadiness', 'AnalysisResults', 'SlackBlock', 'AnalysisMetadata', 'TeamCapacity', 'SprintPrepData',
          'RawJiraTicket', 'ActionItemsResponse', 'Promise', 'void'
        ],
        parameters: {
          enforcement: 'Immutable',
          ignoreInferredTypes: true
        },
        returnTypes: {
          enforcement: 'Immutable',
          ignoreInferredTypes: true
        },
        variables: {
          enforcement: 'Immutable',
          ignoreInFunctions: true
        }
      }],
      'functional/no-let': 'error',
      'functional/immutable-data': ['error', {
        ignoreClasses: true,
        ignoreImmediateMutation: true
      }],
      'functional/prefer-readonly-type': ['error', {
        allowLocalMutation: true,
        allowMutableReturnType: false,
        ignoreCollections: false
      }],
      'functional/readonly-type': 'off',
      '@typescript-eslint/no-misused-promises': ['error', {
        checksVoidReturn: {
          arguments: false
        }
      }],
      '@typescript-eslint/require-await': 'off',

      // Vue rules
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'error',
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-based']
    }
  },

  // Vue files - use vue-eslint-parser
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.json', './tsconfig.app.json'],
        extraFileExtensions: ['.vue']
      }
    },
    rules: {
      'functional/no-let': 'off',
      'functional/immutable-data': 'off',
      'functional/prefer-readonly-type': 'off',
      'functional/prefer-immutable-types': 'off'
    }
  },

  // Backend files
  {
    files: ['backend/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node
      },
      parserOptions: {
        project: ['./backend/tsconfig.json']
      }
    },
    rules: {
      'no-console': 'off'
    }
  },

  // Test files
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'functional/no-let': 'off',
      'functional/immutable-data': 'off',
      'functional/prefer-immutable-types': 'off',
      'functional/prefer-readonly-type': 'off'
    }
  },

  // JavaScript/CommonJS files
  {
    files: ['**/*.js', '**/*.cjs'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'functional/no-let': 'off',
      'functional/immutable-data': 'off',
      'functional/prefer-immutable-types': 'off',
      'functional/prefer-readonly-type': 'off'
    }
  },

  // Composables and main.ts (Vue-specific)
  {
    files: ['src/composables/**/*.ts', 'src/main.ts'],
    rules: {
      'functional/immutable-data': 'off',
      'functional/prefer-immutable-types': 'off',
      'functional/prefer-readonly-type': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off'
    }
  },

  // Config files
  {
    files: ['**/*.config.ts', '**/jest.config.ts'],
    rules: {
      'functional/prefer-immutable-types': 'off'
    }
  },

  // Utility files that need Map/cache mutations
  {
    files: ['backend/src/utils/ssm.ts', 'backend/src/integrations/jira/index.ts'],
    rules: {
      'functional/immutable-data': 'off'
    }
  }
);
