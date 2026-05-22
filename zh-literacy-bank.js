/**
 * 中文語文練習題庫（60 題：基礎 / 中階 / 高階）
 * 供中文課程使用；題幹含繁/簡/英，介面語言通用。
 */
(function (global) {
  function L(hant, hans, en) {
    return { hant: hant, hans: hans, en: en };
  }

  function litPrompt(hant, en) {
    var hans = hant
      .replace(/著/g, "着")
      .replace(/裡/g, "里")
      .replace(/麼/g, "么")
      .replace(/為/g, "为")
      .replace(/國/g, "国")
      .replace(/學/g, "学")
      .replace(/詞/g, "词")
      .replace(/語/g, "语")
      .replace(/這/g, "这")
      .replace(/說/g, "说")
      .replace(/雖/g, "虽")
      .replace(/還/g, "还")
      .replace(/從/g, "从")
      .replace(/時/g, "时")
      .replace(/會/g, "会")
      .replace(/們/g, "们")
      .replace(/來/g, "来")
      .replace(/過/g, "过")
      .replace(/見/g, "见")
      .replace(/讓/g, "让")
      .replace(/與/g, "与")
      .replace(/應/g, "应")
      .replace(/對/g, "对")
      .replace(/問/g, "问")
      .replace(/聽/g, "听")
      .replace(/讀/g, "读")
      .replace(/書/g, "书")
      .replace(/圖/g, "图")
      .replace(/館/g, "馆")
      .replace(/遲/g, "迟")
      .replace(/課/g, "课")
      .replace(/歡/g, "欢")
      .replace(/樂/g, "乐")
      .replace(/難/g, "难")
      .replace(/義/g, "义")
      .replace(/詞/g, "词")
      .replace(/辭/g, "辞")
      .replace(/誤/g, "误")
      .replace(/衛/g, "卫")
      .replace(/態/g, "态")
      .replace(/氣/g, "气")
      .replace(/陰/g, "阴")
      .replace(/陽/g, "阳")
      .replace(/無/g, "无")
      .replace(/願/g, "愿")
      .replace(/顯/g, "显")
      .replace(/發/g, "发")
      .replace(/現/g, "现")
      .replace(/將/g, "将")
      .replace(/經/g, "经")
      .replace(/經理/g, "经理")
      .replace(/親/g, "亲")
      .replace(/關係/g, "关系")
      .replace(/決/g, "决")
      .replace(/堅/g, "坚")
      .replace(/體/g, "体")
      .replace(/練/g, "练")
      .replace(/習/g, "习")
      .replace(/識/g, "识")
      .replace(/覺/g, "觉")
      .replace(/憶/g, "忆")
      .replace(/憶/g, "忆")
      .replace(/憶/g, "忆");
    return L(hant, hans, en);
  }

  function tc(id, level, prompt, labels, correctIndex, extra) {
    var o = {
      id: id,
      type: "text_choice",
      level: level,
      courses: ["zh"],
      badge: extra && extra.badge ? extra.badge : level === "beginner" ? "daily" : "grammar",
      vocabKey: "zh_lit:" + id,
      prompt: litPrompt(
        prompt.hant || prompt,
        prompt.en || "Chinese literacy"
      ),
      options: labels.map(function (lab, i) {
        var text =
          typeof lab === "string"
            ? lab
            : lab.hant || lab.hans || lab.en || "";
        return {
          label: L(text, text, text),
          correct: i === correctIndex,
        };
      }),
    };
    if (extra && extra.promptLine) o.promptLine = L(extra.promptLine, extra.promptLine, extra.promptLine);
    if (extra && extra.statement) o.statement = L(extra.statement, extra.statement, extra.statement);
    return o;
  }

  function tf(id, level, prompt, statement, correct, extra) {
    return {
      id: id,
      type: "true_false",
      level: level,
      courses: ["zh"],
      badge: "grammar",
      vocabKey: "zh_lit:" + id,
      prompt: litPrompt(prompt, "True or false?"),
      statement: L(statement, statement, statement),
      correct: correct,
    };
  }

  function wb(id, level, prompt, pieces, answerIds, extra) {
    var words = pieces.map(function (p, i) {
      var hant = p.t;
      var hans = p.hans || hant;
      return {
        id: p.id || "w" + i,
        text: L(hant, hans, hans),
        distractor: !!p.d,
      };
    });
    return {
      id: id,
      type: "word_bank",
      level: level,
      courses: ["zh"],
      badge: "phrase",
      vocabKey: "zh_lit:" + id,
      prompt: litPrompt(prompt, "Arrange the sentence in Chinese"),
      words: words,
      answer: answerIds,
    };
  }

  var BANK = [
    /* ── 基礎 Easy (20) ── */
    tc(
      "zh_lit_e01",
      "beginner",
      { hant: "下列哪一個字的讀音與其他三個不同？", en: "Which character has a different reading?" },
      ["基礎", "著名", "儲存", "處所"],
      1
    ),
    tc(
      "zh_lit_e02",
      "beginner",
      {
        hant: "「他每天都按時交功課，從不遲道。」句中的錯別字應改為？",
        en: "Fix the typos in this sentence",
      },
      ["功→課、道→到", "功→功、道→道", "課→功、到→道", "句子沒有錯字"],
      0
    ),
    tc(
      "zh_lit_e03",
      "beginner",
      {
        hant: "「這家餐廳的服務態度非常好，_____菜色也很美味。」空格處最適合填入？",
        en: "Best word for the blank",
      },
      ["但是", "而且", "雖然", "所以"],
      1
    ),
    tc(
      "zh_lit_e04",
      "beginner",
      { hant: "下列哪一組詞語不是反義詞？", en: "Which pair is NOT antonyms?" },
      ["驕傲 / 謙虛", "慷慨 / 大方", "寒冷 / 炎熱", "成功 / 失敗"],
      1
    ),
    tc(
      "zh_lit_e05",
      "beginner",
      {
        hant: "請選出正確的量詞：「一_____美麗的彩虹掛在天空。」",
        en: "Pick the correct measure word",
      },
      ["條", "道", "隻", "張"],
      1
    ),
    wb(
      "zh_lit_e06",
      "beginner",
      "請將以下詞語重組成通順的句子",
      [
        { id: "a", t: "小狗" },
        { id: "b", t: "在" },
        { id: "c", t: "公園裡", hans: "公园里" },
        { id: "d", t: "快樂地" },
        { id: "e", t: "奔跑" },
        { id: "x", t: "慢慢地", d: true },
      ],
      ["a", "b", "c", "d", "e"]
    ),
    tc(
      "zh_lit_e07",
      "beginner",
      {
        hant: "請將主動句改為被動句：「弟弟吃光了桌上的蛋糕。」",
        en: "Choose the correct passive sentence",
      },
      ["弟弟吃光了桌上的蛋糕。", "桌上的蛋糕被弟弟吃光了。", "桌上的蛋糕吃光了弟弟。", "吃光蛋糕的是弟弟桌上。"],
      1
    ),
    tc(
      "zh_lit_e08",
      "beginner",
      {
        hant: "「雖然外面的雨很大，__________。」最合理的後半句是？",
        en: "Best completion for this sentence",
      },
      ["所以我決定出門散步", "他還是決定待在家裡", "因此大家都去游泳", "而且雨變得更大了"],
      1
    ),
    tf(
      "zh_lit_e09",
      "beginner",
      "判斷正誤",
      "他高興得流下了傷心的眼淚。",
      false
    ),
    tc(
      "zh_lit_e10",
      "beginner",
      { hant: "下列哪一組全是「高興」的近義詞？", en: "Which are all near-synonyms of 高兴?" },
      ["開心、愉快、快樂", "傷心、難過、沮喪", "憤怒、生氣、惱火", "害怕、恐懼、驚慌"],
      0
    ),
    tc(
      "zh_lit_e11",
      "beginner",
      {
        hant: "「明日復明日，明日何其多。」主要是勸人不要做什麼？",
        en: "What does this line warn against?",
      },
      ["浪費時間、拖延偷懶", "太早起床", "吃太多美食", "不愛學外語"],
      0
    ),
    tc(
      "zh_lit_e12",
      "beginner",
      {
        hant: "「我預計大約明天會去圖書館。」哪個詞語是多餘的（贅字）？",
        en: "Which word is redundant?",
      },
      ["預計", "大約", "明天", "圖書館"],
      1
    ),
    tc(
      "zh_lit_e13",
      "beginner",
      {
        hant: "「媽媽對我說：『快去洗手吃飯。』」改成間接引述（轉述句）後，正確的是？",
        en: "Choose the correct reported speech",
      },
      [
        "媽媽對我說，快去洗手吃飯。",
        "媽媽叫我快洗手吃飯。",
        "媽媽問我是否洗手吃飯。",
        "媽媽說她正在洗手吃飯。",
      ],
      1
    ),
    tc(
      "zh_lit_e14",
      "beginner",
      { hant: "下列哪一個詞語形容「時間過得很快」？", en: "Which idiom means time flies?" },
      ["日月如梭", "慢條斯理", "度日如年", "井井有條"],
      0
    ),
    tc(
      "zh_lit_e15",
      "beginner",
      { hant: "請選出正確的字填空：「這件事讓你費_____了。」", en: "Fill in the blank" },
      ["心", "新", "薪"],
      0
    ),
    tc(
      "zh_lit_e16",
      "beginner",
      {
        hant: "將「小鳥在樹上唱歌」改寫得更豐富，哪一句最好？",
        en: "Pick the best enriched sentence",
      },
      [
        "小鳥在樹上唱歌。",
        "可愛的小鳥在綠蔭的樹枝上輕快地唱歌。",
        "小鳥唱歌在樹上。",
        "樹上唱歌小鳥在。",
      ],
      1
    ),
    tc(
      "zh_lit_e17",
      "beginner",
      { hant: "下列哪個詞常用來形容「說話很有禮貌」？", en: "Which word means polite speech?" },
      ["粗魯", "謙遜", "傲慢", "敷衍"],
      1
    ),
    tf(
      "zh_lit_e18",
      "beginner",
      "這句話有沒有語病？",
      "看見這幅畫，讓我想起了過去許多往事。",
      false
    ),
    tc(
      "zh_lit_e19",
      "beginner",
      { hant: "「黑」的反義詞是？並選出用法正確的一組。", en: "Antonym of 黑 and correct usage" },
      [
        "白——天空很白。／黑夜很黑。",
        "白——黑夜很白。／天空很黑。",
        "紅——紅花很紅。／黑葉很黑。",
        "亮——月亮很亮。／星星很亮。",
      ],
      0
    ),
    tc(
      "zh_lit_e20",
      "beginner",
      {
        hant: "「一分耕耘，一分收穫」的意思是？",
        en: "Meaning of this proverb",
      },
      ["付出多少努力，就得到多少成果", "只要耕耘就會下雨", "收穫比耕耘更重要", "耕耘與收穫無關"],
      0
    ),

    /* ── 中階 Medium (20) ── */
    tc(
      "zh_lit_m01",
      "intermediate",
      {
        hant: "「指鹿為馬」常用來形容什麼行為？",
        en: "What does 指鹿为马 describe?",
      },
      ["故意顛倒是非、混淆黑白", "誠實坦白", "虛心學習", "互相幫助"],
      0
    ),
    tc(
      "zh_lit_m02",
      "intermediate",
      {
        hant: "觀眾對這部電影的_____很好。（反應／反映）",
        en: "反应 or 反映?",
      },
      ["反應", "反映", "感應", "反射"],
      0
    ),
    tc(
      "zh_lit_m02b",
      "intermediate",
      {
        hant: "這本小說_____了當時的社會現實。（反應／反映）",
        en: "反应 or 反映?",
      },
      ["反應", "反映", "感應", "反射"],
      1
    ),
    tc(
      "zh_lit_m03",
      "intermediate",
      {
        hant: "哪個成語形容「感情深厚、分不開」？",
        en: "Which idiom means inseparable?",
      },
      ["形影不離", "三心二意", "萍水相逢", "貌合神離"],
      0
    ),
    tf(
      "zh_lit_m04",
      "intermediate",
      "成語用法是否正確？",
      "他對這件事的態度真是「捉襟見肘」。",
      false
    ),
    tc(
      "zh_lit_m05",
      "intermediate",
      { hant: "與「事半功倍」意思相反的成語是？", en: "Opposite of 事半功倍" },
      ["事倍功半", "一舉兩得", "如虎添翼", "得心應手"],
      0
    ),
    tc(
      "zh_lit_m06",
      "intermediate",
      {
        hant: "「微風輕輕地撫摸著我的臉頰。」運用了什麼修辭？",
        en: "Which rhetorical device?",
      },
      ["比喻", "擬人", "排比", "誇張"],
      1
    ),
    tc(
      "zh_lit_m07",
      "intermediate",
      {
        hant: "「與其……不如……」和「寧可……也不……」的主要區別是？",
        en: "Main difference between these patterns",
      },
      [
        "前者表達選擇建議，後者表達強硬取捨",
        "兩者完全相同",
        "前者表否定，後者表肯定",
        "前者只能用在書面語",
      ],
      0
    ),
    tc(
      "zh_lit_m08",
      "intermediate",
      {
        hant: "用適當關聯詞連接：「他身體不舒服。」「他堅持完成了比賽。」",
        en: "Best connecting sentence",
      },
      [
        "他身體不舒服，所以堅持完成了比賽。",
        "雖然他身體不舒服，但他堅持完成了比賽。",
        "他身體不舒服，而且堅持完成了比賽。",
        "他身體不舒服，或者堅持完成了比賽。",
      ],
      1
    ),
    tf(
      "zh_lit_m09",
      "intermediate",
      "這句話有沒有語病？",
      "通過這次的演習，使大家提高了防火意識。",
      false
    ),
    tc(
      "zh_lit_m10",
      "intermediate",
      {
        hant: "「孤帆遠影碧空盡，唯見長江天際流。」詩中「孤帆」主要運用了？",
        en: "Rhetoric in 孤帆",
      },
      ["借代", "誇張", "對比", "反問"],
      0
    ),
    tf(
      "zh_lit_m11",
      "intermediate",
      "因果關係是否合理？",
      "他雖然贏了比賽，但大家並沒有給他掌聲，因為他作弊了。",
      true
    ),
    tc(
      "zh_lit_m12",
      "intermediate",
      {
        hant: "「冰凍三尺，非一日之寒。」隱喻的道理是？",
        en: "Meaning of this proverb",
      },
      ["重大結果往往由長期累積造成", "冬天一定很冷", "三尺冰很難融化", "做事要趁熱打鐵"],
      0
    ),
    tc(
      "zh_lit_m13",
      "intermediate",
      {
        hant: "將敘述排成邏輯通順的段落，正確順序是？①天空開朗 ②烏雲大雨 ③彩虹橫跨",
        en: "Correct paragraph order",
      },
      ["①②③", "②①③", "③②①", "②③①"],
      1
    ),
    tc(
      "zh_lit_m14",
      "intermediate",
      {
        hant: "「項莊舞劍，意在沛公」字面以外的含意是？",
        en: "Hidden meaning of this idiom",
      },
      ["表面一套，實際針對另一目標", "跳舞很優美", "劍術比賽", "歡迎貴賓"],
      0
    ),
    tc(
      "zh_lit_m15",
      "intermediate",
      {
        hant: "下列哪一段最符合「創新」的定義？",
        en: "Best definition of 创新",
      },
      [
        "創新是在既有基礎上提出新想法、新方法，帶來進步與價值。",
        "創新就是完全複製舊事物。",
        "創新只指買新產品。",
        "創新與學習無關。",
      ],
      0
    ),
    tc(
      "zh_lit_m16",
      "intermediate",
      {
        hant: "哪一組詞語的感情色彩（褒貶）與其他三組不同？",
        en: "Which group has different connotation?",
      },
      ["大公無私 / 捨己為人", "勾心鬥角 / 陰險狡詐", "鍥而不捨 / 持之以恆", "高瞻遠矚 / 足智多謀"],
      1
    ),
    tc(
      "zh_lit_m17",
      "intermediate",
      {
        hant: "「唯有源頭活水來」的前一句與作者是？",
        en: "Previous line and author",
      },
      ["問渠那得清如許？——朱熹", "床前明月光——李白", "春眠不覺曉——孟浩然", "白日依山盡——王之渙"],
      0
    ),
    tc(
      "zh_lit_m18",
      "intermediate",
      {
        hant: "「不恥下問」中「恥」的意思是？",
        en: "Meaning of 耻 in 不耻下问",
      },
      ["以……為恥（感到羞恥）", "光榮", "快樂", "生氣"],
      0
    ),
    tc(
      "zh_lit_m19",
      "intermediate",
      {
        hant: "「這款新手機的銷量是去年同期的兩倍兩成。」邏輯問題在於？",
        en: "Logical error in this sentence",
      },
      ["「兩倍」與「兩成」疊加造成語意不清", "手機不能賣", "去年不能比較", "沒有使用成語"],
      0
    ),
    tc(
      "zh_lit_m20",
      "intermediate",
      { hant: "將「時間很寶貴。」改為反問句，正確的是？", en: "Correct rhetorical question" },
      ["時間難道不寶貴嗎？", "時間很寶貴。", "時間不寶貴。", "寶貴的時間很寶貴。"],
      0
    ),

    /* ── 高階 Hard (20) ── */
    tc(
      "zh_lit_h01",
      "intermediate",
      {
        hant: "「學而不思則罔，思而不學則殆。」中「罔」與「殆」的意思是？",
        en: "Meanings of 罔 and 殆",
      },
      ["迷惘／危殆（有害）", "快樂／憂傷", "成功／失敗", "開始／結束"],
      0
    ),
    tc(
      "zh_lit_h02",
      "intermediate",
      {
        hant: "「君子成人之美，不成人之惡」在職場中最貼近的應用是？",
        en: "Modern workplace application",
      },
      ["樂於成全他人優點，不助長惡行", "只幫自己升職", "拒絕合作", "背後批評同事"],
      0
    ),
    tc(
      "zh_lit_h03",
      "intermediate",
      {
        hant: "「親賢臣，遠小人，此先漢所以興隆也。」句中「所以」的意思是？",
        en: "Meaning of 所以 in classical Chinese",
      },
      ["……的原因", "因此", "所以（連詞）", "所有"],
      0
    ),
    tc(
      "zh_lit_h04",
      "intermediate",
      {
        hant: "「余憶童稚時，能張目對日，明察秋毫。」的白話意思是？",
        en: "Modern translation",
      },
      [
        "我回想小時候，能睜眼對著太陽，看清細微之物。",
        "我討厭童年，什麼都看不見。",
        "秋天一定要打獵。",
        "太陽很大所以閉眼。",
      ],
      0
    ),
    tc(
      "zh_lit_h05",
      "intermediate",
      {
        hant: "對聯中，上聯末字通常是？下聯末字通常是？",
        en: "Couplet tone pattern",
      },
      ["仄聲／平聲", "平聲／仄聲", "仄聲／仄聲", "平聲／平聲"],
      0
    ),
    tc(
      "zh_lit_h06",
      "intermediate",
      {
        hant: "「不論氣候條件多麼惡劣，他都能夠按時完成任務的決心。」語病修正後最佳的是？",
        en: "Fix the advanced grammar issue",
      },
      [
        "不論氣候多麼惡劣，他都有按時完成任務的決心。",
        "不論氣候條件多麼惡劣，他都能夠按時完成任務的決心。",
        "他決心完成任務氣候惡劣。",
        "惡劣氣候決心他完成任務。",
      ],
      0
    ),
    tc(
      "zh_lit_h07",
      "intermediate",
      {
        hant: "「他太專心，_____忘了吃飯。」應填入？",
        en: "不免 / 未免 / 以免",
      },
      ["不免", "以免", "未免", "必須"],
      0
    ),
    tc(
      "zh_lit_h08",
      "intermediate",
      {
        hant: "「能否建立良好的親自關係，是青少年健康成長的關鍵。」犯了什麼錯？",
        en: "Error type",
      },
      ["「親自」應為「親子」（搭配不當）", "沒有錯誤", "標點錯誤", "缺少主語"],
      0
    ),
    tc(
      "zh_lit_h09",
      "intermediate",
      {
        hant: "「這件衣服差點洗得乾乾淨淨」與「洗得乾乾淨淨」的差異是？",
        en: "Meaning of 差点",
      },
      [
        "前者暗示結果可能沒洗乾淨（差點＝幾乎沒）",
        "兩句完全相同",
        "前者表示洗得更乾淨",
        "前者是反問句",
      ],
      0
    ),
    tc(
      "zh_lit_h10",
      "intermediate",
      {
        hant: "「經理通知小張，部門會議他可以不參加。」有歧義。較明確的寫法是？",
        en: "Disambiguated sentence",
      },
      [
        "經理通知小張：部門會議你可以不參加。",
        "經理通知小張，部門會議他可以不參加。",
        "小張通知經理不參加。",
        "部門會議通知經理。",
      ],
      0
    ),
    tc(
      "zh_lit_h11",
      "intermediate",
      {
        hant: "「朱門酒肉臭，路有凍死骨。」主要運用了？反映了？",
        en: "Rhetoric and social critique",
      },
      [
        "對比——貧富懸殊、社會不公",
        "誇張——天氣寒冷",
        "擬人——酒肉會臭",
        "借代——只有門很紅",
      ],
      0
    ),
    tc(
      "zh_lit_h12",
      "intermediate",
      {
        hant: "「大巧若拙，大音希聲」的核心思想是？",
        en: "Core philosophy",
      },
      ["最高明的境界往往看似樸素、淡泊", "越笨拙越好聽", "聲音越大越好", "藝術必須華麗"],
      0
    ),
    tc(
      "zh_lit_h13",
      "intermediate",
      {
        hant: "「水滴石穿……學問的積累亦如春繭吐絲……」主要運用了？",
        en: "Argument method",
      },
      ["比喻論證", "舉例論證", "對比論證", "引用論證"],
      0
    ),
    tc(
      "zh_lit_h14",
      "intermediate",
      {
        hant: "中國古典詩詞中「月亮」常承載的情感是？",
        en: "Moon imagery in poetry",
      },
      ["思鄉、團圓或離別的思念", "只有歡笑", "只有憤怒", "只有諷刺官場"],
      0
    ),
    tc(
      "zh_lit_h15",
      "intermediate",
      {
        hant: "「僧敲月下門」中「敲」比「推」更妙，主要在於？",
        en: "敲 vs 推",
      },
      ["有聲響，畫面更靜中有動", "推門更有禮貌", "敲字筆畫少", "推表示生氣"],
      0
    ),
    tc(
      "zh_lit_h16",
      "intermediate",
      {
        hant: "下列哪句最符合「孤獨」的最高美學層次？",
        en: "Highest aesthetic of solitude",
      },
      [
        "獨愴然而涕下",
        "舉杯邀明月，對影成三人",
        "孤舟蓑笠翁，獨釣寒江雪",
        "門前冷落鞍馬稀",
      ],
      2
    ),
    tc(
      "zh_lit_h17",
      "intermediate",
      {
        hant: "「形而上」與「形而下」的基本區別是？",
        en: "形而上 vs 形而下",
      },
      [
        "形而上指抽象道理；形而下指具體事物",
        "形而上指物質；形而下指精神",
        "兩者沒有區別",
        "形而上指形狀，形而下指顏色",
      ],
      0
    ),
    tc(
      "zh_lit_h18",
      "intermediate",
      {
        hant: "用純景物描寫表現「絕望」（不出現情緒字眼），最佳的是？",
        en: "Despair through scenery only",
      },
      [
        "灰牆剝落，枯枝橫在積水的巷口，街燈搖晃卻照不亮任何一扇門。",
        "我很絕望，所以哭了。",
        "今天天氣真好，陽光燦爛。",
        "絕望讓我覺得很絕望。",
      ],
      0
    ),
    tc(
      "zh_lit_h19",
      "intermediate",
      {
        hant: "「死得其所」與「馬革裹屍」的細微差別是？",
        en: "Fine distinction",
      },
      [
        "前者重價值與意義；後者重軍旅殉國的壯烈",
        "兩者完全相同",
        "前者只用於動物",
        "後者表示回家結婚",
      ],
      0
    ),
    tc(
      "zh_lit_h20",
      "intermediate",
      {
        hant: "「滄海桑田」與「白駒過隙」在時間維度上的不同是？",
        en: "Time dimension difference",
      },
      [
        "滄海桑田重世事的巨變；白駒過隙重光陰飛逝",
        "兩者都只看天氣",
        "白駒過隙指馬很老",
        "滄海桑田指海水很鹹",
      ],
      0
    ),
  ];

  global.RNFLiteracyBank = {
    BANK: BANK,
    VERSION: 1,
  };
})(window);
