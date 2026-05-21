# StoryVocab 3000

StoryVocab 3000 is an offline-first, zero-dependency web app for learning 3000 high-frequency English words through vivid daily stories.

It is designed for Chinese-speaking learners who want a more memorable alternative to alphabetical word lists. Each lesson mixes frequent words by rank and scene, embeds them in a story, and adds spaced repetition, favorites, wrong-word tracking, and one-click American English pronunciation.

Live demo: https://songdc98.github.io/english-3000-story-learning/

![Story view](docs/screenshots/story.png)

## Features

- **15-day learning plan**: 200 new words per day, 3000 words total.
- **Story-first reading**: words are mixed by frequency and story context instead of alphabetic order.
- **Gentle difficulty ramp**: Day 01 stays easy to enter, then later days surface slightly richer words earlier in each story.
- **Adjustable English density**: switch the story between roughly 30%, 50%, and 90% English for a gradual difficulty climb.
- **Phrase-aware chips**: common words can appear as natural phrases such as `listen to`, `depend on`, and `according to`.
- **Light and dark themes**: the app opens in dark mode by default and lets learners switch back to a bright reading theme.
- **One-click en-US pronunciation**: click any colored word chip to hear American pronunciation through the browser Web Speech API.
- **Low-friction word actions**: long hover over a word to open actions for favorite, known, and review.
- **Spaced repetition**: 100 review slots per day, weighted by due date, favorites, and wrong words.
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

## Quick Start

Open `index.html` directly in a browser:

```text
file:///path/to/english_3000_daily/index.html
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
  "app": "StoryVocab 3000",
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

## License

MIT License. See [LICENSE](LICENSE).

## Keywords

English vocabulary, English 3000, 高频词, 英语单词, 美音发音, spaced repetition, story-based learning, Web Speech API, GitHub Pages, Chinese English learning, LLM connector, cloud function, offline English learning.
