(function () {
  "use strict";

  const LESSONS = window.LESSONS || [];
  const DATA_LICENSES = window.DATA_LICENSES || {};
  const STORE_KEY = "storyvocab3000.progress.v2";
  const MENU_OPEN_DELAY = 620;
  const MENU_CLOSE_DELAY = 820;
  const REVIEW_SLOTS = 100;
  const DEFAULT_DENSITY = 30;

  const PHRASE_OVERRIDES = {
    listen: "listen to",
    listened: "listened to",
    listening: "listening to",
    looks: "looks at",
    look: "look at",
    looked: "looked at",
    looking: "looking at",
    wait: "wait for",
    waited: "waited for",
    waiting: "waiting for",
    talk: "talk to",
    talked: "talked to",
    talking: "talking to",
    speak: "speak to",
    spoke: "spoke to",
    speaking: "speaking to",
    belong: "belong to",
    belongs: "belongs to",
    belonged: "belonged to",
    depend: "depend on",
    depends: "depends on",
    depended: "depended on",
    according: "according to",
    based: "based on",
    interested: "interested in",
    afraid: "afraid of",
    similar: "similar to",
    different: "different from",
    responsible: "responsible for",
    full: "full of",
    proud: "proud of",
    aware: "aware of",
    capable: "capable of",
    ask: "ask for",
    asked: "asked for",
    asking: "asking for",
    pay: "pay for",
    paid: "paid for",
    paying: "paying for",
    care: "care about",
    cared: "cared about",
    caring: "caring about",
    think: "think about",
    thought: "thought about",
    thinking: "thinking about",
    deal: "deal with",
    dealt: "dealt with",
    dealing: "dealing with",
    agree: "agree with",
    agreed: "agreed with",
    agreeing: "agreeing with",
    arrive: "arrive at",
    arrived: "arrived at",
    arriving: "arriving at",
    search: "search for",
    searched: "searched for",
    searching: "searching for",
    focus: "focus on",
    focused: "focused on",
    focusing: "focusing on",
    turn: "turn into",
    turned: "turned into",
    turning: "turning into",
    lead: "lead to",
    led: "led to",
    leading: "leading to",
    consist: "consist of",
    consists: "consists of",
    consisted: "consisted of",
    prepare: "prepare for",
    prepared: "prepared for",
    preparing: "preparing for",
    protect: "protect from",
    protected: "protected from",
    suffer: "suffer from",
    suffered: "suffered from",
    reply: "reply to",
    replied: "replied to",
    replying: "replying to",
    refer: "refer to",
    referred: "referred to",
    referring: "referring to"
  };

  const state = loadState();
  const menuTimers = new WeakMap();
  let activeFilter = "all";

  const storyFrames = {
    cinematic: [
      "雨夜把城市压得很低，主角沿着空街追一条线索。镜头先扫过 {0}，再落到 {1}；她听见有人低声提到 {2}，却在玻璃反光里看见 {3}。几秒后，{4} 成了钥匙，{5} 成了陷阱，{6} 像一盏危险的灯。她把 {7} 写在手心，又把 {8} 藏进口袋。门外的人以为她只是在等 {9}，其实她已经准备好用 {10} 换一个答案。她不敢相信 {11}，却不得不面对 {12}；当警报响起，{13}、{14}、{15} 同时出现。最后，她穿过走廊，抓住 {16}，推开 {17}，在天亮前做出 {18} 和 {19}。",
      "第二幕从一通电话开始。对方说 {0} 不只是词，而是今晚活下去的密码。她回头看见 {1}，又在桌上发现 {2}。所有人都在谈 {3}，只有她注意到 {4}。她的同伴想用 {5} 解决问题，可真正的危险来自 {6}。如果她选择 {7}，就会失去 {8}；如果她拒绝 {9}，就必须承担 {10}。她把 {11} 给了陌生人，把 {12} 留给自己。风声里，{13} 像证词，{14} 像谎言，{15} 像还没说出口的告白。她终于明白：{16} 不是终点，{17} 不是退路，{18} 和 {19} 才是今晚的真相。"
    ],
    campus: [
      "校园钟声停在半夜，图书馆里只剩一盏灯。她先在借书卡上看到 {0}，又在座位下面找到 {1}。管理员说 {2} 很普通，可学生们都在传 {3}。她和朋友把 {4} 贴到白板上，用 {5} 标出可疑时间。窗外有人喊 {6}，楼梯口却只留下 {7}。她想问 {8}，却收到一条关于 {9} 的匿名消息。为了保护 {10}，她必须学会看懂 {11}。夜越来越深，{12}、{13}、{14} 排成一条线索。她把 {15} 放进口袋，带着 {16} 冲出阅览室，直到 {17}、{18}、{19} 一起指向被锁住的地下室。",
      "第二天，老师宣布一切只是误会。她不信，因为 {0} 的位置变了，{1} 的字迹也变了。朋友建议从 {2} 查起，校报却突然刊出 {3}。她在走廊里听见 {4}，在公告栏上看见 {5}。每个人都想隐藏 {6}，每个人又都需要 {7}。她把 {8} 和 {9} 做了比较，发现真正的答案藏在 {10} 后面。到黄昏时，{11} 成了证据，{12} 成了动机，{13} 成了最后一把钥匙。她不再害怕 {14}，也不再等待 {15}。她写下 {16}，说出 {17}，让 {18} 和 {19} 重新回到光下。"
    ],
    startup: [
      "发布会开始前十分钟，大屏忽然黑掉。工程师在后台喊着 {0}，运营团队忙着解释 {1}，创始人却盯着日志里的 {2}。有人把 {3} 当成小错误，没人知道它会引爆 {4}。她打开控制台，看见 {5} 和 {6} 连在一起。投资人等着 {7}，媒体追问 {8}，用户只关心 {9}。她必须在 {10} 前做决定：公开 {11}，还是继续掩盖 {12}。当倒计时跳到最后一分钟，{13}、{14}、{15} 全部失控。她按下按钮，让 {16} 上线，也让 {17} 曝光。掌声停下后，真正改变公司的，是 {18} 和 {19}。",
      "凌晨两点，办公室只剩咖啡和警报声。她把 {0} 写进事故报告，又把 {1} 标成高危。老板希望用 {2} 稳住舆论，可团队知道 {3} 才是根本。前端在修 {4}，后端在追 {5}，法务在讨论 {6}。她忽然发现 {7} 不是漏洞，而是人为留下的门。要抓住内鬼，她需要 {8}、{9} 和一点运气。天亮前，{10} 变成公开声明，{11} 变成用户信任，{12} 变成团队边界。她终于敢说：{13} 可以失败，{14} 可以重来，但 {15}、{16}、{17}、{18}、{19} 不能再被牺牲。"
    ],
    comedy: [
      "事情坏就坏在大家都太自信。老板说 {0} 很简单，实习生说 {1} 也不难，结果五分钟后，整间屋子都在找 {2}。前台抱着 {3} 冲进来，保安误会了 {4}，会计把 {5} 当成发票。主角本来只想喝咖啡，却被迫解释 {6}、{7}、{8} 的区别。电话那头的人还在重复 {9}，旁边的人已经开始为 {10} 鼓掌。她只好拿起白板笔，把 {11} 画成路线，把 {12} 写成警告。笑声里，{13}、{14}、{15} 全都露馅。最后大家才发现，真正重要的不是 {16}，而是 {17}、{18} 和 {19}。",
      "午饭后，混乱升级。有人把 {0} 放进冰箱，有人把 {1} 发给全公司，还有人认真讨论 {2} 是否违法。主角想保持礼貌，却被迫处理 {3}。她先安抚 {4}，再拦住 {5}，最后发现 {6} 才是幕后主使。会议室里，{7} 像炸弹，{8} 像笑话，{9} 像一份迟到的道歉。她问每个人是否理解 {10}，大家同时点头，又同时问 {11}。于是她换了办法：把 {12} 做成故事，把 {13} 做成选择题，把 {14} 做成惩罚。到下班时，{15} 解决了，{16} 留下了，{17}、{18}、{19} 竟然成了团队传统。"
    ],
    travel: [
      "公路穿过平原，车里只有地图、汽水和一封旧信。她在第一站听见 {0}，在第二站买下 {1}，在第三站遇到一个知道 {2} 的老人。朋友负责记录 {3}，她负责追踪 {4}。天边的云像 {5}，远处的灯像 {6}。每到一个小镇，{7} 都会换一种说法，{8} 却始终指向同一个方向。夜里，他们把车停在桥边，讨论 {9}、{10} 和 {11}。如果继续向前，就可能找到 {12}；如果回头，就能保住 {13}。最后，她把 {14} 放到仪表盘上，踩下油门，让 {15}、{16}、{17}、{18}、{19} 一起进入下一段路。",
      "第二天清晨，导航失灵，雨刷坏了，咖啡也洒了。朋友说这是 {0}，她说这是线索。加油站的收银员递来 {1}，背面写着 {2}。他们沿着河开，看到 {3}，避开 {4}，追上 {5}。路越走越窄，故事却越来越大。她开始明白，{6} 不只是地点，{7} 不只是时间，{8} 不只是名字。每个人都带着 {9}，也害怕 {10}。傍晚，他们终于来到那座废弃旅馆。门牌上刻着 {11}，墙上画着 {12}，柜台后藏着 {13}。她推门进去，带着 {14}、{15}、{16}、{17}、{18}、{19}，也带着一个新的自己。"
    ]
  };

  const frameCycle = ["cinematic", "campus", "travel", "cinematic", "startup", "campus", "cinematic", "startup", "cinematic", "travel", "cinematic", "campus", "travel", "cinematic", "cinematic"];

  const themeProfiles = {
    cinematic: {
      mixed: [
        "雨夜像一部快速剪辑的悬疑片。每个 clue 都带一点 danger, every choice 都像在倒计时。",
        "镜头切到走廊尽头，灯忽明忽暗。She was no longer just reading words; she was reading a threat."
      ],
      english: [
        "In the rain-cut city, every reflection looked like evidence and every sound arrived late.",
        "The second scene moved faster: a locked door, a hidden file, and a voice that refused to explain itself."
      ]
    },
    campus: {
      mixed: [
        "午夜校园安静得不正常，library light still burned, and every note on the desk felt suspicious.",
        "第二天的走廊像一条长长的 puzzle. Students smiled in Chinese, but their secrets moved in English."
      ],
      english: [
        "At the edge of campus, the library kept one light on as if it knew the truth would return.",
        "By morning, every hallway had a rumor, every locker had a mark, and every friendly face looked rehearsed."
      ]
    },
    startup: {
      mixed: [
        "发布会前十分钟，dashboard went dark. Everyone wanted a clean story, but the logs told another one.",
        "凌晨办公室只剩 keyboard sound 和冷掉的咖啡。The product was live, yet the real problem was human."
      ],
      english: [
        "Ten minutes before launch, the screen went black and the quiet office became a courtroom.",
        "At 2:00 a.m., the team stopped selling a product and started defending a promise."
      ]
    },
    comedy: {
      mixed: [
        "这场混乱本来只需要一个 explanation, but everyone tried to be clever at the same time.",
        "午饭后，事情越来越离谱。The office wanted order; the story preferred jokes."
      ],
      english: [
        "The disaster began politely, which made it much worse when everybody tried to help.",
        "After lunch, common sense left the room and the meeting became a small public experiment."
      ]
    },
    travel: {
      mixed: [
        "公路一直向西，the map was old, the sky was wide, and every stop changed the meaning of the trip.",
        "清晨的加油站像一个 checkpoint. They bought coffee, lost the route, and found a new clue."
      ],
      english: [
        "The road crossed a wide plain where every town looked ordinary until the old letter named it.",
        "By sunrise, the map had failed, the radio had gone silent, and the journey finally became honest."
      ]
    }
  };

  function loadState() {
    try {
      return Object.assign({
        currentDay: 1,
        theme: "cinematic",
        englishDensity: DEFAULT_DENSITY,
        reviewSeed: 0,
        words: {},
        customWords: [],
        completedDays: {}
      }, JSON.parse(localStorage.getItem(STORE_KEY) || "{}"));
    } catch {
      return { currentDay: 1, theme: "cinematic", englishDensity: DEFAULT_DENSITY, reviewSeed: 0, words: {}, customWords: [], completedDays: {} };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      toast("当前浏览器限制本地存储，本次可用但刷新后可能丢进度。");
    }
  }

  function lesson() {
    return LESSONS[state.currentDay - 1] || LESSONS[0];
  }

  function wordId(item) {
    return item.id || item.word;
  }

  function entryFor(item) {
    const id = wordId(item);
    state.words[id] ||= { seen: 0, right: 0, wrong: 0, favorite: false, known: false, review: false, interval: 0, due: state.currentDay };
    return state.words[id];
  }

  function shortZh(text) {
    return String(text || "常用词")
      .replace(/\b[a-z.]+\s*/gi, "")
      .replace(/[;,，；].*$/, "")
      .replace(/\s+/g, "")
      .slice(0, 8) || "常用词";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function phraseFor(item) {
    const phrase = PHRASE_OVERRIDES[String(item.word || "").toLowerCase()];
    return phrase ? { root: item.word, text: phrase } : null;
  }

  function displayWord(item) {
    return phraseFor(item)?.text || item.word;
  }

  function spokenText(item) {
    return typeof item === "string" ? item : displayWord(item);
  }

  function chip(item) {
    const entry = entryFor(item);
    const phrase = phraseFor(item);
    const shown = displayWord(item);
    const classes = ["word-chip"];
    if (phrase) classes.push("phrase");
    if (entry.favorite) classes.push("favorite");
    if (entry.review) classes.push("review");
    if (entry.known) classes.push("known");
    const menuTitle = phrase
      ? `${item.phonetic ? "/" + item.phonetic + "/ · " : ""}phrase · ${item.word} -> ${shown} · ${item.zh || "常用词"}`
      : `${item.phonetic ? "/" + item.phonetic + "/ · " : ""}${item.pos || "word"} · ${item.zh || "常用词"}`;
    return `<span class="${classes.join(" ")}" tabindex="0" data-word="${escapeHtml(item.word)}" data-say="${escapeHtml(shown)}" data-id="${escapeHtml(wordId(item))}">
      <span class="word-en">${escapeHtml(shown)}</span>
      <span class="word-zh">${escapeHtml(shortZh(item.zh))}</span>
      <span class="word-menu" role="tooltip">
        <span class="menu-title">${escapeHtml(menuTitle)}</span>
        <span class="menu-actions">
          <button data-action="say" data-id="${escapeHtml(wordId(item))}" data-say="${escapeHtml(shown)}">美音</button>
          <button data-action="favorite" data-id="${escapeHtml(wordId(item))}">收藏</button>
          <button data-action="known" data-id="${escapeHtml(wordId(item))}">会了</button>
          <button data-action="review" data-id="${escapeHtml(wordId(item))}">复习</button>
        </span>
      </span>
    </span>`;
  }

  function fillFrame(frame, group) {
    return frame.replace(/\{(\d+)\}/g, (_, index) => {
      const item = group[Number(index)];
      return item ? chip(item) : "";
    });
  }

  function adaptiveParagraph(group, selectedTheme, density, paragraphIndex) {
    const profile = themeProfiles[selectedTheme] || themeProfiles.cinematic;
    const c = (index) => group[index] ? chip(group[index]) : "";
    if (density >= 90) {
      return `${profile.english[paragraphIndex % profile.english.length]} ${c(0)} was the first signal, and ${c(1)} changed the room before anyone could breathe. She read the mark ${c(2)}, tested the warning ${c(3)}, and kept the clue ${c(4)} close. In the next minute, ${c(5)} sounded ordinary, but ${c(6)} felt dangerous; ${c(7)} opened one door while ${c(8)} closed another. Nobody wanted to admit ${c(9)}. She kept moving because the clue ${c(10)} mattered, because ${c(11)} was missing, and because ${c(12)} pointed to the person behind the plan. Near the end, ${c(13)}, ${c(14)}, and ${c(15)} collided in one bright second. She chose the path marked ${c(16)}, carried the clue ${c(17)} through the noise, and let ${c(18)} and ${c(19)} decide what happened next.`;
    }
    return `${profile.mixed[paragraphIndex % profile.mixed.length]} ${c(0)} 先把场景点亮，and ${c(1)} pushed the story forward. 她在 ${c(2)} 和 ${c(3)} 之间做选择，while ${c(4)} kept changing the room. Someone tried to explain ${c(5)}，可真正的问题是 ${c(6)}. Then ${c(7)} became a promise, ${c(8)} became a warning, and ${c(9)} made everyone quiet. 她把 ${c(10)} 写在便签上，把 ${c(11)} 藏进口袋。By the time ${c(12)} appeared, she had to keep ${c(13)} close, test ${c(14)}, and follow the trace of ${c(15)}. 最后一段路上，${c(16)}, ${c(17)}, ${c(18)}, and ${c(19)} together turned the story into a choice.`;
  }

  function buildStory(items, selectedTheme, selectedDensity = state.englishDensity) {
    const theme = selectedTheme || state.theme || frameCycle[state.currentDay - 1] || "cinematic";
    const density = Number(selectedDensity) || DEFAULT_DENSITY;
    const frames = storyFrames[theme] || storyFrames.cinematic;
    const paragraphs = [];
    for (let i = 0; i < items.length; i += 20) {
      const group = items.slice(i, i + 20);
      const paragraphIndex = i / 20;
      const html = density <= 30
        ? fillFrame(frames[paragraphIndex % frames.length], group)
        : adaptiveParagraph(group, theme, density, paragraphIndex);
      paragraphs.push(`<p>${html}</p>`);
    }
    return paragraphs.join("");
  }

  function allWords() {
    return LESSONS.flatMap((day) => day.words.map((word) => ({ ...word, day: day.day, id: `d${day.day}-${word.word}` }))).concat(state.customWords);
  }

  function findWord(id) {
    return allWords().find((item) => wordId(item) === id || item.word === id);
  }

  function speak(word) {
    const text = spokenText(word);
    if (!("speechSynthesis" in window)) {
      toast("这个浏览器不支持语音合成。");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    utterance.pitch = 1;
    utterance.voice =
      voices.find((voice) => voice.lang === "en-US" && /Samantha|Alex|Google|Microsoft|United States/i.test(voice.name)) ||
      voices.find((voice) => voice.lang === "en-US") ||
      null;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  function toast(message) {
    const node = document.getElementById("toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 1800);
  }

  function markFavorite(item) {
    const entry = entryFor(item);
    entry.favorite = !entry.favorite;
    saveAndRender(entry.favorite ? `${item.word} 已收藏。` : `${item.word} 已取消收藏。`);
  }

  function markKnown(item) {
    const entry = entryFor(item);
    entry.known = true;
    entry.review = false;
    entry.seen += 1;
    entry.right += 1;
    entry.interval = Math.max(entry.interval, 4);
    entry.due = state.currentDay + entry.interval;
    saveAndRender(`${item.word} 已标记会了。`);
  }

  function markReview(item) {
    const entry = entryFor(item);
    entry.review = true;
    entry.known = false;
    entry.seen += 1;
    entry.wrong += 1;
    entry.interval = 1;
    entry.due = state.currentDay + 1;
    saveAndRender(`${item.word} 已加入错词复习。`);
  }

  function rateWord(item, rating) {
    const entry = entryFor(item);
    const intervals = { again: 1, hard: 2, good: Math.max(4, entry.interval + 3), easy: Math.max(8, entry.interval + 7) };
    entry.seen += 1;
    entry.interval = intervals[rating];
    entry.due = state.currentDay + entry.interval;
    if (rating === "again") {
      entry.wrong += 1;
      entry.review = true;
      entry.known = false;
    } else {
      entry.right += 1;
      entry.review = false;
      entry.known = rating === "easy" || entry.right >= 2;
    }
    saveAndRender(`${item.word}: ${rating}，下次 Day ${entry.due}`);
  }

  function buildReviewSlots() {
    const pool = [];
    const available = allWords().filter((item) => !item.day || item.day <= state.currentDay);
    available.forEach((item) => {
      const entry = entryFor(item);
      let weight = 0;
      if (entry.due <= state.currentDay) weight += 3;
      if (entry.favorite) weight += 3;
      if (entry.review || entry.wrong > entry.right) weight += 4;
      if (item.day === state.currentDay && entry.seen === 0) weight += 1;
      for (let i = 0; i < Math.max(weight, 0); i += 1) pool.push(item);
    });
    const fallback = lesson().words.map((item) => ({ ...item, day: lesson().day, id: `d${lesson().day}-${item.word}` }));
    const source = pool.length ? pool : fallback.slice(0, REVIEW_SLOTS);
    const slots = [];
    const offset = state.reviewSeed % source.length;
    while (slots.length < REVIEW_SLOTS) {
      slots.push(source[(offset + slots.length) % source.length]);
    }
    return slots;
  }

  function renderDayOptions() {
    const select = document.getElementById("daySelect");
    select.innerHTML = LESSONS.map((item) => `<option value="${item.day}">Day ${String(item.day).padStart(2, "0")} · ${escapeHtml(item.titleZh)}</option>`).join("");
    select.value = String(state.currentDay);
  }

  function renderStory() {
    const data = lesson();
    const items = data.words.map((item) => ({ ...item, day: data.day, id: `d${data.day}-${item.word}` }));
    document.getElementById("heroDay").textContent = `Day ${String(data.day).padStart(2, "0")}`;
    document.getElementById("heroTitle").textContent = data.titleZh;
    document.getElementById("storyHeading").textContent = `Story ${String(data.day).padStart(2, "0")}: ${data.titleEn}`;
    document.getElementById("storyStyle").textContent = `${data.style} · ${data.premise}`;
    document.getElementById("themeSelect").value = state.theme;
    document.getElementById("densitySelect").value = String(state.englishDensity || DEFAULT_DENSITY);
    const storyText = document.getElementById("storyText");
    storyText.dataset.density = String(state.englishDensity || DEFAULT_DENSITY);
    storyText.innerHTML = buildStory(items, state.theme, state.englishDensity);
  }

  function renderStats() {
    const availableWords = allWords().filter((item) => !item.day || item.day <= state.currentDay);
    const entries = availableWords.map(entryFor);
    const todayEntries = lesson().words.map((item) => entryFor({ ...item, id: `d${lesson().day}-${item.word}` }));
    const seen = entries.filter((entry) => entry.seen > 0).length;
    const favorites = entries.filter((entry) => entry.favorite).length;
    const due = entries.filter((entry) => entry.due <= state.currentDay || entry.review).length;
    document.getElementById("metricNew").textContent = lesson().words.length;
    document.getElementById("metricReview").textContent = REVIEW_SLOTS;
    document.getElementById("metricSeen").textContent = seen;
    document.getElementById("metricFav").textContent = favorites;
    document.getElementById("stateSummary").textContent =
      `今日已接触 ${todayEntries.filter((entry) => entry.seen > 0).length}/${todayEntries.length} 个；全局收藏 ${favorites} 个；当前到期或错词 ${due} 个；英文占比 ${state.englishDensity || DEFAULT_DENSITY}%。`;
  }

  function renderReview() {
    const grid = document.getElementById("reviewGrid");
    grid.innerHTML = buildReviewSlots().map((item, index) => `<article class="review-card">
      <span class="slot">slot ${String(index + 1).padStart(2, "0")} / ${REVIEW_SLOTS}</span>
      <span class="review-word">${escapeHtml(displayWord(item))}</span>
      <span class="answer hidden">${escapeHtml(item.zh)} ${item.phonetic ? " /" + escapeHtml(item.phonetic) + "/" : ""}</span>
      <div class="card-actions">
        <button class="tiny-button" data-action="say" data-id="${escapeHtml(wordId(item))}" data-say="${escapeHtml(displayWord(item))}">美音</button>
        <button class="tiny-button" data-action="show-answer">看释义</button>
      </div>
      <div class="rate-row">
        <button class="tiny-button warn" data-action="rate" data-rating="again" data-id="${escapeHtml(wordId(item))}">忘了</button>
        <button class="tiny-button" data-action="rate" data-rating="hard" data-id="${escapeHtml(wordId(item))}">勉强</button>
        <button class="tiny-button good" data-action="rate" data-rating="good" data-id="${escapeHtml(wordId(item))}">记得</button>
        <button class="tiny-button good" data-action="rate" data-rating="easy" data-id="${escapeHtml(wordId(item))}">秒懂</button>
      </div>
    </article>`).join("");
  }

  function renderWordbook() {
    const query = document.getElementById("wordSearch").value.trim().toLowerCase();
    const words = allWords().filter((item) => {
      const entry = entryFor(item);
      const text = `${item.word} ${displayWord(item)} ${item.zh} ${item.pos} ${item.phonetic}`.toLowerCase();
      if (query && !text.includes(query)) return false;
      if (activeFilter === "favorite") return entry.favorite;
      if (activeFilter === "review") return entry.review || entry.wrong > entry.right;
      if (activeFilter === "known") return entry.known;
      if (activeFilter === "custom") return item.custom;
      return true;
    }).slice(0, 240);
    document.getElementById("wordGrid").innerHTML = words.map((item) => {
      const entry = entryFor(item);
      return `<article class="word-card">
        <span class="meta">${item.custom ? "custom" : "day " + String(item.day).padStart(2, "0")} · ${escapeHtml(item.pos || "word")}</span>
        <strong>${escapeHtml(displayWord(item))}</strong>
        <span>${escapeHtml(item.zh)}</span>
        ${phraseFor(item) ? `<span class="meta">root word: ${escapeHtml(item.word)}</span>` : ""}
        <span class="meta">${item.phonetic ? "/" + escapeHtml(item.phonetic) + "/" : "en-US speech"}</span>
        <div class="card-actions">
          <button class="tiny-button" data-action="say" data-id="${escapeHtml(wordId(item))}" data-say="${escapeHtml(displayWord(item))}">美音</button>
          <button class="tiny-button ${entry.favorite ? "warn" : ""}" data-action="favorite" data-id="${escapeHtml(wordId(item))}">${entry.favorite ? "已收藏" : "收藏"}</button>
          <button class="tiny-button good" data-action="known" data-id="${escapeHtml(wordId(item))}">会了</button>
          <button class="tiny-button warn" data-action="review" data-id="${escapeHtml(wordId(item))}">复习</button>
        </div>
      </article>`;
    }).join("");
  }

  function renderCustomStory() {
    const theme = document.getElementById("customTheme").value.trim() || "自定义主题";
    const items = state.customWords.slice(0, 200);
    if (!items.length) {
      document.getElementById("customStory").innerHTML = "<p>先导入一些自定义词，再生成阅读。</p>";
      return;
    }
    const normalized = items.map((item, index) => ({ ...item, id: item.id || `custom-${index}` }));
    document.getElementById("customStory").innerHTML = `<p class="eyebrow">${escapeHtml(theme)} · English ${state.englishDensity || DEFAULT_DENSITY}%</p>${buildStory(normalized, state.theme, state.englishDensity)}`;
  }

  function renderAbout() {
    document.getElementById("licenseSummary").textContent = `${DATA_LICENSES.wordList || ""}；${DATA_LICENSES.dictionary || ""}`;
  }

  function renderAll() {
    renderDayOptions();
    renderStory();
    renderStats();
    renderReview();
    renderWordbook();
    renderAbout();
  }

  function saveAndRender(message) {
    saveState();
    renderAll();
    toast(message);
  }

  function clearChipMenuTimers(chipNode) {
    const timers = menuTimers.get(chipNode);
    if (!timers) return;
    clearTimeout(timers.open);
    clearTimeout(timers.close);
  }

  function scheduleChipMenuOpen(chipNode) {
    clearChipMenuTimers(chipNode);
    const open = setTimeout(() => chipNode.classList.add("open"), MENU_OPEN_DELAY);
    menuTimers.set(chipNode, { open, close: null });
  }

  function scheduleChipMenuClose(chipNode) {
    clearChipMenuTimers(chipNode);
    const close = setTimeout(() => chipNode.classList.remove("open"), MENU_CLOSE_DELAY);
    menuTimers.set(chipNode, { open: null, close });
  }

  function parseCustom(text) {
    return text.split(/\n+/).map((line, index) => {
      const parts = line.split(/,|\t|\|/).map((part) => part.trim()).filter(Boolean);
      if (!parts[0]) return null;
      return { id: `custom-${Date.now()}-${index}`, word: parts[0], zh: parts[1] || "自定义释义", pos: parts[2] || "custom", phonetic: "", custom: true };
    }).filter(Boolean);
  }

  function exportFile(name, text, type = "application/json") {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function copyAiPrompt() {
    const customWords = state.customWords.slice(0, 200).map((item) => `${item.word}|${item.zh}|${item.pos}`).join("\n");
    const theme = document.getElementById("customTheme").value.trim() || "任意吸引人的故事主题";
    const prompt = `请用以下自定义词写一篇中文为主、英文词嵌入的英语学习故事。主题：${theme}。英文占比约 ${state.englishDensity || DEFAULT_DENSITY}%。常见搭配请尽量显示为短语，例如 listen 写成 listen to，depend 写成 depend on。每个英文词或短语都要自然出现，并在词后给中文提示。\n\n${customWords}`;
    navigator.clipboard?.writeText(prompt).then(() => toast("AI 重写提示已复制。")).catch(() => {
      exportFile("storyvocab-ai-prompt.txt", prompt, "text/plain;charset=utf-8");
      toast("无法复制，已下载提示文件。");
    });
  }

  document.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (tab) {
      document.querySelectorAll(".tab").forEach((node) => node.classList.toggle("active", node === tab));
      document.querySelectorAll(".panel").forEach((node) => node.classList.toggle("active", node.id === tab.dataset.panel));
      return;
    }

    const chipNode = event.target.closest(".word-chip");
    if (chipNode && !event.target.closest("button")) {
      speak(chipNode.dataset.say || chipNode.dataset.word);
      const item = findWord(chipNode.dataset.id);
      if (item) {
        entryFor(item).seen += 1;
        saveState();
        renderStats();
      }
      return;
    }

    const actionNode = event.target.closest("[data-action]");
    if (!actionNode) return;
    const action = actionNode.dataset.action;
    const item = actionNode.dataset.id ? findWord(actionNode.dataset.id) : null;

    if (action === "say" && item) speak(actionNode.dataset.say || item);
    if (action === "favorite" && item) markFavorite(item);
    if (action === "known" && item) markKnown(item);
    if (action === "review" && item) markReview(item);
    if (action === "rate" && item) rateWord(item, actionNode.dataset.rating);
    if (action === "show-answer") {
      const answer = actionNode.closest(".review-card").querySelector(".answer");
      answer.classList.toggle("hidden");
      actionNode.textContent = answer.classList.contains("hidden") ? "看释义" : "隐藏释义";
    }
    if (action === "shuffle-review") {
      state.reviewSeed += 17;
      saveAndRender("复习顺序已重排。");
    }
    if (action === "complete-day") {
      lesson().words.forEach((word) => {
        const item = { ...word, day: lesson().day, id: `d${lesson().day}-${word.word}` };
        const entry = entryFor(item);
        if (entry.seen === 0) entry.seen = 1;
        if (entry.interval === 0) entry.interval = 1;
        if (entry.due <= state.currentDay) entry.due = state.currentDay + entry.interval;
      });
      state.completedDays[state.currentDay] = new Date().toISOString();
      saveAndRender(`Day ${state.currentDay} 已完成。`);
    }
    if (action === "export-progress") exportFile("storyvocab-progress.json", JSON.stringify(state, null, 2));
    if (action === "reset-view") window.scrollTo({ top: 0, behavior: "smooth" });
    if (action === "speak-paragraph") {
      const openingWords = Array.from(document.querySelectorAll("#storyText .word-en")).slice(0, 24).map((node) => node.textContent.trim()).join(", ");
      speak(openingWords || "StoryVocab 3000");
    }
    if (action === "import-custom") {
      const imported = parseCustom(document.getElementById("customInput").value);
      state.customWords.push(...imported);
      saveAndRender(`已导入 ${imported.length} 个自定义词。`);
    }
    if (action === "export-wordbook") {
      exportFile("storyvocab-custom-wordbook.json", JSON.stringify(state.customWords, null, 2));
    }
    if (action === "render-custom-story") renderCustomStory();
    if (action === "copy-ai-prompt") copyAiPrompt();
  });

  document.addEventListener("mouseover", (event) => {
    const chipNode = event.target.closest(".word-chip");
    if (!chipNode || chipNode.contains(event.relatedTarget)) return;
    scheduleChipMenuOpen(chipNode);
  });

  document.addEventListener("mouseout", (event) => {
    const chipNode = event.target.closest(".word-chip");
    if (!chipNode || chipNode.contains(event.relatedTarget)) return;
    scheduleChipMenuClose(chipNode);
  });

  document.addEventListener("focusin", (event) => {
    const chipNode = event.target.closest(".word-chip");
    if (chipNode) chipNode.classList.add("open");
  });

  document.addEventListener("focusout", (event) => {
    const chipNode = event.target.closest(".word-chip");
    if (chipNode) chipNode.classList.remove("open");
  });

  document.getElementById("daySelect").addEventListener("change", (event) => {
    state.currentDay = Number(event.target.value);
    saveAndRender(`切换到 Day ${state.currentDay}`);
  });

  document.getElementById("themeSelect").addEventListener("change", (event) => {
    state.theme = event.target.value;
    saveAndRender("写作主题已切换。");
  });

  document.getElementById("densitySelect").addEventListener("change", (event) => {
    state.englishDensity = Number(event.target.value) || DEFAULT_DENSITY;
    saveAndRender(`英文占比已切换到 ${state.englishDensity}%。`);
  });

  document.getElementById("wordSearch").addEventListener("input", renderWordbook);

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((node) => node.classList.toggle("active", node === button));
      renderWordbook();
    });
  });

  if ("speechSynthesis" in window) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }

  renderAll();
})();
