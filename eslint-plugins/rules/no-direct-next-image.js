/**
 * @fileoverview Rule to disallow direct imports of next/image
 * @author Codegen
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow direct imports of next/image",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    schema: [], // no options
    messages: {
      noDirectNextImage: "Direct import of next/image is not allowed. Use OptimizedImage or OptimizedAvatar from '@/components/ui' instead.",
    },
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        // Check if this is importing from 'next/image'
        if (node.source.value === 'next/image') {
          // Check if this is importing the default export (Image)
          const defaultImport = node.specifiers.find(
            (specifier) => specifier.type === 'ImportDefaultSpecifier'
          );

          if (defaultImport) {
            context.report({
              node,
              messageId: "noDirectNextImage",
              fix(fixer) {
                // Suggest importing OptimizedImage as a replacement
                return fixer.replaceText(
                  node,
                  "import { OptimizedImage, OptimizedAvatar } from '@/components/ui';"
                );
              },
            });
          }
        }
      },
    };
  },
};

