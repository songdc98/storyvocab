import fs from "node:fs";

const app = fs.readFileSync("src/app.js", "utf8");
const storyStart = app.indexOf("function dayTwoLockedLibraryStory");
const storyEnd = app.indexOf("function buildStory", storyStart);

if (storyStart === -1 || storyEnd === -1) {
  throw new Error("Could not find the authored Day 02 story block.");
}

const storyBlock = app.slice(storyStart, storyEnd);
const refs = [...storyBlock.matchAll(/c\((\d+)\)/g)].map((match) => Number(match[1]));
const uniqueRefs = new Set(refs);
const missing = [];
const duplicated = [...uniqueRefs].filter((index) => refs.filter((ref) => ref === index).length > 1);

for (let index = 0; index < 200; index += 1) {
  if (!uniqueRefs.has(index)) missing.push(index);
}

if (missing.length || duplicated.length || refs.length !== 200) {
  throw new Error(`Day 02 word coverage failed. refs=${refs.length}, missing=${missing.join(",") || "none"}, duplicated=${duplicated.join(",") || "none"}`);
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
  if (storyBlock.includes(snippet)) {
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
  if (!storyBlock.includes(snippet)) {
    throw new Error(`Missing expected usage-aware phrase: ${snippet}`);
  }
}

console.log("Story quality checks passed.");
