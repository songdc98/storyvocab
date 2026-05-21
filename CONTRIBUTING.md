# Contributing To StoryVocab

Thank you for considering a contribution. StoryVocab is meant to stay practical, learner-friendly, privacy-aware, and easy to deploy as a static site.

## Good Contributions

- Better stories, word mixing, phrase handling, or review scheduling.
- UI improvements that keep reading comfortable on mobile and desktop.
- Accessibility improvements for keyboard, screen reader, contrast, and reduced-motion users.
- Clearer documentation, screenshots, examples, and translations.
- Safer optional cloud/LLM connector examples that keep secrets server-side.
- Bug reports with screenshots, browser details, and steps to reproduce.

## Before You Change Code

1. Open an issue for large behavior changes so the direction is clear.
2. Keep the app static-first. Do not make login, tracking, a database, or a paid API required for the default experience.
3. Do not commit API keys, tokens, private endpoints, user data, or generated files containing personal information.
4. Preserve local progress compatibility when changing storage keys or state shape.
5. Keep README, screenshots, and policy docs in sync with user-facing changes.

## Local Checks

Run these before opening a pull request:

```bash
node --check src/app.js
node --check examples/cloud-endpoint-template.js
git diff --check
```

For UI changes, open the app locally and verify:

- story, review, wordbook, custom, connector, and about panels render;
- dark and light themes both work;
- word chips still speak en-US pronunciation on click;
- long-hover menus do not overlap badly and remain clickable;
- mobile width does not overflow important controls.

## Pull Request Checklist

- The change is scoped and does not rewrite unrelated files.
- Public wording is clear and learner-safe.
- README is updated when features, deployment, privacy, or connector behavior changes.
- Relevant screenshots under `docs/screenshots/` are refreshed when the UI changes.
- License and third-party notices remain intact.
- No secrets or private user data are committed.

## License Of Contributions

By contributing, you agree that your contribution will be licensed under the MIT License used by this repository.
