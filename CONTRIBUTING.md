# Contributing to Sprint Agent

Thank you for your interest in contributing to Sprint Agent! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to build something useful together.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/sprint-agent.git
cd sprint-agent

# Install dependencies
npm install

# Install pre-commit hooks
npm run prepare

# Start development server
npm run dev
```

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feat/add-sprint-prep-analyzer`
- `fix/stale-ticket-detection`
- `docs/update-api-contract`

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). All commits must follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

**Examples:**
```
feat(analyzer): add sprint prep readiness check

fix(slack): handle missing user email gracefully

docs(api): update response schema for quality check
```

### Code Quality

Before submitting a PR, ensure:

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check formatting
npm run format:check

# Run tests
npm run test

# Run all validations
npm run validate
```

### Testing

- Write tests for new features
- Update tests when modifying existing features
- Aim for >70% code coverage
- Use descriptive test names

```javascript
// Good
it('should identify tickets without story points as incomplete', () => {})

// Bad
it('should work', () => {})
```

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines above
3. **Write/update tests** for your changes
4. **Run `npm run validate`** to ensure all checks pass
5. **Create a Pull Request** with:
   - Clear title following conventional commits
   - Description of what and why
   - Link to related issue (if any)
   - Screenshots (for UI changes)
6. **Address review feedback** promptly
7. **Squash and merge** once approved

### PR Title Format

Same as commit messages:
```
feat(analyzer): add sprint prep readiness check
```

## Project Structure

```
sprint-agent/
├── src/                  # Vue 3 Frontend
│   ├── views/            # Page components
│   ├── components/       # Reusable components
│   ├── composables/      # Vue composition functions
│   ├── services/         # API clients
│   └── types/            # Type definitions (JSDoc)
├── backend/              # Lambda Backend
│   ├── src/
│   │   ├── analyzers/    # Claude analysis logic
│   │   ├── prompts/      # System prompts
│   │   └── utils/        # Utilities
│   └── __tests__/        # Backend tests
├── docs/                 # Documentation
└── .github/workflows/    # CI/CD
```

## Adding New Features

### Adding a New Analyzer

1. Create the analyzer in `backend/src/analyzers/`
2. Add the system prompt in `backend/src/prompts/index.js`
3. Register in main handler `backend/src/index.js`
4. Add UI component in `src/components/`
5. Update API contract in `docs/api-contract.md`
6. Add tests
7. Update CLAUDE.md if needed

### Adding a New UI Component

1. Create component in `src/components/`
2. Use Vue 3 Composition API with `<script setup>`
3. Use Tailwind CSS for styling
4. Add props validation
5. Write component tests

## Questions?

Open an issue or reach out to the maintainers.
