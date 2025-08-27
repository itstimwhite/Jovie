const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ['eslint.config.js'],
  },
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:import/recommended'
  ),
  {
    rules: {
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
  },
];
