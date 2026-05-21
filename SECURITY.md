# Security Policy

StoryVocab is a static web app. The default experience should not require a server, account, database, analytics service, or model API key.

## Supported Version

Security reports should target the current `main` branch and the live GitHub Pages deployment:

https://songdc98.github.io/storyvocab/

## Report A Vulnerability

Please do not open a public GitHub issue for sensitive security reports.

Copy this email address and send the report from your preferred email client:

`dsong25@gmu.edu`

Include:

- a short description of the issue;
- steps to reproduce;
- browser and operating system details when relevant;
- whether the issue affects local-only use, GitHub Pages deployment, or the optional cloud connector;
- any proof-of-concept details that avoid exposing real secrets or private data.

## Security Boundaries

- Do not put model provider API keys in the frontend.
- Optional LLM/cloud connectors should call provider APIs from a server, cloud function, or trusted backend.
- StoryVocab stores progress in browser `localStorage`; anyone with access to the same browser profile may be able to read it.
- Connector endpoints receive the lesson payload shown in the app. Only use endpoints you control and trust.
- This project does not collect passwords, payment data, health records, or government identifiers.

## Out Of Scope

- Issues caused by a user-configured third-party connector that is outside this repository.
- Browser or operating-system speech engine behavior that StoryVocab cannot control.
- Social engineering, spam, denial-of-service, or automated scanning that disrupts GitHub Pages or users.
