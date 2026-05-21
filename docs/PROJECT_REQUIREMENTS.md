# StoryVocab Product Requirements

This file records the maintainer requirements that should survive context resets and future edits.

## Core Learning Experience

- The built-in authored course maintains two official tracks: American-campus story learning and US workplace/business English.
- Other genres or topics are extension interfaces for custom wordbooks or optional LLM connectors, not promises that every theme is fully authored.
- Future authored-story updates should update both maintained tracks when the changed lesson or behavior affects story content.
- The business English track should cover US workplace communication, tech-industry collaboration, overseas work settings, commute/traffic, meetings, daily professional phrases, follow-up emails, ownership, alignment, and escalation language.
- Daily reading should feel like a vivid chapter, not a mechanical list of words.
- Stories may be romantic, scheming, dramatic, absurd, or exaggerated, but every target word must still belong naturally to the sentence logic.
- Avoid flat narration. Prefer conflict, suspense, emotional stakes, visual scenes, memorable behavior, and coherent cause-and-effect.
- If the learner keeps the same style, later lessons should feel like chapters of one longer story rather than unrelated daily topics.

## Vocabulary Policy

- Default daily load is 200 new words plus 100 review slots, and both counts must remain adjustable.
- The story status must distinguish words written into the story from words the learner has clicked or reviewed.
- Avoid alphabetic ordering for learning flow. Mix words by frequency, difficulty, and story usefulness.
- Do not use low-value glue words such as `the`, `what`, `this`, single letters, standalone names, or obvious function words as primary target chips when better words are available.
- Maintain at least a 30% harder-word share for later daily lessons where configured.
- Use phrase-aware chips when the natural use is a phrase, for example `listen to`, `depend on`, `according to`, or `below the notice board`.
- Chinese glosses inside chips should be smaller than the English word so learners read English first.

## Story Quality Gate

- Each authored daily story should include the requested number of target words, with no accidental omissions or duplicate target slots.
- Each chip must fit the grammar and semantics of the sentence.
- Check for awkward isolated-preposition usage, repeated English-Chinese duplication, and unrelated word drops.
- Abstraction is allowed only when the word still has a clear role in the scene.
- After generating or editing a story, run the local quality checks before release.

## Interaction Requirements

- Clicking a colored word or phrase should immediately play en-US pronunciation.
- Long hover should open lower-priority actions such as favorite, known, and review.
- Hover menus should open slowly enough to avoid interrupting pronunciation clicks and remain stable long enough to use.
- When hovering a new chip, any previous chip menu should close immediately.
- Favorites and wrong words should be weighted into future review appearances.
- The app should remain usable as a purely static page without Codex or any backend.

## Customization And Connector

- Users should be able to import custom wordbooks.
- Users should be able to adjust English density, such as 30%, 50%, and 90%.
- Optional cloud or LLM connectors may rewrite stories, but no provider API key should ever be placed in the static frontend.
- Contact buttons should copy `dsong25@gmu.edu` instead of opening the user's mail app.

## Public Project Maintenance

- License is MIT.
- Keep README, screenshots, and public-facing docs aligned with each meaningful UI, content, or behavior update.
- Keep README bilingual. Each substantial English paragraph, list, or explanation should be followed by its Chinese counterpart, and future README updates must update both languages together.
- Do not fragment README Chinese translations into many tiny sentence-by-sentence pieces; use readable Chinese blocks that correspond to the English blocks.
- Refresh `docs/screenshots/story.png` when the story UI changes.
- Commit and push code, documentation, and screenshot changes together.
- Verify GitHub Pages after pushing when practical.
