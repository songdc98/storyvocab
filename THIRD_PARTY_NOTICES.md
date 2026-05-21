# Third-Party Notices

StoryVocab code is MIT licensed. It includes derived offline vocabulary data from the following MIT-licensed sources. Keep these notices when redistributing the bundled data or a modified build that includes it.

## 3000-words-list

- Source: `3000-words-list@0.0.3`
- Repository: `capheshift/3000-words-list`
- Package description: a list of the 3000 most frequent words in spoken and written English
- License: MIT
- Copyright: Copyright (c) 2015 Tam Pham

## ECDICT

- Source: `skywind3000/ECDICT`
- File used during generation: `ecdict.csv`
- Purpose: English-Chinese glosses and phonetic hints for the offline word cards
- License: MIT
- Copyright notice in upstream license: Copyright (c) 2025 Linwei

Generated project data lives in `src/lessons.js`. The generation script is `tools/extract_lessons.py`.

The optional cloud connector template does not bundle a model provider SDK or provider data. Users are responsible for the terms, privacy policy, and costs of any provider they connect.
