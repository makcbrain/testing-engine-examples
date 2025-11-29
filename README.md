# Testing Engine Examples

A playground for comparing different JavaScript/TypeScript testing engines in terms of setup complexity, developer experience, and performance.

## Purpose

This repository is designed to:

- Compare testing engines side-by-side
- Evaluate ease of test writing and infrastructure setup
- Benchmark execution speed
- Experiment with different testing approaches

## Testing Engines

- **Jest** - Popular testing framework with built-in mocking and assertions
- **Bun** - Fast all-in-one JavaScript runtime with native test runner
- **React Testing Library** - Testing utilities for React components
- **Vitest** - Next-generation testing framework powered by Vite
- **Playwright** - End-to-end testing for modern web applications

## Technology Stack

- **Language**: TypeScript (strict mode)
- **UI Library**: React
- **Package Manager**: Bun
- **Runtime**: Bun

## Project Structure

```
testing-engine-examples/
├── components/          # React components for testing
│   ├── Counter/
│   ├── MultiStepForm/
│   └── TodoList/
├── engines/            # Isolated testing engine configurations
│   ├── bun/
│   ├── jest/
│   └── vitest/
└── package.json
```

Each testing engine is configured in its own directory under `engines/` with isolated dependencies and configuration files.

## Installation

```bash
bun install
```

## Running Tests

```bash
# Run Jest tests
bun run test:jest

# Run Bun test runner
bun run test:bun

# Run Vitest tests
bun run test:vitest
```

## Development Scripts

```bash
# Type checking
bun run typecheck

# Linting and formatting
bun run lint

# Pre-commit hook
bun run precommit
```

## License

MIT