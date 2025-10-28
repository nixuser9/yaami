# Contributing to Yaami

Thank you for your interest in contributing to Yaami! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/nixuser9/yaami/issues)
- If not, create a new issue with:
  - Clear title and description
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable
  - Your environment (OS, Node version, etc.)

### Suggesting Features

- Check existing feature requests in [Issues](https://github.com/nixuser9/yaami/issues)
- Create a new issue with the `enhancement` label
- Describe the feature and its use case
- Explain why it would be useful

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test your changes thoroughly
5. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/yaami.git
cd yaami

# Install dependencies
npm install

# Run development server
npm run dev
```

### Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Test your changes on your platform
- If possible, test on multiple platforms (macOS, Windows, Linux)
- Ensure no existing functionality is broken

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Reference issues and pull requests when relevant
- Keep first line under 72 characters

## Protocol Implementation

If you're adding a new protocol:

1. Create a service class in `src/main/services/`
2. Implement the required interface methods
3. Add IPC handlers in `src/main/main.ts`
4. Expose API in `src/main/preload.ts`
5. Add TypeScript types in `src/renderer/types.d.ts`
6. Update UI components as needed
7. Update README.md with protocol details

## Questions?

Feel free to open an issue for any questions or clarifications.

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
