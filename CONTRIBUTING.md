# Contributing to RushDish

Thanks for helping improve RushDish. The repository currently contains an
interactive product prototype rather than a production ordering service.

## Before you start

- Search existing issues before opening a new one.
- Use the issue forms for reproducible bugs and focused feature requests.
- Report security vulnerabilities privately by following
  [SECURITY.md](./SECURITY.md).
- Never include passwords, tokens, customer data, payment information, or other
  secrets in an issue, commit, screenshot, or pull request.

## Local setup

RushDish requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Create a short-lived branch from `main` for your change. Keep changes focused
and update the documentation or tests when behavior changes.

## Checks

Run both checks before opening a pull request:

```bash
npm run lint
npm test
```

`npm test` creates a production build before running the rendered-page tests.

## Pull requests

A useful pull request explains:

- the problem or goal;
- the approach taken;
- how the change was tested; and
- any screenshots needed to understand a visible change.

Keep payment processing, persistent orders, authentication, and production
data integrations out of scope unless the associated security and operational
requirements are addressed explicitly.
