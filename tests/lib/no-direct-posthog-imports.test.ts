import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('No direct posthog-js imports', () => {
  it('should not have any direct imports of posthog-js outside of lib/analytics.ts', async () => {
    // Run grep to find all imports of posthog-js
    const { stdout } = await execAsync(
      'grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" "from \'posthog-js\'" .'
    );

    // Split the results by line
    const lines = stdout.split('\n').filter(Boolean);

    // Filter out the allowed imports (in lib/analytics.ts)
    const disallowedImports = lines.filter(
      (line) => !line.includes('lib/analytics.ts')
    );

    // Log the disallowed imports for debugging
    if (disallowedImports.length > 0) {
      console.error(
        'Found direct imports of posthog-js outside of lib/analytics.ts:'
      );
      disallowedImports.forEach((line) => console.error(line));
    }

    // Expect no disallowed imports
    expect(disallowedImports).toHaveLength(0);
  });

  it('should not have any direct usage of posthog outside of lib/analytics.ts', async () => {
    // Run grep to find all usages of posthog
    const { stdout } = await execAsync(
      'grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" "posthog\\." .'
    );

    // Split the results by line
    const lines = stdout.split('\n').filter(Boolean);

    // Filter out the allowed usages (in lib/analytics.ts)
    const disallowedUsages = lines.filter(
      (line) => !line.includes('lib/analytics.ts') && !line.includes('tests/')
    );

    // Log the disallowed usages for debugging
    if (disallowedUsages.length > 0) {
      console.error(
        'Found direct usage of posthog outside of lib/analytics.ts:'
      );
      disallowedUsages.forEach((line) => console.error(line));
    }

    // Expect no disallowed usages
    expect(disallowedUsages).toHaveLength(0);
  });
});
