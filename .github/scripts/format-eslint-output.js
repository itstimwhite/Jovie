#!/usr/bin/env node

/**
 * This script formats ESLint output for better readability in GitHub job summaries.
 * It extracts the most important information and formats it in a concise way.
 *
 * Usage: node format-eslint-output.js < eslint-output.log > formatted-output.md
 */

const fs = require('fs');

// Read from stdin
let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  const lines = input.split('\n');
  let output = '## ESLint Errors Summary\n\n';

  // Extract error and warning counts
  const summaryLine = lines.find(
    (line) =>
      line.includes('problems') &&
      (line.includes('error') || line.includes('warning'))
  );
  if (summaryLine) {
    output += `### Overview\n\n${summaryLine.trim()}\n\n`;
  }

  output += '### Details\n\n';

  // Group errors by file
  const fileErrors = {};
  let currentFile = null;

  lines.forEach((line) => {
    // Check if line contains a file path
    if (line.match(/^[\/\w\.-]+\.(js|jsx|ts|tsx):/)) {
      const fileParts = line.split(':');
      currentFile = fileParts[0];

      if (!fileErrors[currentFile]) {
        fileErrors[currentFile] = [];
      }

      // Extract line and column numbers
      const lineNum = fileParts[1];
      const colNum = fileParts[2];
      const message = fileParts.slice(3).join(':').trim();

      fileErrors[currentFile].push({
        line: lineNum,
        column: colNum,
        message,
      });
    }
  });

  // Format errors by file
  Object.keys(fileErrors).forEach((file) => {
    output += `#### ${file}\n\n`;
    output += '| Line | Column | Message |\n';
    output += '| ---- | ------ | ------- |\n';

    fileErrors[file].forEach((error) => {
      output += `| ${error.line} | ${error.column} | ${error.message} |\n`;
    });

    output += '\n';
  });

  // Write to stdout
  process.stdout.write(output);
});
