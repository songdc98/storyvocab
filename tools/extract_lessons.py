#!/usr/bin/env python3
"""Build the offline lesson data from MIT-licensed vocabulary sources.

Inputs expected in /tmp:
- /tmp/3000-words.json from npm package 3000-words-list@0.0.3
- /tmp/ecdict.csv from skywind3000/ECDICT
"""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WORDS_JS = Path("/tmp/3000-words.json")
ECDICT_CSV = Path("/tmp/ecdict.csv")
OUT = ROOT / "src" / "lessons.js"


FALLBACK_ZH = {
    "the": "这个/那个",
    "of": "属于/关于",
    "and": "和/并且",
    "a": "一个",
    "to": "到/向",
    "in": "在里面",
    "is": "是",
    "you": "你/你们",
    "that": "那个/那",
    "it": "它/这件事",
    "he": "他",
    "for": "为了/给",
    "was": "曾是",
    "on": "在上面",
    "are": "是",
    "as": "作为/像",
    "with": "和/带有",
    "his": "他的",
    "they": "他们",
    "at": "在",
    "be": "是/存在",
    "this": "这个",
    "from": "从",
    "I": "我",
    "have": "有/已经",
    "or": "或者",
    "by": "通过/由",
    "one": "一个",
    "had": "曾有",
    "not": "不",
    "but": "但是",
    "what": "什么",
    "all": "全部",
    "were": "曾是",
    "we": "我们",
    "when": "当...时",
    "your": "你的",
    "can": "能够",
    "said": "说过",
    "there": "那里",
    "use": "使用",
    "an": "一个",
    "each": "每个",
    "which": "哪个/那个",
    "she": "她",
    "do": "做",
    "how": "如何",
    "their": "他们的",
    "if": "如果",
    "will": "将会",
    "up": "向上",
    "other": "其他",
    "about": "关于/大约",
    "out": "出去",
    "many": "许多",
    "then": "然后",
    "them": "他们",
    "these": "这些",
    "so": "所以/如此",
    "some": "一些",
    "her": "她的/她",
    "would": "会/将",
    "make": "制造/使",
    "like": "喜欢/像",
    "him": "他",
    "into": "进入",
    "time": "时间",
    "has": "有",
    "look": "看",
    "two": "两个",
    "more": "更多",
    "write": "写",
    "go": "去",
    "see": "看见",
    "number": "数字/号码",
    "no": "不/没有",
    "way": "方式/道路",
    "could": "可以/可能",
    "people": "人们",
    "my": "我的",
    "than": "比",
    "first": "第一/首先",
    "water": "水",
    "been": "曾经是",
    "call": "打电话/称呼",
    "who": "谁",
    "oil": "油",
    "its": "它的",
    "now": "现在",
    "find": "找到",
    "long": "长的/长期",
    "down": "向下",
    "day": "天",
    "did": "做过",
    "get": "得到",
    "come": "来",
    "made": "制造了",
    "may": "可能/可以",
    "part": "部分",
}

SUPPLEMENTAL_WORDS = [
    "internet", "website", "email", "software", "hardware", "battery",
    "screen", "keyboard", "profile", "password", "download", "upload",
    "browser", "account", "privacy", "security", "climate", "energy",
    "global", "online", "offline", "mobile", "device", "network",
    "algorithm", "dataset", "dashboard", "platform", "startup", "podcast",
    "notification", "subscription", "workspace", "repository", "license",
    "keyword", "search", "ranking", "community", "accessibility", "interface",
    "interactive", "progress", "schedule", "reminder", "favorite", "review",
    "practice", "pronunciation", "accent", "speech", "synthesis", "storage",
    "offline", "export", "import", "customize", "template", "theme",
    "scenario", "chapter", "lesson", "flashcard", "quiz", "memory",
    "context", "narrative", "dialogue", "emotion", "conflict", "evidence",
    "mystery", "romance", "campus", "career", "finance", "health",
    "science", "research", "engineering", "design", "culture", "travel",
    "election", "hospital", "library", "festival", "apartment", "athlete",
    "coach", "witness", "privacy", "climate", "launch", "debug", "deploy",
    "hosting", "domain", "analytics", "maintenance", "contributor",
    "release", "roadmap", "archive", "backup", "sync", "desktop",
    "browser", "extension", "profile", "session", "cookie", "cache",
    "refresh", "monitor", "pipeline", "benchmark", "baseline", "dataset",
    "model", "prompt", "agent", "automation", "workflow", "notebook",
    "spreadsheet", "presentation", "document", "screenshot", "licensee",
]


THEMES = [
    ("The Storm Contract", "暴雨夜的假婚约", "storm-contract", "suspense romance", "a storm-night fake engagement exposes a family debt and a hidden video"),
    ("The Overnight Library Hunt", "图书馆通宵寻宝夜", "overnight-library-hunt", "campus adventure", "students follow library clue cards to recover a hidden scholarship list"),
    ("The Spring Break Bus Trip", "春假前的校车公路旅行", "spring-break-bus-trip", "campus road story", "a film-club bus trip turns into a confession before spring break"),
    ("The Midnight Mock Trial", "午夜模拟法庭", "mock-trial", "campus courtroom", "a student mock trial becomes a public apology and a second chance"),
    ("The Student Office Leak", "学生会办公室泄密风波", "student-office-leak", "campus politics", "a newspaper editor investigates a leaked budget before a debate"),
    ("The Campus Community Festival", "校园社区节", "community-festival", "campus festival", "a broken stage signal turns a campus festival into a treasure hunt"),
    ("The Health Center Night Shift", "校园健康中心夜班", "health-center-night-shift", "campus health story", "a rainy health-center line calms down after students trace a rumor"),
    ("The Campus Demo Day", "校园创业 Demo Day", "campus-demo-day", "student startup drama", "a student team chooses honesty over prize money during demo day"),
    ("The College Town Vote", "大学城学生投票日", "college-town-vote", "campus civic story", "students keep a snowstorm voting station fair and calm"),
    ("The Delayed Train Bag", "晚点列车上的手提包", "delayed-train-bag", "campus travel story", "a delayed train gives an exchange student time to return a missing bag"),
    ("The Apartment Fire Aftermath", "校外公寓火灾之后", "apartment-fire-aftermath", "campus safety story", "students recover a hard drive and learn where an apartment fire began"),
    ("The School Rumor", "学校里的谣言", "school", "social conflict", "a rumor nearly destroys a friendship before the truth comes out"),
    ("The Final Campus Game", "最后一场校内比赛", "final-campus-game", "campus sports story", "a campus final game becomes a lesson in loyalty and public truth"),
    ("The Alumni Dinner Letter", "校友重聚晚宴", "alumni-dinner-letter", "campus reunion story", "an alumni dinner changes when an old letter is read aloud"),
    ("The Graduation Memory Parade", "毕业记忆游行", "graduation-memory-parade", "campus graduation story", "a graduation parade gathers fifteen days of campus memories"),
]


def read_word_list() -> list[str]:
    text = WORDS_JS.read_text(encoding="utf-8")
    names = re.findall(r'"name"\s*:\s*"([^"]+)"', text)
    seen: set[str] = set()
    words: list[str] = []
    for name in names:
        word = name.strip()
        key = word.lower()
        if not word or " " in word or key in seen:
            continue
        seen.add(key)
        words.append(word)
    for word in SUPPLEMENTAL_WORDS:
        if len(words) >= 3000:
            break
        key = word.lower()
        if key not in seen:
            seen.add(key)
            words.append(word)
    if len(words) < 3000:
        raise RuntimeError(f"expected 3000 words, got {len(words)}")
    return words[:3000]


def clean_translation(value: str) -> str:
    value = value.replace("\\n", "\n").strip()
    lines = [line.strip() for line in value.splitlines() if line.strip()]
    usable = []
    for line in lines:
        if line.startswith("[网络]") or line.startswith("[") or line.startswith("网络"):
            continue
        line = re.sub(r"^[a-zA-Z.]+\\s*", "", line)
        line = line.replace("；", "/").replace("，", "/")
        line = re.sub(r"\\s+", " ", line)
        usable.append(line)
    text = "/".join(usable) if usable else value
    text = re.sub(r"/+", "/", text).strip("/ ")
    return text[:42] if text else ""


def read_dictionary(targets: set[str]) -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = {}
    with ECDICT_CSV.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            word = (row.get("word") or "").strip().lower()
            if word not in targets or word in out:
                continue
            zh = clean_translation(row.get("translation") or "")
            pos = (row.get("pos") or "").strip()
            phonetic = (row.get("phonetic") or "").strip()
            if zh:
                out[word] = {"zh": zh, "pos": pos or "word", "phonetic": phonetic}
    return out


def mix_words(words: list[str]) -> list[list[str]]:
    """Interleave ranks so no day becomes an alphabetical or same-level block."""
    lessons = [[] for _ in range(15)]
    for idx, word in enumerate(words):
        lessons[idx % 15].append(word)
    return lessons


def order_story_words(day: int, day_words: list[str]) -> list[str]:
    """Keep Day 01 gentle, then raise the visible opening difficulty a little each day."""
    if day <= 1:
        return day_words
    offset = min((day - 1) * 10, 70)
    return day_words[offset:] + day_words[:offset]


def main() -> None:
    source_words = read_word_list()
    dictionary = read_dictionary({word.lower() for word in source_words})
    lessons = []
    for day, day_words in enumerate(mix_words(source_words), start=1):
        title_en, title_zh, slug, style, premise = THEMES[day - 1]
        entries = []
        for rank, word in enumerate(order_story_words(day, day_words), start=1):
            item = dictionary.get(word.lower(), {})
            zh = item.get("zh") or FALLBACK_ZH.get(word) or "常用词"
            entries.append({
                "word": word,
                "zh": zh,
                "pos": item.get("pos") or "word",
                "phonetic": item.get("phonetic") or "",
                "globalRank": source_words.index(word) + 1,
                "dayRank": rank,
            })
        lessons.append({
            "day": day,
            "titleEn": title_en,
            "titleZh": title_zh,
            "slug": slug,
            "style": style,
            "premise": premise,
            "words": entries,
        })

    js = (
        "// Generated by tools/extract_lessons.py. Do not edit by hand.\n"
        "window.DATA_LICENSES = {\n"
        "  wordList: '3000-words-list@0.0.3, MIT License, Copyright (c) 2015 Tam Pham',\n"
        "  dictionary: 'ECDICT, MIT License, Copyright (c) 2025 Linwei / skywind3000 project lineage'\n"
        "};\n\n"
        "window.LESSONS = "
        + json.dumps(lessons, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )
    OUT.write_text(js, encoding="utf-8")
    print(f"wrote {OUT} with {sum(len(day['words']) for day in lessons)} words")


if __name__ == "__main__":
    main()
