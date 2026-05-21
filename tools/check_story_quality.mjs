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
  "数量 ${c(142)}",
  "佛罗里达 ${c(156)}"
];

for (const snippet of bannedSnippets) {
  if (storyBlock.includes(snippet)) {
    throw new Error(`Found known awkward usage pattern: ${snippet}`);
  }
}

const requiredSnippets = [
  "the answer is ${c(2)} the notice board",
  "abandoned ${c(104)}",
  "一队 ${c(105)}",
  "The ${c(142)} did not match the receipts",
  "in ${c(156)}"
];

for (const snippet of requiredSnippets) {
  if (!storyBlock.includes(snippet)) {
    throw new Error(`Missing expected usage-aware phrase: ${snippet}`);
  }
}

console.log("Story quality checks passed.");
