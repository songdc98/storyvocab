# Privacy

StoryVocab is designed to be offline-first and local-first.

## Default Static Mode

In the default mode:

- no account is required;
- no analytics are included;
- no cookies are set by StoryVocab;
- no database is used;
- no learning progress is sent to the project maintainer.

The app stores progress in browser `localStorage`, including current day, favorites, known words, review state, custom words, display mode, and optional connector URL.

If you use the public GitHub Pages deployment, GitHub may process ordinary web-server request information as the hosting provider. StoryVocab itself does not add analytics or tracking scripts.

## Speech

StoryVocab uses the browser Web Speech API for pronunciation. The actual speech engine depends on the browser and operating system. Some browsers or operating systems may process speech locally, while others may use vendor services. Check your browser and operating-system privacy settings if this matters for your use case.

## Optional Cloud / LLM Connector

If you configure a connector endpoint, StoryVocab sends a JSON payload to that endpoint. The payload can include:

- current lesson metadata;
- target words and Chinese glosses;
- selected theme and English-density setting;
- favorite and review-word status for the current lesson;
- the instruction text used to request a generated story.

Only connect endpoints you control and trust. Do not put model provider API keys in the frontend. Keep API keys server-side.

## Clearing Local Data

You can clear StoryVocab data by clearing browser site data for the page, or by deleting localStorage entries with keys beginning with `storyvocab`.

## Contact

For privacy questions, contact Dachuan Song at dsong25@gmu.edu.
