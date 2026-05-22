/**
 * 英文語言練習題庫（60 題：基礎 / 中階 / 高階，四選一）
 * 供英語課程使用；題幹含繁/簡/英，選項為英文。
 */
(function (global) {
  function L(hant, hans, en) {
    return { hant: hant, hans: hans, en: en };
  }

  function tc(id, level, enPrompt, zhPrompt, opts, correctIndex) {
    return {
      id: id,
      type: "text_choice",
      level: level,
      courses: ["en"],
      badge: level === "beginner" ? "daily" : "grammar",
      vocabKey: "en_lit:" + id,
      prompt: L(zhPrompt, zhPrompt, enPrompt),
      options: opts.map(function (text, i) {
        return {
          label: L(text, text, text),
          correct: i === correctIndex,
        };
      }),
    };
  }

  /** [id, level, enPrompt, zhPrompt, options, correctIndex] */
  var RAW = [
    /* ── Easy (20) ── */
    [
      "en_lit_e01",
      "beginner",
      "Which word is a noun?",
      "哪一個是名詞？",
      ["Beautiful", "Run", "Happiness", "Quickly"],
      2,
    ],
    [
      "en_lit_e02",
      "beginner",
      "Choose the correct spelling:",
      "選出正確拼寫：",
      ["Tomorow", "Tomorrow", "Toomorrow", "Tommorrow"],
      1,
    ],
    [
      "en_lit_e03",
      "beginner",
      "She _______ to school every day.",
      "她每天______上學。",
      ["go", "goes", "going", "gone"],
      1,
    ],
    [
      "en_lit_e04",
      "beginner",
      "I have been living here _______ three years.",
      "我在這裡住了______三年。",
      ["since", "for", "during", "while"],
      1,
    ],
    [
      "en_lit_e05",
      "beginner",
      'What is the opposite of the word "generous"?',
      "「generous」的反義詞是？",
      ["Kind", "Mean", "Helpful", "Honest"],
      1,
    ],
    [
      "en_lit_e06",
      "beginner",
      "That book belongs to Sarah. It is _______.",
      "那本書是 Sarah 的。It is _______.",
      ["her", "hers", "she", "his"],
      1,
    ],
    [
      "en_lit_e07",
      "beginner",
      "We are look forward _______ you soon.",
      "We look forward _______ you soon.",
      ["to see", "seeing", "to seeing", "see"],
      2,
    ],
    [
      "en_lit_e08",
      "beginner",
      "Listen! The birds _______ in the garden.",
      "聽！鳥兒在花園裡______。",
      ["sing", "are singing", "sang", "is singing"],
      1,
    ],
    [
      "en_lit_e09",
      "beginner",
      'Choose the correct article: "He wants to be _______ engineer when he grows up."',
      "選出正確冠詞：engineer",
      ["a", "an", "the", "(No article)"],
      1,
    ],
    [
      "en_lit_e10",
      "beginner",
      "Which sentence is grammatically CORRECT?",
      "哪一句文法正確？",
      ["She don't like apples.", "He have two dogs.", "They are very friendly.", "We was at home yesterday."],
      2,
    ],
    [
      "en_lit_e11",
      "beginner",
      "SKIP_E11",
      "",
      [],
      0,
    ],
    [
      "en_lit_e12",
      "beginner",
      "There isn't _______ milk left in the fridge.",
      "冰箱裡沒有______牛奶了。",
      ["many", "some", "any", "no"],
      2,
    ],
    [
      "en_lit_e13",
      "beginner",
      "Yesterday, I _______ my keys in the office.",
      "昨天我把鑰匙______在辦公室。",
      ["leave", "left", "leaving", "have left"],
      1,
    ],
    [
      "en_lit_e14",
      "beginner",
      "This dress is _______ than that one.",
      "這件洋裝比那件______。",
      ["more cheap", "cheaper", "cheapest", "more cheaper"],
      1,
    ],
    [
      "en_lit_e15",
      "beginner",
      "If it _______ tomorrow, we will stay at home.",
      "如果明天______，我們就待在家。",
      ["rain", "rains", "will rain", "rained"],
      1,
    ],
    [
      "en_lit_e16",
      "beginner",
      "Which of the following refers to a period of 100 years?",
      "哪個詞指一百年？",
      ["Decade", "Century", "Millennium", "Annual"],
      1,
    ],
    [
      "en_lit_e17",
      "beginner",
      'Identify the adverb: "The chef cooked a delicious meal quickly."',
      "哪個是副詞？",
      ["chef", "delicious", "meal", "quickly"],
      3,
    ],
    [
      "en_lit_e18",
      "beginner",
      'What is the plural form of the word "child"?',
      "child 的複數形式是？",
      ["Childs", "Childes", "Children", "Childrens"],
      2,
    ],
    [
      "en_lit_e19",
      "beginner",
      '"Are you ready to order?" — "Yes, I _______ the steak, please."',
      "「可以點餐了嗎？」—「是的，我______牛排。」",
      ["have", "will have", "had", "am having"],
      1,
    ],
    [
      "en_lit_e20",
      "beginner",
      'Choose the correct preposition: "The cat is hiding _______ the bed."',
      "貓躲在床______。",
      ["under", "on", "between", "through"],
      0,
    ],

    /* ── Medium (20) ── */
    [
      "en_lit_m01",
      "intermediate",
      "The new policy had a major _______ on the local economy.",
      "新政策對當地經濟有重大______。",
      ["affect", "effect", "effective", "affection"],
      1,
    ],
    [
      "en_lit_m02",
      "intermediate",
      'Choose the synonym for "cooperate":',
      "「cooperate」的同義詞是？",
      ["Compete", "Collaborate", "Contradict", "Complain"],
      1,
    ],
    [
      "en_lit_m03",
      "intermediate",
      "The manager decided to _______ the meeting until next Monday.",
      "經理決定把會議______到下週一。",
      ["call off", "put off", "run out", "look after"],
      1,
    ],
    [
      "en_lit_m04",
      "intermediate",
      "Although she was tired, she _______ working on the project.",
      "雖然很累，她仍______做專案。",
      ["gave up", "kept on", "took over", "broke down"],
      1,
    ],
    [
      "en_lit_m05",
      "intermediate",
      "He is a person _______ opinions I deeply respect.",
      "他是位我深深敬重其觀點的人。",
      ["who", "whom", "whose", "which"],
      2,
    ],
    [
      "en_lit_m06",
      "intermediate",
      "By the time the movie started, we _______ our popcorn.",
      "電影開始時，我們已經______爆米花。",
      ["already ate", "have already eaten", "had already eaten", "are eating"],
      2,
    ],
    [
      "en_lit_m07",
      "intermediate",
      "The bridge _______ by the end of next year.",
      "這座橋到明年底將會______。",
      ["will build", "will be built", "is building", "has built"],
      1,
    ],
    [
      "en_lit_m08",
      "intermediate",
      "I wish I _______ more time to travel around the world right now.",
      "但願我現在有更多時間環遊世界。",
      ["have", "had", "will have", "have had"],
      1,
    ],
    [
      "en_lit_m09",
      "intermediate",
      "He denied _______ the money from the cash register.",
      "他否認從收銀機______錢。",
      ["to take", "taking", "take", "to have taken"],
      1,
    ],
    [
      "en_lit_m10",
      "intermediate",
      "Rarely _______ such a beautiful sunset in this city.",
      "我很少在這城市見過如此美的日落。（倒裝）",
      ["I have seen", "have I seen", "I saw", "did I saw"],
      1,
    ],
    [
      "en_lit_m11",
      "intermediate",
      "_______ the heavy traffic, we managed to arrive on time.",
      "______交通壅塞，我們仍準時到達。",
      ["Despite", "Although", "Even though", "However"],
      0,
    ],
    [
      "en_lit_m12",
      "intermediate",
      "The scientific data is _______, leaving no room for doubt.",
      "科學數據______，不容置疑。",
      ["ambiguous", "conclusive", "superficial", "preliminary"],
      1,
    ],
    [
      "en_lit_m13",
      "intermediate",
      "Choose the sentence with the correct punctuation:",
      "哪一句標點正確？",
      [
        "Its a well-known fact that the earth revolves around the sun.",
        "It's a well-known fact that the earth revolves around the sun.",
        "It's a well known fact that the earth revolves around the sun.",
        "Its a well known fact that the earth revolves around the sun.",
      ],
      1,
    ],
    [
      "en_lit_m14",
      "intermediate",
      "If I had known about the traffic jam, I _______ a different route.",
      "若早知道塞車，我會______另一條路。",
      ["would take", "will take", "would have taken", "had taken"],
      2,
    ],
    [
      "en_lit_m15",
      "intermediate",
      "The teacher made the students _______ their essays after class.",
      "老師讓學生課後______作文。",
      ["rewrite", "to rewrite", "rewriting", "rewrote"],
      0,
    ],
    [
      "en_lit_m16",
      "intermediate",
      'To "bite the bullet" means to:',
      "「bite the bullet」意思是？",
      [
        "Start a fight with someone",
        "Face a difficult situation with courage",
        "Make a mistake out of carelessness",
        "End a long-standing argument",
      ],
      1,
    ],
    [
      "en_lit_m17",
      "intermediate",
      'When someone tells you to "break a leg", they are:',
      "「break a leg」表示？",
      [
        "Wishing you bad luck",
        "Telling you to stop acting",
        "Wishing you good luck before a performance",
        "Warning you about a danger",
      ],
      2,
    ],
    [
      "en_lit_m18",
      "intermediate",
      'Which word best fits someone who is "easily hurt or offended"?',
      "哪個詞形容「容易受傷或生氣」？",
      ["Sensitive", "Sensible", "Sensation", "Sentimental"],
      0,
    ],
    [
      "en_lit_m19",
      "intermediate",
      "The project was canceled because it was no longer financially _______.",
      "專案因財務上不再______而取消。",
      ["variable", "vibrant", "viable", "virtual"],
      2,
    ],
    [
      "en_lit_m20",
      "intermediate",
      "He didn't want to go to the party, so he _______ an excuse about being sick.",
      "他不想參加派對，便______生病的藉口。",
      ["made up", "turned down", "took up", "put out"],
      0,
    ],

    /* ── Hard (20) ── */
    [
      "en_lit_h01",
      "intermediate",
      "The speaker's arguments were completely _______, lacking logical structure or valid evidence.",
      "演講者的論點完全______，缺乏邏輯與證據。",
      ["cogent", "specious", "lucid", "profound"],
      1,
    ],
    [
      "en_lit_h02",
      "intermediate",
      "Despite the chaos, the captain maintained his _______ and guided the ship safely ashore.",
      "儘管混亂，船長仍保持______，安全靠岸。",
      ["equanimity", "trepidation", "belligerence", "lassitude"],
      0,
    ],
    [
      "en_lit_h03",
      "intermediate",
      'What is the meaning of the word "ephemeral"?',
      "「ephemeral」的意思是？",
      [
        "Lasting for a very short time",
        "Extremely complex or deep",
        "Showing great wisdom",
        "Highly decorative or ornate",
      ],
      0,
    ],
    [
      "en_lit_h04",
      "intermediate",
      "Taxing basic necessities drew widespread _______ from the public.",
      "對必需品課稅引發公眾廣泛______。",
      ["adulation", "approbation", "opprobrium", "acquiescence"],
      2,
    ],
    [
      "en_lit_h05",
      "intermediate",
      "His writing style is incredibly _______, using far more words than necessary.",
      "他的文風極為______，用詞遠超所需。",
      ["concise", "verbose", "taciturn", "pithy"],
      1,
    ],
    [
      "en_lit_h06",
      "intermediate",
      "Were it not for your timely intervention, the company _______ bankruptcy last quarter.",
      "若非你及時介入，公司上季會______破產。",
      ["would face", "had faced", "would have faced", "will face"],
      2,
    ],
    [
      "en_lit_h07",
      "intermediate",
      "Under no circumstances _______ to leave the laboratory without supervision.",
      "在任何情況下都不得無人監督______實驗室。",
      [
        "employees are allowed",
        "are allowed employees",
        "are employees allowed",
        "employees allow",
      ],
      2,
    ],
    [
      "en_lit_h08",
      "intermediate",
      "The committee recommended that the proposal _______ deferred until the next fiscal year.",
      "委員會建議提案______至下一財年。",
      ["is", "be", "was", "will be"],
      1,
    ],
    [
      "en_lit_h09",
      "intermediate",
      "The novel's plot is so _______ woven that one missing detail ruins the climax.",
      "小說情節編織如此______，缺一細節便毀高潮。",
      ["haphazardly", "intricately", "superficially", "inadvertently"],
      1,
    ],
    [
      "en_lit_h10",
      "intermediate",
      "Having _______ all options, the board finally settled on a merger.",
      "在______所有選項後，董事會決定合併。",
      ["exhausted", "exhausting", "been exhausted", "exhaust"],
      0,
    ],
    [
      "en_lit_h11",
      "intermediate",
      '"Each of the candidates must submit their application before Friday." Which fix is formally correct?',
      "哪項修改使句子在正式語境中正確？",
      [
        'Change "must" to "ought to"',
        'Change "their" to "his or her"',
        'Change "submit" to "submitting"',
        'Change "before" to "until"',
      ],
      1,
    ],
    [
      "en_lit_h12",
      "intermediate",
      "The new framework is designed to _______ corruption by increasing transparency.",
      "新框架旨在透過透明度______腐敗。",
      ["exacerbate", "mitigate", "condone", "perpetuate"],
      1,
    ],
    [
      "en_lit_h13",
      "intermediate",
      "Which sentence exhibits a dangling modifier?",
      "哪句有「懸垂修飾語」？",
      [
        "Walking down the street, the wind blew my hat off.",
        "While I was walking down the street, my hat blew off.",
        "Walking down the street, I lost my hat in the wind.",
        "As I walked down the street, the wind took my hat.",
      ],
      0,
    ],
    [
      "en_lit_h14",
      "intermediate",
      "The philosopher's theories were so _______ that only a few scholars could fully comprehend them.",
      "這位哲學家的理論極為______，少數學者才能完全理解。",
      ["esoteric", "pedestrian", "ubiquitous", "manifest"],
      0,
    ],
    [
      "en_lit_h15",
      "intermediate",
      "She was _______ critic, whose reviews could make or break a production.",
      "她是位______的評論家，評論可成就或摧毀一部作品。",
      ["an innocuous", "an astute", "a gullible", "a complaisant"],
      1,
    ],
    [
      "en_lit_h16",
      "intermediate",
      "When a non-human object is given human-like attributes, it is _______.",
      "把非人事物賦予人性，屬於______。",
      ["oxymoron", "hyperbole", "personification", "euphemism"],
      2,
    ],
    [
      "en_lit_h17",
      "intermediate",
      '"The silence was deafening." This phrase is an example of:',
      "「The silence was deafening.」是什麼修辭？",
      ["Metaphor", "Oxymoron", "Simile", "Onomatopoeia"],
      1,
    ],
    [
      "en_lit_h18",
      "intermediate",
      "The politician gave a _______ response, dodging the direct question about the deficit.",
      "政客給出______回應，迴避赤字問題。",
      ["candid", "forthright", "noncommittal", "vociferous"],
      2,
    ],
    [
      "en_lit_h19",
      "intermediate",
      "Her behavior at the gala was quite _______; she spoke loudly and ignored etiquette.",
      "她在晚宴上的舉止相當______。",
      ["decorous", "unseemly", "fastidious", "meticulous"],
      1,
    ],
    [
      "en_lit_h20",
      "intermediate",
      'Choose the word meaning "taking credit for or using something without permission":',
      "哪個詞有「擅用／佔為己有」之意？",
      ["Allocate", "Appropriate", "Ameliorate", "Assimilate"],
      1,
    ],
  ];

  function buildPenLendDialog() {
    return {
      id: "en_lit_e11",
      type: "text_choice",
      level: "beginner",
      courses: ["en"],
      badge: "daily",
      vocabKey: "en_lit:e11_pen",
      prompt: L(
        "對話情境：對方說「能借我一支筆嗎？」，你把筆遞給他。回覆應填哪句？（不是「不客氣」）",
        "对话情境：对方说「能借我一支笔吗？」，你把笔递给他。回复应填哪句？（不是「不客气」）",
        'Dialog: "Can I borrow a pen?" You hand them the pen. What do you say? (Not "you\'re welcome")'
      ),
      promptLine: L(
        "能借我一支筆嗎？— 當然，_______。",
        "能借我一支笔吗？— 当然，_______。",
        '"Can I borrow a pen?" — "Sure, _______."'
      ),
      bubbleLine: L(
        "遞東西 → here you are｜對方道謝 → you're welcome",
        "递东西 → here you are｜对方道谢 → you're welcome",
        "Handing something → here you are | Thanks → you're welcome"
      ),
      speakLine: L("here you are", "here you are", "here you are"),
      speakLang: "en-US",
      options: [
        {
          label: L(
            "here you are（給你／遞上東西）",
            "here you are（给你／递上东西）",
            "here you are (handing something over)"
          ),
          correct: true,
        },
        {
          label: L(
            "you're welcome（不客氣，對方謝你時）",
            "you're welcome（不客气，对方谢你时）",
            "you're welcome (reply to \"thank you\")"
          ),
          correct: false,
        },
        {
          label: L("never mind（沒關係）", "never mind（没关系）", "never mind"),
          correct: false,
        },
        {
          label: L(
            "it doesn't matter（沒關係）",
            "it doesn't matter（没关系）",
            "it doesn't matter"
          ),
          correct: false,
        },
      ],
    };
  }

  var BANK = RAW.map(function (row) {
    if (row[0] === "en_lit_e11") return null;
    return tc(row[0], row[1], row[2], row[3], row[4], row[5]);
  }).filter(Boolean);

  BANK.push(buildPenLendDialog());

  global.RNFEnLiteracyBank = {
    BANK: BANK,
    VERSION: 1,
  };
})(window);
