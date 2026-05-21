import fs from "node:fs";

const app = fs.readFileSync("src/app.js", "utf8");
const lessonsText = fs.readFileSync("src/lessons.js", "utf8");
const lessonsMatch = lessonsText.match(/window\.LESSONS = (.*);\s*$/s);

if (!lessonsMatch) {
  throw new Error("Could not parse lesson data.");
}

const lessons = JSON.parse(lessonsMatch[1]);

function blockBetween(startNeedle, endNeedle) {
  const start = app.indexOf(startNeedle);
  const end = app.indexOf(endNeedle, start);
  if (start === -1 || end === -1) {
    throw new Error(`Could not find story block: ${startNeedle}`);
  }
  return app.slice(start, end);
}

function checkCoverage(label, storyBlock, expectedCount = 200) {
  const refs = [...storyBlock.matchAll(/c\((\d+)\)/g)].map((match) => Number(match[1]));
  const uniqueRefs = new Set(refs);
  const missing = [];
  const duplicated = [...uniqueRefs].filter((index) => refs.filter((ref) => ref === index).length > 1);

  for (let index = 0; index < expectedCount; index += 1) {
    if (!uniqueRefs.has(index)) missing.push(index);
  }

  if (missing.length || duplicated.length || refs.length !== expectedCount) {
    throw new Error(`${label} word coverage failed. refs=${refs.length}, missing=${missing.join(",") || "none"}, duplicated=${duplicated.join(",") || "none"}`);
  }
}

function extractDayThreeDifficultWords() {
  const match = app.match(/3:\s*\[([\s\S]*?)\n\s*\]/);
  if (!match) throw new Error("Could not find Day 03 difficult-word list.");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((matchItem) => matchItem[1].toLowerCase());
}

const dayTwoBlock = blockBetween("function dayTwoLockedLibraryStory", "function dayThreeRoadTripStory");
const dayThreeBlock = blockBetween("function dayThreeRoadTripStory", "function buildStory");

checkCoverage("Day 02", dayTwoBlock);
checkCoverage("Day 03", dayThreeBlock);

const bannedSnippets = [
  "答案在告示牌 ${c(2)}",
  "像 ${c(104)}",
  "${c(104)} 一样",
  "废弃 ${c(105)}",
  "成群的 ${c(104)}",
  "${c(104)} 在爬",
  "数量 ${c(142)}",
  "佛罗里达 ${c(156)}",
  "a fake ${c(155)} in ${c(156)}",
  "a hive of ${c(157)}",
  "cancelled ${c(158)} plan"
];

for (const snippet of bannedSnippets) {
  if (dayTwoBlock.includes(snippet)) {
    throw new Error(`Found known awkward usage pattern: ${snippet}`);
  }
}

const requiredSnippets = [
  "${c(2)} the bronze owl",
  "a guard ${c(103)} at the desk",
  "closed ${c(104)}",
  "${c(105)} followed a trail of sugar",
  "a mock ${c(106)} hearing",
  "The ${c(142)} on the receipts did not match",
  "retirement ${c(155)} in ${c(156)}",
  "a beekeeping club called ${c(157)}",
  "a planetarium trip to ${c(158)}",
  "library ${c(190)} glass"
];

for (const snippet of requiredSnippets) {
  if (!dayTwoBlock.includes(snippet)) {
    throw new Error(`Missing expected usage-aware phrase: ${snippet}`);
  }
}

const dayThreeDifficultWords = new Set(extractDayThreeDifficultWords());
const dayThreeWords = lessons[2].words;
const priorityWords = dayThreeWords.filter((item) => dayThreeDifficultWords.has(item.word.toLowerCase())).slice(0, 60);

if (priorityWords.length < 60) {
  throw new Error(`Day 03 difficult-word target failed. expected at least 60, got ${priorityWords.length}.`);
}

const expectedDayThreeOpening = [
  "California", "fishing", "member", "degrees", "captain", "hunting", "fence", "explained", "rolled", "laws",
  "spelling", "climate", "atmosphere", "dictionary", "serve", "struck", "kill", "style", "nations", "brain"
];

const actualDayThreeOpening = priorityWords.slice(0, expectedDayThreeOpening.length).map((item) => item.word);
if (actualDayThreeOpening.join("|") !== expectedDayThreeOpening.join("|")) {
  throw new Error(`Day 03 opening difficulty order changed. got=${actualDayThreeOpening.join(",")}`);
}

const dayThreeRequiredSnippets = [
  "${c(11)} 异常",
  "空气里的 ${c(12)} 像烧焦的纸",
  "this mark may ${c(14)} as a border code",
  "裸露的 ${c(29)} wires",
  "低沉 ${c(48)}：stay still",
  "搜索框里的 ${c(176)}"
];

for (const snippet of dayThreeRequiredSnippets) {
  if (!dayThreeBlock.includes(snippet)) {
    throw new Error(`Missing Day 03 semantic-fit phrase: ${snippet}`);
  }
}

console.log("Story quality checks passed.");
