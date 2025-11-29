# Testing Engine Examples

## Project Overview

This project is designed to evaluate and compare the speed and usability of various testing engines including:
- Jest
- Bun
- React Testing Library
- Vitest
- Playwright

The project uses TypeScript as the primary language and React as the rendering engine.

## Project Structure

- `components/` - React components for testing
- `engines/` - Each testing engine has its own folder with isolated dependencies

## Coding Guidelines

### General Principles
- Prefer arrow functions
- Prefer named exports to default export
- Use English only in code
- Don't use index.ts files to reexport things from folder. Use direct import from files
- Always use a flag `-E` to install dependencies
- Avoid adding obvious comments in code
- Use English language when writing documentation files
- Follow the existing code patterns and architecture

### TypeScript
- Maintain TypeScript strict mode compliance
- Avoid using type assertions (as) in TypeScript where possible; prefer proper typing with generics or type annotations

### Naming Conventions
- Use camelCase for file names and variables

### Component Structure
- Each component must have its own folder with the component name (e.g., `Button/`)
- Each component folder must contain at minimum:
  - `ComponentName.tsx` - the component file
  - `styles.css` - the component styles
- Use plain CSS without CSS modules
- Import styles directly in the component: `import './styles.css'`
- All interactive elements must include `data-testid` attributes for testing purposes
- Follow the pattern: `data-testid="component-element-identifier"`