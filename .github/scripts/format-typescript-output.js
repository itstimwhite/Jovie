#!/usr/bin/env node

/**
 * This script formats TypeScript output for better readability in GitHub job summaries.
 * It extracts the most important information and formats it in a concise way.
 *
 * Usage: node format-typescript-output.js < typecheck-output.log > formatted-output.md
 */

const fs = require('fs');

// Read from stdin
let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  const lines = input.split('\n');
  let output = '## TypeScript Errors Summary\n\n';

  // Extract error count
  const errorCountLine = lines.find(
    (line) => line.includes('Found') && line.includes('error')
  );
  if (errorCountLine) {
    output += `### Overview\n\n${errorCountLine.trim()}\n\n`;
  }

  output += '### Details\n\n';

  // Group errors by file
  const fileErrors = {};
  let currentFile = null;
  let currentError = null;

  lines.forEach((line) => {
    // Check if line contains a file path with line and column
    const fileMatch = line.match(/^(.+\.tsx?)\((\d+),(\d+)\):/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      const lineNum = fileMatch[2];
      const colNum = fileMatch[3];
      const message = line.split(':').slice(1).join(':').trim();

      if (!fileErrors[currentFile]) {
        fileErrors[currentFile] = [];
      }

      currentError = {
        line: lineNum,
        column: colNum,
        message,
        details: [],
      };

      fileErrors[currentFile].push(currentError);
    } else if (
      currentError &&
      line.trim() &&
      !line.includes('Found') &&
      !line.includes('error TS')
    ) {
      // Add details to the current error
      currentError.details.push(line.trim());
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
