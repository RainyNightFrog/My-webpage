/**
 * 題庫：多元化題型，可無限輪換
 */
(function (global) {
  var QUESTION_BANK = [
    {
      id: "q_beginner_tea_pic",
      type: "emoji_pick",
      level: "beginner",
      courses: ["zh", "en", "es", "fr", "ja", "ko", "de", "it", "pt"],
      vocabKey: "core:tea",
      badge: "new_word",
      prompt: { hant: "哪一個是「茶」？", hans: "哪一个是「茶」？", en: 'Which is "tea"?' },
      speakLine: { hant: "茶", hans: "茶", en: "tea" },
      options: [
        {
          emoji: "☕",
          cardArt: "coffee",
          label: { hant: "咖啡", hans: "咖啡", en: "coffee" },
        },
        {
          emoji: "🍵",
          cardArt: "tea",
          label: { hant: "茶", hans: "茶", en: "tea" },
          correct: true,
        },
        {
          emoji: "💧",
          cardArt: "water",
          label: { hant: "水", hans: "水", en: "water" },
        },
      ],
    },
    {
      id: "q_beginner_welcome_chip",
      type: "word_bank",
      variant: "translate_chip",
      level: "beginner",
      courses: ["en"],
      vocabKey: "en:welcome",
      badge: "new_word",
      avatar: "👩",
      avatarClass: "girl",
      prompt: {
        hant: "點選正確的英文詞語",
        hans: "点选正确的英文词语",
        en: "Pick the correct English word",
      },
      promptLine: { hant: "歡迎", hans: "欢迎", en: "welcome" },
      speakLine: { hant: "歡迎", hans: "欢迎", en: "welcome" },
      speakLang: "zh-CN",
      words: [
        {
          id: "w_wel",
          text: { hant: "welcome", hans: "welcome", en: "welcome" },
          correct: true,
        },
        {
          id: "w_thx",
          text: { hant: "thank you", hans: "thank you", en: "thank you" },
          distractor: true,
        },
        {
          id: "w_sug",
          text: { hant: "sugar", hans: "sugar", en: "sugar" },
          distractor: true,
        },
      ],
      answer: ["w_wel"],
    },
    {
      id: "q001",
      type: "emoji_pick",
      level: "beginner",
      courses: ["zh"],
      vocabKey: "zh:cf",
      badge: "new_word",
      prompt: { hant: "哪一個是「腸粉」？", hans: "哪一个是「肠粉」？", en: 'Which is "cheung fun"?' },
      options: [
        { emoji: "🥟", label: { hant: "燒賣", hans: "烧卖", en: "Siu mai" } },
        { emoji: "🍖", label: { hant: "豉汁排骨", hans: "豉汁排骨", en: "Spare ribs" } },
        { emoji: "🍜", label: { hant: "腸粉", hans: "肠粉", en: "Cheung fun" }, correct: true },
      ],
    },
    {
      id: "q002",
      type: "text_choice",
      badge: "daily",
      level: "beginner",
      courses: ["en"],
      prompt: { hant: "「你好」的英文是？", hans: "「你好」的英文是？", en: 'How do you say "hello"?' },
      avatar: "👋",
      promptLine: { hant: "你好", hans: "你好", en: "你好" },
      speakLine: { hant: "你好", hans: "你好", en: "你好" },
      speakLang: "zh-CN",
      options: [
        { label: { hant: "Goodbye", hans: "Goodbye", en: "Goodbye" } },
        { label: { hant: "Hello", hans: "Hello", en: "Hello" }, correct: true },
        { label: { hant: "Thanks", hans: "Thanks", en: "Thanks" } },
      ],
    },
    {
      id: "q_translate_sister",
      type: "translate_choice",
      badge: "new_word",
      level: "beginner",
      courses: ["zh"],
      avatar: "🐻",
      avatarClass: "bear",
      promptLine: { hant: "妹妹", hans: "妹妹", en: "妹妹 (younger sister)" },
      options: [
        {
          label: { hant: "在講電話", hans: "在打电话", en: "On the phone" },
        },
        {
          label: { hant: "妹妹", hans: "妹妹", en: "Younger sister" },
          correct: true,
        },
        { label: { hant: "餐廳", hans: "餐厅", en: "Restaurant" } },
      ],
    },
    {
      id: "q_translate_who",
      type: "translate_choice",
      badge: "new_word",
      level: "beginner",
      courses: ["zh"],
      avatar: "🐻",
      avatarClass: "orange",
      correctPraise: "great",
      promptLine: { hant: "誰", hans: "谁", en: "谁 (who)" },
      options: [
        { label: { hant: "那位", hans: "那位", en: "That person" } },
        { label: { hant: "怎麼稱呼", hans: "怎么称呼", en: "How to address" } },
        {
          label: { hant: "誰", hans: "谁", en: "Who" },
          correct: true,
        },
      ],
    },
    {
      id: "q_translate_breakup",
      type: "translate_choice",
      badge: "new_word",
      level: "beginner",
      courses: ["zh"],
      avatar: "👩",
      avatarClass: "purple",
      correctPraise: "great",
      promptLine: { hant: "分手", hans: "分手", en: "分手 (break up)" },
      options: [
        { label: { hant: "弟弟", hans: "弟弟", en: "Younger brother" } },
        {
          label: { hant: "分手", hans: "分手", en: "Break up" },
          correct: true,
        },
        { label: { hant: "老闆", hans: "老板", en: "Boss" } },
      ],
    },
    {
      id: "q_write_photo",
      type: "word_bank",
      variant: "write_sentence",
      badge: "phrase",
      level: "beginner",
      courses: ["zh"],
      avatar: "👩",
      avatarClass: "girl",
      prompt: { hant: "用中文寫出這句話", hans: "用中文写出这句话", en: "Write this sentence in Chinese" },
      promptLine: {
        hant: "這張照片是我爸爸以前的。",
        hans: "这张照片是我爸爸以前的。",
        en: "This is a photo of my dad from before.",
      },
      answerDisplay: {
        hant: "這張照片是我爸爸以前的。",
        hans: "这张照片是我爸爸以前的。",
        en: "这张照片是我爸爸以前的。",
      },
      words: [
        { id: "wp1", text: { hant: "這張", hans: "这张", en: "这张" } },
        { id: "wp2", text: { hant: "是", hans: "是", en: "是" } },
        { id: "wp3", text: { hant: "我", hans: "我", en: "我" } },
        { id: "wp4", text: { hant: "爸爸", hans: "爸爸", en: "爸爸" } },
        { id: "wp5", text: { hant: "以前", hans: "以前", en: "以前" } },
        { id: "wp6", text: { hant: "的", hans: "的", en: "的" } },
        { id: "wp7", text: { hant: "照片", hans: "照片", en: "照片" } },
        { id: "wd1", text: { hant: "時候", hans: "时候", en: "时候" }, distractor: true },
        { id: "wd2", text: { hant: "喝", hans: "喝", en: "喝" }, distractor: true },
        { id: "wd3", text: { hant: "正在", hans: "正在", en: "正在" }, distractor: true },
      ],
      answer: ["wp1", "wp2", "wp3", "wp4", "wp5", "wp6"],
    },
    {
      id: "q_write_dad_young",
      type: "word_bank",
      variant: "write_sentence",
      badge: "phrase",
      avatar: "🏃‍♀️",
      avatarClass: "fit",
      prompt: { hant: "用中文寫出這句話", hans: "用中文写出这句话", en: "Write this sentence in Chinese" },
      level: "beginner",
      courses: ["zh"],
      promptLine: {
        hant: "你有沒有你爸爸年輕時的照片？",
        hans: "你有没有你爸爸年轻时的照片？",
        en: "Do you have a photo of your dad when he was young?",
      },
      answerDisplay: {
        hant: "你有沒有你爸爸年輕時的照片？",
        hans: "你有没有你爸爸年轻时的照片？",
        en: "你有没有你爸爸年轻时的照片？",
      },
      words: [
        { id: "wy1", text: { hant: "你", hans: "你", en: "你" } },
        { id: "wy2", text: { hant: "有没有", hans: "有没有", en: "有没有" } },
        { id: "wy3", text: { hant: "你", hans: "你", en: "你" } },
        { id: "wy4", text: { hant: "爸爸", hans: "爸爸", en: "爸爸" } },
        { id: "wy5", text: { hant: "年輕", hans: "年轻", en: "年轻" } },
        { id: "wy6", text: { hant: "時", hans: "时", en: "时" } },
        { id: "wy7", text: { hant: "的", hans: "的", en: "的" } },
        { id: "wy8", text: { hant: "照片", hans: "照片", en: "照片" } },
        { id: "wyd1", text: { hant: "老闆", hans: "老板", en: "boss" }, distractor: true },
        { id: "wyd2", text: { hant: "奶奶", hans: "奶奶", en: "奶奶" }, distractor: true },
        { id: "wyd3", text: { hant: "分手", hans: "分手", en: "分手" }, distractor: true },
        { id: "wyd4", text: { hant: "吵架", hans: "吵架", en: "吵架" }, distractor: true },
      ],
      answer: ["wy1", "wy2", "wy3", "wy4", "wy5", "wy6", "wy7", "wy8"],
    },
    {
      id: "q003",
      type: "word_bank",
      badge: "phrase",
      level: "beginner",
      courses: ["zh"],
      prompt: { hant: "排出正確句子", hans: "排出正确句子", en: "Arrange the correct sentence" },
      promptLine: { hant: "🔊 我要一杯熱茶。", hans: "🔊 我要一杯热茶。", en: "🔊 I would like a cup of hot tea." },
      words: [
        { id: "w1", text: { hant: "我要", hans: "我要", en: "I want" } },
        { id: "w2", text: { hant: "一杯", hans: "一杯", en: "a cup of" } },
        { id: "w3", text: { hant: "熱茶", hans: "热茶", en: "hot tea" } },
        { id: "d1", text: { hant: "多少錢", hans: "多少钱", en: "how much" }, distractor: true },
        { id: "d2", text: { hant: "什麼", hans: "什么", en: "what" }, distractor: true },
      ],
      answer: ["w1", "w2", "w3"],
    },
    {
      id: "q004",
      type: "true_false",
      level: "beginner",
      courses: ["en"],
      badge: "grammar",
      prompt: { hant: "這句英文正確嗎？", hans: "这句英文正确吗？", en: "Is this English sentence correct?" },
      statement: { hant: "She go to school every day.", hans: "She go to school every day.", en: "She go to school every day." },
      correct: false,
    },
    {
      id: "q005",
      type: "emoji_pick",
      level: "beginner",
      courses: ["zh"],
      vocabKey: "zh:hg",
      badge: "new_word",
      prompt: { hant: "哪一個是「蝦餃」？", hans: "哪一个是「虾饺」？", en: 'Which is "har gow"?' },
      options: [
        { emoji: "🥟", label: { hant: "蝦餃", hans: "虾饺", en: "Har gow" }, correct: true },
        { emoji: "🍜", label: { hant: "腸粉", hans: "肠粉", en: "Cheung fun" } },
        { emoji: "🥠", label: { hant: "餃子", hans: "饺子", en: "Dumpling" } },
      ],
    },
    {
      id: "q006",
      type: "fill_pick",
      level: "beginner",
      courses: ["en"],
      badge: "daily",
      prompt: { hant: "選出正確的詞填入空格", hans: "选出正确的词填入空格", en: "Pick the word for the blank" },
      template: { hant: "我 ___ 學生。", hans: "我 ___ 学生。", en: "I ___ a student." },
      options: [
        { label: { hant: "是", hans: "是", en: "am" }, correct: true },
        { label: { hant: "有", hans: "有", en: "have" } },
        { label: { hant: "在", hans: "在", en: "at" } },
      ],
    },
    {
      id: "q007",
      type: "text_choice",
      badge: "phrase",
      level: "beginner",
      courses: ["en"],
      prompt: { hant: "哪個回答最自然？", hans: "哪个回答最自然？", en: "Which reply sounds most natural?" },
      promptLine: { hant: "謝謝你的幫忙！", hans: "谢谢你的帮忙！", en: "Thanks for your help!" },
      speakLine: { hant: "謝謝你的幫忙！", hans: "谢谢你的帮忙！", en: "Thanks for your help!" },
      speakLang: "zh-CN",
      options: [
        { label: { hant: "You're welcome.", hans: "You're welcome.", en: "You're welcome." }, correct: true },
        { label: { hant: "I'm sorry.", hans: "I'm sorry.", en: "I'm sorry." } },
        { label: { hant: "Good night.", hans: "Good night.", en: "Good night." } },
        { label: { hant: "No problem.", hans: "No problem.", en: "No problem." } },
        { label: { hant: "My pleasure.", hans: "My pleasure.", en: "My pleasure." } },
      ],
    },
    {
      id: "q008",
      type: "word_bank",
      badge: "phrase",
      level: "beginner",
      courses: ["zh"],
      prompt: { hant: "用中文排出問句", hans: "用中文排出问句", en: "Form the question in Chinese" },
      promptLine: { hant: "🔊 Where is the station?", hans: "🔊 Where is the station?", en: "🔊 Where is the station?" },
      words: [
        { id: "w1", text: { hant: "車站", hans: "车站", en: "station" } },
        { id: "w2", text: { hant: "在", hans: "在", en: "at" } },
        { id: "w3", text: { hant: "哪裡", hans: "哪里", en: "where" } },
        { id: "w4", text: { hant: "？", hans: "？", en: "?" } },
        { id: "d1", text: { hant: "今天", hans: "今天", en: "today" }, distractor: true },
      ],
      answer: ["w3", "w2", "w1", "w4"],
    },
    {
      id: "q009",
      type: "true_false",
      level: "beginner",
      courses: ["en"],
      badge: "grammar",
      prompt: { hant: "判斷正誤", hans: "判断正误", en: "True or false?" },
      statement: { hant: "They are playing football now.", hans: "They are playing football now.", en: "They are playing football now." },
      correct: true,
    },
    {
      id: "q010",
      type: "emoji_pick",
      level: "beginner",
      courses: ["zh"],
      vocabKey: "zh:lib",
      badge: "daily",
      prompt: { hant: "哪一個代表「圖書館」？", hans: "哪一个代表「图书馆」？", en: "Which means library?" },
      options: [
        { emoji: "📚", label: { hant: "圖書館", hans: "图书馆", en: "Library" }, correct: true },
        { emoji: "🏥", label: { hant: "醫院", hans: "医院", en: "Hospital" } },
        { emoji: "🏦", label: { hant: "銀行", hans: "银行", en: "Bank" } },
      ],
    },
    {
      id: "q011",
      type: "text_choice",
      badge: "new_word",
      level: "beginner",
      courses: ["en"],
      prompt: { hant: "選出正確拼寫", hans: "选出正确拼写", en: "Pick the correct spelling" },
      promptLine: {
        hant: "這個英文單詞：漂亮的",
        hans: "这个英文单词：漂亮的",
        en: "The English word for 漂亮的",
      },
      speakLine: { hant: "漂亮的", hans: "漂亮的", en: "beautiful" },
      speakLang: "zh-CN",
      options: [
        { label: { hant: "beatiful", hans: "beatiful", en: "beatiful" } },
        { label: { hant: "beautiful", hans: "beautiful", en: "beautiful" }, correct: true },
        { label: { hant: "beautifull", hans: "beautifull", en: "beautifull" } },
      ],
    },
    {
      id: "q012",
      type: "fill_pick",
      badge: "grammar",
      prompt: { hant: "選出正確時態", hans: "选出正确时态", en: "Choose the correct tense" },
      template: { hant: "Yesterday he ___ to the park.", hans: "Yesterday he ___ to the park.", en: "Yesterday he ___ to the park." },
      options: [
        { label: { hant: "go", hans: "go", en: "go" } },
        { label: { hant: "went", hans: "went", en: "went" }, correct: true },
        { label: { hant: "going", hans: "going", en: "going" } },
      ],
    },
    {
      id: "q013",
      type: "word_bank",
      badge: "daily",
      level: "beginner",
      courses: ["zh"],
      prompt: { hant: "排出正確句子", hans: "排出正确句子", en: "Arrange the correct sentence" },
      promptLine: { hant: "🔊 這是燒賣。", hans: "🔊 这是烧卖。", en: "🔊 This is siu mai." },
      words: [
        { id: "w1", text: { hant: "這是", hans: "这是", en: "This is" } },
        { id: "w2", text: { hant: "燒賣", hans: "烧卖", en: "siu mai" } },
        { id: "d1", text: { hant: "我要", hans: "我要", en: "I want" }, distractor: true },
        { id: "d2", text: { hant: "元", hans: "元", en: "dollar" }, distractor: true },
      ],
      answer: ["w1", "w2"],
    },
    {
      id: "q014",
      type: "text_choice",
      badge: "daily",
      level: "beginner",
      courses: ["en"],
      prompt: { hant: "「再見」英文？", hans: "「再见」英文？", en: 'English for "goodbye"?' },
      promptLine: { hant: "再見", hans: "再见", en: "「再见」" },
      speakLine: { hant: "再見", hans: "再见", en: "再見" },
      speakLang: "zh-CN",
      options: [
        { label: { hant: "Hello", hans: "Hello", en: "Hello" } },
        { label: { hant: "Goodbye", hans: "Goodbye", en: "Goodbye" }, correct: true },
        { label: { hant: "Please", hans: "Please", en: "Please" } },
        { label: { hant: "Thanks", hans: "Thanks", en: "Thanks" } },
        { label: { hant: "Yes", hans: "Yes", en: "Yes" } },
      ],
    },
    {
      id: "q015",
      type: "emoji_pick",
      vocabKey: "zh:coffee",
      badge: "daily",
      prompt: { hant: "哪個是「咖啡」？", hans: "哪个是「咖啡」？", en: "Which is coffee?" },
      options: [
        { emoji: "🍵", label: { hant: "茶", hans: "茶", en: "Tea" } },
        { emoji: "☕", label: { hant: "咖啡", hans: "咖啡", en: "Coffee" }, correct: true },
        { emoji: "🧃", label: { hant: "果汁", hans: "果汁", en: "Juice" } },
      ],
    },
    {
      id: "q016",
      type: "true_false",
      level: "beginner",
      courses: ["zh"],
      badge: "grammar",
      prompt: { hant: "中文句子正確嗎？", hans: "中文句子正确吗？", en: "Is the Chinese correct?" },
      statement: { hant: "我昨天去了圖書館。", hans: "我昨天去了图书馆。", en: "我昨天去了图书馆。" },
      correct: true,
    },
    {
      id: "q017",
      type: "fill_pick",
      badge: "new_word",
      prompt: { hant: "選出量詞", hans: "选出量词", en: "Pick the measure word" },
      template: { hant: "一 ___ 蘋果", hans: "一 ___ 苹果", en: "one ___ apple" },
      options: [
        { label: { hant: "個", hans: "个", en: "ge" }, correct: true },
        { label: { hant: "本", hans: "本", en: "ben" } },
        { label: { hant: "張", hans: "张", en: "zhang" } },
      ],
    },
    {
      id: "q018",
      type: "text_choice",
      badge: "phrase",
      level: "beginner",
      courses: ["zh"],
      avatar: "🧑‍🏫",
      prompt: { hant: "選出最佳翻譯", hans: "选出最佳翻译", en: "Best translation?" },
      promptLine: {
        hant: "🔊 英文句子（請選中文譯文）",
        hans: "🔊 英文句子（请选中文译文）",
        en: "Pick the Chinese translation",
      },
      speakLine: {
        hant: "I have been learning for two years.",
        hans: "I have been learning for two years.",
        en: "I have been learning for two years.",
      },
      speakLang: "en-US",
      options: [
        { label: { hant: "我學習了兩年。", hans: "我学习了两年。", en: "I studied for two years." } },
        { label: { hant: "我已經學了兩年。", hans: "我已经学了两年。", en: "I have been learning for two years." }, correct: true },
        { label: { hant: "我將學兩年。", hans: "我将学两年。", en: "I will study two years." } },
      ],
    },
    {
      id: "q019",
      type: "word_bank",
      variant: "write_sentence",
      level: "beginner",
      courses: ["en"],
      badge: "phrase",
      audioOnly: true,
      prompt: { hant: "排出否定句", hans: "排出否定句", en: "Build the negative sentence" },
      speakLine: {
        hant: "He doesn't like coffee.",
        hans: "He doesn't like coffee.",
        en: "He doesn't like coffee.",
      },
      speakLang: "en-US",
      promptLine: { hant: "", hans: "", en: "" },
      words: [
        { id: "w1", text: { hant: "He", hans: "He", en: "He" } },
        { id: "w2", text: { hant: "doesn't", hans: "doesn't", en: "doesn't" } },
        { id: "w3", text: { hant: "like", hans: "like", en: "like" } },
        { id: "w4", text: { hant: "coffee", hans: "coffee", en: "coffee" } },
        { id: "d1", text: { hant: "tea", hans: "tea", en: "tea" }, distractor: true },
      ],
      answer: ["w1", "w2", "w3", "w4"],
    },
    {
      id: "q020",
      type: "emoji_pick",
      level: "beginner",
      courses: ["zh"],
      vocabKey: "zh:rain",
      badge: "review",
      prompt: { hant: "哪一個是「雨」？", hans: "哪一个是「雨」？", en: "Which means rain?" },
      options: [
        { emoji: "🌧️", label: { hant: "雨", hans: "雨", en: "Rain" }, correct: true },
        { emoji: "☀️", label: { hant: "晴", hans: "晴", en: "Sunny" } },
        { emoji: "❄️", label: { hant: "雪", hans: "雪", en: "Snow" } },
      ],
    },
    {
      id: "q022",
      type: "true_false",
      badge: "daily",
      level: "beginner",
      courses: ["en"],
      vocabKey: "en:fast",
      prompt: { hant: "詞義判斷", hans: "词义判断", en: "Meaning check" },
      statement: {
        hant: "「fast」可以表示「快的」，也可以表示「禁食、不吃東西」。",
        hans: "「fast」可以表示「快的」，也可以表示「禁食、不吃东西」。",
        en: '"Fast" can mean "quick" or "to go without food".',
      },
      explanation: {
        hant: "「fast」= 快的（quick），也可當動詞指禁食、不吃東西（to fast）。所以這句說法正確。",
        hans: "「fast」= 快的（quick），也可当动词指禁食、不吃东西（to fast）。所以这句说法正确。",
        en: "Fast = quick (adjective), or to fast / not eat (verb). The statement is true.",
      },
      correct: true,
    },
    {
      id: "q023",
      type: "fill_pick",
      level: "beginner",
      courses: ["en"],
      badge: "daily",
      prompt: { hant: "選出正確介系詞", hans: "选出正确介词", en: "Pick the preposition" },
      template: { hant: "The book is ___ the table.", hans: "The book is ___ the table.", en: "The book is ___ the table." },
      options: [
        { label: { hant: "on", hans: "on", en: "on" }, correct: true },
        { label: { hant: "in", hans: "in", en: "in" } },
        { label: { hant: "at", hans: "at", en: "at" } },
      ],
    },
    {
      id: "q024",
      type: "word_bank",
      variant: "write_sentence",
      level: "beginner",
      courses: ["en"],
      badge: "new_word",
      vocabKey: "en:restroom_ask",
      audioOnly: true,
      prompt: { hant: "排列問路句", hans: "排列问路句", en: "Arrange: asking directions" },
      speakLine: {
        hant: "Excuse me, where is the restroom?",
        hans: "Excuse me, where is the restroom?",
        en: "Excuse me, where is the restroom?",
      },
      speakLang: "en-US",
      promptLine: { hant: "", hans: "", en: "" },
      words: [
        { id: "w1", text: { hant: "Excuse me", hans: "Excuse me", en: "Excuse me" } },
        { id: "w2", text: { hant: "where", hans: "where", en: "where" } },
        { id: "w3", text: { hant: "is", hans: "is", en: "is" } },
        { id: "w4", text: { hant: "the", hans: "the", en: "the" } },
        { id: "w5", text: { hant: "restroom", hans: "restroom", en: "restroom" } },
        { id: "w6", text: { hant: "?", hans: "?", en: "?" } },
        { id: "d1", text: { hant: "thanks", hans: "thanks", en: "thanks" }, distractor: true },
      ],
      answer: ["w1", "w2", "w3", "w4", "w5", "w6"],
      answerDisplay: {
        hant: "請問，洗手間在哪裡？",
        hans: "请问，洗手间在哪里？",
        en: "Excuse me, where is the restroom?",
      },
    },
    {
      id: "q025",
      type: "text_choice",
      badge: "daily",
      level: "beginner",
      courses: ["en"],
      prompt: {
        hant: "「15」的英文是？",
        hans: "「15」的英文是？",
        en: "How do you say 15 in English?",
      },
      promptLine: { hant: "15", hans: "15", en: "15" },
      speakLine: { hant: "十五", hans: "十五", en: "fifteen" },
      speakLang: "zh-CN",
      options: [
        { label: { hant: "five", hans: "five", en: "five" } },
        { label: { hant: "fifteen", hans: "fifteen", en: "fifteen" }, correct: true },
        { label: { hant: "fifty", hans: "fifty", en: "fifty" } },
        { label: { hant: "ten", hans: "ten", en: "ten" } },
        { label: { hant: "twenty", hans: "twenty", en: "twenty" } },
      ],
    },
  ];

  /** 配對題池：每次隨機抽 5 組，可無限組合 */
  var MATCH_PAIR_COUNT = 5;
  var MATCH_POOL = [
    {
      setId: "canto_daily",
      dialect: "yue",
      badge: "phrase",
      prompt: {
        hant: "選擇配對（普通話 ↔ 粵語）",
        hans: "选择配对（普通话 ↔ 粤语）",
        en: "Match Mandarin ↔ Cantonese",
      },
      pool: [
        { pairId: "hg", left: { hant: "蝦餃", hans: "虾饺", en: "Har gow" }, right: { hant: "蝦餃", hans: "虾饺", en: "Har gow" } },
        { pairId: "cf", left: { hant: "腸粉", hans: "肠粉", en: "Cheung fun" }, right: { hant: "腸粉", hans: "肠粉", en: "Cheung fun" } },
        { pairId: "is", left: { hant: "是", hans: "是", en: "是 (to be)" }, right: { hant: "係", hans: "系", en: "係" } },
        { pairId: "this", left: { hant: "這個", hans: "这个", en: "this" }, right: { hant: "呢個", hans: "呢个", en: "呢個" } },
        { pairId: "what", left: { hant: "什麼", hans: "什么", en: "what" }, right: { hant: "乜嘢", hans: "乜嘢", en: "乜嘢" } },
        { pairId: "where", left: { hant: "哪裡", hans: "哪里", en: "where" }, right: { hant: "邊度", hans: "边度", en: "邊度" } },
        { pairId: "not", left: { hant: "不是", hans: "不是", en: "not" }, right: { hant: "唔係", hans: "唔系", en: "唔係" } },
        { pairId: "eat", left: { hant: "吃", hans: "吃", en: "eat" }, right: { hant: "食", hans: "食", en: "食" } },
        { pairId: "very", left: { hant: "很", hans: "很", en: "very" }, right: { hant: "好", hans: "好", en: "好 (very)" } },
        { pairId: "now", left: { hant: "現在", hans: "现在", en: "now" }, right: { hant: "而家", hans: "而家", en: "而家" } },
      ],
    },
    {
      setId: "canto_food",
      badge: "new_word",
      prompt: {
        hant: "配對點心名稱",
        hans: "配对点心名称",
        en: "Match dim sum names",
      },
      pool: [
        { pairId: "sm", left: { hant: "燒賣", hans: "烧卖", en: "Siu mai" }, right: { hant: "燒賣", hans: "烧卖", en: "Siu mai" } },
        { pairId: "cf2", left: { hant: "腸粉", hans: "肠粉", en: "Cheung fun" }, right: { hant: "腸粉", hans: "肠粉", en: "Cheung fun" } },
        { pairId: "hg2", left: { hant: "蝦餃", hans: "虾饺", en: "Har gow" }, right: { hant: "蝦餃", hans: "虾饺", en: "Har gow" } },
        { pairId: "ribs", left: { hant: "豉汁排骨", hans: "豉汁排骨", en: "Spare ribs" }, right: { hant: "豉汁排骨", hans: "豉汁排骨", en: "Spare ribs" } },
        { pairId: "tofu", left: { hant: "豆腐花", hans: "豆腐花", en: "Tofu pudding" }, right: { hant: "豆腐花", hans: "豆腐花", en: "Tofu pudding" } },
        { pairId: "tea", left: { hant: "熱茶", hans: "热茶", en: "Hot tea" }, right: { hant: "熱茶", hans: "热茶", en: "Hot tea" } },
        { pairId: "bb", left: { hant: "叉燒包", hans: "叉烧包", en: "BBQ pork bun" }, right: { hant: "叉燒包", hans: "叉烧包", en: "BBQ pork bun" } },
        { pairId: "egg", left: { hant: "蛋撻", hans: "蛋挞", en: "Egg tart" }, right: { hant: "蛋撻", hans: "蛋挞", en: "Egg tart" } },
      ],
    },
    {
      setId: "en_zh_word",
      badge: "daily",
      prompt: {
        hant: "配對中英文詞彙",
        hans: "配对中英文词汇",
        en: "Match English ↔ Chinese",
      },
      pool: [
        { pairId: "hello", left: { hant: "Hello", hans: "Hello", en: "Hello" }, right: { hant: "你好", hans: "你好", en: "你好" } },
        { pairId: "bye", left: { hant: "Goodbye", hans: "Goodbye", en: "Goodbye" }, right: { hant: "再見", hans: "再见", en: "再见" } },
        { pairId: "thanks", left: { hant: "Thank you", hans: "Thank you", en: "Thank you" }, right: { hant: "謝謝", hans: "谢谢", en: "谢谢" } },
        { pairId: "book", left: { hant: "book", hans: "book", en: "book" }, right: { hant: "書", hans: "书", en: "书" } },
        { pairId: "water", left: { hant: "water", hans: "water", en: "water" }, right: { hant: "水", hans: "水", en: "水" } },
        { pairId: "school", left: { hant: "school", hans: "school", en: "school" }, right: { hant: "學校", hans: "学校", en: "学校" } },
        { pairId: "friend", left: { hant: "friend", hans: "friend", en: "friend" }, right: { hant: "朋友", hans: "朋友", en: "朋友" } },
        { pairId: "rain", left: { hant: "rain", hans: "rain", en: "rain" }, right: { hant: "雨", hans: "雨", en: "雨" } },
        { pairId: "frog", left: { hant: "frog", hans: "frog", en: "frog" }, right: { hant: "青蛙", hans: "青蛙", en: "青蛙" } },
        { pairId: "night", left: { hant: "night", hans: "night", en: "night" }, right: { hant: "夜晚", hans: "夜晚", en: "夜晚" } },
      ],
    },
    {
      setId: "en_zh_phrase",
      badge: "phrase",
      prompt: {
        hant: "配對英文句子與中文",
        hans: "配对英文句子与中文",
        en: "Match English phrases ↔ Chinese",
      },
      pool: [
        { pairId: "p1", left: { hant: "Good morning", hans: "Good morning", en: "Good morning" }, right: { hant: "早安", hans: "早安", en: "早安" } },
        { pairId: "p2", left: { hant: "How are you?", hans: "How are you?", en: "How are you?" }, right: { hant: "你好嗎？", hans: "你好吗？", en: "你好吗？" } },
        { pairId: "p3", left: { hant: "I don't know", hans: "I don't know", en: "I don't know" }, right: { hant: "我不知道", hans: "我不知道", en: "我不知道" } },
        { pairId: "p4", left: { hant: "See you later", hans: "See you later", en: "See you later" }, right: { hant: "待會見", hans: "待会见", en: "待会见" } },
        { pairId: "p5", left: { hant: "Nice to meet you", hans: "Nice to meet you", en: "Nice to meet you" }, right: { hant: "很高興認識你", hans: "很高兴认识你", en: "很高兴认识你" } },
        { pairId: "p6", left: { hant: "Where is the station?", hans: "Where is the station?", en: "Where is the station?" }, right: { hant: "車站在哪裡？", hans: "车站在哪里？", en: "车站在哪里？" } },
        { pairId: "p7", left: { hant: "I am learning Chinese", hans: "I am learning Chinese", en: "I am learning Chinese" }, right: { hant: "我在學中文", hans: "我在学中文", en: "我在学中文" } },
      ],
    },
    {
      setId: "emoji_meaning",
      badge: "daily",
      prompt: {
        hant: "配對表情與詞語",
        hans: "配对表情与词语",
        en: "Match emoji ↔ word",
      },
      pool: [
        { pairId: "e1", left: { hant: "📚", hans: "📚", en: "📚" }, right: { hant: "圖書館", hans: "图书馆", en: "library" } },
        { pairId: "e2", left: { hant: "☕", hans: "☕", en: "☕" }, right: { hant: "咖啡", hans: "咖啡", en: "coffee" } },
        { pairId: "e3", left: { hant: "🌧️", hans: "🌧️", en: "🌧️" }, right: { hant: "雨", hans: "雨", en: "rain" } },
        { pairId: "e4", left: { hant: "🐸", hans: "🐸", en: "🐸" }, right: { hant: "青蛙", hans: "青蛙", en: "frog" } },
        { pairId: "e5", left: { hant: "🏥", hans: "🏥", en: "🏥" }, right: { hant: "醫院", hans: "医院", en: "hospital" } },
        { pairId: "e6", left: { hant: "🍜", hans: "🍜", en: "🍜" }, right: { hant: "麵", hans: "面", en: "noodles" } },
        { pairId: "e7", left: { hant: "✈️", hans: "✈️", en: "✈️" }, right: { hant: "飛機", hans: "飞机", en: "airplane" } },
      ],
    },
    {
      setId: "es_en_basic",
      badge: "grammar",
      prompt: {
        hant: "配對西班牙文與英文",
        hans: "配对西班牙文与英文",
        en: "Match Spanish ↔ English",
      },
      pool: [
        { pairId: "s1", left: { hant: "hola", hans: "hola", en: "hola" }, right: { hant: "hello", hans: "hello", en: "hello" } },
        { pairId: "s2", left: { hant: "gracias", hans: "gracias", en: "gracias" }, right: { hant: "thank you", hans: "thank you", en: "thank you" } },
        { pairId: "s3", left: { hant: "agua", hans: "agua", en: "agua" }, right: { hant: "water", hans: "water", en: "water" } },
        { pairId: "s4", left: { hant: "libro", hans: "libro", en: "libro" }, right: { hant: "book", hans: "book", en: "book" } },
        { pairId: "s5", left: { hant: "casa", hans: "casa", en: "casa" }, right: { hant: "house", hans: "house", en: "house" } },
        { pairId: "s6", left: { hant: "perro", hans: "perro", en: "perro" }, right: { hant: "dog", hans: "dog", en: "dog" } },
      ],
    },
    {
      setId: "ko_zh_basic",
      badge: "new_word",
      prompt: {
        hant: "配對韓語與中文",
        hans: "配对韩语与中文",
        en: "Match Korean ↔ Chinese",
      },
      pool: [
        { pairId: "k1", left: { hant: "안녕하세요", hans: "안녕하세요", en: "안녕하세요" }, right: { hant: "你好", hans: "你好", en: "你好" } },
        { pairId: "k2", left: { hant: "감사합니다", hans: "감사합니다", en: "감사합니다" }, right: { hant: "謝謝", hans: "谢谢", en: "谢谢" } },
        { pairId: "k3", left: { hant: "차", hans: "차", en: "차" }, right: { hant: "茶", hans: "茶", en: "茶" } },
        { pairId: "k4", left: { hant: "커피", hans: "커피", en: "커피" }, right: { hant: "咖啡", hans: "咖啡", en: "咖啡" } },
        { pairId: "k5", left: { hant: "물", hans: "물", en: "물" }, right: { hant: "水", hans: "水", en: "水" } },
        { pairId: "k6", left: { hant: "학교", hans: "학교", en: "학교" }, right: { hant: "學校", hans: "学校", en: "学校" } },
        { pairId: "k7", left: { hant: "친구", hans: "친구", en: "친구" }, right: { hant: "朋友", hans: "朋友", en: "朋友" } },
        { pairId: "k8", left: { hant: "사과", hans: "사과", en: "사과" }, right: { hant: "蘋果", hans: "苹果", en: "苹果" } },
      ],
    },
    {
      setId: "ja_zh_kana",
      badge: "daily",
      prompt: {
        hant: "配對日文與中文意思",
        hans: "配对日文与中文意思",
        en: "Match Japanese ↔ Chinese meaning",
      },
      pool: [
        { pairId: "j1", left: { hant: "こんにちは", hans: "こんにちは", en: "こんにちは" }, right: { hant: "你好", hans: "你好", en: "你好" } },
        { pairId: "j2", left: { hant: "ありがとう", hans: "ありがとう", en: "ありがとう" }, right: { hant: "謝謝", hans: "谢谢", en: "谢谢" } },
        { pairId: "j3", left: { hant: "さようなら", hans: "さようなら", en: "さようなら" }, right: { hant: "再見", hans: "再见", en: "再见" } },
        { pairId: "j4", left: { hant: "本", hans: "本", en: "本 (book)" }, right: { hant: "書", hans: "书", en: "书" } },
        { pairId: "j5", left: { hant: "水", hans: "水", en: "水 (water)" }, right: { hant: "水", hans: "水", en: "水" } },
        { pairId: "j6", left: { hant: "学校", hans: "学校", en: "学校" }, right: { hant: "學校", hans: "学校", en: "学校" } },
      ],
    },
    {
      setId: "antonym_en",
      badge: "grammar",
      prompt: {
        hant: "配對英文反義詞",
        hans: "配对英文反义词",
        en: "Match English antonyms",
      },
      pool: [
        { pairId: "a1", left: { hant: "hot", hans: "hot", en: "hot" }, right: { hant: "cold", hans: "cold", en: "cold" } },
        { pairId: "a2", left: { hant: "big", hans: "big", en: "big" }, right: { hant: "small", hans: "small", en: "small" } },
        { pairId: "a3", left: { hant: "fast", hans: "fast", en: "fast" }, right: { hant: "slow", hans: "slow", en: "slow" } },
        { pairId: "a4", left: { hant: "day", hans: "day", en: "day" }, right: { hant: "night", hans: "night", en: "night" } },
        { pairId: "a5", left: { hant: "open", hans: "open", en: "open" }, right: { hant: "close", hans: "close", en: "close" } },
        { pairId: "a6", left: { hant: "happy", hans: "happy", en: "happy" }, right: { hant: "sad", hans: "sad", en: "sad" } },
      ],
    },
  ];

  var matchSeq = 0;

  function findMatchSet(setId) {
    for (var i = 0; i < MATCH_POOL.length; i++) {
      if (MATCH_POOL[i].setId === setId) return MATCH_POOL[i];
    }
    return null;
  }

  function matchSideDisplayText(pair, course, side) {
    if (!pair) return "";
    if (course === "zh") {
      return side === "left" ? tField(pair.left) : tField(pair.right);
    }
    if (side === "left") {
      return pair.left.hant || pair.left.en || pair.left.hans || "";
    }
    return tMatchLabel(pair.right, course, "right");
  }

  function pickUniqueVocabForMatch(list, course, count) {
    var shuffled = shuffle(list.slice());
    var picked = [];
    var usedIcon = {};
    var usedLeft = {};
    var usedRight = {};
    var i;
    for (i = 0; i < shuffled.length && picked.length < count; i++) {
      var item = shuffled[i];
      if (!item || !item.icon || usedIcon[item.icon]) continue;
      var leftKey =
        course === "zh"
          ? tField(item.meaning)
          : (item.foreign || "").toLowerCase();
      var rightKey =
        course === "zh"
          ? (item.foreign || "").toLowerCase()
          : tField(item.meaning);
      if (!leftKey || !rightKey || usedLeft[leftKey] || usedRight[rightKey]) {
        continue;
      }
      usedIcon[item.icon] = true;
      usedLeft[leftKey] = true;
      usedRight[rightKey] = true;
      picked.push(item);
    }
    return picked;
  }

  function dedupeMatchPairs(pairs, course) {
    if (!pairs || !pairs.length) return [];
    var out = [];
    var usedLeft = {};
    var usedRight = {};
    var usedPairId = {};
    pairs.forEach(function (pair) {
      if (!pair) return;
      var pid = pair.pairId || "";
      var lk = matchSideDisplayText(pair, course, "left").toLowerCase();
      var rk = matchSideDisplayText(pair, course, "right").toLowerCase();
      if (!lk || !rk) return;
      if (usedPairId[pid] || usedLeft[lk] || usedRight[rk]) return;
      usedPairId[pid] = true;
      usedLeft[lk] = true;
      usedRight[rk] = true;
      out.push(pair);
    });
    return out;
  }

  function createMatchQuestion(set, count) {
    var n = count || MATCH_PAIR_COUNT;
    var course = getLearnTarget();
    var pool = dedupeMatchPairs(shuffle(set.pool), course);
    if (pool.length > n) pool = pool.slice(0, n);
    matchSeq += 1;
    return {
      id: "match_" + set.setId + "_" + matchSeq,
      type: "match_pairs",
      badge: set.badge || "daily",
      setId: set.setId,
      prompt: set.prompt,
      pairs: pool,
    };
  }

  function fieldLooksCantonese(obj) {
    if (!obj) return false;
    var s = (obj.hant || "") + (obj.hans || "") + (obj.en || "");
    if (/粵語|粤语|Cantonese/i.test(s)) return true;
    if (/[嘅冇喺咗嘢乜唔]/u.test(s)) return true;
    if (
      /傾緊|細妹|細佬|掟煲|老細|邊個|嗰位|點稱呼|呢個|呢張|呢张|阿爸|嘅相|邊度|乜嘢|傾紧|边个/.test(
        s
      )
    ) {
      return true;
    }
    return false;
  }

  function isCantoneseQuestion(q) {
    if (!q) return false;
    if (q.dialect === "yue") return true;
    if (q.type === "match_pairs" && q.setId === "canto_daily") return true;
    if (fieldLooksCantonese(q.prompt)) return true;
    if (fieldLooksCantonese(q.promptLine)) return true;
    if (q.statement && fieldLooksCantonese(q.statement)) return true;
    if (q.template && fieldLooksCantonese(q.template)) return true;
    if (q.options) {
      for (var i = 0; i < q.options.length; i++) {
        if (fieldLooksCantonese(q.options[i].label)) return true;
      }
    }
    if (q.words) {
      for (var j = 0; j < q.words.length; j++) {
        if (fieldLooksCantonese(q.words[j].text)) return true;
      }
    }
    return false;
  }

  /** 各學習語言允許的靜態配對題（空陣列＝只用課程詞彙動態生成） */
  var MATCH_SET_IDS_BY_COURSE = {
    en: ["en_zh_word", "en_zh_phrase", "emoji_meaning", "antonym_en"],
    es: ["es_en_basic"],
    ja: ["ja_zh_kana"],
    ko: ["ko_zh_basic"],
    fr: [],
    de: [],
    it: [],
    pt: [],
  };

  function matchSetsForCourse(course) {
    if (course === "zh") {
      return MATCH_POOL.filter(function (s) {
        return s.dialect !== "yue" && s.setId !== "canto_food";
      });
    }
    var ids = MATCH_SET_IDS_BY_COURSE[course];
    if (!ids || !ids.length) return [];
    return MATCH_POOL.filter(function (s) {
      return ids.indexOf(s.setId) >= 0;
    });
  }

  function matchPromptForCourse(course) {
    var map = {
      en: {
        hant: "配對英文與中文",
        hans: "配对英文与中文",
        en: "Match English ↔ Chinese",
      },
      es: {
        hant: "配對西班牙文與中文",
        hans: "配对西班牙文与中文",
        en: "Match Spanish ↔ Chinese",
      },
      ja: {
        hant: "配對日文與中文",
        hans: "配对日文与中文",
        en: "Match Japanese ↔ Chinese",
      },
      ko: {
        hant: "配對韓語與中文",
        hans: "配对韩语与中文",
        en: "Match Korean ↔ Chinese",
      },
      fr: {
        hant: "配對法語與中文",
        hans: "配对法语与中文",
        en: "Match French ↔ Chinese",
      },
      de: {
        hant: "配對德語與中文",
        hans: "配对德语与中文",
        en: "Match German ↔ Chinese",
      },
      it: {
        hant: "配對義大利語與中文",
        hans: "配对意大利语与中文",
        en: "Match Italian ↔ Chinese",
      },
      pt: {
        hant: "配對葡萄牙語與中文",
        hans: "配对葡萄牙语与中文",
        en: "Match Portuguese ↔ Chinese",
      },
    };
    return (
      map[course] || {
        hant: "選擇配對",
        hans: "选择配对",
        en: "Select matching pairs",
      }
    );
  }

  function pickMatchQuestion(course, beginner) {
    var vocab =
      global.RNFQuestionGen &&
      RNFQuestionGen.VOCAB &&
      RNFQuestionGen.VOCAB[course];
    if (vocab && vocab.length >= MATCH_PAIR_COUNT) {
      return createBeginnerMatchQuestion(course);
    }
    if (beginner) {
      return createBeginnerMatchQuestion(course);
    }
    return randomMatchQuestion();
  }

  /** 靜態題庫裡反覆出現的點心題（生成題庫已涵蓋） */
  function isLegacyDimSumStatic(q) {
    if (!q || !q.id || q.id.indexOf("gen_") === 0) return false;
    var vk = q.vocabKey || "";
    return vk === "zh:cf" || vk === "zh:hg" || vk === "zh:sm" || vk === "zh:ribs";
  }

  function boostZhGeneratedPool(pool, course) {
    if (course !== "zh") return pool;
    var generated = pool.filter(function (q) {
      return q.id && q.id.indexOf("gen_") === 0;
    });
    if (generated.length < 80) return pool;
    return generated.concat(
      pool.filter(function (q) {
        return q.id.indexOf("gen_") !== 0 && !isLegacyDimSumStatic(q);
      })
    );
  }

  function createBeginnerMatchQuestion(course) {
    var list =
      global.RNFQuestionGen && RNFQuestionGen.VOCAB && RNFQuestionGen.VOCAB[course];
    if (!list || list.length < 5) return randomMatchQuestion();
    var pool = list.filter(function (item) {
      return item.tier !== "hard";
    });
    if (pool.length < 5) pool = list.slice();
    var picked = pickUniqueVocabForMatch(pool, course, MATCH_PAIR_COUNT);
    if (picked.length < MATCH_PAIR_COUNT) {
      picked = pickUniqueVocabForMatch(list.slice(), course, MATCH_PAIR_COUNT);
    }
    var pairs = picked.map(function (item, i) {
      var pairId = "bg_" + course + "_" + (item.icon || i);
      if (course === "zh") {
        return {
          pairId: pairId,
          left: item.meaning,
          right: {
            hant: item.foreign,
            hans: item.foreign,
            en: item.foreign,
          },
        };
      }
      return {
        pairId: pairId,
        left: {
          hant: item.foreign,
          hans: item.foreign,
          en: item.foreign,
        },
        right: item.meaning,
      };
    });
    matchSeq += 1;
    return {
      id: "match_beginner_" + course + "_" + matchSeq,
      type: "match_pairs",
      level: "beginner",
      badge: "daily",
      courses: [course],
      setId: "beginner_vocab",
      prompt: matchPromptForCourse(course),
      pairs: dedupeMatchPairs(pairs, course),
    };
  }

  function randomMatchQuestion() {
    var course = getLearnTarget();
    var vocab =
      global.RNFQuestionGen &&
      RNFQuestionGen.VOCAB &&
      RNFQuestionGen.VOCAB[course];
    if (vocab && vocab.length >= MATCH_PAIR_COUNT) {
      return createBeginnerMatchQuestion(course);
    }
    var sets = matchSetsForCourse(course);
    if (!sets.length) return createBeginnerMatchQuestion(course);
    var set = sets[Math.floor(Math.random() * sets.length)];
    return createMatchQuestion(set, MATCH_PAIR_COUNT);
  }

  function resolveQuestionRef(ref) {
    if (typeof ref !== "string") return ref;
    if (ref.indexOf("matchSet:") === 0) {
      var set = findMatchSet(ref.slice(9));
      return set ? createMatchQuestion(set, MATCH_PAIR_COUNT) : null;
    }
    return getById(ref);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function getLocaleKey() {
    var lang = global.AppI18n ? AppI18n.getLang() : "zhHant";
    if (lang === "zhHans") return "hans";
    if (lang === "en") return "en";
    return "hant";
  }

  function looksLikeEnglish(s) {
    var x = (s || "").trim();
    if (!x) return false;
    return /^[A-Za-z0-9\s'".,?!;:()\-–—…]+$/.test(x);
  }

  /** 學日語／韓語等：選項與詞塊顯示目標語言，不用 en 欄的英文釋義 */
  function tTargetField(obj) {
    if (!obj) return "";
    if (obj.foreign) return obj.foreign;
    if (obj.hant && obj.hant === obj.hans && obj.hant === obj.en) return obj.hant;
    if (obj.hant && !looksLikeEnglish(obj.hant)) return obj.hant;
    if (obj.hans && !looksLikeEnglish(obj.hans)) return obj.hans;
    if (obj.en && !looksLikeEnglish(obj.en)) return obj.en;
    return obj.hant || obj.hans || obj.en || obj.foreign || "";
  }

  function tField(obj) {
    if (!obj) return "";
    var course = getLearnTarget();
    if (course === "zh") {
      var zk = getLocaleKey();
      if (obj[zk]) return obj[zk];
      return obj.hant || obj.hans || obj.en || "";
    }
    if (course === "en") {
      return obj.en || obj.foreign || obj.hant || obj.hans || "";
    }
    return tTargetField(obj);
  }

  /** 介面文案（標題、配對題說明）依網站語言 */
  function tUiField(obj) {
    if (!obj) return "";
    var k = getLocaleKey();
    if (obj[k]) return obj[k];
    return obj.hant || obj.hans || obj.en || "";
  }

  /** 配對題左右欄：學英語時左英文、右中文 */
  function tMatchLabel(obj, course, side) {
    if (!obj) return "";
    if (course === "zh") return tField(obj);
    if (side === "left") {
      if (course === "en") return obj.en || obj.hant || obj.hans || "";
      return tTargetField(obj) || obj.hant || obj.hans || obj.en || "";
    }
    var ui = getLocaleKey();
    if (ui === "zhHans") return obj.hans || obj.hant || "";
    if (ui === "zhHant") return obj.hant || obj.hans || "";
    return obj.hant || obj.hans || obj.en || "";
  }

  function getById(id) {
    for (var i = 0; i < QUESTION_BANK.length; i++) {
      if (QUESTION_BANK[i].id === id) return QUESTION_BANK[i];
    }
    return null;
  }

  var _fullBankCache = null;
  var _fullBankCacheVersion = 38;
  var MIN_CHOICE_OPTIONS = 5;

  function dedupeEmojiPickQuestion(q, course) {
    if (!q || q.type !== "emoji_pick" || !(q.options && q.options.length)) {
      return q;
    }
    var copy = JSON.parse(JSON.stringify(q));
    var seen = {};
    var kept = [];
    var correctOpt = null;
    copy.options.forEach(function (o) {
      if (o && o.correct) correctOpt = o;
    });
    function tryPush(o) {
      if (!o) return;
      var em = o.emoji || "";
      if (!em || seen[em]) return;
      seen[em] = true;
      kept.push(o);
    }
    if (correctOpt) tryPush(correctOpt);
    copy.options.forEach(function (o) {
      if (o && !o.correct) tryPush(o);
    });
    var vocab =
      global.RNFQuestionGen && RNFQuestionGen.VOCAB
        ? RNFQuestionGen.VOCAB[course] || []
        : [];
    var tries = 0;
    while (kept.length < MIN_CHOICE_OPTIONS && tries < vocab.length * 3) {
      tries += 1;
      var it = vocab[Math.floor(Math.random() * vocab.length)];
      if (!it || !it.emoji || seen[it.emoji]) continue;
      if (correctOpt && it.icon === correctOpt.cardArt) continue;
      tryPush({
        emoji: it.emoji,
        cardArt: it.icon,
        label:
          course === "zh"
            ? { hant: it.meaning.hant, hans: it.meaning.hans, en: it.meaning.en }
            : { hant: it.foreign, hans: it.foreign, en: it.foreign },
      });
    }
    copy.options = kept;
    return copy;
  }

  function expandQuestionChoices(q, course) {
    if (!q) return q;
    if (q.type === "emoji_pick") {
      q = dedupeEmojiPickQuestion(q, course);
    }
    if (!global.RNFQuestionGen || !RNFQuestionGen.VOCAB) return q;
    var vocab = RNFQuestionGen.VOCAB[course] || [];
    if (!vocab.length) return q;

    if (q.words && q.variant === "translate_chip" && q.words.length < MIN_CHOICE_OPTIONS) {
      var copyW = JSON.parse(JSON.stringify(q));
      var usedIds = {};
      copyW.words.forEach(function (w) {
        usedIds[w.id] = true;
      });
      var poolW = shuffle(vocab.slice());
      for (var w = 0; w < poolW.length && copyW.words.length < MIN_CHOICE_OPTIONS; w++) {
        var itw = poolW[w];
        var wid = "extra_" + itw.icon + "_" + w;
        if (usedIds[wid] || usedIds["w" + itw.icon]) continue;
        usedIds[wid] = true;
        copyW.words.push({
          id: wid,
          text:
            course === "zh"
              ? itw.meaning
              : {
                  hant: itw.foreign,
                  hans: itw.foreign,
                  en: itw.foreign,
                },
          distractor: true,
        });
      }
      return copyW;
    }

    if (!q.options || q.options.length >= MIN_CHOICE_OPTIONS) {
      if (q.type === "emoji_pick") return dedupeEmojiPickQuestion(q, course);
      return q;
    }

    /* 靜態選擇題勿用詞表亂塞無關選項 */
    if (q.type === "text_choice" && q.id && q.id.indexOf("gen_") !== 0) {
      return q;
    }

    var copy = JSON.parse(JSON.stringify(q));
    var used = {};
    var usedEmoji = {};
    copy.options.forEach(function (opt) {
      if (opt.label) {
        used[tField(opt.label)] = true;
      }
      if (copy.type === "emoji_pick" && opt.emoji) {
        usedEmoji[opt.emoji] = true;
      }
    });

    var pool = shuffle(vocab.slice());
    for (var i = 0; i < pool.length && copy.options.length < MIN_CHOICE_OPTIONS; i++) {
      var it = pool[i];
      var key =
        course === "zh"
          ? tField(it.meaning) || it.foreign
          : it.foreign || tField(it.meaning);
      if (used[key]) continue;
      if (copy.type === "emoji_pick") {
        if (!it.emoji || usedEmoji[it.emoji]) continue;
        usedEmoji[it.emoji] = true;
      }
      used[key] = true;
      if (copy.type === "emoji_pick") {
        copy.options.push({
          emoji: it.emoji,
          cardArt: it.icon,
          label:
            course === "zh"
              ? { hant: it.meaning.hant, hans: it.meaning.hans, en: it.meaning.en }
              : { hant: it.foreign, hans: it.foreign, en: it.foreign },
        });
      } else if (copy.type === "translate_choice") {
        if (course === "zh") {
          copy.options.push({ label: it.meaning });
        } else {
          copy.options.push({
            label: { hant: it.foreign, hans: it.foreign, en: it.foreign },
          });
        }
      } else if (copy.type === "text_choice" && course === "zh") {
        copy.options.push({ label: it.meaning });
      } else if (copy.type === "fill_pick") {
        copy.options.push({
          label: { hant: it.foreign, hans: it.foreign, en: it.foreign },
        });
      } else {
        copy.options.push({
          label: { hant: it.foreign, hans: it.foreign, en: it.foreign },
        });
      }
    }
    if (copy.type === "emoji_pick") {
      return dedupeEmojiPickQuestion(copy, course);
    }
    return copy;
  }

  function getLearnTarget() {
    try {
      return sessionStorage.getItem("learn_target") || "en";
    } catch (e) {
      return "en";
    }
  }

  function validateQuestionIntegrity(q) {
    var issues = [];
    if (!q || !q.id) return ["missing_id"];
    if (
      q.type === "text_choice" ||
      q.type === "translate_choice" ||
      q.type === "emoji_pick" ||
      q.type === "fill_pick" ||
      q.type === "listen_pick"
    ) {
      var n = 0;
      (q.options || []).forEach(function (o) {
        if (o.correct) n += 1;
      });
      if (n !== 1) issues.push("correct_count:" + n);
      if (q.type === "emoji_pick") {
        var seenEmoji = {};
        (q.options || []).forEach(function (o) {
          var em = o.emoji || "";
          if (!em) return;
          if (seenEmoji[em]) issues.push("dup_emoji:" + em);
          seenEmoji[em] = true;
        });
      }
      var seenOpt = {};
      (q.options || []).forEach(function (o) {
        if (!o.label) return;
        var key = tField(o.label).toLowerCase();
        if (!key) return;
        if (seenOpt[key]) issues.push("dup_option:" + key);
        seenOpt[key] = true;
      });
    }
    if (q.type === "match_pairs" && q.pairs) {
      var course =
        (q.courses && q.courses[0]) ||
        (q.course) ||
        getLearnTarget();
      var seenL = {};
      var seenR = {};
      q.pairs.forEach(function (p) {
        var lk = matchSideDisplayText(p, course, "left").toLowerCase();
        var rk = matchSideDisplayText(p, course, "right").toLowerCase();
        if (lk && seenL[lk]) issues.push("dup_match_left:" + lk);
        if (rk && seenR[rk]) issues.push("dup_match_right:" + rk);
        if (lk) seenL[lk] = true;
        if (rk) seenR[rk] = true;
      });
      if (q.pairs.length < 3) issues.push("match_too_few");
    }
    if (q.type === "true_false" && q.correct !== true && q.correct !== false) {
      issues.push("true_false");
    }
    if (q.type === "word_bank") {
      if (!q.words || !q.words.length) issues.push("no_words");
      if (!q.answer || !q.answer.length) issues.push("no_answer");
      var ids = {};
      (q.words || []).forEach(function (w) {
        if (w.id) ids[w.id] = true;
      });
      (q.answer || []).forEach(function (aid) {
        if (!ids[aid]) issues.push("bad_answer:" + aid);
      });
    }
    if (q.type === "text_choice" || q.type === "translate_choice") {
      var correct = "";
      (q.options || []).forEach(function (o) {
        if (o.correct) {
          correct = (o.label && (o.label.en || o.label.hans || o.label.hant)) || "";
        }
      });
      correct = correct.replace(/^🔊\s*/, "").trim().toLowerCase();
      if (correct && q.promptLine) {
        var pl = (q.promptLine.en || q.promptLine.hans || q.promptLine.hant || "")
          .replace(/^🔊\s*/, "")
          .trim()
          .toLowerCase();
        if (pl && pl === correct) issues.push("spoiler_line");
      }
    }
    return issues;
  }

  function getFullBank() {
    if (!_fullBankCache || _fullBankCache._v !== _fullBankCacheVersion) {
      _fullBankCache = QUESTION_BANK.slice();
      if (global.RNFQuestionGen && RNFQuestionGen.generateAll) {
        _fullBankCache = _fullBankCache.concat(RNFQuestionGen.generateAll());
      }
      if (global.RNFLiteracyBank && RNFLiteracyBank.BANK) {
        _fullBankCache = _fullBankCache.concat(RNFLiteracyBank.BANK);
      }
      if (global.RNFEnLiteracyBank && RNFEnLiteracyBank.BANK) {
        _fullBankCache = _fullBankCache.concat(RNFEnLiteracyBank.BANK);
      }
      _fullBankCache = _fullBankCache.filter(function (q) {
        return validateQuestionIntegrity(q).length === 0;
      });
      _fullBankCache._v = _fullBankCacheVersion;
      if (global.console && global.RNF_DEBUG_QUESTIONS) {
        var bad = QUESTION_BANK.filter(function (q) {
          return validateQuestionIntegrity(q).length > 0;
        });
        if (bad.length) console.warn("[RNF] static bank issues", bad);
      }
    }
    return _fullBankCache;
  }

  /** 中文課：題幹與答案同一個詞（舊版生成器錯誤） */
  function isCircularZhTextChoice(q) {
    if (!q || q.type !== "text_choice" || getLearnTarget() !== "zh") return false;
    var prompt = tField(q.prompt);
    var line = tField(q.promptLine);
    if (!prompt || prompt.indexOf("用中文") < 0) return false;
    if (line && prompt.indexOf("「" + line + "」") >= 0) return true;
    var correct = "";
    if (q.options) {
      for (var i = 0; i < q.options.length; i++) {
        if (q.options[i].correct) {
          correct = tField(q.options[i].label);
          break;
        }
      }
    }
    return correct && prompt.indexOf("「" + correct + "」") >= 0;
  }

  /** 學外語時泡泡應顯示中文釋義，不用英文欄（常與選項答案相同） */
  function cueTextForLearnForeign(pl) {
    if (!pl) return "";
    return pl.hans || pl.hant || "";
  }

  function getQuestionCorrectText(q) {
    if (!q) return "";
    if (q.options) {
      for (var i = 0; i < q.options.length; i++) {
        if (q.options[i].correct) return tField(q.options[i].label);
      }
    }
    if (q.type === "word_bank" && q.variant === "translate_chip" && q.words) {
      for (var j = 0; j < q.words.length; j++) {
        if (q.words[j].correct) return tField(q.words[j].text);
      }
    }
    return "";
  }

  /** 學外語：泡泡已顯示與選項相同的目標語（洩題） */
  function isSpoilerLearnForeignQuestion(q) {
    if (!q) return false;
    var course = getLearnTarget();
    if (course === "zh") {
      return q.type === "text_choice" && isCircularZhTextChoice(q);
    }
    var isChip = q.type === "word_bank" && q.variant === "translate_chip";
    if (
      q.type !== "text_choice" &&
      q.type !== "translate_choice" &&
      !isChip
    ) {
      return false;
    }
    var correct = getQuestionCorrectText(q);
    if (!correct) return false;
    var line = q.promptLine ? cueTextForLearnForeign(q.promptLine) : "";
    if (line && line.toLowerCase() === correct.toLowerCase()) return true;
    if (
      q.promptLine &&
      q.promptLine.en &&
      q.promptLine.en.toLowerCase() === correct.toLowerCase()
    ) {
      return true;
    }
    if (q.speakLine) {
      var sp = cueTextForLearnForeign(q.speakLine);
      if (!sp && q.speakLine.en) sp = q.speakLine.en;
      if (sp && sp.toLowerCase() === correct.toLowerCase()) return true;
    }
    return false;
  }

  function isSpoilerTextChoice(q) {
    return isSpoilerLearnForeignQuestion(q);
  }

  /** 「用中文排列」等僅適用中文課的 word_bank */
  function isZhDirectedWordBank(q) {
    if (!q || q.type !== "word_bank") return false;
    if (q.variant === "translate_chip") return false;
    var h = q.prompt && q.prompt.hans;
    var t = q.prompt && q.prompt.hant;
    var e = q.prompt && q.prompt.en;
    if ((h && h.indexOf("用中文") >= 0) || (t && t.indexOf("用中文") >= 0)) {
      return true;
    }
    if (e && /in Chinese/i.test(e)) return true;
    if (e && /Chinese/i.test(e) && /form|arrange|write/i.test(e)) return true;
    return false;
  }

  /** 學英語卻出現「用中文寫」、學日語卻出現中文排列題等 */
  function isMisdirectedWordBank(q, course) {
    course = course || getLearnTarget();
    if (!q || q.type !== "word_bank") return false;
    if (isCantoneseQuestion(q)) return true;
    if (course !== "zh" && isZhDirectedWordBank(q)) return true;
    if (course === "en" && isZhDirectedWordBank(q)) return true;
    return false;
  }

  function isMisdirectedEnWordBank(q) {
    return isMisdirectedWordBank(q, "en");
  }

  function isMisdirectedEnChipQuestion(q) {
    return (
      isMisdirectedWordBank(q, "en") &&
      q.variant === "translate_chip"
    );
  }

  function questionMatchesCourse(q, course) {
    if (!q.courses || !q.courses.length) return true;
    return q.courses.indexOf(course) >= 0;
  }

  function getSkillLevel() {
    try {
      var course = getLearnTarget();
      var raw = localStorage.getItem("rnf_onboard_" + course + "_level");
      if (raw === null || raw === "") return 0;
      return parseInt(raw, 10);
    } catch (e) {
      return 0;
    }
  }

  function isBeginnerQuestion(q) {
    if (!q) return false;
    if (q.level === "intermediate" || q.level === "advanced") return false;
    if (q.level === "beginner") return true;
    if (q.type === "emoji_pick") {
      return !!(q.courses && q.courses.length);
    }
    if (q.type === "translate_choice" && q.courses && q.courses.length) return true;
    if (q.type === "word_bank" && q.variant === "translate_chip") return true;
    if (q.type === "listen_pick" && q.courses && q.courses.length) return true;
    if (q.type === "match_pairs" && (q.level === "beginner" || q.setId === "beginner_vocab")) {
      return true;
    }
    if (q.type === "text_choice" && q.courses && q.courses.length) return true;
    if (q.type === "fill_pick" && q.courses && q.courses.length) return false;
    if (q.type === "word_bank" && q.courses && q.courses.indexOf("zh") >= 0) {
      return q.variant !== "write_sentence";
    }
    return false;
  }

  function useBeginnerPool() {
    var lvl = getSkillLevel();
    return isNaN(lvl) || lvl === 0;
  }

  /** 提高進階題在池中的出現率 */
  function boostZhHardPool(pool, course) {
    if (course !== "zh") return pool;
    var hard = [];
    var rest = [];
    pool.forEach(function (q) {
      if (q.level === "intermediate" || q.level === "advanced") {
        hard.push(q);
        hard.push(q);
        hard.push(q);
      } else {
        rest.push(q);
      }
    });
    if (!hard.length) return pool;
    return shuffle(hard).concat(shuffle(rest));
  }

  function questionTypeKey(q) {
    if (!q) return "other";
    if (q.type === "word_bank") return "word_bank:" + (q.variant || "default");
    return q.type;
  }

  /** 同一詞彙只出現一次（靜態題 + 生成題共用） */
  function questionVocabKey(q) {
    if (!q) return "";
    if (q.vocabKey) return q.vocabKey;
    var course = getLearnTarget();
    var prompt = q.prompt ? tField(q.prompt) : "";
    var m = prompt.match(/[「『]([^」』]+)[」』]/);
    if (m && m[1]) return course + ":" + m[1];
    if (q.type === "translate_choice" && q.promptLine) {
      var line = tField(q.promptLine).replace(/\s*\([^)]*\)\s*$/, "").trim();
      if (line) return course + ":" + line;
    }
    if (q.type === "word_bank" && q.variant === "translate_chip" && q.words && q.answer) {
      for (var i = 0; i < q.words.length; i++) {
        if (q.words[i].id === q.answer[0]) {
          var wk = tField(q.words[i].text);
          if (wk) return course + ":" + wk;
        }
      }
    }
    if (q.speakLine) {
      var sp = tField(q.speakLine);
      if (sp) return course + ":" + sp;
    }
    return "";
  }

  function pickFromPool(pool, used, usedVocab, preferType, allowVocabRepeat) {
    for (var i = 0; i < pool.length; i++) {
      var q = pool[i];
      if (used[q.id]) continue;
      var vk = questionVocabKey(q);
      if (!allowVocabRepeat && vk && usedVocab[vk]) continue;
      if (preferType && questionTypeKey(q) !== preferType) continue;
      used[q.id] = true;
      if (vk) usedVocab[vk] = true;
      return q;
    }
    for (var j = 0; j < pool.length; j++) {
      var q2 = pool[j];
      if (used[q2.id]) continue;
      var vk2 = questionVocabKey(q2);
      if (!allowVocabRepeat && vk2 && usedVocab[vk2]) continue;
      used[q2.id] = true;
      if (vk2) usedVocab[vk2] = true;
      return q2;
    }
    return null;
  }

  function buildSession(size, filterIds, opts) {
    opts = opts || {};
    var out = [];
    var bank = getFullBank();

    if (filterIds && filterIds.length) {
      var reviewCourse = getLearnTarget();
      var usedReview = {};
      var usedVocabReview = {};
      filterIds.forEach(function (ref) {
        var q = resolveQuestionRef(ref);
        if (q && !isCantoneseQuestion(q)) {
          out.push(q);
          usedReview[q.id] = true;
          var rvk = questionVocabKey(q);
          if (rvk) usedVocabReview[rvk] = true;
        }
      });
      var reviewPool = bank.filter(function (q) {
        if (reviewCourse === "zh" && isCantoneseQuestion(q)) return false;
        if (reviewCourse === "zh" && isCircularZhTextChoice(q)) return false;
        if (isSpoilerTextChoice(q)) return false;
        if (isMisdirectedWordBank(q, reviewCourse)) return false;
        return questionMatchesCourse(q, reviewCourse);
      });
      while (out.length < size) {
        var extraR = pickFromPool(reviewPool, usedReview, usedVocabReview, null, false);
        if (!extraR) {
          extraR = pickFromPool(reviewPool, usedReview, usedVocabReview, null, true);
        }
        if (!extraR) break;
        out.push(extraR);
      }
      return shuffle(out).slice(0, size);
    }

    var course = getLearnTarget();
    var beginner =
      opts.mode !== "jump" && (opts.beginner === true || useBeginnerPool());

    var pool = bank.filter(function (q) {
      if (!questionMatchesCourse(q, course)) return false;
      if (course !== "zh" && isLegacyDimSumStatic(q)) return false;
      if (isCantoneseQuestion(q)) return false;
      if (course === "zh" && isCircularZhTextChoice(q)) return false;
      if (isSpoilerTextChoice(q)) return false;
      if (isMisdirectedWordBank(q, course)) return false;
      return true;
    });
    if (beginner) {
      pool = pool.filter(isBeginnerQuestion);
    }
    pool = boostZhGeneratedPool(pool, course);
    pool = boostZhHardPool(pool, course);
    pool = shuffle(
      pool.map(function (q) {
        return expandQuestionChoices(q, course);
      })
    );
    if (pool.length < size) {
      var fallback = bank.filter(function (q) {
        if (!questionMatchesCourse(q, course)) return false;
        if (course !== "zh" && isLegacyDimSumStatic(q)) return false;
        if (isCantoneseQuestion(q)) return false;
        if (course === "zh" && isCircularZhTextChoice(q)) return false;
        if (isSpoilerTextChoice(q)) return false;
        if (isMisdirectedWordBank(q, course)) return false;
        return true;
      });
      if (beginner) {
        fallback = fallback.filter(isBeginnerQuestion);
      }
      pool = pool.concat(
        shuffle(
          fallback.map(function (q) {
            return expandQuestionChoices(q, course);
          })
        )
      );
    }

    var used = {};
    var usedVocab = {};

    if (beginner && course === "zh" && pool.length >= size * 4) {
      while (out.length < size) {
        var zhPick = pickFromPool(pool, used, usedVocab, null, false);
        if (!zhPick) zhPick = pickFromPool(pool, used, usedVocab, null, true);
        if (!zhPick) break;
        out.push(zhPick);
      }
      return shuffle(out).slice(0, size);
    }

    var typeOrder = beginner
      ? [
          "emoji_pick",
          "listen_pick",
          "word_bank:translate_chip",
          "translate_choice",
          "word_bank:write_sentence",
          "text_choice",
        ]
      : [
          "emoji_pick",
          "translate_choice",
          "word_bank:translate_chip",
          "word_bank:write_sentence",
          "word_bank:default",
          "text_choice",
          "fill_pick",
          "true_false",
        ];

    typeOrder.forEach(function (tk) {
      if (out.length >= size) return;
      var q = pickFromPool(pool, used, usedVocab, tk, false);
      if (q) out.push(q);
    });

    while (out.length < size) {
      var extra = pickFromPool(pool, used, usedVocab, null, false);
      if (!extra) {
        extra = pickFromPool(pool, used, usedVocab, null, true);
      }
      if (!extra) break;
      out.push(extra);
    }

    out = shuffle(out);

    var matchSlots = beginner ? 1 : Math.max(1, Math.floor(size / 5));
    for (var m = 0; m < matchSlots; m++) {
      var insertAt = Math.floor(Math.random() * (out.length + 1));
      var matchQ = pickMatchQuestion(course, beginner);
      if (matchQ) out.splice(insertAt, 0, matchQ);
    }

    return out.slice(0, size);
  }

  function mistakeKey(q) {
    if (q && q.type === "match_pairs" && q.setId) return "matchSet:" + q.setId;
    return q ? q.id : "";
  }

  global.RNFQuestions = {
    BANK: QUESTION_BANK,
    getFullBank: getFullBank,
    MATCH_POOL: MATCH_POOL,
    buildSession: buildSession,
    getById: getById,
    resolveQuestionRef: resolveQuestionRef,
    createMatchQuestion: createMatchQuestion,
    randomMatchQuestion: randomMatchQuestion,
    isCantoneseQuestion: isCantoneseQuestion,
    mistakeKey: mistakeKey,
    tField: tField,
    tTargetField: tTargetField,
    tUiField: tUiField,
    isMisdirectedWordBank: isMisdirectedWordBank,
    isZhDirectedWordBank: isZhDirectedWordBank,
    tMatchLabel: tMatchLabel,
    matchSideDisplayText: matchSideDisplayText,
    cueTextForLearnForeign: cueTextForLearnForeign,
    isSpoilerLearnForeignQuestion: isSpoilerLearnForeignQuestion,
    validateQuestionIntegrity: validateQuestionIntegrity,
    dedupeEmojiPickQuestion: dedupeEmojiPickQuestion,
    questionMatchesCourse: questionMatchesCourse,
    shuffle: shuffle,
  };
})(window);
