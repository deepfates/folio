# Contributing to Folio

Thanks for your interest in contributing! Folio is built on Eclipse Theia, so understanding the basics of that framework will help you get oriented.

## Prerequisites

- **Node.js** ≥ 18
- **Yarn** 1.x

## Development Setup

```bash
# Install dependencies
yarn

# Build everything
yarn build:electron

# Start the app
yarn start:electron
```

## Development Workflow

For active development with live rebuilding:

```bash
# In one terminal, watch for changes
yarn watch:electron

# In another terminal, start the app
yarn start:electron
```

After making changes, restart the app to see them.

## Project Structure

```text
folio/
├── folio/              # Main Folio extension
├── electron-app/       # Electron app configuration
├── browser-app/        # Browser-based version (optional)
└── package.json        # Workspace root
```

**Key directories:**

- [folio/src/browser/](folio/src/browser/) - Frontend extension code (UI, contributions)
- [electron-app/package.json](electron-app/package.json) - Theia module selection and app config

## Understanding Theia

Folio is built on [Eclipse Theia](https://theia-ide.org/), a framework for building IDEs with web technologies.

**Key concepts:**

- **Dependency Injection**: Theia uses [InversifyJS](https://inversify.io/). Services are bound in `*-frontend-module.ts` files and injected with `@inject()`.
- **Contributions**: Extend functionality by implementing contribution interfaces (e.g., `CommandContribution`, `MenuContribution`, `WidgetFactory`).
- **Modules**: Theia packages are composed as modules. Add features by including `@theia/*` packages in `electron-app/package.json`.

For more details, see [Theia's documentation](https://theia-ide.org/docs/).

## Making Changes

1. **Read [PHILOSOPHY.md](PHILOSOPHY.md)** to understand the vision
2. **Make your changes** in the appropriate directory
3. **Build** with `yarn build:electron`
4. **Test** by running the app
5. **Submit a PR** with a clear description

## Testing

```bash
# Run tests
yarn test

# Run tests for a specific package
cd folio
yarn test
```

## Resetting State

During development, you may need to reset the app's state:

```bash
# Clear Theia's local storage
rm -rf ~/.theia/
```

This resets the workspace layout and preferences.

## Philosophy

We build Folio in Folio. If it's not good enough for us to use every day, it's not good enough to ship.

Keep changes focused on knowledge workers, not developers. Prioritize clarity and simplicity over technical purity.

See [PHILOSOPHY.md](PHILOSOPHY.md) for the full vision.

## Questions?

Open an issue or start a discussion. We're figuring this out together.
