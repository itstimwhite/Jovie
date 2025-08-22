/**
 * ESLint rules for feature flags
 * 
 * This file contains custom ESLint rules to enforce best practices for feature flags.
 * Include this in your .eslintrc.js file to enable these rules.
 */

module.exports = {
  rules: {
    // Prevent direct access to feature flags without using the proper hooks
    'no-direct-feature-flag-access': {
      create: function (context) {
        return {
          MemberExpression(node) {
            if (
              node.object.type === 'Identifier' &&
              node.object.name === 'flags' &&
              node.parent.type !== 'VariableDeclarator' &&
              !context.getScope().references.some(ref => 
                ref.identifier.name === 'useFeatureFlags' || 
                ref.identifier.name === 'getServerFeatureFlags'
              )
            ) {
              context.report({
                node,
                message: 'Direct access to feature flags is not allowed. Use useFeatureFlags() or getServerFeatureFlags() instead.',
              });
            }
          },
        };
      },
    },
    
    // Enforce feature flag naming conventions
    'feature-flag-naming-convention': {
      create: function (context) {
        return {
          Property(node) {
            if (
              node.parent.type === 'ObjectExpression' &&
              node.parent.parent.type === 'VariableDeclarator' &&
              node.parent.parent.id.name === 'defaultFeatureFlags'
            ) {
              const propertyName = node.key.name || node.key.value;
              
              // Check if the flag name follows camelCase and ends with 'Enabled' for boolean flags
              if (
                typeof propertyName === 'string' &&
                node.value.type === 'Literal' &&
                typeof node.value.value === 'boolean' &&
                !propertyName.match(/^[a-z][a-zA-Z0-9]*Enabled$/)
              ) {
                context.report({
                  node,
                  message: 'Boolean feature flag names should be camelCase and end with "Enabled"',
                });
              }
            }
          },
        };
      },
    },
    
    // Ensure feature flags are properly typed
    'feature-flag-type-safety': {
      create: function (context) {
        return {
          TSPropertySignature(node) {
            if (
              node.parent.type === 'TSInterfaceBody' &&
              node.parent.parent.type === 'TSInterfaceDeclaration' &&
              node.parent.parent.id.name === 'FeatureFlags'
            ) {
              const flagName = node.key.name;
              const typeAnnotation = node.typeAnnotation?.typeAnnotation;
              
              // Check if the flag has a boolean type annotation
              if (
                typeAnnotation &&
                typeAnnotation.type !== 'TSBooleanKeyword' &&
                !context.getSourceCode().getText(typeAnnotation).includes('boolean')
              ) {
                context.report({
                  node,
                  message: 'Feature flags should have boolean type annotations',
                });
              }
              
              // Check if the flag has a JSDoc comment
              const comments = context.getSourceCode().getCommentsBefore(node);
              if (!comments.some(comment => comment.type === 'Block' && comment.value.startsWith('*'))) {
                context.report({
                  node,
                  message: 'Feature flags should have JSDoc comments describing their purpose',
                });
              }
            }
          },
        };
      },
    },
  },
};
