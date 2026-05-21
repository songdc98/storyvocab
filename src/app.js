(function () {
  "use strict";

  const LESSONS = window.LESSONS || [];
  const DATA_LICENSES = window.DATA_LICENSES || {};
  const STORE_KEY = "storyvocab.progress.v3";
  const LEGACY_STORE_KEYS = ["storyvocab3000.progress.v2"];
  const MENU_OPEN_DELAY = 620;
  const MENU_CLOSE_DELAY = 820;
  const DEFAULT_NEW_WORDS = 200;
  const DEFAULT_REVIEW_SLOTS = 100;
  const DEFAULT_DENSITY = 30;
  const DEFAULT_COLOR_MODE = "dark";
  const HARD_WORD_SHARE = 0.3;
  const HARD_WORD_FALLBACK_RANK = 1800;

  const LOW_VALUE_WORDS = new Set([
    "the", "a", "an", "of", "and", "to", "in", "is", "are", "was", "were", "be", "been", "being", "am",
    "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "them", "my", "your", "his", "its", "our", "their",
    "this", "that", "these", "those", "what", "which", "who", "whom", "whose", "where", "when", "why", "how",
    "as", "at", "by", "for", "from", "with", "on", "into", "onto", "over", "under", "above", "up", "down", "out", "off",
    "about", "after", "before", "between", "through", "during", "because", "if", "then", "so", "than",
    "very", "just", "only", "ever", "already", "now", "here", "there", "not", "no", "yes",
    "do", "does", "did", "done", "doing", "will", "would", "can", "could", "should", "may", "might", "must", "shall",
    "have", "has", "had", "having", "get", "got", "make", "made", "go", "went", "gone", "come", "came",
    "see", "saw", "seen", "look", "looks", "looked", "looking", "say", "said", "tell", "told", "ask", "asked",
    "use", "used", "using", "let", "lets", "let's", "like", "such", "some", "any", "all", "each", "every", "other", "another",
    "one", "two", "first", "second", "third", "more", "most", "many", "much", "few", "little", "long", "short", "good", "bad", "great", "big", "small", "old", "new", "same", "different",
    "but", "also", "it's", "thats", "that's", "don't", "didn't", "can't", "couldn't", "wasn't", "we'll", "we've", "i'm", "you're", "he's", "she's", "they're", "there's",
    "per", "nor", "oh", "f", "t", "thy", "jane", "betsy", "jeff", "you've", "1/2", "2", "5", "12", "17", "18", "30", "60", "70", "90", "200", "500", "etc."
  ]);

  const DAY_DIFFICULT_WORDS = {
    3: [
      "California", "fishing", "member", "degrees", "captain", "hunting", "fence", "explained", "rolled", "laws",
      "spelling", "climate", "atmosphere", "dictionary", "serve", "struck", "kill", "style", "nations", "brain",
      "fought", "shoulders", "hunt", "successful", "instrument", "supplies", "provided", "prevent", "factor", "bare",
      "layer", "measured", "underline", "carries", "combine", "religious", "comfortable", "plus", "loss", "perform",
      "consonant", "airplanes", "owner", "announced", "happening", "package", "positions", "effects", "command", "declared",
      "chamber", "sources", "captured", "shelter", "opinion", "arrive", "require", "discussion", "satellites", "warning",
      "floating", "depth", "shallow", "tales", "brick", "rhyme", "keyword", "theme", "culture", "archive"
    ]
  };

  const DIFFICULT_WORD_SETS = Object.fromEntries(
    Object.entries(DAY_DIFFICULT_WORDS).map(([day, words]) => [day, new Set(words.map((word) => word.toLowerCase()))])
  );

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
  let activeChip = null;

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

  const chapterBeats = [
    {
      lead: "第一幕先把危险压低，像有人把整座城的声音都调暗了。",
      close: "她第一次感觉到，这不是偶然，而是一条被故意留下的路。"
    },
    {
      lead: "线索没有断，只是换了一种更狡猾的方式出现。",
      close: "她把前后的细节连起来，终于听见故事内部轻轻响了一声。"
    },
    {
      lead: "到了第三段，所有人都开始给出解释，可每个解释都缺一角。",
      close: "这一次，她不再追问答案，而是追问谁最害怕答案。"
    },
    {
      lead: "雨停了几分钟，城市却没有变安静，反而像在等待下一次爆炸。",
      close: "她明白真正的选择还没到，但代价已经提前站在门口。"
    },
    {
      lead: "中段忽然转向，原本像背景的人开始变得可疑。",
      close: "她把情绪压下去，只留下足够清醒的一点判断。"
    },
    {
      lead: "第六段里，秘密终于露出边缘，却仍然不肯完整现身。",
      close: "她知道自己离真相更近了，也离安全更远了。"
    },
    {
      lead: "每个人都在说话，但真正重要的是那些没有被说出口的停顿。",
      close: "她开始相信，沉默本身也是一种证词。"
    },
    {
      lead: "临近结尾时，所有小线索开始回到同一个房间。",
      close: "她没有立刻开门，因为门后的人也在等她犯错。"
    },
    {
      lead: "最后的反转来得很轻，轻到旁人几乎错过。",
      close: "她却在那一秒确定，整件事从一开始就不是误会。"
    },
    {
      lead: "天快亮时，故事把所有人推回最初的地方。",
      close: "她带着新的答案离开，也把这些词留在了真正有情绪的记忆里。"
    }
  ];

  function loadState() {
    try {
      const saved = localStorage.getItem(STORE_KEY) || LEGACY_STORE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) || "{}";
      return Object.assign({
        currentDay: 1,
        theme: "campus",
        englishDensity: DEFAULT_DENSITY,
        colorMode: DEFAULT_COLOR_MODE,
        dailyNewCount: DEFAULT_NEW_WORDS,
        reviewSlotCount: DEFAULT_REVIEW_SLOTS,
        connectorEndpoint: "",
        reviewSeed: 0,
        words: {},
        customWords: [],
        completedDays: {}
      }, JSON.parse(saved));
    } catch {
      return { currentDay: 1, theme: "campus", englishDensity: DEFAULT_DENSITY, colorMode: DEFAULT_COLOR_MODE, dailyNewCount: DEFAULT_NEW_WORDS, reviewSlotCount: DEFAULT_REVIEW_SLOTS, connectorEndpoint: "", reviewSeed: 0, words: {}, customWords: [], completedDays: {} };
    }
  }

  function clampNumber(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, Math.round(number)));
  }

  function dailyNewCount() {
    const max = Math.max(1, lesson().words.length);
    return clampNumber(state.dailyNewCount, DEFAULT_NEW_WORDS, Math.min(20, max), max);
  }

  function reviewSlotCount() {
    return clampNumber(state.reviewSlotCount, DEFAULT_REVIEW_SLOTS, 0, 200);
  }

  function hardWordTarget(count) {
    return Math.ceil(count * HARD_WORD_SHARE);
  }

  function applyColorMode() {
    const mode = state.colorMode === "light" ? "light" : "dark";
    state.colorMode = mode;
    document.documentElement.dataset.colorMode = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", mode === "light" ? "#f7f3ec" : "#101626");
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
    const cleaned = String(text || "常用词")
      .replace(/\b[a-z.]+\s*/gi, "")
      .replace(/[;,，；].*$/, "")
      .replace(/\s+/g, "");
    const parts = cleaned.split(/[\/|]/).filter(Boolean);
    const compact = parts.length ? [...new Set(parts)].join("/") : cleaned;
    return compact.slice(0, 8) || "常用词";
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

  function chineseParagraph(group, selectedTheme, paragraphIndex) {
    const beat = chapterBeats[paragraphIndex % chapterBeats.length];
    const profile = themeProfiles[selectedTheme] || themeProfiles.cinematic;
    const c = (index) => group[index] ? chip(group[index]) : "";
    return `${beat.lead} ${profile.mixed[paragraphIndex % profile.mixed.length]} 她先注意到 ${c(0)}，又把 ${c(1)} 和 ${c(2)} 放到同一张时间线上。${c(3)} 让她停下，${c(4)} 让她回头，${c(5)} 则像一只藏在抽屉里的手。为了弄清 ${c(6)}，她不得不重新判断 ${c(7)}、${c(8)} 和 ${c(9)}。同伴以为 ${c(10)} 只是细节，可她知道 ${c(11)} 已经改变局面。走廊尽头，${c(12)} 像证词，${c(13)} 像谎言，${c(14)} 像一封没写完的信。她把 ${c(15)} 留给自己，把 ${c(16)} 交给最不该相信的人。直到 ${c(17)} 出现，${c(18)} 和 ${c(19)} 才真正连上。${beat.close}`;
  }

  function adaptiveParagraph(group, selectedTheme, density, paragraphIndex) {
    const profile = themeProfiles[selectedTheme] || themeProfiles.cinematic;
    const c = (index) => group[index] ? chip(group[index]) : "";
    if (density >= 90) {
      return `${profile.english[paragraphIndex % profile.english.length]} ${c(0)} was the first signal, and ${c(1)} changed the room before anyone could breathe. She read the mark ${c(2)}, tested the warning ${c(3)}, and kept the clue ${c(4)} close. In the next minute, ${c(5)} sounded ordinary, but ${c(6)} felt dangerous; ${c(7)} opened one door while ${c(8)} closed another. Nobody wanted to admit ${c(9)}. She kept moving because the clue ${c(10)} mattered, because ${c(11)} was missing, and because ${c(12)} pointed to the person behind the plan. Near the end, ${c(13)}, ${c(14)}, and ${c(15)} collided in one bright second. She chose the path marked ${c(16)}, carried the clue ${c(17)} through the noise, and let ${c(18)} and ${c(19)} decide what happened next.`;
    }
    return `${profile.mixed[paragraphIndex % profile.mixed.length]} ${c(0)} 先把场景点亮，and ${c(1)} pushed the story forward. 她在 ${c(2)} 和 ${c(3)} 之间做选择，while ${c(4)} kept changing the room. Someone tried to explain ${c(5)}，可真正的问题是 ${c(6)}. Then ${c(7)} became a promise, ${c(8)} became a warning, and ${c(9)} made everyone quiet. 她把 ${c(10)} 写在便签上，把 ${c(11)} 藏进口袋。By the time ${c(12)} appeared, she had to keep ${c(13)} close, test ${c(14)}, and follow the trace of ${c(15)}. 最后一段路上，${c(16)}, ${c(17)}, ${c(18)}, and ${c(19)} together turned the story into a choice.`;
  }

  function dayOneCampusStory(items, density) {
    if (density >= 90) return "";
    const c = (index) => items[index] ? chip(items[index]) : "";
    const paragraphs = [
      `暴雨把 West Hall 的 ${c(0)} 压得像冷玻璃，排水管的 ${c(1)} 一下一下敲着那栋老 ${c(2)} 的东 ${c(3)}。orientation ${c(5)} 的 ${c(4)} stream 正开着，苏念薇刚把箱子推进 ${c(6)}，就发现床底有一封 missing scholarship ${c(7)} 的黑信。信上写：宿舍 ${c(8)} 第三次响起时，立刻 ${c(9)} to the ${c(10)} desk。七点刚 ${c(11)}，窗外 ${c(12)} 把传单卷成白鸟。${c(13)} 是恶作剧，可学生会会长顾凛已经站在门口，像 campus CEO 一样冷着脸说：“你是今晚唯一能救我的 ${c(14)}。”他递来一张 ${c(15)}：假订婚赌局第一 ${c(16)} 开始，她和新 ${c(17)} 都被卷进去。拖得 ${c(18)}，门禁 ${c(19)} 会把一切抹掉。`,
      `她要 ${c(20)} 查账，他负责挡住校董会。那封信被人 ${c(21)} across campus，最后落在化学 ${c(22)} 的地下室。灯光很 ${c(23)}，助教一边 ${c(24)} lab report，一边把暖气 ${c(25)} 调到像审讯室。苏念薇原本周末要 ${c(26)}，连 ${c(27)} 都没梳；冷雨打湿裤脚，她的 ${c(28)} 发抖，却 ${c(29)} 想留下来赢他一次。四个学生的 ${c(30)} 被这笔钱拧成一团，她边 ${c(31)}，边把校园最 ${c(32)} 的传闻写上白板：谁能 ${c(33)} the receipt？账单的 ${c(34)} 像被人故意剪成心形，只差一 ${c(35)} 就会失效；学校 ${c(36)} 的异常记录 ${c(37)} straight to the bursar，连校警的 ${c(38)} channel 都沉默。她换上干 ${c(39)}，准备陪顾凛演完这场戏。`,
      `清晨，室友在草坪上 ${c(40)} frisbee，苏念薇却 ${c(41)} 得睡不着：顾凛的前女友林夏笑得 ${c(42)}，手里拿着一份 ${c(43)} receipt。她显然 ${c(44)} the old stamp，故意把办公室弄得 ${c(45)}，像在等猎物进笼。从东 ${c(46)} 来的雾罩住钟楼，打印机却 ${c(47)} another copy。一个年长 ${c(48)} 走进来，成功抢走所有人的 ${c(49)}，又把一张纸 ${c(50)} under a folder。纸上不是情书，而是解剖课的 ${c(51)}；背面写着顾凛私人 ${c(52)} 的门牌。苏念薇沿走廊 ${c(53)}，手里攥着蓝 ${c(54)}，穿过湿漉漉的 ${c(55)}。${c(56)} to the note, 林夏会在实验室 basic ${c(58)} cabinet 旁制造事故，谁靠近都会 get ${c(57)}；远处 ${c(59)} 被雾吞掉。`,
      `午后，她收到短信：你的 ${c(60)} 知道顾凛为什么选你。她冲回宿舍，看见妹妹正 ${c(61)} at a microscope photo。照片里的 ${c(62)} 因窗台太 ${c(63)} 变色；妹妹抬起 ${c(64)}，用 ${c(65)} 点着边角：someone was ${c(66)} a fake receipt into the frame。顾凛靠在门边，第一次卸下那副冷脸，说他没有 ${c(67)} 对抗整个董事会，只能查出每个学生的 ${c(68)} grant amount。苏念薇突然明白，自己的 ${c(69)} 不是旁观，而是入局。校园 ${c(70)}、旧剧场和食堂后门都变得 ${c(71)}，但她必须 ${c(72)} read the room。地上的 ${c(73)} stopper、门边 ${c(74)} footprints、从四楼 ${c(75)} 下来的水，全部指向 ${c(76)} floor。她必须 ${c(77)} his record before suspicion ${c(78)} into a bad ${c(79)}。`,
      `食堂旁的 ${c(80)} tank 映着她最 ${c(81)} 的长椅，顾凛却把伞塞给她，转身独自面对董事会的 ${c(82)}。公告栏贴着来自 ${c(83)} 的交换项目海报，体育馆里有人练 ${c(84)}，校园看起来正常得可怕。心理学教授讲 investigation ${c(85)}，屏幕却闪过一片 ${c(86)} database。苏念薇咬住 ${c(87)}，在名单里找到一个 quiet ${c(88)} who kept ${c(89)} to himself and never touched the coffee ${c(90)} at meetings。他的计划几乎 ${c(91)}：把天文社 ${c(92)} 模型改成藏钥匙的盒子，把 ${c(93)} report ${c(94)} across the nurse's desk，还逼护士喊一声 ${c(95)}。更离谱的是，语法课上的 ${c(96)} exercise 变成密码表；门口那只橡胶 ${c(97)} 其实是监控壳。她从侧 ${c(98)} 进楼，避开下课 ${c(99)}。`,
      `她 ${c(100)} understood the pattern：幕后人 ${c(101)} taken everything at once，而是每天只挪几美元。顾凛的手很 ${c(102)}，可他这个 ${c(103)} 并不简单；整件 ${c(104)} 像一场专门为她设计的爱情审判。投影机的蓝色 ${c(105)} 刺眼，她仍保留一丝 ${c(106)}：也许顾凛也在利用她。箭头 ${c(107)} the route to the old engineering garage；那里几台坏 ${c(108)} 旁突然传来 ${c(109)} smoke alarm。墙上是 ${c(110)} emissions 图，校徽 ${c(111)} the donor group。粉 ${c(112)} 粉笔画着 ${c(113)} line，通往校外 ${c(114)} 仓库。门把手 ${c(115)} a strip of tape，说明这里 ${c(116)} was not a joke。那一 ${c(117)} tape、坏掉的 ${c(118)} keyboard，和必须 ${c(119)} on exact timing 的脚本，把“假订婚”变成真危险。`,
      `苏念薇刚进仓库就 ${c(120)}，顾凛伸手扶住她，却低声说：“别信我。”脚本 ${c(121)} of fake club payments, bookstore refunds, and scholarship edits。文件夹里有校园报 ${c(122)} 的爆料草稿，资料被 ${c(123)} by week，像有人长期布阵。窗边 ${c(124)} 自己晃动，风声突然 ${c(125)} 得像宣判。一个学生冲进来，说账单跨过好几个 ${c(126)}；他 ${c(127)}，把装着球赛 ${c(128)} 的袋子递来。袋底 ${c(129)} 了一张钟楼照片，照片里 ${c(130)} 顶端藏着机关，像顾凛亲手设计的 ${c(131)}。原来嫌疑人受过计算机社 ${c(132)}，性格 ${c(133)}，还懂旧 ${c(134)} 的锁。他们把 ${c(135)} 摊开，发现被 ${c(136)} 的不只是账单：隔壁 ${c(137)} 邮箱也有信封，校报 ${c(138)} 写过一首关于失踪 ${c(139)} 的短诗。`,
      `第一笔钱是谁 ${c(140)} 的？答案 ${c(141)} 指向 ${c(142)} security ${c(143)}：有人穿着像校园吉祥物的 ${c(144)}，拖着 ${c(145)} bag，嘴里还 ${c(146)} escaped ${c(147)} from biology class。包里没有蛇，只有 ${c(148)} envelopes、一只铜 ${c(149)}、一只旧 ${c(150)}，和一盒被 ${c(151)} 的钥匙。每个信封都画着小 ${c(152)}，最后地址指向校 ${c(153)}。晚上十点，她 ${c(154)} the campus shuttle；车厢四个 ${c(155)} 都装着微型摄像头。整场追查像一次失败的 ${c(156)}，日期偏偏写着 ${c(157)}。地上有一张 ${c(158)} of paper，边缘 ${c(159)} like gravel；纸上只有一句话：顾凛会为了你输掉一切。`,
      `苏念薇看到那句话，竟然 ${c(160)} laughed。真正 ${c(161)} 的不是钱，而是林夏 ${c(162)} 的值班表。小 ${c(163)} 后面藏着一台 ${c(164)} scanner，标签来自 ${c(165)} 文物展；柜台上留着 ${c(166)} 的旧名牌。风扇开始 ${c(167)}，她的 ${c(168)} 都紧了。她打开 ${c(169)} log，发现备份在 private ${c(170)}，还允许幕后人 ${c(171)} the evidence before morning。午夜前，她找到钱的路径：student government ${c(172)}、一次 fake ${c(173)}、一条 red ${c(174)}，and a note taped ${c(175)} the water fountain。没有顾凛，她 ${c(176)} permission 也翻到了缺页 ${c(177)}；按 ${c(178)} instruction 找到原始 ${c(179)} 后，她决定 ${c(180)} one last move。`,
      `窗外像黑 ${c(181)}，她把账单 ${c(182)} open，发现几 ${c(183)} scholarships 都被标成 ${c(184)} donor gifts。最疯狂的 ${c(185)} 是：those ${c(186)} were not random。她 ${c(187)} who was responsible，却故意把礼堂空调开到 ${c(188)}，把全班 ${c(189)} 都引来。灯光变 ${c(190)}，第一阵 ${c(191)} wind seemed to ${c(192)} back the missing witness from the stairwell。${c(193)} finally stood in plain sight：同一种 ${c(194)} style，同一套 transfer ${c(195)}，和一个所有人不敢问的 ${c(196)}。除了林夏，谁 ${c(197)} could enter the office before the alarm？雨点开始 ${c(198)}，顾凛看着苏念薇，眼神里的心机忽然 ${c(199)} into something dangerously sincere。美国校园第一夜结束时，假订婚没有解除，赌约才刚刚开始。`
    ];
    return paragraphs
      .filter((_, paragraphIndex) => items[paragraphIndex * 20])
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  }

  function dayTwoLockedLibraryStory(items, density) {
    if (density >= 90) return "";
    const c = (index) => items[index] ? chip(items[index]) : "";
    const paragraphs = [
      `奖学金颁奖夜，图书馆像被一只黑手扣住。馆长只来得及 ${c(0)} 苏念薇一句：沿地上的红色 ${c(1)} 走，钥匙在猫头鹰铜像 ${c(2)} the bronze owl。入口牌写着 ${c(3)} enter ${c(4)} a library card，像一条故意留下的威胁。第七层旧书架里夹着一张被撕掉角的 ${c(5)}，上面写着 ${c(6)} clue。她把那张 ${c(7)} 按在掌心，决定再 ${c(8)} 一次。窗外的雨铺成一片黑色 ${c(9)}，她从没 ${c(10)} 过这样的夜：页边被人整齐 ${c(11)} 开，旁边放着三 ${c(12)} 钥匙。一个 ${c(13)} donor 的名字被红笔圈住，下面写着一个疯狂的 ${c(14)}，以及所有可疑 ${c(15)} 的编号。她忽然 ${c(16)} 地意识到，大厅的闷 ${c(17)} 不是空调坏了，而是有人烧过文件；她 ${c(18)} leave this ${c(19)} until the first clue made sense.`,
      `${c(20)} 里的阅览室像一口深井，警报却 ${c(21)} 停了，安静得反常。一个假 ${c(22)} 展台还亮着灯，里面的冷风会 ${c(23)} 灰尘，也会带来新的 ${c(24)}。玻璃上的 ${c(25)} 和地毯上的 ${c(26)} 完全一致，她写下第一个 ${c(27)}：who ${c(28)} came in after midnight？吊灯忽然 ${c(29)}，书架后方 ${c(30)} 出一排影子。她 ${c(31)} 下门牌号码，跟着一只受惊的机械 ${c(32)} 穿过门缝。走廊 ${c(33)} 没有尽头，每一段 ${c(34)} 都像被人恶意拉长。她一直 ${c(35)} to stay calm，可唯一的 ${c(36)} 太 ${c(37)}：那些缺失的 ${c(38)} 正在书脊之间自己 ${c(39)} back。`,
      `八点整，钟声敲了 ${c(40)} 下，东侧 ${c(41)} 裂开一道暗门。箭头给出一个 ${c(42)}，纸条却给出两组相反 ${c(43)}。楼梯间里，石像的 ${c(44)} 从黑布 ${c(45)} 下伸出来，把一台投影仪的 ${c(46)} manual 递给她：这座图书馆像一座被挖空的 ${c(47)}。档案说，${c(48)} students vanished from room ${c(49)} and had to ${c(50)} before ${c(51)} roll call。校方把那晚包装成 ${c(52)} ceremony，可墙上的 ${c(53)} 都指向西翼。她用 ${c(54)} 摸过凹槽，朝 ${c(55)} stairwell 走去。楼下有人 ${c(56)}：the ${c(57)} is still open！可她看见椅子上 ${c(58)} 着一本黑册子，第一页 ${c(59)} her father's signature。`,
      `册子里没有现金，只有一小包 ${c(60)}、一页校规 ${c(61)}，和一张解释审核 ${c(62)} 的钢印流程图。图中央是一根 ${c(63)} pillar，旁边写着 ${c(64)} 的名字；那一整栏 ${c(65)} 竟然来自校报旧专栏。一位 ${c(66)} ${c(67)} professor 在照片里看着镜头，语气熟悉得让她觉得 ${c(68)}。她刚把资料收好，书架就被人 ${c(69)} 了一把，${c(70)} books 像多米诺骨牌倒下。扩音器里响起一声 ${c(71)}，像求救又像暗号。储藏室有半块三明治，显然有人刚才还在 ${c(72)}，旁边堆着 a ${c(73)} of colored bookmarks。她原本 ${c(74)} 普通的 ${c(75)} exercise，却发现说明文字 ${c(76)} three ${c(77)} cases, one stolen ${c(78)}, and a last ticket to ${c(79)}。`,
      `第二层社区展厅被改成临时法庭，整个 ${c(80)} 都在屏幕上静音旁观。管理员 ${c(81)} at her，像早等她来，又像被她 ${c(82)}。想要 ${c(83)} 这场局，她必须先找出哪一张 ${c(84)} 被换掉。她 ${c(85)} the table aside，发现那份文件 did not ${c(86)} the school，而是来自一份 buried ${c(87)} report。旁边整齐摆着几件 ${c(88)}、一张 ${c(89)} shipping map 和一份学生对事件的 ${c(90)}。固定 ${c(91)} 忽然响起，听筒旁压着一个 cracked ${c(92)}，碗底画着图书馆的 scale ${c(93)}。她沿着粉笔 ${c(94)} 追到楼梯口，荒唐得有点 ${c(95)}：${c(96)} 年前，那个被大家 ${c(97)} 的男孩留下最后一声 ${c(98)}，然后从不同 ${c(99)} 的记录里被同时抹掉。`,
      `镜子上的箭头 ${c(100)} 她去洗手间，水槽下的管道还在 ${c(101)} dust from a hidden box。盒子里是一份 ${c(102)} transfer deed，旁边的监控单写着：a guard ${c(103)} at the desk missed the handoff。那份 deed 不是乱来的背景信息；它列出三家 closed ${c(104)}，每一家都收到过被洗白的奖学金。与此同时，一队 ${c(105)} followed a trail of sugar from the trophy case to the air vent，证明有人刚把甜点藏进通风口。档案还提到 a mock ${c(106)} hearing 和一场针对学生记录的 ${c(107)}。地球仪旁的标签写着 ${c(108)} axis，玻璃 ${c(109)} 里装着 the ${c(110)} of every secret donation。名单上只 ${c(111)} three names，证词却 ${c(112)} a fourth existed。她想起父亲，低声喊 ${c(113)}。灯光的 ${c(114)} 像鼓点，雨的 ${c(115)} 正好盖住脚步声。为了 ${c(116)} being caught，她把文件分成几个 ${c(117)}，用最后一点 ${c(118)} 把金属 ${c(119)} 插进锁孔。`,
      `锁开的瞬间，走廊里的影子 ${c(120)}。屏幕跳出 ${c(121)} 年前的录像：她的 ${c(122)} 在 ${c(123)} hall 举着证词，审判已经 ${c(124)}，每个人都被 ${c(125)} to sign before leaving。桌上有一团 ${c(126)} scarf、数字 ${c(127)}、一个旅行 ${c(128)} 和写着 ${c(129)} 的旧车票。票背面是一条 ${c(130)} route，终点不是医院也不是 ${c(131)} office，而是给所有 ${c(132)} 的公开听证。照片里站着一位 ${c(133)} historian，他的 ${c(134)} 是证明 early ${c(135)} funds 被非法转走。墙上 ${c(136)} 的箭头让她必须重新 ${c(137)} every page。她想退，可 ${c(138)} it was too late，只能 ${c(139)} 一遍：真相不是奖学金，而是谁偷走了别人的未来。`,
      `她把线索 ${c(140)}，用红线 ${c(141)} them to the table legs。The ${c(142)} on the receipts did not match the bank logs；最后一盏 ${c(143)} 突然亮起，照出地下室的旧 ${c(144)} tunnel。冷风 ${c(145)} through the tunnel，像有人仍在里面呼吸。她保持 ${c(146)}，因为校长已经 ${c(147)} her voice on the emergency line；下一步必须 ${c(148)} the evidence for a public speech。线索的 ${c(149)} 不是神话，而是一张 ${c(150)} cipher：${c(151)} 上从 ${c(152)} tally marks 到现代系统的记录，全被校徽 ${c(153)}。外面停着几辆 ${c(154)}，档案却指向 a retirement ${c(155)} in ${c(156)}。另外两笔钱伪装成 a beekeeping club called ${c(157)} 和 a planetarium trip to ${c(158)}。那些看似离谱的 ${c(159)} coordinates，其实把每笔钱都指回同一间办公室。`,
      `她把所有材料 ${c(160)} 好，准备 ${c(161)} the final projector before the dean arrived。炉膛里一团 ${c(162)} 跳动，墙上的 ${c(163)} poster ${c(164)} a red circle around the emergency switch，像一张荒唐但有用的地图。她敲门说 ${c(165)}，无人回应；图书馆 ${c(166)} suddenly changed，像建筑自己醒了。日志显示 this ${c(167)} every time the basement door opens。楼下的 campus ${c(168)} 已经进来，门禁显示所有格子都被 ${c(169)}。她用 ${c(170)} 拍下 ${c(171)} seconds of evidence，避开两处 false ${c(172)} alarms 和一只被学生当吉祥物养的 ${c(173)}。展台上的 ${c(174)} board 对应整个 ${c(175)} 的捐款路线；所有 ${c(176)} 被倒成一圈，机器 ${c(177)} 哼着同一段 ${c(178)}，定位却落在 ${c(179)}。`,
      `最后的档案来自 ${c(180)}，封面写着 ${c(181)}: return every stolen scholarship。她 ${c(182)} her eyes，重新确认自己的 ${c(183)}：不是赢一次辩论，而是把证据放回公众视线。她把资料传到 the ${c(184)}，同时保存 ${c(185)} backups；旧合同的 ${c(186)}、证词 ${c(187)}、整套 ${c(188)} drawings 和行动 ${c(189)} 全部公开。她终于明白，这座图书馆是一座 library ${c(190)} glass, secrets, and second chances，也是一群愿意 stand ${c(191)} the truth 的人。她问自己 ${c(192)} comes next；答案是 ${c(193)} witness ${c(194)} a voice, and the one ${c(195)} lost it still deserves to be heard。天快亮时，一点 ${c(196)} courage 变成一个 ${c(197)} ending。她环顾 ${c(198)}，轻声说：the truth started ${c(199)}.`
    ];
    return paragraphs
      .filter((_, paragraphIndex) => items[paragraphIndex * 20])
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  }

  function dayThreeRoadTripStory(items, density) {
    if (density >= 90) return "";
    const c = (index) => items[index] ? chip(items[index]) : "";
    const paragraphs = [
      `苏念薇离开锁住的图书馆后，线索把她推向 ${c(0)} 海岸。旧车停在一个清晨的 ${c(1)} pier，车门上贴着“missing club ${c(2)}”的照片。温度计显示四十几 ${c(3)}，冷得像有人把海风磨成刀。船上的 ${c(4)} 不肯说话，只递给她一张非法 ${c(5)} map；地图边缘画着一道断裂的 ${c(6)}。他终于 ${c(7)}：那晚一辆卡车 ${c(8)} 过公路，违反了三条州 ${c(9)}，车牌的 ${c(10)} 还故意写错。更糟的是，沿途 ${c(11)} 异常，空气里的 ${c(12)} 像烧焦的纸。她翻出旧 ${c(13)}，查到一个词：this mark may ${c(14)} as a border code。她刚读完，a pebble ${c(15)} the car window，远处有人喊：they will ${c(16)} the witness if she keeps that ${c(17)} of investigation. 这不像普通逃亡，像几个 ${c(18)} 的情报部门正在抢同一份 ${c(19)} scan。`,
      `同行的男孩曾经 ${c(20)} through a custody case，肩上还留着伤；他的 ${c(21)} 一紧，就说明附近有人在 ${c(22)} them。第一次追踪竟然 ${c(23)}：他们在废弃收费站找到一件奇怪 ${c(24)}，旁边堆着 emergency ${c(25)}。纸条写着：${c(26)} you keep the route secret, this will ${c(27)} another disappearance。苏念薇明白，车速不是唯一 ${c(28)}；裸露的 ${c(29)} wires、潮湿的地图 ${c(30)}、被精准 ${c(31)} 的油量，都在说同一件事。她用红笔 ${c(32)} the bridge name，因为那座桥 ${c(33)} the smuggled files。要把线索 ${c(34)} with Day 02 的账本，她必须进入一个废弃 ${c(35)} camp。营地并不 ${c(36)}，只有旧毯子、碎玻璃，${c(37)} 一张写着赔偿 ${c(38)} 的名单。深夜，他们被迫 ${c(39)} a fake ceremony，假装只是游客。`,
      `营地门口的木牌写着一个奇怪 ${c(40)} code，像有人把辅音当密码。头顶的 ${c(41)} 低低飞过，机身没有编号。旅店 ${c(42)} 终于 ${c(43)}：今晚发生的 ${c(44)} 不是事故，而是一次交换。她收到一个湿透的 ${c(45)}，里面塞着六个 ${c(46)} coordinates 和一张被海水泡皱的财物清单；所有 ${c(47)} 都指向同一个人。对讲机里传来低沉 ${c(48)}：stay still。警方却刚刚 ${c(49)} the road closed，山洞 ${c(50)} 里只剩 echo。她追问 ${c(51)}，可每个来源都被人 ${c(52)} or erased。暴雨把他们逼进临时 ${c(53)}，每个人都有 ${c(54)}，却没人敢说。要在天亮前 ${c(55)} at the border, they would ${c(56)} evidence, ${c(57)}, and one satellite photo. 天空里的 ${c(58)} flickered，手机跳出最后一条 ${c(59)}。`,
      `这次他们 ${c(60)} wait for permission；该做的事早已 ${c(61)}。苏念薇把图书馆 ${c(62)} 放在膝上，一个 ${c(63)} journalist 的 ${c(64)} came from the road ${c(65)} them。第 ${c(66)} 个隧道口什么都没有，却像藏着 ${c(67)}。风很 ${c(68)}，把一 ${c(69)} torn poster 拍在挡风玻璃上。两个失踪 ${c(70)} 的照片被雨水泡得发 ${c(71)}；旁边有一枚 ${c(72)} charm 和一块坏掉的 ${c(73)}。她知道这是第 ${c(74)} 个标记，也是第一个 ${c(75)} clue。夜空 ${c(76)} 得像一张展开的布，远处 ${c(77)} desert 里闪着 ${c(78)}。路边的 ${c(79)} motel 却挂着“no vacancy”，像专门给他们看的笑话。`,
      `她让同伴 ${c(80)} to the radio：不同 ${c(81)} 每隔十分钟播一次暗号，每 ${c(82)} mile 改变一个 ${c(83)} grid。车的 ${c(84)} 不能太快，否则前方的 ${c(85)} herd 会惊起来。两张地图的 ${c(86)} 在于，旧地图上标着一篮 ${c(87)}，新地图却把那里改成了 ${c(88)} market。当地 ${c(89)} owner 在镇子 ${c(90)} 等他们，约好 ${c(91)} at midnight。谈话的 ${c(92)} 不是钱，${c(93)} 是安全；没有人想参加这场 ${c(94)}，可几个 ${c(95)} 都被卷进来。最后的 ${c(96)} 很清楚：只要有人还 ${c(97)} in the doorway，仓库就会继续 ${c(98)} false records in neat ${c(99)}。`,
      `仓库后面堆着 ${c(100)}、褐色 ${c(101)} crates，还有一个自称 ${c(102)} 的司机。苏念薇准备 ${c(103)} the yard，却先 ${c(104)} a warning to the captain。她并不 ${c(105)} about being brave；油箱里的 ${c(106)} 快没了，身边那个已经 ${c(107)} silent 的男孩突然问：do you ever ${c(108)} why the papers were hidden in a ${c(109)}？答案像一把 ${c(110)}，打开的却是 ${c(111)}。她想起自己的 ${c(112)}，想起海盐 ${c(113)} on her coat。门后有人 ${c(114)} down，影子晃了 ${c(115)}。旧 ${c(116)} 正播着事故新闻，主持人用了一个奇怪 ${c(117)}，几乎 ${c(118)} anyone noticed except ${c(119)}。`,
      `他们的车 ${c(120)} down near a diner，仪表盘只剩 ${c(121)} tank。霓虹 ${c(122)} 在雨里化开，像第五个 ${c(123)}。如果今晚有人 ${c(124)}，明天就没人能作证；如果活到 ${c(125)}，案子就会变成公开记录。苏念薇负责 ${c(126)} the files in ${c(127)}，男孩负责买 ${c(128)}：一个 ${c(129)}、一份还在 ${c(130)} 的 ${c(131)}，以及写着 ${c(132)} route across ${c(133)} 的旧剪报。柜台后的女人笑得很 ${c(134)}，给他们一杯 ${c(135)}，又叫来 ${c(136)}。她说自己来自 ${c(137)}，小时候在 ${c(138)} 边见过同一辆车；车身上喷着 ${c(139)}。`,
      `${c(140)} 不是他的真名，他的 ${c(141)} 是在州际赛场上把证据藏进 ${c(142)} helmet。路边一根 ${c(143)} 上贴着去 ${c(144)} 的旧船票，背面沾着 ${c(145)} 和 ${c(146)}。有人曾经 ${c(147)} 他们一条安全路线，却在河边被一只 ${c(148)} 惊动。新路比地图短得多，actually ${c(149)}，却要穿过 ${c(150)} repair shop。日期写着 ${c(151)}；男孩跪下检查自己的 ${c(152)}，发现地上散着给 ${c(153)} 的玩具车。旁边的 ${c(154)} 早把真相画成漫画：${c(155)}、black ${c(156)}、a broken ${c(157)}, ${c(158)}. Every clue was ridiculous, but every one was useful, even the ${c(159)} sticker on the wall.`,
      `太阳 ${c(160)} 时，他们终于赶到夜校。几间 ${c(161)} 还亮着灯，桌上有一只 ${c(162)}、一只冷掉的 ${c(163)}，窗外蹲着一只 ${c(164)}。河边的 ${c(165)} 半沉半浮，记录仪仍在 ${c(166)}。老师让学生测量水的 ${c(167)}，却故意写成 ${c(168)}；她的 ${c(169)} 说，七十年前，${c(170)} 个家庭靠这些 ${c(171)} 活下来。校墙是红 ${c(172)}，黑板上写着一段押 ${c(173)} 的暗号。苏念薇把证据上传到 ${c(174)}，又切到 ${c(175)} backup。搜索框里的 ${c(176)} 是今晚的 ${c(177)}：how a local ${c(178)} became an ${c(179)} nobody could delete.`,
      `最后一页只写着 ${c(180)} one more thing: the witness kept ${c(181)} promise。${c(182)} roads were ${c(183)} the same crime, but there was ${c(184)} proof ${c(185)} than anyone expected. A ${c(186)} file opened, then ${c(187)} witness added ${c(188)} clue. 苏念薇 ${c(189)} the wheel while three ${c(190)} behind her ${c(191)} up flares。她 ${c(192)} the whole ${c(193)} through the windshield：一个 ${c(194)} who ${c(195)} away, the number ${c(196)} on a bridge, a ${c(197)} road, and a truth her father had ${c(198)} her to keep ${c(199)} the dark. 天亮时，车没有停；故事也没有停。`
    ];
    return paragraphs
      .filter((_, paragraphIndex) => items[paragraphIndex * 20])
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  }

  function buildStory(items, selectedTheme, selectedDensity = state.englishDensity) {
    const theme = "campus";
    const density = Number(selectedDensity) || DEFAULT_DENSITY;
    const authored = state.currentDay === 1
      ? dayOneCampusStory(items, density)
      : state.currentDay === 2
        ? dayTwoLockedLibraryStory(items, density)
        : state.currentDay === 3
          ? dayThreeRoadTripStory(items, density)
          : "";
    if (authored) return authored;
    const frames = storyFrames[theme] || storyFrames.cinematic;
    const paragraphs = [];
    for (let i = 0; i < items.length; i += 20) {
      const group = items.slice(i, i + 20);
      const paragraphIndex = i / 20;
      const html = density <= 30
        ? chineseParagraph(group, theme, paragraphIndex)
        : adaptiveParagraph(group, theme, density, paragraphIndex);
      paragraphs.push(`<p>${html}</p>`);
    }
    return paragraphs.join("");
  }

  function currentLessonItems() {
    const data = lesson();
    return data.words.map((item) => ({ ...item, day: data.day, id: `d${data.day}-${item.word}` }));
  }

  function isLowValueWord(item) {
    const word = String(item.word || "").toLowerCase();
    return LOW_VALUE_WORDS.has(word) || /^\d/.test(word) || /^[a-z]'/.test(word) || /^[a-z]$/i.test(word);
  }

  function isDifficultWord(item, day) {
    const curated = DIFFICULT_WORD_SETS[String(day)];
    if (curated?.has(String(item.word || "").toLowerCase())) return true;
    return Number(item.globalRank) >= HARD_WORD_FALLBACK_RANK;
  }

  function lowValueFilteredItems(data, items, count) {
    if (data.day !== 1) return items;
    const selected = items.filter((item) => !isLowValueWord(item));
    const selectedWords = new Set(selected.map((item) => String(item.word).toLowerCase()));
    for (const item of allWords()) {
      const key = String(item.word || "").toLowerCase();
      if (selected.length >= count) break;
      if (!selectedWords.has(key) && !isLowValueWord(item)) {
        selected.push(item);
        selectedWords.add(key);
      }
    }
    return selected;
  }

  function difficultyBalancedItems(data, items, count) {
    if (data.day < 3) return items;
    const target = hardWordTarget(count);
    const curated = DIFFICULT_WORD_SETS[String(data.day)];
    const curatedPriority = curated
      ? items.filter((item) => curated.has(String(item.word || "").toLowerCase()))
      : [];
    const curatedIds = new Set(curatedPriority.map(wordId));
    const fallbackPriority = items.filter((item) => !curatedIds.has(wordId(item)) && isDifficultWord(item, data.day));
    const priority = curatedPriority.concat(fallbackPriority).slice(0, target);
    if (!priority.length) return items;
    const priorityIds = new Set(priority.map(wordId));
    return priority.concat(items.filter((item) => !priorityIds.has(wordId(item))));
  }

  function currentStudyItems() {
    const data = lesson();
    const count = dailyNewCount();
    const valueFiltered = lowValueFilteredItems(data, currentLessonItems(), count);
    return difficultyBalancedItems(data, valueFiltered, count).slice(0, count);
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
    const targetCount = reviewSlotCount();
    if (targetCount <= 0) return [];
    const pool = [];
    const available = allWords().filter((item) => !item.day || item.day <= state.currentDay);
    available.forEach((item) => {
      const entry = entryFor(item);
      const tracked = entry.seen > 0 || entry.favorite || entry.review || entry.wrong > 0 || entry.right > 0 || entry.known;
      let weight = 0;
      if (tracked && entry.due <= state.currentDay) weight += 3;
      if (entry.favorite) weight += 3;
      if (entry.review || entry.wrong > entry.right) weight += 4;
      if (item.day === state.currentDay && entry.seen === 0) weight += 1;
      for (let i = 0; i < Math.max(weight, 0); i += 1) pool.push(item);
    });
    const fallback = currentStudyItems();
    const source = pool.length ? pool : fallback.slice(0, targetCount);
    if (!source.length) return [];
    const slots = [];
    const offset = state.reviewSeed % source.length;
    while (slots.length < targetCount) {
      slots.push(source[(offset + slots.length) % source.length]);
    }
    return slots;
  }

  function lessonDisplayMeta(data) {
    if (data.day !== 1) return data;
    return {
      ...data,
      titleZh: "暴雨夜的奖学金赌约",
      titleEn: "The Scholarship Ultimatum",
      style: "campus mystery",
      premise: "a stormy dorm night turns a missing scholarship into a fake-engagement campus gamble"
    };
  }

  function renderDayOptions() {
    const select = document.getElementById("daySelect");
    select.innerHTML = LESSONS.map((item) => {
      const meta = lessonDisplayMeta(item);
      return `<option value="${item.day}">Day ${String(item.day).padStart(2, "0")} · ${escapeHtml(meta.titleZh)}</option>`;
    }).join("");
    select.value = String(state.currentDay);
  }

  function renderPreferences() {
    applyColorMode();
    document.getElementById("colorModeSelect").value = state.colorMode;
  }

  function renderStory() {
    state.theme = "campus";
    const data = lesson();
    const meta = lessonDisplayMeta(data);
    const items = currentStudyItems();
    document.getElementById("heroDay").textContent = `Day ${String(data.day).padStart(2, "0")}`;
    document.getElementById("heroTitle").textContent = meta.titleZh;
    document.getElementById("storyHeading").textContent = `Story ${String(data.day).padStart(2, "0")}: ${meta.titleEn}`;
    document.getElementById("storyStyle").textContent = `${meta.style} · ${meta.premise}`;
    document.getElementById("themeSelect").value = "campus";
    document.getElementById("densitySelect").value = String(state.englishDensity || DEFAULT_DENSITY);
    const newCountInput = document.getElementById("newCountInput");
    newCountInput.max = String(data.words.length);
    newCountInput.value = String(dailyNewCount());
    document.getElementById("reviewCountInput").value = String(reviewSlotCount());
    const storyText = document.getElementById("storyText");
    storyText.dataset.density = String(state.englishDensity || DEFAULT_DENSITY);
    storyText.innerHTML = buildStory(items, state.theme, state.englishDensity);
  }

  function renderStats() {
    const availableWords = allWords().filter((item) => !item.day || item.day <= state.currentDay);
    const entries = availableWords.map((item) => state.words[wordId(item)]).filter(Boolean);
    const todayItems = currentStudyItems();
    const todayEntries = todayItems.map(entryFor);
    const difficultCount = todayItems.filter((item) => isDifficultWord(item, state.currentDay)).length;
    const seen = entries.filter((entry) => entry.seen > 0).length;
    const favorites = entries.filter((entry) => entry.favorite).length;
    const due = entries.filter((entry) => (entry.seen > 0 || entry.favorite || entry.review || entry.wrong > 0 || entry.right > 0 || entry.known) && (entry.due <= state.currentDay || entry.review)).length;
    document.getElementById("metricNew").textContent = dailyNewCount();
    document.getElementById("metricReview").textContent = reviewSlotCount();
    document.getElementById("metricSeen").textContent = seen;
    document.getElementById("metricFav").textContent = favorites;
    document.getElementById("stateSummary").textContent =
      `文章新词已写入 ${todayItems.length}/${dailyNewCount()} 个；难词 ${difficultCount}/${todayItems.length} 个（目标至少 ${hardWordTarget(todayItems.length)} 个）；今日已互动 ${todayEntries.filter((entry) => entry.seen > 0).length}/${todayEntries.length} 个；复习槽 ${reviewSlotCount()} 个；全局收藏 ${favorites} 个；当前到期或错词 ${due} 个；英文占比 ${state.englishDensity || DEFAULT_DENSITY}%。`;
  }

  function renderReview() {
    const grid = document.getElementById("reviewGrid");
    const total = reviewSlotCount();
    document.querySelector("#reviewPanel h2").textContent = `${total} 个复习槽`;
    grid.innerHTML = buildReviewSlots().map((item, index) => `<article class="review-card">
      <span class="slot">slot ${String(index + 1).padStart(2, "0")} / ${total}</span>
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
    </article>`).join("") || "<p class=\"muted-story\">复习槽当前设为 0。把复习槽调高后，这里会重新生成复习卡片。</p>";
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
    const items = state.customWords.slice(0, dailyNewCount());
    if (!items.length) {
      document.getElementById("customStory").innerHTML = "<p>先导入一些自定义词，再生成阅读。</p>";
      return;
    }
    const normalized = items.map((item, index) => ({ ...item, id: item.id || `custom-${index}` }));
    document.getElementById("customStory").innerHTML = `<p class="eyebrow">${escapeHtml(theme)} · English ${state.englishDensity || DEFAULT_DENSITY}%</p>${buildStory(normalized, state.theme, state.englishDensity)}`;
  }

  function connectorPayload() {
    const data = lesson();
    const words = currentStudyItems().map((item) => {
      const entry = entryFor(item);
      return {
        id: wordId(item),
        word: item.word,
        display: displayWord(item),
        zh: item.zh || "",
        shortZh: shortZh(item.zh),
        pos: item.pos || "",
        phonetic: item.phonetic || "",
        day: item.day,
        favorite: Boolean(entry.favorite),
        review: Boolean(entry.review || entry.wrong > entry.right),
        known: Boolean(entry.known)
      };
    });
    return {
      app: "StoryVocab",
      version: 1,
      mode: "optional-cloud",
      day: data.day,
      titleEn: data.titleEn,
      titleZh: data.titleZh,
      premise: data.premise,
      theme: state.theme,
      englishDensity: state.englishDensity || DEFAULT_DENSITY,
      newWordCount: dailyNewCount(),
      reviewSlotCount: reviewSlotCount(),
      words,
      favorites: words.filter((item) => item.favorite).map((item) => item.display),
      reviewWords: words.filter((item) => item.review).map((item) => item.display),
      instruction: "Write one vivid, coherent English-learning story for Chinese-speaking learners. Use the provided display phrases naturally, keep the Chinese meaning near each target word, and return plain text in storyText."
    };
  }

  function buildConnectorRequestExample() {
    const endpoint = state.connectorEndpoint || "https://your-domain.example/storyvocab/generate";
    const payload = connectorPayload();
    return `const endpoint = ${JSON.stringify(endpoint)};\nconst request = ${JSON.stringify(payload, null, 2)};\n\nconst response = await fetch(endpoint, {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(request)\n});\n\nconst data = await response.json();\nconsole.log(data.storyText || data.text || data.notes);`;
  }

  function renderExternalStory(content, notes = "") {
    const node = document.getElementById("connectorPreview");
    if (!node) return;
    const text = typeof content === "string" ? content : JSON.stringify(content, null, 2);
    const paragraphs = text.split(/\n{2,}/).map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
    node.classList.remove("muted-story");
    node.innerHTML = `${paragraphs || "<p>接口没有返回故事文本。</p>"}${notes ? `<p class="connector-status">${escapeHtml(notes)}</p>` : ""}`;
  }

  function renderConnector() {
    const input = document.getElementById("connectorEndpoint");
    if (!input) return;
    if (document.activeElement !== input) input.value = state.connectorEndpoint || "";
    const status = document.getElementById("connectorStatus");
    if (status) {
      status.textContent = state.connectorEndpoint
        ? `已配置接口：${state.connectorEndpoint}`
        : "当前是纯静态模式。配置接口后，才会向你的云端发送请求。";
    }
  }

  function renderAbout() {
    document.getElementById("licenseSummary").textContent = `${DATA_LICENSES.wordList || ""}；${DATA_LICENSES.dictionary || ""}`;
  }

  function renderAll() {
    renderPreferences();
    renderDayOptions();
    renderStory();
    renderStats();
    renderReview();
    renderWordbook();
    renderConnector();
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

  function closeChipMenuNow(chipNode) {
    if (!chipNode) return;
    clearChipMenuTimers(chipNode);
    chipNode.classList.remove("open");
    if (activeChip === chipNode) activeChip = null;
  }

  function closeOtherChipMenus(currentChip) {
    if (activeChip && activeChip !== currentChip) closeChipMenuNow(activeChip);
    document.querySelectorAll(".word-chip.open").forEach((chipNode) => {
      if (chipNode !== currentChip) closeChipMenuNow(chipNode);
    });
  }

  function scheduleChipMenuOpen(chipNode) {
    closeOtherChipMenus(chipNode);
    clearChipMenuTimers(chipNode);
    const open = setTimeout(() => {
      closeOtherChipMenus(chipNode);
      chipNode.classList.add("open");
      activeChip = chipNode;
    }, MENU_OPEN_DELAY);
    menuTimers.set(chipNode, { open, close: null });
  }

  function scheduleChipMenuClose(chipNode) {
    clearChipMenuTimers(chipNode);
    const close = setTimeout(() => closeChipMenuNow(chipNode), MENU_CLOSE_DELAY);
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

  async function copyText(text, successMessage) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        toast(successMessage);
        return;
      } catch {
        // Fall back to the older selection-based copy path below.
      }
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Copy command was rejected.");
    toast(successMessage);
  }

  function copyEmail(email = "dsong25@gmu.edu") {
    copyText(email, "邮箱地址已复制。").catch(() => toast(`请手动复制：${email}`));
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

  function saveConnector() {
    const input = document.getElementById("connectorEndpoint");
    state.connectorEndpoint = input.value.trim();
    saveState();
    renderConnector();
    toast(state.connectorEndpoint ? "接口已保存，本地课程仍可离线使用。" : "接口已清空，继续使用纯静态模式。");
  }

  function clearConnector() {
    state.connectorEndpoint = "";
    saveState();
    renderConnector();
    toast("已清除接口，回到纯静态模式。");
  }

  function copyConnectorExample() {
    const example = buildConnectorRequestExample();
    navigator.clipboard?.writeText(example).then(() => toast("接口请求示例已复制。")).catch(() => {
      exportFile("storyvocab-connector-example.js", example, "text/javascript;charset=utf-8");
      toast("无法复制，已下载请求示例。");
    });
  }

  async function runConnector() {
    const endpoint = (document.getElementById("connectorEndpoint")?.value.trim() || state.connectorEndpoint || "").trim();
    const status = document.getElementById("connectorStatus");
    if (!endpoint) {
      if (status) status.textContent = "未配置接口。当前页面会继续使用内置的纯静态故事。";
      toast("先填入你自己的云端接口。");
      return;
    }
    state.connectorEndpoint = endpoint;
    saveState();
    if (status) status.textContent = "正在请求你的云端接口...";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connectorPayload())
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : { storyText: await response.text() };
      if (!response.ok) throw new Error(data.error || data.message || `HTTP ${response.status}`);
      const story = data.storyText || data.text || data.story || data.html || data.storyHtml || "";
      renderExternalStory(story, data.notes || "已由你的云端接口返回。");
      if (status) status.textContent = "接口返回成功。结果只显示在预览区，不覆盖本地课程。";
      toast("云端故事已返回。");
    } catch (error) {
      if (status) status.textContent = `接口请求失败：${error.message}`;
      toast("接口请求失败，已保留纯静态课程。");
    }
  }

  window.StoryVocabAPI = {
    version: "1.0.0",
    getState: () => JSON.parse(JSON.stringify(state)),
    getCurrentLesson: () => JSON.parse(JSON.stringify(lesson())),
    getCurrentWords: () => JSON.parse(JSON.stringify(currentStudyItems().map((item) => ({ ...item, display: displayWord(item) })))),
    buildConnectorPayload: () => JSON.parse(JSON.stringify(connectorPayload())),
    buildConnectorRequestExample,
    renderExternalStory,
    speak
  };

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
      currentStudyItems().forEach((item) => {
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
      speak(openingWords || "StoryVocab");
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
    if (action === "save-connector") saveConnector();
    if (action === "clear-connector") clearConnector();
    if (action === "copy-connector-example") copyConnectorExample();
    if (action === "copy-email") copyEmail(actionNode.dataset.email);
    if (action === "run-connector") runConnector();
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
    if (chipNode) {
      closeOtherChipMenus(chipNode);
      chipNode.classList.add("open");
      activeChip = chipNode;
    }
  });

  document.addEventListener("focusout", (event) => {
    const chipNode = event.target.closest(".word-chip");
    if (chipNode) closeChipMenuNow(chipNode);
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

  document.getElementById("newCountInput").addEventListener("change", (event) => {
    state.dailyNewCount = clampNumber(event.target.value, DEFAULT_NEW_WORDS, 20, lesson().words.length);
    saveAndRender(`今日新词已调整为 ${dailyNewCount()} 个。`);
  });

  document.getElementById("reviewCountInput").addEventListener("change", (event) => {
    state.reviewSlotCount = clampNumber(event.target.value, DEFAULT_REVIEW_SLOTS, 0, 200);
    saveAndRender(`复习槽已调整为 ${reviewSlotCount()} 个。`);
  });

  document.getElementById("colorModeSelect").addEventListener("change", (event) => {
    state.colorMode = event.target.value === "light" ? "light" : "dark";
    saveState();
    renderPreferences();
    toast(state.colorMode === "dark" ? "已切换到黑夜版。" : "已切换到亮版。");
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
