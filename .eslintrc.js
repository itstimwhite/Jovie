module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
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
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
