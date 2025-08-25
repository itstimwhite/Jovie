module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'no-secrets', 'import'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-secrets/no-secrets': 'error',
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.ts', '**/*.tsx'],
      rules: {
        'import/order': [
          'error',
          {
            'groups': [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index'
            ],
            'pathGroups': [
              {
                'pattern': '@/**',
                'group': 'internal',
                'position': 'after'
              }
            ],
            'alphabetize': {
              'order': 'asc',
              'caseInsensitive': true
            },
            'newlines-between': 'always'
          }
        ]
      }
    },
    {
      files: ['**/*.dev.js', '**/*.dev.ts', '**/*.dev.tsx'],
      rules: {
        'no-console': 'off'
      }
    }
  ],
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx']
      },
      'typescript': {
        'alwaysTryTypes': true
      }
    }
  }
};
