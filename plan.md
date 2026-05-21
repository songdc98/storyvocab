# English 3000 Daily Plan

Start date: 2026-05-21

Goal: finish first exposure to about 3000 common American English words in 15 days.

Daily structure:

- 200 new words embedded in one story page.
- Do not group words alphabetically. Mix the 3000-word pool by scene, emotion, action, object, relationship, time, place, and abstract idea so the story can stay alive.
- 100 review slots generated from due words, favorites, and wrong words.
- Favorites and wrong words receive higher review weight.
- Browser localStorage stores progress, favorites, known words, wrong counts, and next due day.

Vocabulary mixing rule:

- Each day should draw from multiple frequency bands and semantic groups.
- Each story should start from a strong plot first, then select words that fit the scenes.
- Avoid long runs of the same initial letter or part of speech.
- Keep function words, daily-life words, emotional words, and action words mixed in every lesson.

Review intervals:

- First exposure: review next day.
- Forgotten: review next day and keep in wrong-word queue.
- Hard: review after 2 days.
- Good: review after at least 3 more days.
- Easy: review after at least 7 more days.

Page sequence:

- Day 01: mixed story set, fake-marriage storm thriller, story page created at `index.html`.
- Day 02-Day 15: create one new story page per day with the next 200 common words and the same localStorage key so progress carries over.

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

- Keep `STORAGE_KEY = "english3000.daily.progress.v1"` unchanged.
- Increment `CURRENT_DAY`.
- Add the next 200 words to `WORD_ROWS`.
- Keep the same interaction pattern: hover options, American pronunciation, favorites, wrong-word review, 100 review slots.
