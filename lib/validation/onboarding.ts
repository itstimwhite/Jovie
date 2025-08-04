import { z } from 'zod';

export const onboardingSchema = z.object({
  handle: z
    .string()
    .min(3, { message: 'Must be at least 3 characters' })
    .max(24, { message: 'Must be no more than 24 characters' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Only lowercase letters, numbers, and hyphens are allowed',
    }),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;
