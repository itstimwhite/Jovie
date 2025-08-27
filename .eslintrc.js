module.exports = {
  extends: ['next/core-web-vitals', 'prettier', 'plugin:import/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@/lib/supabase',
            message:
              "Client-side Supabase is deprecated. Use server-only helpers from '@/lib/supabase/client' or server routes/actions.",
          },
          {
            name: '@clerk/clerk-react',
            message:
              'Use @clerk/nextjs in the App Router. Import components/hooks from @clerk/nextjs or @clerk/nextjs/server only.',
          },
        ],
      },
    ],

    // Prevent duplicate imports
    'no-duplicate-imports': 'error',
    'import/no-duplicates': 'error',

    // Prevent cycles
    'import/no-cycle': 'error',

    // Prevent sql alias collision
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "ImportSpecifier[imported.name='sql'][local.name='sql'][parent.source.value='drizzle-orm']",
        message:
          "Alias drizzle's sql as drizzleSql to avoid conflicts with Neon client.",
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
