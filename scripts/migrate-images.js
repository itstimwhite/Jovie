#!/usr/bin/env node

/**
 * Automated script to migrate direct next/image usage to OptimizedImage/OptimizedAvatar
 * 
 * Usage:
 *   node scripts/migrate-images.js [--dry-run] [--path=<path>]
 * 
 * Options:
 *   --dry-run    Don't modify files, just show what would be changed
 *   --path       Specify a path to scan (default: components/)
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const pathArg = args.find(arg => arg.startsWith('--path='));
const scanPath = pathArg ? pathArg.split('=')[1] : 'components/';

console.log(`Scanning ${scanPath} for direct next/image usage...`);
if (dryRun) {
  console.log('DRY RUN: No files will be modified');
}

// Find all files with direct next/image imports
const findDirectImports = () => {
  try {
    const result = execSync(
      `grep -r "import Image from 'next/image'" --include="*.tsx" ${scanPath}`,
      { encoding: 'utf-8' }
    );
    
    return result
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [filePath] = line.split(':');
        return filePath;
      });
  } catch (error) {
    if (error.status === 1) {
      // grep returns 1 when no matches found
      return [];
    }
    throw error;
  }
};

// Process a file to migrate next/image to OptimizedImage/OptimizedAvatar
const processFile = (filePath) => {
  console.log(`Processing ${filePath}...`);
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if file contains Image component usage
  if (!content.includes('<Image')) {
    console.log(`  No <Image> component usage found, skipping`);
    return;
  }
  
  // Determine if this file is more likely to need OptimizedImage or OptimizedAvatar
  const isLikelyAvatar = 
    filePath.toLowerCase().includes('avatar') || 
    filePath.toLowerCase().includes('profile') ||
    content.includes('rounded-full') ||
    (content.includes('width={') && content.includes('height={') && 
     content.match(/width={\s*(\d+)\s*}/)?.[1] === content.match(/height={\s*(\d+)\s*}/)?.[1]);
  
  // Replace the import
  let newContent = content.replace(
    /import Image from ['"]next\/image['"];?/,
    isLikelyAvatar 
      ? `import { OptimizedAvatar } from '@/components/ui/OptimizedAvatar';`
      : `import { OptimizedImage } from '@/components/ui/OptimizedImage';`
  );
  
  // Replace Image components with OptimizedImage/OptimizedAvatar
  if (isLikelyAvatar) {
    // For avatar-like images
    newContent = replaceAvatarComponents(newContent);
  } else {
    // For general images
    newContent = replaceImageComponents(newContent);
  }
  
  // Write changes if not in dry run mode
  if (!dryRun && newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`  Updated ${filePath}`);
  } else if (newContent !== content) {
    console.log(`  Would update ${filePath} (dry run)`);
  } else {
    console.log(`  No changes needed for ${filePath}`);
  }
};

// Replace Image components with OptimizedAvatar
const replaceAvatarComponents = (content) => {
  // This is a simplified replacement that handles common patterns
  // More complex cases will need manual intervention
  
  return content.replace(
    /<Image\s+src={([^}]+)}\s+alt={([^}]+)}\s+width={(\d+)}\s+height={(\d+)}([^>]*)\/>/g,
    (match, src, alt, width, height, rest) => {
      // Check if width and height are the same (avatar)
      if (width === height) {
        return `<OptimizedAvatar src={${src}} alt={${alt}} size={${width}}${rest}/>`;
      }
      return match; // Keep original if not a square image
    }
  );
};

// Replace Image components with OptimizedImage
const replaceImageComponents = (content) => {
  // This is a simplified replacement that handles common patterns
  // More complex cases will need manual intervention
  
  return content.replace(
    /<Image\s+src={([^}]+)}\s+alt={([^}]+)}\s+width={(\d+)}\s+height={(\d+)}([^>]*)\/>/g,
    (match, src, alt, width, height, rest) => {
      // Calculate aspect ratio if possible
      let aspectRatioProp = '';
      const w = parseInt(width, 10);
      const h = parseInt(height, 10);
      
      if (w && h) {
        if (w === h) {
          aspectRatioProp = ' aspectRatio="square"';
        } else if (Math.abs(w/h - 16/9) < 0.1) {
          aspectRatioProp = ' aspectRatio="video"';
        } else if (Math.abs(w/h - 4/5) < 0.1) {
          aspectRatioProp = ' aspectRatio="portrait"';
        } else if (Math.abs(w/h - 21/9) < 0.1) {
          aspectRatioProp = ' aspectRatio="wide"';
        }
      }
      
      return `<OptimizedImage src={${src}} alt={${alt}} width={${width}} height={${height}}${aspectRatioProp}${rest}/>`;
    }
  );
};

// Main execution
const filesToProcess = findDirectImports();

if (filesToProcess.length === 0) {
  console.log('No files with direct next/image imports found.');
} else {
  console.log(`Found ${filesToProcess.length} files with direct next/image imports.`);
  filesToProcess.forEach(processFile);
  
  console.log('\nMigration complete!');
  if (dryRun) {
    console.log('This was a dry run. Run without --dry-run to apply changes.');
  } else {
    console.log('Please review the changes and test thoroughly before committing.');
  }
  
  console.log('\nNote: This script handles simple cases only. Complex components may need manual migration.');
}
