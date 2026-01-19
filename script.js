
// ============ 1. Global Config ============
const CONFIG = {
    totalSteps: 10,
    storageKey: 'sleep_quiz_result'
};

let state = { currentStep: 0, answers: {}, answerData: {} };

// ============ 2. Quiz Data (10 Questions) ============
const QUIZ_QUESTIONS = [
    {
        id: 1, text: "这种睡不好的状态持续多久了？",
        options: [
            { text: "最近一两周", score: { type: 'stress', points: 1 } },
            { text: "1-3个月", score: { type: 'chronic', points: 2 } },
            { text: "3-6个月", score: { type: 'chronic', points: 3 } },
            { text: "半年以上", score: { type: 'trait', points: 5 } }
        ]
    },
    {
        id: 2, text: "它对白天影响最大的是？",
        options: [
            { text: "脑子不在线，就像内存溢出", score: { type: 'A', points: 1 } },
            { text: "情绪脆皮，很容易想哭或炸毛", score: { type: 'B', points: 1 } },
            { text: "身体沉重，像被抽干了电", score: { type: 'C', points: 1 } },
            { text: "分不清现实和梦境，经常走神", score: { type: 'D', points: 1 } },
            { text: "觉得世界很吵，只想一个人躲着", score: { type: 'E', points: 1 } }
        ]
    },
    {
        id: 3, text: "你的睡不好更像哪种典型模式？",
        options: [
            { text: "入睡困难，躺很久都睡不着", score: { type: 'A', points: 2 } },
            { text: "半夜醒，醒了难睡回去", score: { type: 'B', points: 2 } },
            { text: "早醒，醒来就立刻清醒", score: { type: 'C', points: 2 } },
            { text: "浅睡多梦，一晚上像演了场电影", score: { type: 'D', points: 2 } },
            { text: "单纯不困，越夜越精神", score: { type: 'E', points: 2 } }
        ]
    },
    {
        id: 4, text: "如果你会醒来，最常发生在？",
        options: [
            { text: "入睡前一小时内就开始翻来覆去", value: "start" },
            { text: "00:00-02:00", value: "00-02" },
            { text: "02:00-04:00", value: "02-04" },
            { text: "04:00-06:00", value: "04-06" },
            { text: "不固定，整夜都浅", value: "all" }
        ]
    },
    {
        id: 5, text: "睡不着时，大脑背景音更像哪种？",
        options: [
            { text: "反复想今天做错了什么", score: { type: 'A', points: 2 } },
            { text: "担心未来会发生坏事", score: { type: 'B', points: 2 } },
            { text: "说不清原因但就是不敢松懈", score: { type: 'C', points: 2 } },
            { text: "各种画面像弹幕一样停不下来", score: { type: 'D', points: 2 } },
            { text: "觉得当下的生活很无聊", score: { type: 'E', points: 2 } }
        ]
    },
    {
        id: 6, text: "日常感觉身体比较不舒服的地方？",
        options: [
            { text: "牙关咬紧 / 太阳穴发胀", score: { type: 'C', points: 1 }, bodyMean: "攻击性抑制" },
            { text: "偏头痛 / 头皮紧 / 眼压高", score: { type: 'A', points: 1 }, bodyMean: "思维过度监控" },
            { text: "肩颈沉重 / 上背部僵硬", score: { type: 'A', points: 1 }, bodyMean: "责任重担" },
            { text: "胸口闷堵 / 呼吸短浅", score: { type: 'B', points: 1 }, bodyMean: "悲伤冻结" },
            { text: "胃部翻腾 / 腹部不适", score: { type: 'C', points: 1 }, bodyMean: "情绪消化不良" },
            { text: "腰椎酸痛 / 骨盆发紧", score: { type: 'E', points: 1 }, bodyMean: "生存安全感缺失" },
            { text: "咽喉有异物感 (喉球症)", score: { type: 'E', points: 1 }, bodyMean: "自我表达受阻" },
            { text: "手脚冰凉 / 身体僵硬", score: { type: 'D', points: 1 }, bodyMean: "创伤性防御" }
        ]
    },
    {
        id: 7, text: "最容易触发你失眠的是？",
        options: [
            { text: "工作没做完，或者没做好", score: { type: 'A', points: 2 } },
            { text: "人际关系出了问题，心里堵", score: { type: 'B', points: 2 } },
            { text: "强迫自己“必须快点睡”的压力", score: { type: 'C', points: 2 } },
            { text: "突然冒出一个新想法/脑洞", score: { type: 'D', points: 2 } },
            { text: "对白天循规蹈矩生活的抗拒", score: { type: 'E', points: 2 } }
        ]
    },
    {
        id: 8, text: "阻碍你睡着的那个“最后念头”通常是？",
        options: [
            { text: "事情还没解决，觉得不能睡", score: { type: 'A', points: 2 } },
            { text: "想到明天太难了，不敢睡", score: { type: 'C', points: 2 } },
            { text: "觉得只有深夜的时间才真正属于我", score: { type: 'E', points: 3 } },
            { text: "潜意识里总觉得不安全", score: { type: 'B', points: 2 } },
            { text: "舍不得结束当下的灵感状态", score: { type: 'D', points: 2 } }
        ]
    },
    {
        id: 9, text: "你最想被安抚的方式是？",
        options: [
            { text: "给我一个拥抱，让我觉得我已经够好了", tag: "comfort" },
            { text: "给我一个明确方法，我照做就行", tag: "solution" },
            { text: "给我一个空间，让我把压着的东西吐出来", tag: "release" },
            { text: "给我一点安静，世界停 5 分钟就好", tag: "silence" }
        ]
    },
    {
        id: 10, text: "最像你的一句话是？",
        options: [
            { text: "我不是不困，是脑子还在模拟明天的战场", tag: "A" },
            { text: "我不是不想睡，是有一个我在监视自己睡着了没", tag: "C" },
            { text: "我不是醒了睡不回去，是被想法拖走了", tag: "A" },
            { text: "我不是浅睡，是身体始终紧绷着不敢放松", tag: "B" },
            { text: "我不是缺方法，是太久没被真正安顿过", tag: "Gen" }
        ]
    }
];

// ============ 3. V4 Long-Form Content Matrix ============
const COPY_LIBRARY = {
    // Identity Variables
    adjectives: {
        0: '超载的 (Overloaded)', 1: '易碎的 (Fragile)', 2: '电量耗尽的 (Exhausted)', 3: '游离的 (Dissociated)', 4: '独处的 (Solitary)'
    },
    talents: {
        'A': '谋略家 (The Strategist)', 'B': '共情者 (The Empath)', 'C': '执行者 (The Achiever)', 'D': '筑梦师 (The Creator)', 'E': '先驱者 (The Pioneer)'
    },

    // Chapter 1
    chapter1: {
        'A': '你拥有一颗令人艳羡的**“全景模拟大脑”**。在前额叶皮层，你拥有一种罕见的能力——能像下棋一样，在脑海里同时推演未来无数种可能的分支。在白天的职场或复杂决策中，你是那个总能看见风险、未雨绸缪的战略家。<br><br>但这种天赋是有代价的。你的大脑出厂设置里，缺少一个**“下班按钮”**。到了深夜，当四周安静下来，这台高性能计算机依然在空转。它开始把“明天早会要说什么”、“后天那个项目还没定”处理成最高级别的生存威胁。你睡不着，不是因为你不够放松，而是因为你的潜意识判定**“当下还不够安全”**，所以拒绝关机。',
        'B': '你拥有一副极其稀缺的**“高敏神经系统 (HSP)”**。你甚至能敏锐地感知到房间里气氛的微妙变化，或通过一个眼神读懂别人的潜台词。这种天赋让你成为人群中最好的倾听者和连接者。<br><br>但硬币的反面是，你就像一块**“情绪海绵”**，在白天无意识地吸附了太多不属于你的情绪微尘（同事的叹气、地铁上的焦虑、家人的脸色）。无论你自己是否意识到，这些他人的情绪都在占用你的系统内存。深夜的失眠，其实是你的神经系统在进行强制的**“排毒”**——那些白天没来得及消化的情绪垃圾，正在排队等待被看见。',
        'C': '你的大脑里住着一位**“绝对完美主义的教官”**。你之所以优秀，很大程度上归功于这个强大的“超我 (Super-Ego)”监控机制——它不断鞭策你更好、更快、更完美。<br><br>但在夜里，这位教官忘记了下班，他开始**监视你的睡眠**。对你来说，睡觉不再是一种休息，而是一项“必须完成的任务”。你可能经常会想：“如果今晚睡不够8小时，明天状态就会不好，项目就会搞砸”。这种**绩效考核心态**，直接锁死了负责放松的副交感神经。你越是想“完美地入睡”，就越是清醒。',
        'D': '你的大脑是一间**“24小时不打烊的灵感便利店”**。你的思维方式不是线性的，而是**“网状发散”**的。这让你在创意和解决问题上拥有惊人的天赋——你总能通过看似不相关的点找到连接。<br><br>常人可以逻辑化地切断思维（关灯=睡觉），但对你来说，黑夜是灵感的温床。那些白天被琐事和会议压抑的脑洞，一定要在深夜跳出来开狂欢节。你睡不着，是因为你的潜意识**“贪恋”**这种思维冲浪的快感。它怕你一睡着，那个绝妙的想法就消失了。与其说你失眠，不如说你是**舍不得结束**。',
        'E': '你其实只是拿错了地球的**“时区表”**。你的基因可能属于古老的**“暗夜狩猎者”**。研究显示，有一类人的体温节律和皮质醇峰值，天生就比社会时钟晚 2-4 小时。<br><br>在这个强制朝九晚五的世界里，你不是病了，你只是在**“长期倒时差”**。你的能量在深夜最纯粹，这本是一种天赋（众人都睡我独醒，此刻世界属于我），现在却被社会规则定义为一种“不正常”。你感到的疲惫，来源于每一天都在试图把一个圆形的自己，塞进方形的时间格子里。'
    },

    // Chapter 2
    chapter2: {
        'A': '让我们还原一下昨晚躺在床上时发生了什么：当你意识到“已经12点了还没有睡意”时，你的第一反应是**“解决它”**。你开始计算：“如果现在睡还能睡6小时...5小时...”。你强迫自己调整呼吸，或者命令自己“别想了”。<br><br>这就是你的思维死循环——**你试图用“控制”来解决一个必须“失去控制”才能发生的事情。** 睡眠是一种“投降”的艺术，而你习惯了“掌控”。你越是努力想睡着，你的交感神经就越兴奋（因为你在执行任务）。**是你试图解决失眠的努力，在维持着失眠。**',
        'B': '当你躺在黑暗中，电影开始了。你是不是经常会重演白天的对话：“我当时那样说是不是不太好？”、“他那个眼神是什么意思？”、“我是不是让他们失望了？”。<br><br>这是一种**“反刍” (Rumination)** 机制。你的潜意识在通过不断复盘来确认“我是安全的/被爱的”。但这种反刍恰恰让你处于持续的情感警报中。你试图在脑海里修补过去，却因此牺牲了此刻的安宁。**你太在意别人的感受，以至于忘记了你的身体正在无声地尖叫求救。**',
        'C': '你的死循环是典型的**“因果倒置的灾难化”**。你担心的根本不是“睡不着”这件事本身，而是“睡不着带来的后果”。<br><br>逻辑链是这样的：如果不睡 -> 明天会精神不好 -> 表现会差 -> 我会失败。于是，**你对“清醒”感到愤怒**。每一次看时间，都是对自己的一次审判。这种愤怒瞬间飙升了你的血压和心率，让你离睡眠越来越远。**是你对清醒的恐惧，让你更加清醒。**',
        'D': '你的误区在于混淆了**“休息”**和**“兴奋”**。当一个新想法冒出来时，你会感到一阵电流般的兴奋。你会立刻跟进它——查资料、写备忘录、或者在脑子里完善它。这种**多巴胺**的释放，让你误以为自己还不困。<br><br>你的惯性模式是：灵感出现 -> 追逐灵感 -> 大脑激活 -> 更加兴奋。直到身体彻底透支，你才会像断电一样昏睡过去。你一直在**透支未来的能量**来支付今晚的灵感账单。',
        'E': '你最大的死循环是**“报复性主权夺回”**。白天的时间属于工作、属于老板、属于家庭，只有深夜的时间才真正**“属于我自己”**。<br><br>你的潜意识逻辑是：“如果我现在睡了，我的一天就彻底只剩下为了别人而活了。”所以你哪怕刷着无聊的视频，也不愿意闭眼。**你不是不想睡，你是“不敢睡”。** 你在用消耗身体的方式，喂养灵魂的自由。这是一种悲壮的抵抗，但这换来的自由太昂贵了。'
    },

    // Chapter 3 Intro
    chapter3_intro: {
        'A': '你的身体比你的大脑更诚实。作为一名谋略家，你的身体不仅是行动的容器，更是**压力的储藏室**。',
        'B': '共情者的身体往往承载了太多**未被表达的情绪**。那些你吞下去的委屈，身体都记得。',
        'C': '为了维持完美的外在表现，你的身体内部时刻处于**战备状态**。',
        'D': '由于思维飞跃太快，你的身体往往跟不上大脑的速度，处于一种**分离的焦躁**中。',
        'E': '由于长期对抗生物钟，你的身体处于一种深层的**生存焦虑**之中。'
    },

    // Energy Leaks
    energy_leaks: {
        0: '数据显示，你最大的能量泄漏点在于**“未完成事件 (Unfinished Business)”**。任何一件没有闭环的小事，都会在你的后台持续消耗运存。',
        1: '你正在经历**“预支性焦虑”**。你在为了“明天可能会累”这件事，提前预支了今天的焦虑能量。',
        2: '你的内耗源于**“主权争夺战”**。你在用牺牲睡眠的方式，向生活夺回属于你的时间。',
        3: '你的能量泄漏点是**“安全感黑洞”**。你的潜意识雷达始终开着，在深度放松和保持警惕之间，本能选择了后者。',
        4: '你最大的消耗是对**“高心流体验的留恋”**。你舍不得结束思维的冲浪，导致入睡变成了一种痛苦的“中断”。'
    },

    // Body Map
    body_map: [
        "**牙关紧咬**: 这是攻击性的内转。你在潜意识里是否正在对某件事通过“咬牙切齿”来维持忍耐？",
        "**头部紧箍**: 这是思维过载的物理信号。你试图用逻辑思维去“控制”本该流动的感受。",
        "**肩颈沉重**: 这是“责任感”的具象化。你不仅在扛自己的生活，还在无意识地扛别人的重担。",
        "**胸口闷堵**: 这是“情感冻结”的信号。悲伤或委屈被锁在了心轮的位置，没能自然流转。",
        "**胃部翻腾**: 胃是情绪的第二大脑。它在替你消化那些难以下咽的焦虑和现实冲突。",
        "**腰椎酸痛**: 腰部代表深层支撑。这通过暗示你感到当下孤立无援，缺乏安全感。",
        "**喉咙异物**: 典型的“梅核气”症状。代表着“表达受阻”——有什么话卡在喉咙口，吞不下也吐不出。",
        "**手脚冰凉**: 这是生物性的“冻结反应”。压力大到让你的神经系统选择“装死”来保护核心器官。"
    ],

    // Chapter 4 Intro
    chapter4_intro: {
        'A': '针对你的控制型大脑，我们不再建议你简单的“放松”，这没用。你需要的是一套能让大脑**“确认安全”**的战略流程。',
        'B': '对于高敏体质，最核心的策略不是强迫入睡，而是建立**“心理结界”**，将他人的情绪隔绝在外。',
        'C': '对于完美主义者，修复的关键在于**“降低预期”**。我们需要打破“必须睡好”这个执念链条。',
        'D': '你需要的是**“物理打断”**。不仅仅是心理上的暗示，更需要通过具体的物理动作来切断灵感回路。',
        'E': '你需要停止自我攻击。既然是暗夜猎人，就不要把夜晚当成敌人，而是把他变成**“高质量的独处”**。'
    },

    actions: {
        mind: {
            'A': '【烦恼归档术】<br>睡前1小时，拿出一张纸，把脑子里所有担心的事情列下来。然后在旁边写上具体的“计划处理时间”（例如：明早10点）。写完后，合上本子，**物理离手**。告诉大脑：“档案已保存，且已排期。现在这一刻，没有任何需要处理的威胁。”',
            'B': '【情绪隔离罩】<br>想象一个透明的、坚固的玻璃罩从头顶降下，将你完全罩住。在这个罩子里，你是绝对安全的。任何人的情绪（老板的、伴侣的）都只能撞在玻璃上滑落，无法渗透进来。在这个空间里，只允许你自己的感受存在。',
            'C': '【60分咒语】<br>对自己说一句咒语：“今晚就算只睡着3个小时也是可以的，躺着就是休息。”这听起来很消极，但它能瞬间切断“必须完美”的压力链条。一旦你允许自己睡不好，睡眠反而会自然发生。',
            'D': '【灵感物理封印】<br>在床头伸手可及的地方放一本“灵感本”。有想法冒出来时，不要在脑子里盘，立刻开灯记下来，然后合上本子。这动作代表**“物理存档”**。告诉大脑：“想法已经存好了，不会丢，现在可以关机了。”',
            'E': '【黑暗沐浴】<br>关掉所有发光的屏幕。在黑暗中睁着眼睛，把这当成一种享受。告诉自己：“这5分钟的黑暗，是我从世界手里抢回来的战利品。”享受这种不需要回应任何人、不需要处理任何信息的绝对自由。'
        },
        body: {
            'head': '【狮子式哈气】<br>躺在床上，张大嘴到极限，伸出舌头，用力呼出一口气，发出“哈——”的声音。这个动作能强制松开你紧锁的咬合肌，并刺激迷走神经，向身体发送“安全”信号。',
            'shoulder': '【重力投降】<br>用力吸气并耸肩找耳朵，保持3秒。然后呼气时，想象全身骨头突然消失，肩膀瞬间**“砸”**向床面。重复3次。把承载的重担全部交给床垫去托举。',
            'chest': '【叹气清理】<br>把手放在胸口，允许自己发出一声长长的、带声音的叹气。想象呼出的是体内积压已久的灰色烟雾。每一次呼气，胸廓的空间就打开一点点。',
            'stomach': '【腹式扫描】<br>将双手手掌搓热，轻轻捂在肚脐处。顺时针缓慢按摩36下。把所有的注意力只集中在手心传来的那一点点热度上。这是让血液从大脑回流到内脏的最快方式。'
        },
        soul: {
            0: '【重力拥抱】<br>用被子把自己裹紧，或者紧紧抱住一个结实的抱枕。想象这是一个巨大的、无条件的拥抱。对自己轻声说：“你已经做得很好了，今天辛苦了。”',
            1: '【清空回车键】<br>结合Mind步骤，在做完归档后，做一个具象化的“按下回车”手势（或并在空中画个勾）。这是给大脑的终极指令：今日程序已结案，系统休眠。',
            2: '【情绪释放】<br>不用强迫自己平静。如果想哭，就流几滴泪；如果想发泄，就对着枕头锤几下。把压抑的塞子拔掉，情绪流走了，睡眠才能进来。',
            3: '【静止五分钟】<br>给自己5分钟的“绝对静止期”。什么都不做，什么都不想，也不用试图入睡。只是单纯地“存在”在黑暗中。这是对你最大的滋养。'
        }
    }
};

// ============ 4. Helper Functions ============
function saveToStorage(d) { localStorage.setItem(CONFIG.storageKey, JSON.stringify(d)); }
function getFromStorage() { const d = localStorage.getItem(CONFIG.storageKey); return d ? JSON.parse(d) : null; }

// Adjusted Parser for Aurora Highlights (Color matches the section)
function parseMarkdown(t, colorClass = "text-indigo-300") {
    return t ? t.replace(/\*\*(.*?)\*\*/g, `<span class="${colorClass} font-bold">$1</span>`).replace(/【(.*?)】/g, `<span class="${colorClass} font-bold">$1</span>`) : '';
}

function classifyType(answers) {
    let scores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    Object.keys(answers).forEach(qid => {
        const val = answers[qid];
        if (Array.isArray(val)) {
            val.forEach(idx => {
                const q = QUIZ_QUESTIONS.find(q => q.id == qid);
                if (q && q.options[idx]?.score?.type) scores[q.options[idx].score.type] += (q.options[idx].score.points || 0);
            });
        } else {
            const q = QUIZ_QUESTIONS.find(q => q.id == qid);
            if (q && q.options[val]?.score?.type) scores[q.options[val].score.type] += (q.options[val].score.points || 0);
            if (q && q.options[val]?.tag) { const map = { 'A': 'A', 'B': 'B', 'C': 'C', 'Gen': 'E' }; if (map[q.options[val].tag]) scores[map[q.options[val].tag]] += 1; }
        }
    });
    let max = -1, winner = 'B';
    ['A', 'B', 'C', 'D', 'E'].forEach(t => { if (scores[t] > max) { max = scores[t]; winner = t; } });
    return { type: winner, scores: scores };
}

// ============ 5. V4.5 Electric Aurora Narrative Engine ============
function generateNarrative(answers, type) {
    try {
        // ---- 1. Data Extract ----
        const q4Val = answers[4] !== undefined ? answers[4] : 0;
        const q6Val = answers[6]; // Body
        const q8 = answers[8] || 0; // Leak
        const q9 = answers[9] || 0; // Soul
        const q10 = answers[10] || 0; // Gold

        // ---- 2. Content Select ----
        const goldenSentence = (QUIZ_QUESTIONS.find(q => q.id === 10)?.options[q10]?.text) || "";

        // Chapters (Safe Access)
        const getLib = (lib, key) => (lib && lib[key]) ? lib[key] : "Thinking...";

        const ch1Text = getLib(COPY_LIBRARY.chapter1, type);
        const ch2Text = getLib(COPY_LIBRARY.chapter2, type);
        const ch3Intro = getLib(COPY_LIBRARY.chapter3_intro, type);
        const ch4Intro = getLib(COPY_LIBRARY.chapter4_intro, type);

        const energyLeak = COPY_LIBRARY.energy_leaks[q8] || COPY_LIBRARY.energy_leaks[0];

        // Chapter 3: Body Audit Logic
        let bodyHtmlSection = '';
        let bodyActionKey = 'stomach'; // Default

        if (q6Val !== undefined) {
            const indices = Array.isArray(q6Val) ? q6Val : [q6Val];
            if ([0, 1].includes(indices[0])) bodyActionKey = 'head';
            else if (indices[0] === 2) bodyActionKey = 'shoulder';
            else if (indices[0] === 3) bodyActionKey = 'chest';

            // Use Teal/Cyan for Body Section
            const bodyPartsList = indices.map(i => COPY_LIBRARY.body_map[i]).filter(t => t);
            if (bodyPartsList.length > 0) {
                // Teal Border
                const bodyPartsText = bodyPartsList.map(part => `<div class="p-3 bg-white/5 rounded border-l-2 border-teal-400/50 text-[14px] text-white/80 leading-relaxed">${parseMarkdown(part, "text-teal-300")}</div>`).join('');
                if (bodyPartsText) {
                    bodyHtmlSection = `
                        <div class="mt-4 pt-4 border-t border-white/5">
                            <h4 class="text-xs text-teal-300/60 uppercase tracking-widest mb-3">BODY SIGNALS (躯体信号)</h4>
                            <div class="space-y-2">
                                ${bodyPartsText}
                            </div>
                        </div>
                    `;
                }
            }
        }

        // Chapter 4: Action Protocol Logic
        const mindAction = COPY_LIBRARY.actions.mind[type] || "Loading Strategy...";
        const bodyAction = COPY_LIBRARY.actions.body[bodyActionKey] || "Loading Strategy...";
        const soulAction = COPY_LIBRARY.actions.soul[q9] !== undefined ? COPY_LIBRARY.actions.soul[q9] : COPY_LIBRARY.actions.soul[0];

        // ---- 3. Render HTML (V4.5 ELECTRIC AURORA Style) ----
        return `
            <div class="animate-fade-in space-y-8 pb-12">
                
                <!-- CHAPTER 1: SLEEP TRAITS (Deep Indigo) -->
                <section class="p-6 rounded-2xl bg-white/5 border border-indigo-500/20 backdrop-blur-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-[10px] font-bold px-2 py-1 rounded tracking-widest border border-indigo-400/30 text-indigo-300">01</span>
                        <h3 class="text-lg font-serif text-white/95 tracking-wide">睡眠特质 (Sleep Traits)</h3>
                    </div>
                    <div class="text-[15px] leading-loose text-white/80 font-light text-justify">
                        <p>${parseMarkdown(ch1Text, "text-indigo-300")}</p>
                    </div>
                </section>

                <!-- CHAPTER 2: INERTIA PATTERNS (Mystic Violet) -->
                <section class="p-6 rounded-2xl bg-white/5 border border-violet-500/20 backdrop-blur-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-[10px] font-bold px-2 py-1 rounded tracking-widest border border-violet-400/30 text-violet-300">02</span>
                        <h3 class="text-lg font-serif text-white/95 tracking-wide">惯性模式 (Inertia Patterns)</h3>
                    </div>
                    <div class="text-[15px] leading-loose text-white/80 font-light text-justify">
                        <p>${parseMarkdown(ch2Text, "text-violet-300")}</p>
                    </div>
                </section>

                <!-- CHAPTER 3: BODY SIGNALS (Healing Teal/Cyan) -->
                <section class="p-6 rounded-2xl bg-white/5 border border-teal-500/20 backdrop-blur-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-[10px] font-bold px-2 py-1 rounded tracking-widest border border-teal-400/30 text-teal-300">03</span>
                        <h3 class="text-lg font-serif text-white/95 tracking-wide">身心信号 (Body Signals)</h3>
                    </div>
                    
                    <div class="space-y-4">
                        <p class="text-[15px] leading-relaxed text-white/60 italic">
                            “${ch3Intro}”
                        </p>

                        <div class="p-4 bg-white/5 rounded-lg border border-white/5">
                            <h4 class="text-xs text-teal-300/60 uppercase tracking-widest mb-2">ENERGY LEAK (能量泄漏)</h4>
                            <p class="text-[15px] leading-relaxed text-teal-100/90">${parseMarkdown(energyLeak, "text-teal-300")}</p>
                        </div>

                        ${bodyHtmlSection}
                    </div>
                </section>

                <!-- CHAPTER 4: STRATEGIC SUGGESTIONS (Electric White/Blue) -->
                <section class="p-6 rounded-2xl bg-white/5 border border-blue-400/20 backdrop-blur-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-[10px] font-bold px-2 py-1 rounded tracking-widest border border-blue-400/30 text-blue-300">04</span>
                        <h3 class="text-lg font-serif text-white/95 tracking-wide">策略建议 (Strategic Suggestions)</h3>
                    </div>

                    <p class="text-[14px] text-white/50 mb-6 leading-relaxed">
                        ${ch4Intro}
                    </p>

                    <div class="space-y-4">
                        <!-- Step 1: Mind -->
                        <div class="bg-[#1A1830]/50 p-5 rounded-xl border border-white/5">
                            <span class="text-xs text-indigo-400 font-bold tracking-wider block mb-2">MIND (认知策略)</span>
                            <div class="text-[15px] text-white/90 leading-relaxed">${parseMarkdown(mindAction, "text-indigo-300")}</div>
                        </div>

                        <!-- Step 2: Body -->
                        <div class="bg-[#1A1830]/50 p-5 rounded-xl border border-white/5">
                            <span class="text-xs text-teal-400 font-bold tracking-wider block mb-2">BODY (躯体策略)</span>
                            <div class="text-[15px] text-white/90 leading-relaxed">${parseMarkdown(bodyAction, "text-teal-300")}</div>
                        </div>

                        <!-- Step 3: Soul -->
                        <div class="bg-[#1A1830]/50 p-5 rounded-xl border border-white/5">
                            <span class="text-xs text-violet-400 font-bold tracking-wider block mb-2">SOUL (仪式策略)</span>
                            <div class="text-[15px] text-white/90 leading-relaxed">${parseMarkdown(soulAction, "text-violet-300")}</div>
                        </div>
                    </div>
                </section>

            </div>
        `;
    } catch (e) {
        console.error("Narrative Gen Error:", e);
        return `<div class="p-4 bg-red-900/50 text-white rounded">生成报告时发生错误: ${e.message}。请尝试清除缓存或重新测试。</div>`;
    }
}

function renderRadar(scores) {
    const ctx = document.getElementById('energyRadar');
    if (!ctx) return;
    if (window.myRadarChart) window.myRadarChart.destroy();
    const dataValues = [scores.A, scores.B, scores.C, scores.D, scores.E];
    window.myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['谋略', '共情', '执行', '创造', '开拓'],
            datasets: [{
                // Cyan/Blue Radar
                label: 'Energy', data: dataValues, backgroundColor: 'rgba(34, 211, 238, 0.15)', borderColor: '#22D3EE', pointBackgroundColor: '#E0F2FE', pointBorderColor: '#22D3EE', borderWidth: 2
            }]
        },
        options: {
            scales: { r: { angleLines: { color: 'rgba(255, 255, 255, 0.05)' }, grid: { color: 'rgba(255, 255, 255, 0.05)' }, pointLabels: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10, family: 'sans-serif' } }, ticks: { display: false }, suggestedMin: 0, suggestedMax: 6 } },
            plugins: { legend: { display: false } }, maintainAspectRatio: false
        }
    });
}

// ============ 6. Modal Logic ============
window.openQrModal = function () {
    const m = document.getElementById('qr-modal');
    const Card = m.querySelector('div.relative'); // The card itself
    if (m) {
        m.classList.remove('opacity-0', 'pointer-events-none');
        Card.classList.remove('scale-95');
        Card.classList.add('scale-100');
    }
}

window.closeQrModal = function () {
    const m = document.getElementById('qr-modal');
    const Card = m.querySelector('div.relative');
    if (m) {
        m.classList.add('opacity-0', 'pointer-events-none');
        Card.classList.remove('scale-100');
        Card.classList.add('scale-95');
    }
}

function initResultPage() {
    console.log("Init Result Page");

    // Bind Modal Event
    const btn = document.getElementById('consult-btn');
    if (btn) btn.addEventListener('click', window.openQrModal);

    const stored = getFromStorage();
    // Default mock data if empty
    const data = stored || { userType: 'A', answers: { 2: 2, 3: 0, 4: 1, 6: [0], 8: 0, 9: 0, 10: 0 } };
    console.log("Result Data:", data);

    const userTypeStr = typeof data.userType === 'object' ? data.userType.type : data.userType;
    const scores = typeof data.userType === 'object' ? data.userType.scores : { A: 5, B: 4, C: 3, D: 2, E: 1 };
    const answers = data.answers || {};

    // 1. Identity Title (ELECTRIC CYAN STYLE)
    const q2 = answers[2] || 0;
    const adjKey = COPY_LIBRARY.adjectives[q2] ? COPY_LIBRARY.adjectives[q2].split(' ')[0] : '疲惫的';
    const typeKey = COPY_LIBRARY.talents[userTypeStr].split(' ')[0];
    const identity = `${adjKey}${typeKey}`;

    const titleEl = document.getElementById('result-title');
    if (titleEl) {
        titleEl.textContent = identity;
        // Electric Cyan + Drop Shadow
        titleEl.className = "text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-white drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] tracking-wide uppercase";
    }

    const subEl = document.getElementById('talent-title');
    if (subEl) {
        const enTitle = COPY_LIBRARY.talents[userTypeStr].match(/\((.*?)\)/);
        subEl.textContent = enTitle ? enTitle[1].toUpperCase() : "THE STRATEGIST";
        subEl.className = "text-xs font-bold tracking-[0.3em] text-white/40 uppercase mb-2";
    }

    // 2. Radar
    renderRadar(scores);

    // 3. Narrative Generation
    const q10 = answers[10] || 0;
    const goldenText = QUIZ_QUESTIONS.find(q => q.id === 10)?.options[q10]?.text || "...";

    const analysisEl = document.getElementById('analysis-text');
    if (analysisEl) {
        const content = generateNarrative(answers, userTypeStr);
        // Violet/Blue Aurora Header
        let headerHtml = `
            <div class="relative py-8 mb-8 border-b border-white/5">
                <div class="absolute -left-2 -top-2 text-6xl text-cyan-500/10 font-serif font-black">“</div>
                <h2 class="text-xl md:text-2xl font-serif text-blue-100/95 leading-relaxed pl-6 italic relative z-10">
                    ${goldenText}
                </h2>
            </div>
        `;
        analysisEl.innerHTML = headerHtml + content;
    }
}

function init() {
    const p = window.location.pathname;
    if (p.includes('quiz')) {
        // initQuizPage is in quiz.js, checking if we need to polyfill or wait
        // quiz.js handles itself.
    } else if (p.includes('result')) {
        initResultPage();
    }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
window.SleepDecode = { CONFIG, QUIZ_QUESTIONS, initResultPage, saveToStorage, classifyType, showTransition: () => { }, hideTransition: () => { }, navigateTo: (u) => window.location.href = u };
