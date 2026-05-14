# Contributing to SafeTools

Thank you for your interest in contributing! SafeTools is a community-driven project focused on privacy and high-performance browser-based tools.

## Development Workflow

1.  **Fork and Clone**: Create a fork of the repository and clone it locally.
2.  **Branching**: Create a new branch for your feature or bugfix: `git checkout -b feature/my-new-feature`.
3.  **Install Dependencies**: `npm install`.
4.  **Development**: `npm run dev`.
5.  **Testing**: Ensure all tests pass: `npm test`.
6.  **Code Style**: We use Prettier and ESLint. Ensure your code is formatted: `npm run lint`.
7.  **Commit**: Use descriptive commit messages.

## PR Guidelines

- Include a clear description of the change.
- Link to any related issues.
- Add unit tests for new logic.
- Verify bundle size impact: `npm run size`.

## Local-First Rule

All new features **MUST** process data 100% locally in the browser. Any PR that introduces server-side processing of user files will be rejected unless there is a critical justification and clear user consent.
