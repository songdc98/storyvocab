# StoryVocab

StoryVocab is an offline-first, zero-dependency web app for learning English vocabulary through vivid daily stories, colorful word chips, one-click American pronunciation, spaced repetition, and custom wordbooks.

It is designed for Chinese-speaking learners who want a more memorable alternative to alphabetical word lists. The default pack includes a 15-day high-frequency vocabulary course, but the format is intentionally flexible: you can swap in custom words, themes, and cloud-generated stories.

Live demo: https://songdc98.github.io/storyvocab/

![Story view](docs/screenshots/story.png)

## Why StoryVocab

Most vocabulary tools make learners stare at isolated words. StoryVocab puts words back into scenes, conflict, emotion, and repeated choices. The goal is simple: make word memory feel closer to reading a vivid story than grinding a list.

## Features

- **Adjustable daily load**: start from the default 200 new words and 100 review slots, then tune both counts for the day.
- **Story-first reading**: words are mixed by frequency and story context instead of alphabetic order.
- **Gentle difficulty ramp**: Day 01 stays easy to enter, then later days surface slightly richer words earlier in each story.
- **Adjustable English density**: switch the story between roughly 30%, 50%, and 90% English for a gradual difficulty climb.
- **Phrase-aware chips**: common words can appear as natural phrases such as `listen to`, `depend on`, and `according to`.
- **Light and dark themes**: the app opens in dark mode by default and lets learners switch back to a bright reading theme.
- **One-click en-US pronunciation**: click any colored word chip to hear American pronunciation through the browser Web Speech API.
- **Low-friction word actions**: long hover over a word to open actions for favorite, known, and review.
- **Spaced repetition**: configurable review slots, weighted by due date, favorites, and wrong words.
- **Local progress**: progress stays in browser `localStorage`; no account or server needed.
- **Custom wordbook**: import your own words with `word,中文释义,pos` lines.
- **Custom theme reading**: turn imported words into a themed reading passage without external services.
- **Optional cloud/LLM connector**: keep the app fully static by default, or connect your own endpoint to rewrite lessons with any model provider.
- **Developer API**: `window.StoryVocabAPI` exposes lesson state, current words, connector payloads, external story rendering, and pronunciation helpers.
- **GitHub Pages ready**: static files only, no build step required for deployment.

## Screenshots

### Daily Story

![Daily story](docs/screenshots/story.png)

### Review Slots

![Review slots](docs/screenshots/review.png)

### Wordbook Search

![Wordbook search](docs/screenshots/wordbook.png)

### Optional Connector

![Optional connector](docs/screenshots/connector.png)

### Privacy, Contact, And Support

![About and support](docs/screenshots/about.png)

## Quick Start

Open `index.html` directly in a browser:

```text
file:///path/to/storyvocab/index.html
```

Or host the folder with any static server:

```bash
python3 -m http.server 8765
```

Then visit:

```text
http://127.0.0.1:8765
```

## Deploy To GitHub Pages

1. Create a new public GitHub repository.
2. Upload or push this project folder.
3. In the repository settings, open **Pages**.
4. Choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`.
6. Save. GitHub will publish the app as a public website.

## Custom Wordbook Format

Paste one word per line:

```csv
privacy,隐私,n.
launch,发布/发射,v.
evidence,证据,n.
```

Then click **导入自定义词**. Imported words can be searched, favorited, reviewed, exported, and used in custom themed readings.

## Optional Cloud / LLM Connector

The app works without any backend. If you want model-generated stories, open **接口**, paste your own endpoint URL, and click **云端重写当前故事**.

Security rule: do not put model provider API keys in this static frontend. Put keys in your own server, Cloudflare Worker, Vercel Function, or other cloud function, then let StoryVocab call that endpoint.

Expected request shape:

```json
{
  "app": "StoryVocab",
  "day": 1,
  "theme": "cinematic",
  "englishDensity": 30,
  "words": [
    { "word": "listen", "display": "listen to", "zh": "听" }
  ],
  "favorites": ["listen to"],
  "reviewWords": ["depend on"]
}
```

Expected response shape:

```json
{
  "storyText": "一篇新的故事...",
  "notes": "Optional note"
}
```

The returned text is displayed in the connector preview and does not overwrite the built-in 15-day static lessons. A starter endpoint template is available at [examples/cloud-endpoint-template.js](examples/cloud-endpoint-template.js).

Developers can also extend the page directly:

```js
const payload = window.StoryVocabAPI.buildConnectorPayload();
window.StoryVocabAPI.renderExternalStory("A custom generated story");
window.StoryVocabAPI.speak("listen to");
```

## Privacy And Safety

- StoryVocab does not require login, analytics, cookies, or a database.
- Learning progress, favorites, wrong words, custom words, and connector URL are saved locally in your browser.
- The browser Web Speech API may use the speech engine provided by your browser or operating system.
- If you configure a cloud endpoint, StoryVocab sends the current lesson payload to that endpoint. Only connect endpoints you control and trust.
- Do not paste private API keys, passwords, private learning data, or confidential material into the static frontend.

See [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md) for the full project policy.

## Community Files

This repository includes the standard public-project files people expect when contributing:

- [LICENSE](LICENSE): MIT License for the project code.
- [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md): bundled vocabulary data attribution.
- [CONTRIBUTING.md](CONTRIBUTING.md): how to propose changes safely.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md): expected behavior for public collaboration.
- [SECURITY.md](SECURITY.md): how to report vulnerabilities or secret-handling issues.
- [SUPPORT.md](SUPPORT.md): where to ask questions, collaborate, or contact the author.
- [PRIVACY.md](PRIVACY.md): local-storage and optional connector privacy notes.

## Data Sources

The offline word data is generated from MIT-licensed sources:

- `3000-words-list@0.0.3`: 3000 frequent English words.
- `skywind3000/ECDICT`: English-Chinese glosses and phonetic hints.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for details.

## Development

No package install is required. To regenerate the lesson data after downloading the upstream sources to `/tmp`:

```bash
python3 tools/extract_lessons.py
```

The generated file is:

```text
src/lessons.js
```

Before opening a pull request, check:

```bash
node --check src/app.js
node --check examples/cloud-endpoint-template.js
git diff --check
```

If a change affects UI, public wording, screenshots, deployment, privacy, or security behavior, update the matching docs and screenshots in the same pull request.

## License, Attribution, And Brand Use

StoryVocab code is released under the MIT License. See [LICENSE](LICENSE).

The bundled vocabulary data keeps third-party notices in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). If you redistribute a modified version, keep the MIT copyright notices and third-party attributions required by the relevant licenses.

The project name, author identity, screenshots, and contact information should not be used to imply endorsement of unrelated products, services, or commercial offerings.

## Author, Contact, And Support

Created and maintained by Dachuan Song.

For collaboration, research/product ideas, educational partnerships, internship/job opportunities, or referral conversations, contact:

dsong25@gmu.edu

If StoryVocab helps you, please star the repository:

https://github.com/songdc98/storyvocab

Stars, thoughtful issues, documentation improvements, and introductions to teams working on language learning, education tools, or human-centered AI all help the project and the author.

## Keywords

English vocabulary, StoryVocab, 高频词, 英语单词, 美音发音, spaced repetition, story-based learning, Web Speech API, GitHub Pages, Chinese English learning, LLM connector, cloud function, offline English learning.
