# StoryVocab Daily Plan

Start date: 2026-05-21

Goal: use a vivid story-first format for vocabulary learning. The default pack gives first exposure to about 3000 common American English words in 15 days, but the system should also support custom word sets.

Daily structure:

- 200 new words embedded in one story page.
- Do not group words alphabetically. Mix the active word pool by scene, emotion, action, object, relationship, time, place, and abstract idea so the story can stay alive.
- If the learner keeps the same style, keep the daily narration close enough to feel like chapters of one long story. Theme changes can shift tone, but the default course should not feel like unrelated daily prompts.
- 100 review slots generated from due words, favorites, and wrong words.
- Favorites and wrong words receive higher review weight.
- Browser localStorage stores progress, favorites, known words, wrong counts, and next due day.

Vocabulary mixing rule:

- Each day should draw from multiple frequency bands and semantic groups.
- Each story should start from a strong plot first, then select words that fit the scenes.
- Avoid long runs of the same initial letter or part of speech.
- Keep function words, daily-life words, emotional words, and action words mixed in every lesson.
- Put words in real usage, especially prepositions, phrasal verbs, count/mass nouns, proper nouns, and plural nouns. For example, use `below the notice board`, `the amounts did not match`, `abandoned factories`, and `in Florida`, not Chinese-English duplicates or isolated labels.

Story quality rules:

- Run the local quality checks before release: syntax checks, authored-story coverage, known awkward phrase checks, screenshot refresh, and a manual read-through of visible paragraphs.
- Remove repeated Chinese-English phrasing such as `数量 amounts` or `佛罗里达 Florida`; the chip already carries the Chinese hint.
- Prefer concrete, visual scenes: locked doors, dripping pipes, red strings, wrong receipts, absurd props, strange behavior, and emotional stakes.
- Allow humor, weirdness, and occasional abstract behavior when it strengthens memory, but every highlighted word should still be grammatically plausible in its sentence.

Review intervals:

- First exposure: review next day.
- Forgotten: review next day and keep in wrong-word queue.
- Hard: review after 2 days.
- Good: review after at least 3 more days.
- Easy: review after at least 7 more days.

Page sequence:

- Day 01: mixed story set, fake-marriage storm thriller, story page created at `index.html`.
- Day 02: authored locked-library chapter, continuing the same suspenseful world with stronger usage-aware placement.
- Day 03-Day 15: add one new authored chapter per day with the next 200 common words and the same localStorage key so progress carries over.

Suggested story arcs:

- Day 02: campus disappearance and a locked library.
- Day 03: road trip across the U.S. with a hidden witness.
- Day 04: courtroom reversal and family secret.
- Day 05: workplace comedy that turns into a fraud chase.
- Day 06: neighborhood festival interrupted by a missing child case.
- Day 07: hospital night shift and impossible diagnosis.
- Day 08: startup launch, data leak, and public apology.
- Day 09: small-town election with a forged video.
- Day 10: train delay, strangers, and one stolen bag.
- Day 11: apartment fire, rescue, and old betrayal.
- Day 12: online rumor, school conflict, and reconciliation.
- Day 13: sports final, injury, and a last-minute decision.
- Day 14: cross-country family reunion with a buried letter.
- Day 15: grand review story that brings back favorites and wrong words.

Implementation notes for future pages:

- Preserve progress across storage-key migrations.
- Update the active day through app state.
- Add or regenerate lesson words in `src/lessons.js`.
- Keep the same interaction pattern: hover options, American pronunciation, favorites, wrong-word review, 100 review slots.
