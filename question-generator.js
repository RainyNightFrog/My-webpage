/**
 * 程序化題庫：依學習語言大量生成不重複練習題
 */
(function (global) {
  var seq = 0;

  function nextId(prefix) {
    seq += 1;
    return "gen_" + prefix + "_" + seq;
  }

  function L(hant, hans, en) {
    return { hant: hant, hans: hans || hant, en: en || hant };
  }

  /** @type {Record<string, Array>} */
  var VOCAB = {
    ko: [
      { foreign: "안녕하세요", meaning: L("你好", "你好", "hello"), emoji: "👋", icon: "wave" },
      { foreign: "감사합니다", meaning: L("謝謝", "谢谢", "thank you"), emoji: "🙏", icon: "thanks" },
      { foreign: "차", meaning: L("茶", "茶", "tea"), emoji: "🍵", icon: "tea" },
      { foreign: "커피", meaning: L("咖啡", "咖啡", "coffee"), emoji: "☕", icon: "coffee" },
      { foreign: "빵", meaning: L("麵包", "面包", "bread"), emoji: "🍞", icon: "bread" },
      { foreign: "물", meaning: L("水", "水", "water"), emoji: "💧", icon: "water" },
      { foreign: "학교", meaning: L("學校", "学校", "school"), emoji: "🏫", icon: "school" },
      { foreign: "친구", meaning: L("朋友", "朋友", "friend"), emoji: "👫", icon: "friend" },
      { foreign: "사과", meaning: L("蘋果", "苹果", "apple"), emoji: "🍎", icon: "apple" },
      { foreign: "고양이", meaning: L("貓", "猫", "cat"), emoji: "🐱", icon: "cat" },
      { foreign: "개", meaning: L("狗", "狗", "dog"), emoji: "🐶", icon: "dog" },
      { foreign: "책", meaning: L("書", "书", "book"), emoji: "📚", icon: "book" },
      { foreign: "오늘", meaning: L("今天", "今天", "today"), emoji: "📅", icon: "today" },
      { foreign: "내일", meaning: L("明天", "明天", "tomorrow"), emoji: "🌅", icon: "tomorrow" },
      { foreign: "비", meaning: L("雨", "雨", "rain"), emoji: "🌧️", icon: "rain" },
      { foreign: "맛있어요", meaning: L("好吃", "好吃", "delicious"), emoji: "😋", icon: "yummy" },
      { foreign: "얼마예요?", meaning: L("多少錢？", "多少钱？", "how much?"), emoji: "💰", icon: "price" },
      { foreign: "화장실", meaning: L("洗手間", "洗手间", "restroom"), emoji: "🚻", icon: "restroom" },
      { foreign: "지하철", meaning: L("地鐵", "地铁", "subway"), emoji: "🚇", icon: "metro" },
      { foreign: "한국", meaning: L("韓國", "韩国", "Korea"), emoji: "🇰🇷", icon: "korea" },
      { foreign: "영어", meaning: L("英語", "英语", "English"), emoji: "🇺🇸", icon: "english" },
      { foreign: "네", meaning: L("是／對", "是/对", "yes"), emoji: "✅", icon: "yes" },
      { foreign: "아니요", meaning: L("不是", "不是", "no"), emoji: "❌", icon: "no" },
      { foreign: "이름", meaning: L("名字", "名字", "name"), emoji: "🪪", icon: "name" },
      { foreign: "가족", meaning: L("家人", "家人", "family"), emoji: "👨‍👩‍👧", icon: "family" },
      { foreign: "사랑해요", meaning: L("我愛你", "我爱你", "I love you"), emoji: "❤️", icon: "love" },
      { foreign: "배고파요", meaning: L("我餓了", "我饿了", "I'm hungry"), emoji: "🍽️", icon: "hungry" },
      { foreign: "피곤해요", meaning: L("我累了", "我累了", "I'm tired"), emoji: "😴", icon: "tired" },
    ],
    ja: [
      { foreign: "こんにちは", meaning: L("你好", "你好", "hello"), emoji: "👋", icon: "hello" },
      { foreign: "ありがとう", meaning: L("謝謝", "谢谢", "thanks"), emoji: "🙏", icon: "thanks" },
      { foreign: "お茶", meaning: L("茶", "茶", "tea"), emoji: "🍵", icon: "tea" },
      { foreign: "コーヒー", meaning: L("咖啡", "咖啡", "coffee"), emoji: "☕", icon: "coffee" },
      { foreign: "パン", meaning: L("麵包", "面包", "bread"), emoji: "🍞", icon: "bread" },
      { foreign: "水", meaning: L("水", "水", "water"), emoji: "💧", icon: "water" },
      { foreign: "学校", meaning: L("學校", "学校", "school"), emoji: "🏫", icon: "school" },
      { foreign: "友達", meaning: L("朋友", "朋友", "friend"), emoji: "👫", icon: "friend" },
      { foreign: "りんご", meaning: L("蘋果", "苹果", "apple"), emoji: "🍎", icon: "apple" },
      { foreign: "猫", meaning: L("貓", "猫", "cat"), emoji: "🐱", icon: "cat" },
      { foreign: "犬", meaning: L("狗", "狗", "dog"), emoji: "🐶", icon: "dog" },
      { foreign: "本", meaning: L("書", "书", "book"), emoji: "📚", icon: "book" },
      { foreign: "今日", meaning: L("今天", "今天", "today"), emoji: "📅", icon: "today" },
      { foreign: "明日", meaning: L("明天", "明天", "tomorrow"), emoji: "🌅", icon: "tomorrow" },
      { foreign: "雨", meaning: L("雨", "雨", "rain"), emoji: "🌧️", icon: "rain" },
      { foreign: "おいしい", meaning: L("好吃", "好吃", "delicious"), emoji: "😋", icon: "yummy" },
      { foreign: "いくらですか", meaning: L("多少錢？", "多少钱？", "how much?"), emoji: "💰", icon: "price" },
      { foreign: "トイレ", meaning: L("洗手間", "洗手间", "restroom"), emoji: "🚻", icon: "restroom" },
      { foreign: "電車", meaning: L("電車", "电车", "train"), emoji: "🚃", icon: "train" },
      { foreign: "日本", meaning: L("日本", "日本", "Japan"), emoji: "🇯🇵", icon: "japan" },
      { foreign: "はい", meaning: L("是", "是", "yes"), emoji: "✅", icon: "yes" },
      { foreign: "いいえ", meaning: L("不是", "不是", "no"), emoji: "❌", icon: "no" },
      { foreign: "名前", meaning: L("名字", "名字", "name"), emoji: "🪪", icon: "name" },
      { foreign: "家族", meaning: L("家人", "家人", "family"), emoji: "👨‍👩‍👧", icon: "family" },
      { foreign: "愛してる", meaning: L("我愛你", "我爱你", "I love you"), emoji: "❤️", icon: "love" },
      { foreign: "お腹すいた", meaning: L("我餓了", "我饿了", "hungry"), emoji: "🍽️", icon: "hungry" },
      { foreign: "疲れた", meaning: L("我累了", "我累了", "tired"), emoji: "😴", icon: "tired" },
      { foreign: "さようなら", meaning: L("再見", "再见", "goodbye"), emoji: "🫡", icon: "bye" },
    ],
    en: [
      { foreign: "hello", meaning: L("你好", "你好", "hello"), emoji: "👋", icon: "hello" },
      { foreign: "welcome", meaning: L("歡迎", "欢迎", "welcome"), emoji: "🤗", icon: "welcome" },
      { foreign: "thank you", meaning: L("謝謝", "谢谢", "thanks"), emoji: "🙏", icon: "thanks" },
      { foreign: "tea", meaning: L("茶", "茶", "tea"), emoji: "🍵", icon: "tea" },
      { foreign: "coffee", meaning: L("咖啡", "咖啡", "coffee"), emoji: "☕", icon: "coffee" },
      { foreign: "bread", meaning: L("麵包", "面包", "bread"), emoji: "🍞", icon: "bread" },
      { foreign: "water", meaning: L("水", "水", "water"), emoji: "💧", icon: "water" },
      { foreign: "school", meaning: L("學校", "学校", "school"), emoji: "🏫", icon: "school" },
      { foreign: "friend", meaning: L("朋友", "朋友", "friend"), emoji: "👫", icon: "friend" },
      { foreign: "apple", meaning: L("蘋果", "苹果", "apple"), emoji: "🍎", icon: "apple" },
      { foreign: "cat", meaning: L("貓", "猫", "cat"), emoji: "🐱", icon: "cat" },
      { foreign: "dog", meaning: L("狗", "狗", "dog"), emoji: "🐶", icon: "dog" },
      { foreign: "book", meaning: L("書", "书", "book"), emoji: "📚", icon: "book" },
      { foreign: "today", meaning: L("今天", "今天", "today"), emoji: "📅", icon: "today" },
      { foreign: "tomorrow", meaning: L("明天", "明天", "tomorrow"), emoji: "🌅", icon: "tomorrow" },
      { foreign: "rain", meaning: L("雨", "雨", "rain"), emoji: "🌧️", icon: "rain" },
      { foreign: "delicious", meaning: L("好吃", "好吃", "delicious"), emoji: "😋", icon: "yummy" },
      { foreign: "how much", meaning: L("多少錢", "多少钱", "how much"), emoji: "💰", icon: "price" },
      { foreign: "restroom", meaning: L("洗手間", "洗手间", "restroom"), emoji: "🚻", icon: "restroom" },
      { foreign: "subway", meaning: L("地鐵", "地铁", "subway"), emoji: "🚇", icon: "metro" },
      { foreign: "goodbye", meaning: L("再見", "再见", "goodbye"), emoji: "🫡", icon: "bye" },
      { foreign: "yes", meaning: L("是", "是", "yes"), emoji: "✅", icon: "yes" },
      { foreign: "no", meaning: L("不是", "不是", "no"), emoji: "❌", icon: "no" },
      { foreign: "family", meaning: L("家人", "家人", "family"), emoji: "👨‍👩‍👧", icon: "family" },
      { foreign: "frog", meaning: L("青蛙", "青蛙", "frog"), emoji: "🐸", icon: "frog" },
      { foreign: "night", meaning: L("夜晚", "夜晚", "night"), emoji: "🌙", icon: "night" },
      { foreign: "library", meaning: L("圖書館", "图书馆", "library"), emoji: "🏛️", icon: "library" },
      { foreign: "hospital", meaning: L("醫院", "医院", "hospital"), emoji: "🏥", icon: "hospital" },
    ],
    es: [
      { foreign: "hola", meaning: L("你好", "你好", "hello"), emoji: "👋", icon: "hello" },
      { foreign: "gracias", meaning: L("謝謝", "谢谢", "thanks"), emoji: "🙏", icon: "thanks" },
      { foreign: "té", meaning: L("茶", "茶", "tea"), emoji: "🍵", icon: "tea" },
      { foreign: "café", meaning: L("咖啡", "咖啡", "coffee"), emoji: "☕", icon: "coffee" },
      { foreign: "pan", meaning: L("麵包", "面包", "bread"), emoji: "🍞", icon: "bread" },
      { foreign: "agua", meaning: L("水", "水", "water"), emoji: "💧", icon: "water" },
      { foreign: "escuela", meaning: L("學校", "学校", "school"), emoji: "🏫", icon: "school" },
      { foreign: "amigo", meaning: L("朋友", "朋友", "friend"), emoji: "👫", icon: "friend" },
      { foreign: "manzana", meaning: L("蘋果", "苹果", "apple"), emoji: "🍎", icon: "apple" },
      { foreign: "gato", meaning: L("貓", "猫", "cat"), emoji: "🐱", icon: "cat" },
      { foreign: "perro", meaning: L("狗", "狗", "dog"), emoji: "🐶", icon: "dog" },
      { foreign: "libro", meaning: L("書", "书", "book"), emoji: "📚", icon: "book" },
      { foreign: "hoy", meaning: L("今天", "今天", "today"), emoji: "📅", icon: "today" },
      { foreign: "mañana", meaning: L("明天", "明天", "tomorrow"), emoji: "🌅", icon: "tomorrow" },
      { foreign: "lluvia", meaning: L("雨", "雨", "rain"), emoji: "🌧️", icon: "rain" },
      { foreign: "delicioso", meaning: L("好吃", "好吃", "delicious"), emoji: "😋", icon: "yummy" },
      { foreign: "¿cuánto cuesta?", meaning: L("多少錢？", "多少钱？", "how much?"), emoji: "💰", icon: "price" },
      { foreign: "baño", meaning: L("洗手間", "洗手间", "restroom"), emoji: "🚻", icon: "restroom" },
      { foreign: "adiós", meaning: L("再見", "再见", "goodbye"), emoji: "🫡", icon: "bye" },
      { foreign: "sí", meaning: L("是", "是", "yes"), emoji: "✅", icon: "yes" },
      { foreign: "no", meaning: L("不是", "不是", "no"), emoji: "❌", icon: "no" },
      { foreign: "familia", meaning: L("家人", "家人", "family"), emoji: "👨‍👩‍👧", icon: "family" },
      { foreign: "casa", meaning: L("房子", "房子", "house"), emoji: "🏠", icon: "house" },
      { foreign: "noche", meaning: L("夜晚", "夜晚", "night"), emoji: "🌙", icon: "night" },
    ],
    fr: [
      { foreign: "bonjour", meaning: L("你好", "你好", "hello"), emoji: "👋", icon: "hello" },
      { foreign: "merci", meaning: L("謝謝", "谢谢", "thanks"), emoji: "🙏", icon: "thanks" },
      { foreign: "thé", meaning: L("茶", "茶", "tea"), emoji: "🍵", icon: "tea" },
      { foreign: "café", meaning: L("咖啡", "咖啡", "coffee"), emoji: "☕", icon: "coffee" },
      { foreign: "pain", meaning: L("麵包", "面包", "bread"), emoji: "🍞", icon: "bread" },
      { foreign: "eau", meaning: L("水", "水", "water"), emoji: "💧", icon: "water" },
      { foreign: "école", meaning: L("學校", "学校", "school"), emoji: "🏫", icon: "school" },
      { foreign: "ami", meaning: L("朋友", "朋友", "friend"), emoji: "👫", icon: "friend" },
      { foreign: "chat", meaning: L("貓", "猫", "cat"), emoji: "🐱", icon: "cat" },
      { foreign: "chien", meaning: L("狗", "狗", "dog"), emoji: "🐶", icon: "dog" },
      { foreign: "livre", meaning: L("書", "书", "book"), emoji: "📚", icon: "book" },
      { foreign: "au revoir", meaning: L("再見", "再见", "goodbye"), emoji: "🫡", icon: "bye" },
      { foreign: "oui", meaning: L("是", "是", "yes"), emoji: "✅", icon: "yes" },
      { foreign: "non", meaning: L("不是", "不是", "no"), emoji: "❌", icon: "no" },
      { foreign: "famille", meaning: L("家人", "家人", "family"), emoji: "👨‍👩‍👧", icon: "family" },
      { foreign: "maison", meaning: L("房子", "房子", "house"), emoji: "🏠", icon: "house" },
      { foreign: "pluie", meaning: L("雨", "雨", "rain"), emoji: "🌧️", icon: "rain" },
    ],
    de: [
      { foreign: "Hallo", meaning: L("你好", "你好", "hello"), emoji: "👋", icon: "hello" },
      { foreign: "Danke", meaning: L("謝謝", "谢谢", "thanks"), emoji: "🙏", icon: "thanks" },
      { foreign: "Tee", meaning: L("茶", "茶", "tea"), emoji: "🍵", icon: "tea" },
      { foreign: "Kaffee", meaning: L("咖啡", "咖啡", "coffee"), emoji: "☕", icon: "coffee" },
      { foreign: "Brot", meaning: L("麵包", "面包", "bread"), emoji: "🍞", icon: "bread" },
      { foreign: "Wasser", meaning: L("水", "水", "water"), emoji: "💧", icon: "water" },
      { foreign: "Schule", meaning: L("學校", "学校", "school"), emoji: "🏫", icon: "school" },
      { foreign: "Freund", meaning: L("朋友", "朋友", "friend"), emoji: "👫", icon: "friend" },
      { foreign: "Katze", meaning: L("貓", "猫", "cat"), emoji: "🐱", icon: "cat" },
      { foreign: "Hund", meaning: L("狗", "狗", "dog"), emoji: "🐶", icon: "dog" },
      { foreign: "Buch", meaning: L("書", "书", "book"), emoji: "📚", icon: "book" },
      { foreign: "Tschüss", meaning: L("再見", "再见", "bye"), emoji: "🫡", icon: "bye" },
      { foreign: "Ja", meaning: L("是", "是", "yes"), emoji: "✅", icon: "yes" },
      { foreign: "Nein", meaning: L("不是", "不是", "no"), emoji: "❌", icon: "no" },
      { foreign: "Familie", meaning: L("家人", "家人", "family"), emoji: "👨‍👩‍👧", icon: "family" },
      { foreign: "Regen", meaning: L("雨", "雨", "rain"), emoji: "🌧️", icon: "rain" },
    ],
    it: [
      { foreign: "ciao", meaning: L("你好", "你好", "hello"), emoji: "👋", icon: "hello" },
      { foreign: "grazie", meaning: L("謝謝", "谢谢", "thanks"), emoji: "🙏", icon: "thanks" },
      { foreign: "tè", meaning: L("茶", "茶", "tea"), emoji: "🍵", icon: "tea" },
      { foreign: "caffè", meaning: L("咖啡", "咖啡", "coffee"), emoji: "☕", icon: "coffee" },
      { foreign: "pane", meaning: L("麵包", "面包", "bread"), emoji: "🍞", icon: "bread" },
      { foreign: "acqua", meaning: L("水", "水", "water"), emoji: "💧", icon: "water" },
      { foreign: "scuola", meaning: L("學校", "学校", "school"), emoji: "🏫", icon: "school" },
      { foreign: "amico", meaning: L("朋友", "朋友", "friend"), emoji: "👫", icon: "friend" },
      { foreign: "gatto", meaning: L("貓", "猫", "cat"), emoji: "🐱", icon: "cat" },
      { foreign: "cane", meaning: L("狗", "狗", "dog"), emoji: "🐶", icon: "dog" },
      { foreign: "libro", meaning: L("書", "书", "book"), emoji: "📚", icon: "book" },
      { foreign: "arrivederci", meaning: L("再見", "再见", "goodbye"), emoji: "🫡", icon: "bye" },
      { foreign: "sì", meaning: L("是", "是", "yes"), emoji: "✅", icon: "yes" },
      { foreign: "no", meaning: L("不是", "不是", "no"), emoji: "❌", icon: "no" },
    ],
    pt: [
      { foreign: "olá", meaning: L("你好", "你好", "hello"), emoji: "👋", icon: "hello" },
      { foreign: "obrigado", meaning: L("謝謝", "谢谢", "thanks"), emoji: "🙏", icon: "thanks" },
      { foreign: "chá", meaning: L("茶", "茶", "tea"), emoji: "🍵", icon: "tea" },
      { foreign: "café", meaning: L("咖啡", "咖啡", "coffee"), emoji: "☕", icon: "coffee" },
      { foreign: "pão", meaning: L("麵包", "面包", "bread"), emoji: "🍞", icon: "bread" },
      { foreign: "água", meaning: L("水", "水", "water"), emoji: "💧", icon: "water" },
      { foreign: "escola", meaning: L("學校", "学校", "school"), emoji: "🏫", icon: "school" },
      { foreign: "amigo", meaning: L("朋友", "朋友", "friend"), emoji: "👫", icon: "friend" },
      { foreign: "gato", meaning: L("貓", "猫", "cat"), emoji: "🐱", icon: "cat" },
      { foreign: "cachorro", meaning: L("狗", "狗", "dog"), emoji: "🐶", icon: "dog" },
      { foreign: "livro", meaning: L("書", "书", "book"), emoji: "📚", icon: "book" },
      { foreign: "tchau", meaning: L("再見", "再见", "bye"), emoji: "🫡", icon: "bye" },
      { foreign: "sim", meaning: L("是", "是", "yes"), emoji: "✅", icon: "yes" },
      { foreign: "não", meaning: L("不是", "不是", "no"), emoji: "❌", icon: "no" },
    ],
    zh: buildZhVocabList(),
  };

  function buildZhVocabList() {
    var list = [];
    if (global.RNFZhVocabExtra && global.RNFZhVocabExtra.length) {
      list = list.concat(global.RNFZhVocabExtra);
    } else {
      list.push(
        { foreign: "你好", meaning: L("你好", "你好", "hello"), emoji: "👋", icon: "hello" },
        { foreign: "謝謝", meaning: L("謝謝", "谢谢", "thanks"), emoji: "🙏", icon: "thanks" }
      );
    }
    if (global.RNFZhVocabHard && global.RNFZhVocabHard.length) {
      list = list.concat(global.RNFZhVocabHard);
    }
    return list;
  }

  function pickMascot(item, seq) {
    if (global.RNFMascot) {
      return RNFMascot.pick(
        { vocabKey: (item && item.icon) || "x", id: "gen_mascot_" + seq },
        seq
      );
    }
    return { emoji: "🐸", theme: "frog", id: "frog" };
  }
  /** 每題除正確答案外的選項數（共 EXTRA_CHOICES + 1 個可選） */
  var EXTRA_CHOICES = 4;

  /** 中文選詞題泡泡：繁簡介面用中文提示，英文介面用英文；不顯示答案本身 */
  var ZH_CHIP_GLOSS = {
    hello: L("見面時的問候", "见面时的问候", "hello"),
    welcome: L("迎接他人時的招呼", "迎接他人时的招呼", "welcome"),
    thanks: L("向人表示感謝", "向人表示感谢", "thank you"),
    tea: L("一種常見的熱飲", "一种常见的热饮", "tea"),
    coffee: L("用咖啡豆沖煮的飲品", "用咖啡豆冲煮的饮品", "coffee"),
    cf: L("廣式點心，米漿卷", "广式点心，米浆卷", "cheung fun"),
    hg: L("以蝦為餡的透明餃", "以虾为馅的透明饺", "har gow"),
    sm: L("點心燒賣", "点心烧卖", "siu mai"),
    ribs: L("豉汁蒸排骨", "豉汁蒸排骨", "spare ribs"),
    price: L("購物時詢問價格", "购物时询问价格", "how much"),
    wc: L("公共洗手間", "公共洗手间", "restroom"),
    friend: L("關係親近的人", "关系亲近的人", "friend"),
    frog: L("會跳的綠色動物", "会跳的绿色动物", "frog"),
    rain: L("從天上落下的水", "从天上落下的水", "rain"),
    lib: L("借書閱讀的地方", "借书阅读的地方", "library"),
    bye: L("道別時說的話", "道别时说的话", "bye"),
    please: L("請求別人幫忙時的禮貌用語", "请求别人帮忙时的礼貌用语", "please"),
    sorry: L("為過失向人致歉", "为过失向人致歉", "sorry"),
    dad: L("父親", "父亲", "dad"),
    mom: L("母親", "母亲", "mom"),
    hospital: L("看病就醫的場所", "看病就医的场所", "hospital"),
    school: L("讀書學習的場所", "读书学习的场所", "school"),
    work: L("上班做事", "上班做事", "work"),
    study: L("學習知識", "学习知识", "study"),
    happy: L("心情愉快", "心情愉快", "happy"),
  };

  function chipGlossForItem(item) {
    if (item.chipHint) return item.chipHint;
    if (ZH_CHIP_GLOSS[item.icon]) return ZH_CHIP_GLOSS[item.icon];
    return L(
      "意思是「" + item.meaning.en + "」的詞",
      "意思是「" + item.meaning.en + "」的词",
      item.meaning.en
    );
  }

  function pickOther(items, exclude, n) {
    var usedEmoji = {};
    usedEmoji[exclude.emoji || ""] = true;
    var out = [];
    var pool = items.filter(function (x) {
      return x && x.icon !== exclude.icon;
    });
    while (out.length < n && pool.length) {
      var candidates = pool.filter(function (x) {
        return !usedEmoji[x.emoji || ""];
      });
      if (!candidates.length) break;
      var pick = candidates[Math.floor(Math.random() * candidates.length)];
      usedEmoji[pick.emoji || ""] = true;
      out.push(pick);
      pool = pool.filter(function (x) {
        return x.icon !== pick.icon;
      });
    }
    return out;
  }

  function ensureUniqueEmojiOptions(options, all, course, correctItem) {
    var seen = {};
    var kept = [];
    var correctOpt = null;
    options.forEach(function (o) {
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
    options.forEach(function (o) {
      if (o && !o.correct) tryPush(o);
    });
    var vocab = all || [];
    var tries = 0;
    while (kept.length < EXTRA_CHOICES + 1 && tries < vocab.length * 2) {
      tries += 1;
      var it = vocab[Math.floor(Math.random() * vocab.length)];
      if (!it || it.icon === correctItem.icon || seen[it.emoji || ""]) continue;
      tryPush({
        emoji: it.emoji || "❓",
        cardArt: it.icon,
        label: emojiOptionLabel(course, it),
      });
    }
    return kept;
  }

  function buildMeaningOptions(correctItem, wrongItems) {
    var options = [{ label: correctItem.meaning, correct: true }];
    wrongItems.forEach(function (w) {
      if (w) options.push({ label: w.meaning });
    });
    return options;
  }

  function buildForeignOptions(correctItem, wrongItems) {
    var options = [
      {
        label: {
          hant: correctItem.foreign,
          hans: correctItem.foreign,
          en: correctItem.foreign,
        },
        correct: true,
      },
    ];
    wrongItems.forEach(function (w) {
      if (!w) return;
      options.push({
        label: { hant: w.foreign, hans: w.foreign, en: w.foreign },
      });
    });
    return options;
  }

  function promptWhich(course, item) {
    if (course === "zh") {
      return {
        hant: "哪一個是「" + item.meaning.hant + "」？",
        hans: "哪一个是「" + item.meaning.hans + "」？",
        en: 'Which one is "' + item.meaning.en + '"?',
      };
    }
    var word = item.foreign || item.meaning.en;
    return {
      hant: 'Which picture is "' + word + '"?',
      hans: 'Which picture is "' + word + '"?',
      en: 'Which picture is "' + word + '"?',
    };
  }

  function foreignCue(item) {
    return {
      hant: item.foreign,
      hans: item.foreign,
      en: item.foreign,
    };
  }

  function emojiOptionLabel(course, item) {
    if (course === "zh") {
      return {
        hant: item.meaning.hant,
        hans: item.meaning.hans,
        en: item.meaning.en,
      };
    }
    return {
      hant: item.foreign,
      hans: item.foreign,
      en: item.foreign,
    };
  }

  function itemLevel(item) {
    return item && item.tier === "hard" ? "intermediate" : "beginner";
  }

  function genEmojiPick(course, item, all) {
    var wrong = pickOther(all, item, EXTRA_CHOICES);
    var options = [
      {
        emoji: item.emoji,
        cardArt: item.icon,
        label: emojiOptionLabel(course, item),
        correct: true,
      },
    ];
    wrong.forEach(function (w) {
      if (!w) return;
      options.push({
        emoji: w.emoji || "❓",
        cardArt: w.icon,
        label: emojiOptionLabel(course, w),
      });
    });
    options = ensureUniqueEmojiOptions(options, all, course, item);
    return {
      id: nextId(course + "_ep"),
      type: "emoji_pick",
      level: itemLevel(item),
      courses: [course],
      vocabKey: course + ":" + item.icon,
      badge: "new_word",
      prompt: promptWhich(course, item),
      speakLine: course === "zh" ? chineseCue(item) : foreignCue(item),
      speakLang: course === "zh" ? "zh-CN" : "en-US",
      options: options,
    };
  }

  function englishCue(item) {
    return {
      hant: item.meaning.en,
      hans: item.meaning.en,
      en: item.meaning.en,
    };
  }

  /** 非中文課：選詞題泡泡顯示外語詞 */
  function chipPromptLine(course, item) {
    return {
      hant: item.foreign,
      hans: item.foreign,
      en: item.foreign,
    };
  }

  function genTranslateChoice(course, item, all) {
    var wrong = pickOther(all, item, EXTRA_CHOICES);
    var mascot = pickMascot(item, seq);
    var promptLine = chineseCue(item);
    var options =
      course === "zh"
        ? buildMeaningOptions(item, wrong)
        : buildForeignOptions(item, wrong);
    return {
      id: nextId(course + "_tc"),
      type: "translate_choice",
      courses: [course],
      vocabKey: course + ":" + item.icon,
      badge: item.tier === "hard" ? "grammar" : "new_word",
      level: itemLevel(item),
      mascotId: mascot.id,
      avatar: mascot.emoji,
      avatarClass: mascot.theme,
      correctPraise: "great",
      promptLine: promptLine,
      speakLine: chineseCue(item),
      speakLang: course === "zh" ? "zh-CN" : "en-US",
      options: options,
    };
  }

  function chineseCue(item) {
    return {
      hant: item.meaning.hant,
      hans: item.meaning.hans,
      en: item.meaning.en,
    };
  }

  function listenPrompt() {
    return {
      hant: "選擇你聽到的內容",
      hans: "选择你听到的内容",
      en: "Select what you hear",
    };
  }

  function listenAudioField(course, item) {
    if (course === "zh") return chineseCue(item);
    return {
      hant: item.foreign,
      hans: item.foreign,
      en: item.foreign,
    };
  }

  function listenChips(course, item, wrong) {
    var chips = [];
    if (course === "zh") {
      chips.push({
        id: "lc_" + item.icon,
        text: chineseCue(item),
        correct: true,
      });
      wrong.forEach(function (w, i) {
        if (!w || chips.length >= EXTRA_CHOICES + 1) return;
        chips.push({
          id: "ld_" + w.icon + "_" + i,
          text: chineseCue(w),
        });
      });
      return chips;
    }
    chips.push({
      id: "lc_" + item.icon,
      text: {
        hant: item.foreign,
        hans: item.foreign,
        en: item.foreign,
      },
      correct: true,
    });
    wrong.forEach(function (w, i) {
      if (!w || chips.length >= EXTRA_CHOICES + 1) return;
      chips.push({
        id: "ld_" + w.icon + "_" + i,
        text: { hant: w.foreign, hans: w.foreign, en: w.foreign },
      });
    });
    return chips;
  }

  function genListenPick(course, item, all) {
    var wrong = pickOther(all, item, EXTRA_CHOICES);
    return {
      id: nextId(course + "_lp"),
      type: "listen_pick",
      level: itemLevel(item),
      courses: [course],
      vocabKey: course + ":" + item.icon,
      badge: "new_word",
      prompt: listenPrompt(),
      audioText: listenAudioField(course, item),
      speakLang: course === "zh" ? "zh-CN" : "en-US",
      chips: listenChips(course, item, wrong),
    };
  }

  var SHORT_PHRASE_ICONS = { tea: 1, hello: 1, thanks: 1, coffee: 1, welcome: 1 };

  function genWriteSentenceShort(course, item, all) {
    /* 學英語不做「用中文寫出 Hello」題（方向錯誤）；改由 translate_chip 處理 */
    return null;
  }

  function genTranslateChip(course, item, all) {
    var wrong = pickOther(all, item, EXTRA_CHOICES);
    var wOk = "w" + item.icon;
    var mascotC = pickMascot(item, seq + 3);
    if (course === "zh") {
      var promptLine = chipGlossForItem(item);
      var words = [{ id: wOk, text: item.meaning, correct: true }];
      wrong.forEach(function (w, i) {
        if (!w) return;
        words.push({
          id: "d_" + w.icon + "_" + i,
          text: w.meaning,
          distractor: true,
        });
      });
      return {
        id: nextId(course + "_wb"),
        type: "word_bank",
        variant: "translate_chip",
        level: itemLevel(item),
        courses: [course],
        vocabKey: course + ":" + item.icon,
        badge: item.tier === "hard" ? "grammar" : "new_word",
        mascotId: mascotC.id,
        avatar: mascotC.emoji,
        avatarClass: mascotC.theme,
        prompt:
          item.tier === "hard"
            ? {
                hant: "根據提示選出最合適的詞語",
                hans: "根据提示选出最合适的词语",
                en: "Pick the best word for the clue",
              }
            : {
                hant: "點選正確的中文詞語",
                hans: "点选正确的中文词语",
                en: "Pick the correct Chinese word",
              },
        promptLine: promptLine,
        speakLine: englishCue(item),
        speakLang: "en-US",
        words: words,
        answer: [wOk],
      };
    }
    var wordsEn = [
      {
        id: wOk,
        text: { hant: item.foreign, hans: item.foreign, en: item.foreign },
        correct: true,
      },
    ];
    wrong.forEach(function (w, i) {
      if (!w) return;
      wordsEn.push({
        id: "d_" + w.icon + "_" + i,
        text: { hant: w.foreign, hans: w.foreign, en: w.foreign },
        distractor: true,
      });
    });
    return {
      id: nextId(course + "_wb"),
      type: "word_bank",
      variant: "translate_chip",
      level: itemLevel(item),
      courses: [course],
      vocabKey: course + ":" + item.icon,
      badge: item.tier === "hard" ? "grammar" : "new_word",
      mascotId: mascotC.id,
      avatar: mascotC.emoji,
      avatarClass: mascotC.theme,
      prompt: {
        hant: "點選正確的英文詞語",
        hans: "点选正确的英文词语",
        en: "Pick the correct English word",
      },
      promptLine: chineseCue(item),
      speakLine: chineseCue(item),
      speakLang: "zh-CN",
      words: wordsEn,
      answer: [wOk],
    };
  }

  function genTextChoice(course, item, all) {
    var wrong = pickOther(all, item, EXTRA_CHOICES);
    var mascotT = pickMascot(item, seq + 5);
    if (course === "zh") {
      return {
        id: nextId(course + "_tx"),
        type: "text_choice",
        level: itemLevel(item),
        courses: [course],
        vocabKey: course + ":" + item.icon,
        badge: item.tier === "hard" ? "grammar" : "daily",
        mascotId: mascotT.id,
        avatar: mascotT.emoji,
        avatarClass: mascotT.theme,
        prompt: {
          hant:
            item.tier === "hard"
              ? "在正式場合，「" + item.meaning.en + "」較自然的說法是？"
              : "「" + item.meaning.en + "」用中文怎麼說？",
          hans:
            item.tier === "hard"
              ? "在正式场合，「" + item.meaning.en + "」较自然的说法是？"
              : "「" + item.meaning.en + "」用中文怎么说？",
          en: 'How do you say "' + item.meaning.en + '" in Chinese?',
        },
        promptLine: englishCue(item),
        options: buildMeaningOptions(item, wrong),
      };
    }
    return {
      id: nextId(course + "_tx"),
      type: "text_choice",
      level: itemLevel(item),
      courses: [course],
      vocabKey: course + ":" + item.icon,
      badge: "daily",
      mascotId: mascotT.id,
      avatar: mascotT.emoji,
      avatarClass: mascotT.theme,
      prompt: {
        hant: "「" + item.meaning.hant + "」用" + courseLabel(course) + "怎麼說？",
        hans: "「" + item.meaning.hans + "」用" + courseLabel(course) + "怎么说？",
        en: 'How do you say "' + item.meaning.en + '"?',
      },
      speakLine: chineseCue(item),
      speakLang: "zh-CN",
      promptLine: chineseCue(item),
      options: buildForeignOptions(item, wrong),
    };
  }

  function courseLabel(code) {
    var map = {
      ko: "韓語",
      ja: "日語",
      en: "英語",
      es: "西班牙語",
      fr: "法語",
      de: "德語",
      it: "義大利語",
      pt: "葡萄牙語",
      zh: "中文",
    };
    return map[code] || code;
  }

  function genFillPick(course, item, all) {
    var wrong = pickOther(all, item, EXTRA_CHOICES);
    var zhHard = course === "zh" && item.tier === "hard";
    return {
      id: nextId(course + "_fp"),
      type: "fill_pick",
      level: itemLevel(item),
      courses: [course],
      vocabKey: course + ":" + item.icon,
      badge: "grammar",
      prompt: {
        hant: zhHard ? "選出最適合填入空格的詞" : "選出正確的詞",
        hans: zhHard ? "选出最适合填入空格的词" : "选出正确的词",
        en: "Pick the correct word",
      },
      template: zhHard
        ? {
            hant: "在正式郵件裡，「" + item.meaning.en + "」應寫作：___",
            hans: "在正式邮件里，「" + item.meaning.en + "」应写作：___",
            en: "In formal writing, \"" + item.meaning.en + "\" is: ___",
          }
        : {
            hant: "___ 的意思是「" + item.meaning.hant + "」。",
            hans: "___ 的意思是「" + item.meaning.hans + "」。",
            en: "___ means \"" + item.meaning.en + "\".",
          },
      options: zhHard
        ? (function () {
            var opts = [{ label: item.meaning, correct: true }];
            wrong.forEach(function (w) {
              if (w && opts.length < 5) opts.push({ label: w.meaning });
            });
            return opts;
          })()
        : buildForeignOptions(item, wrong),
    };
  }

  function genZhSentenceArrange(sent) {
    return {
      id: nextId("zh_sent"),
      type: "word_bank",
      level: "intermediate",
      courses: ["zh"],
      badge: "phrase",
      vocabKey: "zh:sent:" + sent.id,
      prompt: {
        hant: "排出正確的普通話句子",
        hans: "排出正确的普通话句子",
        en: "Arrange the sentence in Mandarin",
      },
      promptLine: sent.promptLine,
      words: sent.words.slice(),
      answer: sent.answer.slice(),
    };
  }

  function genTrueFalse(course, item) {
    var odd = seq % 2 === 0;
    return {
      id: nextId(course + "_tf"),
      type: "true_false",
      level: itemLevel(item),
      courses: [course],
      vocabKey: course + ":" + item.icon,
      badge: "grammar",
      prompt: {
        hant: "這個配對正確嗎？",
        hans: "这个配对正确吗？",
        en: "Is this pairing correct?",
      },
      statement: odd
        ? {
            hant: "「" + item.foreign + "」→「" + item.meaning.hant + "」",
            hans: "「" + item.foreign + "」→「" + item.meaning.hans + "」",
            en: "\"" + item.foreign + "\" → \"" + item.meaning.en + "\"",
          }
        : {
            hant: "「" + item.foreign + "」→「" + item.meaning.hant + "錯誤」",
            hans: "「" + item.foreign + "」→「" + item.meaning.hans + "错误」",
            en: "\"" + item.foreign + "\" → wrong meaning",
          },
      correct: odd,
    };
  }

  function generateForCourse(course) {
    var list = VOCAB[course];
    if (!list || !list.length) return [];
    var out = [];
    list.forEach(function (item, idx) {
      seq = idx * 11;
      if (course === "zh" && item.tier === "hard") {
        out.push(genTranslateChip(course, item, list));
        out.push(genTranslateChoice(course, item, list));
        out.push(genTextChoice(course, item, list));
        out.push(genFillPick(course, item, list));
        if (idx % 2 === 0) out.push(genTrueFalse(course, item));
        return;
      }
      if (idx % 3 === 0) {
        out.push(genEmojiPick(course, item, list));
      }
      out.push(genListenPick(course, item, list));
      out.push(genTranslateChoice(course, item, list));
      out.push(genTranslateChip(course, item, list));
      var shortWrite = genWriteSentenceShort(course, item, list);
      if (shortWrite) out.push(shortWrite);
      if (course === "zh" || idx % 2 === 0) {
        out.push(genTextChoice(course, item, list));
      }
    });
    if (course === "zh" && global.RNFZhSentences && global.RNFZhSentences.length) {
      global.RNFZhSentences.forEach(function (sent) {
        out.push(genZhSentenceArrange(sent));
      });
    }
    return out;
  }

  function generateAll() {
    var all = [];
    Object.keys(VOCAB).forEach(function (course) {
      all = all.concat(generateForCourse(course));
    });
    return all;
  }

  global.RNFQuestionGen = {
    VOCAB: VOCAB,
    generateAll: generateAll,
    generateForCourse: generateForCourse,
  };
})(window);
