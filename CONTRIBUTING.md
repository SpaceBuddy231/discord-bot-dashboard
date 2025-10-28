# Contributing Guide

Thank you for your interest in contributing to this project! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Wie kann ich beitragen?](#wie-kann-ich-beitragen)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

Bitte lies und befolge unseren [Code of Conduct](./CODE_OF_CONDUCT.md) um eine freundliche und respektvolle Community zu gewährleisten.

## Wie kann ich beitragen?

### 🐛 Bug Reports

Wenn du einen Bug findest:
1. Prüfe ob der Bug bereits gemeldet wurde
2. Erstelle ein neues Issue mit dem "bug" Label
3. Beschreibe das Problem ausführlich:
   - Schritte zur Reproduktion
   - Erwartetes Verhalten
   - Tatsächliches Verhalten
   - Screenshots (falls relevant)
   - Environment Details (OS, Node Version, etc.)

### ✨ Feature Requests

Für neue Features:
1. Prüfe ob das Feature bereits vorgeschlagen wurde
2. Erstelle ein neues Issue mit dem "enhancement" Label
3. Beschreibe:
   - Was soll das Feature tun?
   - Warum ist es nützlich?
   - Wie könnte es implementiert werden?

### 📝 Documentation

Documentation Improvements sind immer willkommen:
- README Verbesserungen
- Code Kommentare
- API Documentation
- Tutorials & Guides

### 💻 Code Contributions

1. Fork das Repository
2. Clone deinen Fork
3. Erstelle einen Branch für deine Änderungen
4. Mache deine Änderungen
5. Teste deine Änderungen
6. Committe und pushe
7. Erstelle einen Pull Request

## Development Setup

### Voraussetzungen

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker & Docker Compose (optional aber empfohlen)
- Git

### Setup

```bash
# Repository forken und klonen
git clone https://github.com/YOUR_USERNAME/discord-bot-dashboard.git
cd discord-bot-dashboard

# Dependencies installieren
npm install

# Environment Setup
cp .env.example .env
# Bearbeite .env mit deinen Credentials

# Development Server starten
docker-compose up -d
# ODER
npm run dev
```

### Tests ausführen

```bash
# Alle Tests
npm run test

# Spezifisches Modul
npm run test --workspace=bot

# Mit Coverage
npm run test:coverage

# Watch Mode
npm run test:watch
```

## Coding Standards

### TypeScript

- Nutze **TypeScript** für alle neuen Dateien
- Aktiviere strict mode
- Vermeide `any` - nutze proper types
- Dokumentiere komplexe Typen mit Comments

### Code Style

Wir nutzen ESLint und Prettier:

```bash
# Linting
npm run lint

# Auto-fix
npm run lint:fix

# Formatting
npm run format
```

### Naming Conventions

- **camelCase**: Variablen, Funktionen
- **PascalCase**: Klassen, Interfaces, Components
- **UPPER_CASE**: Konstanten
- **kebab-case**: Dateien, CSS-Klassen

### File Organization

```typescript
// 1. External imports
import express from 'express';
import { Router } from 'express';

// 2. Internal imports (alphabetically)
import { authMiddleware } from '../middleware';
import logger from '../utils/logger';

// 3. Types & Interfaces
interface MyInterface {
  // ...
}

// 4. Constants
const MAX_RETRIES = 3;

// 5. Main code
export class MyClass {
  // ...
}
```

### Comments & Documentation

```typescript
/**
 * Beschreibung der Funktion
 * @param paramName - Beschreibung des Parameters
 * @returns Beschreibung des Rückgabewerts
 * @throws Error wenn etwas schief geht
 * @example
 * ```typescript
 * const result = myFunction('test');
 * ```
 */
export function myFunction(paramName: string): ReturnType {
  // Implementation
}
```

## Commit Guidelines

Wir folgen [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Neues Feature
- `fix`: Bug Fix
- `docs`: Documentation
- `style`: Code Formatting
- `refactor`: Code Refactoring
- `test`: Tests hinzufügen/ändern
- `chore`: Maintenance Tasks
- `perf`: Performance Improvements
- `ci`: CI/CD Changes

### Beispiele

```bash
feat(bot): add custom command support

Implement custom command builder with trigger types
and response configuration.

Closes #123

---

fix(api): resolve authentication middleware bug

The middleware was not properly handling expired tokens.
Now correctly returns 401 status.

Fixes #456

---

docs: update README with new deployment instructions
```

### Commit Messages Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues and PRs when applicable
- Provide detailed body for complex changes

## Pull Request Process

### Before Creating PR

1. ✅ Code compiles without errors
2. ✅ All tests pass
3. ✅ New tests added for new features
4. ✅ Linting passes
5. ✅ Documentation updated
6. ✅ CHANGELOG.md updated

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] Tests pass locally
```

### PR Review Process

1. Mindestens 1 Reviewer erforderlich
2. All checks must pass
3. No merge conflicts
4. Maintainer approved

## Issue Guidelines

### Issue Template

```markdown
## Bug Report / Feature Request

**Type**: [Bug | Feature | Documentation | Question]

### Description
Clear description of the issue/feature

### Steps to Reproduce (for bugs)
1. Step 1
2. Step 2
3. ...

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Environment
- OS: [e.g. Windows 11]
- Node Version: [e.g. 20.10.0]
- npm Version: [e.g. 10.2.3]

### Additional Context
Screenshots, logs, etc.
```

### Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority
- `priority: low` - Low priority
- `wontfix` - Won't be fixed

## Development Tips

### Debugging

```typescript
// Use logger instead of console.log
import logger from './utils/logger';

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

### Testing

```typescript
// Use descriptive test names
describe('Auth Middleware', () => {
  it('should return 401 when no token provided', async () => {
    // Test implementation
  });

  it('should attach user to request when valid token', async () => {
    // Test implementation
  });
});
```

### Error Handling

```typescript
// Always handle errors properly
try {
  await someAsyncOperation();
} catch (error) {
  logger.error('Failed to perform operation:', error);
  throw new ApiError(500, 'Operation failed');
}
```

## Getting Help

- 💬 [Discord Community](https://discord.gg/your-invite)
- 📧 Email: dev@yourdomain.com
- 📖 [Documentation](./docs/)

## Recognition

Contributors will be added to:
- README.md Contributors Section
- CONTRIBUTORS.md file
- GitHub Contributors page

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🎉**
