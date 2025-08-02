# Contributing to Jovie

Thank you for your interest in contributing to Jovie! This document provides guidelines and information about contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- A GitHub account

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/jovie.git
   cd jovie
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables (see README.md for details)
5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Before Making Changes

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
2. Make sure your local main branch is up to date:
   ```bash
   git checkout main
   git pull upstream main
   ```

### Making Changes

1. Make your changes following our coding standards (see below)
2. Add tests for new functionality
3. Ensure all tests pass:
   ```bash
   npm run test
   npm run test:e2e
   ```
4. Run linting and type checking:
   ```bash
   npm run lint
   npm run typecheck
   ```
5. Format your code:
   ```bash
   npm run format
   ```

### Submitting Changes

1. Commit your changes with a descriptive message:
   ```bash
   git add .
   git commit -m "feat: add new artist profile customization options"
   ```
2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Create a Pull Request on GitHub

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use proper generics where applicable

### React/Next.js

- Use functional components with hooks
- Follow the established component structure
- Use proper prop types
- Implement proper error boundaries where needed

### CSS/Styling

- Use Tailwind CSS classes
- Follow the established design system
- Ensure responsive design
- Test in both light and dark modes

### File Structure

- Follow the established folder structure
- Use proper naming conventions:
  - Components: PascalCase (e.g., `ProfileHeader.tsx`)
  - Utilities: camelCase (e.g., `extractSpotifyId.ts`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_SOCIAL_LINKS`)

## Commit Message Guidelines

We follow conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:

- `feat: add social media link management`
- `fix: resolve profile image loading issue`
- `docs: update API documentation`

## Testing Guidelines

### Unit Tests

- Write unit tests for utility functions
- Test component rendering and behavior
- Use descriptive test names
- Aim for good coverage of critical paths

### End-to-End Tests

- Test complete user workflows
- Cover critical features like authentication and profile creation
- Ensure tests are reliable and not flaky

## Pull Request Guidelines

### Before Submitting

- Ensure your PR has a clear title and description
- Link to any related issues
- Make sure all tests pass
- Ensure your code follows the established patterns

### PR Description Template

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots to help explain your changes

## Additional Notes

Any additional information about the changes
```

## Code Review Process

1. PRs require at least one approval before merging
2. All automated checks must pass
3. Address any feedback promptly
4. Keep discussions constructive and professional

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, browser, etc.)
- Screenshots if applicable

### Feature Requests

For feature requests, please provide:

- Clear description of the desired functionality
- Use case and motivation
- Any relevant mockups or examples
- Discussion of implementation approach

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's code of conduct

## Questions and Support

- Check existing issues and PRs first
- Use GitHub Discussions for questions
- Join our community channels for real-time help

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- Project documentation

Thank you for contributing to Jovie! 🎵
