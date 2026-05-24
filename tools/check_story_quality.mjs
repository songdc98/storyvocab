import fs from "node:fs";

const app = fs.readFileSync("src/app.js", "utf8");
const indexHtml = fs.readFileSync("index.html", "utf8");
const lessonsText = fs.readFileSync("src/lessons.js", "utf8");
const businessLessonsText = fs.readFileSync("src/business-lessons.js", "utf8");
const lessonsMatch = lessonsText.match(/window\.LESSONS = (.*);\s*$/s);
const businessLessonsMatch = businessLessonsText.match(/window\.BUSINESS_LESSONS = (.*);\s*$/s);

if (!lessonsMatch || !businessLessonsMatch) {
  throw new Error("Could not parse lesson data.");
}

const lessons = JSON.parse(lessonsMatch[1]);
const businessLessons = JSON.parse(businessLessonsMatch[1]);

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

function extractLowValueWords() {
  const match = app.match(/const LOW_VALUE_WORDS = new Set\(\[([\s\S]*?)\]\);/);
  if (!match) throw new Error("Could not find low-value word list.");
  return new Set([...match[1].matchAll(/"([^"]+)"/g)].map((matchItem) => matchItem[1].toLowerCase()));
}

function currentDayOneWords(count = 200) {
  const lowValueWords = extractLowValueWords();
  const allWords = lessons.flatMap((day) => day.words.map((word) => ({ ...word, day: day.day })));
  const selected = lessons[0].words.filter((item) => !isLowValue(item, lowValueWords));
  const selectedWords = new Set(selected.map((item) => String(item.word).toLowerCase()));

  for (const item of allWords) {
    const key = String(item.word || "").toLowerCase();
    if (selected.length >= count) break;
    if (!selectedWords.has(key) && !isLowValue(item, lowValueWords)) {
      selected.push(item);
      selectedWords.add(key);
    }
  }

  return selected.slice(0, count);
}

function isLowValue(item, lowValueWords) {
  const word = String(item.word || "").toLowerCase();
  return lowValueWords.has(word) || /^\d/.test(word) || /^[a-z]'/.test(word) || /^[a-z]$/i.test(word);
}

const dayOneCampusBlock = blockBetween("function dayOneCampusStory", "function dayOneBusinessStory");
const dayOneBusinessBlock = blockBetween("function dayOneBusinessStory", "function dayTwoLockedLibraryStory");
const dayTwoBlock = blockBetween("function dayTwoLockedLibraryStory", "function dayThreeRoadTripStory");
const dayThreeBlock = blockBetween("function dayThreeRoadTripStory", "function buildStory");
const buildStoryBlock = blockBetween("function buildStory", "const standaloneCampusStories");
const standaloneCampusPlanBlock = blockBetween("const standaloneCampusStories", "const standaloneFunctionUses");
const standaloneCampusUsageBlock = blockBetween("const standaloneFunctionUses", "function standaloneCampusPlan");

checkCoverage("Day 01 campus", dayOneCampusBlock);
checkCoverage("Day 01 business", dayOneBusinessBlock);
checkCoverage("Day 02", dayTwoBlock);
checkCoverage("Day 03", dayThreeBlock);

const expectedDayOneOpening = [
  "air", "sound", "house", "side", "live", "night", "room", "money", "door", "run",
  "front", "started", "wind", "perhaps", "person", "notice", "round", "friends", "longer", "system"
];

const dayOneWords = currentDayOneWords();
const actualDayOneOpening = dayOneWords.slice(0, expectedDayOneOpening.length).map((item) => item.word);
if (actualDayOneOpening.join("|") !== expectedDayOneOpening.join("|")) {
  throw new Error(`Day 01 opening filter changed. got=${actualDayOneOpening.join(",")}`);
}

const lowValueBlockedWords = ["the", "as", "but", "will", "into", "its", "this", "what", "f", "t", "thy", "jane", "betsy", "jeff"];
const blockedDayOneWords = dayOneWords.filter((item) => lowValueBlockedWords.includes(String(item.word).toLowerCase())).map((item) => item.word);
if (blockedDayOneWords.length) {
  throw new Error(`Day 01 still contains low-value target chips: ${blockedDayOneWords.join(",")}`);
}

const businessDayOneWords = businessLessons[0]?.words || [];
if (businessDayOneWords.length !== 200) {
  throw new Error(`Business Day 01 must contain 200 independent business targets. got=${businessDayOneWords.length}`);
}

const campusDayOneSet = new Set(dayOneWords.map((item) => String(item.word).toLowerCase()));
const businessOverlap = businessDayOneWords.filter((item) => campusDayOneSet.has(String(item.word).toLowerCase()));
if (businessOverlap.length > 5) {
  throw new Error(`Business Day 01 overlaps too much with campus Day 01: ${businessOverlap.map((item) => item.word).join(",")}`);
}

const requiredBusinessTargets = [
  "calendar invite",
  "stand-up",
  "action item",
  "stakeholder",
  "follow-up",
  "please find attached",
  "renewal",
  "customer success",
  "SLA",
  "deployment",
  "Could you clarify",
  "Let's align",
  "by end of day",
  "unit economics",
  "traffic congestion",
  "decision maker",
  "acceptance criteria",
  "conditional clause",
  "executive summary",
  "value proposition"
];

const businessTargetSet = new Set(businessDayOneWords.map((item) => item.word));
for (const target of requiredBusinessTargets) {
  if (!businessTargetSet.has(target)) {
    throw new Error(`Business Day 01 is missing expected business target: ${target}`);
  }
}

const expectedStandaloneCampusTitles = new Map([
  [2, ["The Overnight Library Hunt", "图书馆通宵寻宝夜"]],
  [3, ["The Spring Break Bus Trip", "春假前的校车公路旅行"]],
  [4, ["The Midnight Mock Trial", "午夜模拟法庭"]],
  [5, ["The Student Office Leak", "学生会办公室泄密风波"]],
  [6, ["The Campus Community Festival", "校园社区节"]],
  [7, ["The Health Center Night Shift", "校园健康中心夜班"]],
  [8, ["The Campus Demo Day", "校园创业 Demo Day"]],
  [9, ["The College Town Vote", "大学城学生投票日"]],
  [10, ["The Delayed Train Bag", "晚点列车上的手提包"]],
  [11, ["The Apartment Fire Aftermath", "校外公寓火灾之后"]],
  [12, ["The School Rumor", "学校里的谣言"]],
  [13, ["The Final Campus Game", "最后一场校内比赛"]],
  [14, ["The Alumni Dinner Letter", "校友重聚晚宴"]],
  [15, ["The Graduation Memory Parade", "毕业记忆游行"]]
]);

for (const [day, [titleEn, titleZh]] of expectedStandaloneCampusTitles) {
  const lessonInfo = lessons.find((item) => item.day === day);
  if (!lessonInfo || lessonInfo.titleEn !== titleEn || lessonInfo.titleZh !== titleZh) {
    throw new Error(`Campus Day ${String(day).padStart(2, "0")} lesson title is stale.`);
  }
}

const dayOneRequiredSnippets = [
  "West Hall",
  "missing scholarship ${c(7)}",
  "campus CEO",
  "假订婚赌局",
  "${c(101)} taken everything at once",
  "those ${c(186)} were not random",
  "taped ${c(175)} the water fountain",
  "赌约才刚刚开始"
];

for (const snippet of dayOneRequiredSnippets) {
  if (!dayOneCampusBlock.includes(snippet)) {
    throw new Error(`Missing Day 01 campus-story phrase: ${snippet}`);
  }
}

const dayOneBusinessRequiredSnippets = [
  "morning standup",
  "follow-up email",
  "Let's align",
  "traffic",
  "${c(80)} the owner",
  "${c(168)} 写成 if the deployment fails",
  "send it in writing",
  "US workplace business English"
];

for (const snippet of dayOneBusinessRequiredSnippets) {
  if (!dayOneBusinessBlock.includes(snippet) && !app.includes(snippet) && !businessLessonsText.includes(snippet)) {
    throw new Error(`Missing Day 01 business-English phrase: ${snippet}`);
  }
}

const maintainedOptions = [...indexHtml.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)]
  .filter((match) => ["campus", "business", "startup", "cinematic", "travel", "comedy"].includes(match[1]))
  .map((match) => match[1]);

if (maintainedOptions.join("|") !== "campus|business") {
  throw new Error(`Expected only maintained story themes in selector. got=${maintainedOptions.join(",")}`);
}

if (!app.includes("function pronunciationTitle") || !app.includes("pronunciationTitle(item, shown)")) {
  throw new Error("Hover menu titles must be built from pronunciationTitle.");
}

if (app.includes("business word ·") || app.includes("${item.pos || \"word\"} · ${item.zh")) {
  throw new Error("Hover menu title must not expose internal part-of-speech labels.");
}

if (!buildStoryBlock.includes("theme === \"campus\" && state.currentDay >= 2") || !buildStoryBlock.includes("standaloneCampusStory(items, density, state.currentDay)")) {
  throw new Error("Campus Day 02-15 must use the standalone campus story generator.");
}

for (let day = 2; day <= 15; day += 1) {
  if (!standaloneCampusPlanBlock.includes(`${day}: {`)) {
    throw new Error(`Standalone campus story plan missing Day ${String(day).padStart(2, "0")}.`);
  }
}

const standaloneStoryRequiredSnippets = [
  "图书馆通宵寻宝夜",
  "春假前的校车公路旅行",
  "午夜模拟法庭",
  "学生会办公室泄密风波",
  "校园社区节",
  "毕业记忆游行",
  "the notice board",
  "start ${word} a witness",
  "two tickets ${word} person",
  "neither the captain ${word} the coach",
  "她戴上耳机 ${word} the hallway recording",
  "three old ${word}",
  "生物社的 ${word}",
  "白板上的 ${word} 对不上",
  "来自 ${word} 的交换生"
];

for (const snippet of standaloneStoryRequiredSnippets) {
  if (!standaloneCampusPlanBlock.includes(snippet) && !standaloneCampusUsageBlock.includes(snippet)) {
    throw new Error(`Missing standalone campus story or usage clause: ${snippet}`);
  }
}

if (/\(word\)\s*=>[^,\n]*plan\./.test(standaloneCampusUsageBlock)) {
  throw new Error("A standalone usage override references plan without accepting plan as an argument.");
}

const standaloneCampusBlocks = [
  standaloneCampusPlanBlock,
  standaloneCampusUsageBlock,
  blockBetween("function standaloneCampusClause", "function standaloneCampusStory"),
  blockBetween("function standaloneCampusStory", "function currentLessonItems")
].join("\n");

for (const snippet of ["案卷把", "证据袋", "每条线索", "证据名", "下一天，案子继续", "所有故事终于回到第一夜", "洗钱路径", "转账路线"]) {
  if (standaloneCampusBlocks.includes(snippet)) {
    throw new Error(`Standalone campus stories still contain old case-board wording: ${snippet}`);
  }
}

for (const snippet of ["图书馆通宵寻宝夜", "春假前的校车公路旅行", "午夜模拟法庭", "学生会办公室泄密风波", "校园社区节", "校园健康中心夜班", "校园创业 Demo Day", "大学城学生投票日", "晚点列车上的手提包", "校外公寓火灾之后", "学校里的谣言", "最后一场校内比赛", "校友重聚晚宴", "毕业记忆游行"]) {
  if (!standaloneCampusBlocks.includes(snippet)) {
    throw new Error(`Missing independent campus story setting: ${snippet}`);
  }
}

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
