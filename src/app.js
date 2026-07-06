const STORAGE_KEY = 'focusStudio810.v2';
const PIN_DEFAULT = '2580';

const MODULES = {
  reading: { id: 'reading', name: '阅读专注', icon: '📖', ability: '持续阅读 / 信息提取', color: 'blue' },
  instruction: { id: 'instruction', name: '听指令', icon: '🎧', ability: '多步骤记忆 / 顺序执行', color: 'purple' },
  errorCheck: { id: 'errorCheck', name: '错误检查', icon: '🔎', ability: '细节检查 / 不急着交', color: 'green' },
  planning: { id: 'planning', name: '任务计划', icon: '🧭', ability: '任务拆解 / 优先级', color: 'orange' },
  quiet: { id: 'quiet', name: '安静完成', icon: '⏳', ability: '真实任务坚持 / 分心觉察', color: 'blue' },
  return: { id: 'return', name: '分心回归', icon: '↩️', ability: '抗干扰 / 回到任务', color: 'purple' }
};

const ABILITY_LABELS = {
  reading: '阅读专注',
  instruction: '听指令',
  errorCheck: '错误检查',
  planning: '任务计划',
  quiet: '安静完成',
  return: '分心回归'
};

const DATA = {
  reading: [
    {
      level: 1,
      title: '图书馆的安静角落',
      passage: '周六上午，米娅和爸爸去了图书馆。她原本想找一本漫画书，但看到儿童区有一个“安静阅读挑战”。规则是：先选一本书，安静读十分钟，再写下三个关键词。米娅选了一本关于海豚的书。她发现海豚会用声音互相联系，也会合作寻找食物。十分钟后，她写下了“声音、合作、海洋”三个词。爸爸没有催她，只是在旁边安静地看自己的书。',
      questions: [
        { q: '米娅周六上午去了哪里？', options: ['公园', '图书馆', '游泳馆', '超市'], answer: 1 },
        { q: '安静阅读挑战要求先做什么？', options: ['写关键词', '选一本书', '回答问题', '借书回家'], answer: 1 },
        { q: '米娅读的书主要关于什么？', options: ['海豚', '企鹅', '飞机', '花园'], answer: 0 },
        { q: '下面哪一个词不是米娅写下的关键词？', options: ['声音', '合作', '森林', '海洋'], answer: 2 }
      ]
    },
    {
      level: 2,
      title: '忘记带尺子的数学课',
      passage: '数学课上，老师让大家画一个长方形，并测量它的长和宽。艾拉打开文具盒，发现自己忘记带尺子了。她先想向同桌借，但同桌正在测量自己的图形。于是她举手告诉老师。老师说：“你可以先用方格纸估算长度，等同桌用完尺子再准确测量。”艾拉照做了。下课前，她把估算结果和准确结果都写在了本子上，还在旁边写了一句提醒：明天检查文具盒。',
      questions: [
        { q: '艾拉忘记带了什么？', options: ['铅笔', '尺子', '橡皮', '作业本'], answer: 1 },
        { q: '老师建议她先做什么？', options: ['直接放弃', '用方格纸估算', '向全班借尺子', '改画圆形'], answer: 1 },
        { q: '艾拉最后写下了什么提醒？', options: ['早点睡觉', '检查文具盒', '复习英语', '带运动鞋'], answer: 1 },
        { q: '这个故事最能说明艾拉做到了什么？', options: ['遇到问题时想办法继续任务', '数学一定比语文简单', '同桌不愿意帮助她', '老师让她不用完成作业'], answer: 0 }
      ]
    },
    {
      level: 3,
      title: '科学小组的植物观察',
      passage: '科学小组要连续五天观察豆芽的变化。第一天，老师把同样数量的豆子分给三组：一组放在窗边，一组放在抽屉里，一组每天只浇很少的水。小林负责记录时间，小雅负责画图，小哲负责测量高度。第三天，窗边的豆芽长得最快，抽屉里的豆芽颜色偏黄，少水组的豆芽最短。小林差点把第三天写成第二天，小雅提醒他先看日期再记录。最后，小组决定第五天再比较三组数据，而不是只看第三天的结果。',
      questions: [
        { q: '科学小组一共要观察几天？', options: ['三天', '四天', '五天', '七天'], answer: 2 },
        { q: '谁负责测量高度？', options: ['小林', '小雅', '小哲', '老师'], answer: 2 },
        { q: '第三天哪一组豆芽长得最快？', options: ['窗边组', '抽屉组', '少水组', '三组一样快'], answer: 0 },
        { q: '小雅提醒小林做什么？', options: ['先浇水', '先看日期再记录', '先画图', '先比较第五天结果'], answer: 1 },
        { q: '为什么小组没有只看第三天结果？', options: ['因为第三天没有数据', '因为要连续观察后再比较', '因为老师不让记录', '因为豆芽都死了'], answer: 1 }
      ]
    },
    {
      level: 4,
      title: '校报采访计划',
      passage: '三年级校报要采访学校的园艺老师。采访前，编辑小组列了四个问题：一，花园里最难照顾的植物是什么；二，学生可以怎样帮忙；三，春天和秋天的工作有什么不同；四，如果只有十分钟，应该先做哪件事。出发前，阿诺把问题顺序抄错了，把第四个问题放到了第二个。采访时，他发现园艺老师先回答了“学生可以怎样帮忙”，于是他在记录纸上做了一个箭头，把答案对应回原来的问题。采访结束后，小组检查记录，发现有一个问题还没有问，于是礼貌地补问了一次。',
      questions: [
        { q: '采访对象是谁？', options: ['校长', '园艺老师', '体育老师', '图书管理员'], answer: 1 },
        { q: '阿诺抄错了什么？', options: ['采访时间', '问题顺序', '老师名字', '校报名'], answer: 1 },
        { q: '阿诺用什么方法把答案对应回原来的问题？', options: ['画箭头', '擦掉重写', '重新采访', '让别人记录'], answer: 0 },
        { q: '小组发现有一个问题没问后做了什么？', options: ['直接放弃', '礼貌地补问', '责怪阿诺', '改写答案'], answer: 1 },
        { q: '这段文字重点训练哪种学习习惯？', options: ['记录后检查是否完整', '写字越快越好', '只问最简单的问题', '采访时不用准备'], answer: 0 }
      ]
    },
    {
      level: 5,
      title: '两份不同的天气报告',
      passage: '老师给全班看了两份天气报告。第一份说周五上午可能下小雨，下午转阴，风力较小。第二份说周五全天多云，但傍晚可能有阵雨。贝拉马上说：“那我们一定不能去郊游。”老师提醒大家，报告里没有说全天大雨，也没有说活动必须取消。小组开始整理信息：两份报告都提到周五不会一直下大雨；一份提到上午小雨，另一份提到傍晚阵雨；两份都没有提到雷暴。最后，他们建议带雨衣，把户外观察安排在中午或下午早些时候，并准备一个室内备用活动。',
      questions: [
        { q: '第一份天气报告说周五上午可能怎样？', options: ['下小雨', '大雪', '雷暴', '晴天'], answer: 0 },
        { q: '第二份天气报告提到什么时候可能有阵雨？', options: ['清晨', '傍晚', '中午', '深夜'], answer: 1 },
        { q: '两份报告都没有提到什么？', options: ['云', '雨', '雷暴', '风'], answer: 2 },
        { q: '小组最后没有建议哪一项？', options: ['带雨衣', '安排室内备用活动', '把观察放在中午或下午早些时候', '直接取消所有活动'], answer: 3 },
        { q: '贝拉一开始的判断有什么问题？', options: ['她把可能下雨理解成一定不能活动', '她没有听到周五这个词', '她把小雨说成了大雪', '她忘记带雨衣'], answer: 0 }
      ]
    }
  ],
  instruction: [
    {
      level: 1,
      title: '整理学习桌',
      instruction: '请按顺序点击：铅笔盒 → 作业本 → 台灯。不要点击玩具熊。',
      steps: ['铅笔盒', '作业本', '台灯'],
      avoid: ['玩具熊'],
      items: ['玩具熊', '作业本', '水杯', '铅笔盒', '台灯', '贴纸']
    },
    {
      level: 2,
      title: '准备阅读任务',
      instruction: '请先点击蓝色书签，再点击故事书，然后点击计时器。不要点击漫画书。',
      steps: ['蓝色书签', '故事书', '计时器'],
      avoid: ['漫画书'],
      items: ['故事书', '漫画书', '蓝色书签', '彩笔', '计时器', '橡皮']
    },
    {
      level: 3,
      title: '检查作业包',
      instruction: '请按顺序点击：数学本 → 红色文件夹 → 水杯 → 完成卡。不要点击游戏卡。',
      steps: ['数学本', '红色文件夹', '水杯', '完成卡'],
      avoid: ['游戏卡'],
      items: ['水杯', '游戏卡', '完成卡', '红色文件夹', '数学本', '贴纸', '故事卡']
    },
    {
      level: 4,
      title: '实验前准备',
      instruction: '请先点击观察表，再点击放大镜，然后点击绿色铅笔，最后点击记录夹。看到零食不要点。',
      steps: ['观察表', '放大镜', '绿色铅笔', '记录夹'],
      avoid: ['零食'],
      items: ['记录夹', '零食', '观察表', '蓝色铅笔', '放大镜', '绿色铅笔', '玩具车', '尺子']
    },
    {
      level: 5,
      title: '复杂课堂指令',
      instruction: '请按顺序完成：黄色便签 → 第二张卡片 → 资料袋 → 检查按钮 → 完成卡。不要点击第一张卡片，也不要点击星星奖励。',
      steps: ['黄色便签', '第二张卡片', '资料袋', '检查按钮', '完成卡'],
      avoid: ['第一张卡片', '星星奖励'],
      items: ['星星奖励', '资料袋', '第二张卡片', '黄色便签', '完成卡', '第一张卡片', '检查按钮', '橙色便签']
    }
  ],
  errorCheck: [
    {
      level: 1,
      title: '数学小检查',
      lines: ['3 + 4 = 7', '5 + 2 = 8', '9 - 3 = 6', '6 + 1 = 7'],
      wrong: [1],
      explain: '5 + 2 应该等于 7，不是 8。'
    },
    {
      level: 2,
      title: '文字和常识检查',
      lines: ['小鸟在天空中飞。', '鱼在树上游来游去。', '我写完作业后检查了一遍。', '太阳通常从东方升起。'],
      wrong: [1],
      explain: '鱼通常在水里游，不是在树上。'
    },
    {
      level: 3,
      title: '混合检查',
      lines: ['12 - 5 = 7', '4 × 3 = 11', '周一之后是周二。', '“因为下雨，所以地面可能会湿。”这句话合理。', '8 + 6 = 14'],
      wrong: [1],
      explain: '4 × 3 应该等于 12。'
    },
    {
      level: 4,
      title: '细节检查',
      lines: ['计划写着：先阅读，再做题，最后检查。', '小南先做题，再阅读，最后检查。', '15 + 9 = 24', '文章说小狗是黑色的，答案写“小狗是白色的”。', '7 × 4 = 28'],
      wrong: [1, 3],
      explain: '第二行顺序不符合计划；第四行颜色信息不一致。'
    },
    {
      level: 5,
      title: '隐蔽错误检查',
      lines: ['说明：只圈出偶数。答案圈了 2、4、6、9。', '18 ÷ 3 = 6', '故事中说莉莉先借书再回家。答案写：莉莉回家后借书。', '“如果今天是星期三，后天是星期五。”', '说明：选择两个原因。答案只选择了一个原因。'],
      wrong: [0, 2, 4],
      explain: '9不是偶数；顺序被写反；要求两个原因但只选了一个。'
    }
  ],
  planning: [
    {
      level: 1,
      title: '准备明天上学',
      scenario: '明天正常上学，需要准备书包。请选择需要的物品，并安排一个合理顺序。',
      items: ['语文书', '数学书', '作业本', '铅笔盒', '水杯', '玩具车', '漫画书'],
      needed: ['语文书', '数学书', '作业本', '铅笔盒', '水杯'],
      order: ['作业本', '语文书', '数学书', '铅笔盒', '水杯']
    },
    {
      level: 2,
      title: '完成阅读作业',
      scenario: '今天要完成一篇阅读作业。请选择需要的东西，并按步骤计划。',
      items: ['阅读文章', '铅笔', '计时器', '答案纸', '检查清单', '跳绳', '贴纸'],
      needed: ['阅读文章', '铅笔', '计时器', '答案纸', '检查清单'],
      order: ['计时器', '阅读文章', '铅笔', '答案纸', '检查清单']
    },
    {
      level: 3,
      title: '整理书桌',
      scenario: '书桌很乱，要在十分钟内整理好。哪些应该留下，哪些应该收走？先做什么？',
      items: ['正在做的作业', '铅笔盒', '水杯', '零食袋', '玩具', '废纸', '台灯', '检查清单'],
      needed: ['正在做的作业', '铅笔盒', '水杯', '台灯', '检查清单'],
      order: ['废纸', '零食袋', '玩具', '正在做的作业', '检查清单']
    },
    {
      level: 4,
      title: '科学观察任务',
      scenario: '要观察一盆植物并写下记录。请选择工具，并安排步骤。',
      items: ['观察表', '铅笔', '尺子', '相机', '水壶', '故事书', '玩具熊', '橡皮'],
      needed: ['观察表', '铅笔', '尺子', '相机', '水壶'],
      order: ['观察表', '尺子', '相机', '铅笔', '水壶']
    },
    {
      level: 5,
      title: '周末项目计划',
      scenario: '周末要做一个小海报项目：查资料、写要点、画图、检查。请选择需要的材料，并排序。',
      items: ['资料卡', '草稿纸', '彩笔', '胶棒', '检查清单', '计时器', '游戏机', '零食', '海报纸'],
      needed: ['资料卡', '草稿纸', '彩笔', '胶棒', '检查清单', '计时器', '海报纸'],
      order: ['计时器', '资料卡', '草稿纸', '海报纸', '彩笔', '胶棒', '检查清单']
    }
  ],
  return: [
    {
      level: 1,
      title: '回到阅读任务',
      rule: '只选择和“阅读任务”有关的卡片。看到无关弹窗，不要点它。',
      cards: ['故事书', '书签', '答案纸', '玩具车', '糖果', '阅读计时器'],
      targets: ['故事书', '书签', '答案纸', '阅读计时器'],
      distractors: ['点我换皮肤', '这里有小游戏', '马上领奖励']
    },
    {
      level: 2,
      title: '回到作业任务',
      rule: '只选择能帮助完成作业的卡片，忽略让你离开任务的按钮。',
      cards: ['作业本', '铅笔', '橡皮', '检查清单', '动画视频', '贴纸商店', '水杯'],
      targets: ['作业本', '铅笔', '橡皮', '检查清单'],
      distractors: ['先看动画', '点这里休息', '打开贴纸商店']
    },
    {
      level: 3,
      title: '回到检查任务',
      rule: '只选择和“检查答案”有关的卡片。弹窗出现时，先深呼吸，再继续任务。',
      cards: ['重新读题', '核对计算', '检查单位', '画画', '游戏邀请', '提交按钮', '看窗外'],
      targets: ['重新读题', '核对计算', '检查单位', '提交按钮'],
      distractors: ['新消息来了', '点我看故事', '换背景颜色']
    },
    {
      level: 4,
      title: '保持项目任务',
      rule: '任务是完成海报项目。只选择项目相关步骤，忽略所有额外吸引物。',
      cards: ['查资料', '写要点', '画标题', '贴图片', '检查拼写', '看短视频', '打开游戏', '找零食'],
      targets: ['查资料', '写要点', '画标题', '贴图片', '检查拼写'],
      distractors: ['只玩一分钟', '这里更有趣', '先换头像']
    },
    {
      level: 5,
      title: '高级分心回归',
      rule: '任务是准备课堂展示。选择必要步骤，并在被打断后自己回到规则。',
      cards: ['确认主题', '写三点要点', '练习开头', '检查时间', '准备问题', '改桌面壁纸', '打开游戏', '看无关图片', '领取星星'],
      targets: ['确认主题', '写三点要点', '练习开头', '检查时间', '准备问题'],
      distractors: ['紧急奖励', '朋友邀请', '有趣视频', '新装饰']
    }
  ]
};

const DEFAULT_STATE = {
  childName: '孩子',
  age: 8,
  pin: PIN_DEFAULT,
  settings: {
    voice: true,
    gentleDistractions: true,
    dailyLimit: 20,
    quietMinutes: 8
  },
  profile: {
    reading: 2,
    instruction: 2,
    errorCheck: 2,
    planning: 2,
    quiet: 2,
    return: 2
  },
  sessions: [],
  standalone: [],
  badges: []
};

const PLANS = {
  quick: {
    label: '轻量 8 分钟',
    minutes: 8,
    icon: '🌤️',
    note: '适合放学后比较累的时候。',
    modules: ['instruction', 'errorCheck']
  },
  standard: {
    label: '标准 12 分钟',
    minutes: 12,
    icon: '🎯',
    note: '每天最推荐：阅读 + 计划 + 检查。',
    modules: ['reading', 'planning', 'errorCheck']
  },
  challenge: {
    label: '挑战 15 分钟',
    minutes: 15,
    icon: '🚀',
    note: '适合状态好时：阅读、听指令、真实任务、分心回归。',
    modules: ['reading', 'instruction', 'quiet', 'return']
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function sampleByLevel(items, level) {
  const exact = items.filter((item) => item.level === level);
  if (exact.length) return clone(exact[Math.floor(Math.random() * exact.length)]);
  const sorted = [...items].sort((a, b) => Math.abs(a.level - level) - Math.abs(b.level - level));
  return clone(sorted[0]);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function percent(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...clone(DEFAULT_STATE),
      ...parsed,
      settings: { ...clone(DEFAULT_STATE).settings, ...(parsed.settings || {}) },
      profile: { ...clone(DEFAULT_STATE).profile, ...(parsed.profile || {}) },
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      standalone: Array.isArray(parsed.standalone) ? parsed.standalone : [],
      badges: Array.isArray(parsed.badges) ? parsed.badges : []
    };
  } catch {
    return clone(DEFAULT_STATE);
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

class FocusStudioApp {
  constructor(root) {
    this.root = root;
    this.state = loadState();
    this.route = 'home';
    this.currentRun = null;
    this.toastTimer = null;
    this.moduleCleanup = null;
  }

  init() {
    window.addEventListener('hashchange', () => this.go(location.hash.replace('#', '') || 'home'));
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/public/service-worker.js').catch(() => {});
    this.go(location.hash.replace('#', '') || 'home');
  }

  persist() { saveState(this.state); }

  go(route = 'home') {
    if (this.moduleCleanup) {
      this.moduleCleanup();
      this.moduleCleanup = null;
    }
    this.route = route;
    if (`#${route}` !== location.hash) location.hash = route;
    this.render();
  }

  html(content, compact = false) {
    this.root.innerHTML = `
      <div class="app-shell">
        <header class="topbar">
          <div class="logo-wrap" role="button" tabindex="0" id="brandHome">
            <div class="logo-mark">FS</div>
            <div>
              <h1 class="brand-title">Focus Studio</h1>
              <p class="brand-subtitle">8–10岁专注学习工作室</p>
            </div>
          </div>
          <nav class="top-actions" aria-label="主要导航">
            <button class="btn small ghost" id="homeBtn">首页</button>
            <button class="btn small ghost" id="modulesBtn">训练模块</button>
            <button class="btn small primary" id="parentBtn">家长中心</button>
          </nav>
        </header>
        <main class="${compact ? '' : 'main-view'}">${content}</main>
      </div>
      <div class="toast" id="toast"></div>
    `;
    this.root.querySelector('#brandHome')?.addEventListener('click', () => this.go('home'));
    this.root.querySelector('#homeBtn')?.addEventListener('click', () => this.go('home'));
    this.root.querySelector('#modulesBtn')?.addEventListener('click', () => this.go('modules'));
    this.root.querySelector('#parentBtn')?.addEventListener('click', () => this.go('parent'));
  }

  render() {
    if (this.route === 'home') return this.renderHome();
    if (this.route === 'modules') return this.renderModules();
    if (this.route === 'parent') return this.renderParent(false);
    if (this.route.startsWith('module/')) return this.startStandalone(this.route.split('/')[1]);
    this.renderHome();
  }

  toast(message) {
    const el = this.root.querySelector('#toast') || document.querySelector('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove('show'), 2100);
  }

  recentSessions(days = 7) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return this.state.sessions.filter((s) => new Date(s.startedAt).getTime() >= cutoff);
  }

  todayMinutes() {
    const t = todayKey();
    return this.state.sessions
      .filter((s) => s.day === t)
      .reduce((sum, s) => sum + (s.minutes || 0), 0);
  }

  averageAccuracy(sessions = this.state.sessions) {
    const results = sessions.flatMap((s) => s.results || []);
    if (!results.length) return 0;
    return results.reduce((sum, r) => sum + (r.accuracy || 0), 0) / results.length;
  }

  weakestModule() {
    const rows = Object.keys(MODULES).map((id) => {
      const results = this.state.sessions.flatMap((s) => s.results || []).filter((r) => r.moduleId === id);
      const avg = results.length ? results.reduce((a, b) => a + (b.accuracy || 0), 0) / results.length : null;
      return { id, avg };
    }).filter((r) => r.avg !== null);
    if (!rows.length) return 'reading';
    rows.sort((a, b) => a.avg - b.avg);
    return rows[0].id;
  }

  recommendedText() {
    const weak = MODULES[this.weakestModule()];
    const mins = this.todayMinutes();
    if (mins >= this.state.settings.dailyLimit) return `今天已经训练 ${mins} 分钟，建议休息或做真实阅读。`;
    if (this.state.sessions.length < 2) return '建议先做标准训练，观察阅读、计划和检查三项表现。';
    return `最近最值得加强：${weak.name}。今天建议做标准训练，结束后看复盘。`;
  }

  renderHome() {
    const recent = this.recentSessions();
    const mins = this.todayMinutes();
    const acc = this.averageAccuracy(recent);
    const streak = this.getStreak();
    this.html(`
      <section class="hero">
        <div class="card">
          <h2 class="hero-title">把专注训练变成真实学习能力</h2>
          <p class="hero-copy">这版不再做低龄点击小游戏，而是训练阅读、听指令、任务计划、错误检查、安静完成和分心回归。适合 8–10 岁孩子在 iPad 或手机触屏上使用。</p>
          <div class="hero-pills">
            <span class="pill">👧 ${escapeHtml(this.state.childName)} · ${this.state.age}岁</span>
            <span class="pill">⏱️ 今日 ${mins}/${this.state.settings.dailyLimit} 分钟</span>
            <span class="pill">🔥 连续 ${streak} 天</span>
          </div>
        </div>
        <div class="grid two">
          <div class="card metric-card flat">
            <div class="metric-value">${percent(acc)}%</div>
            <div class="metric-label">近7天平均完成质量</div>
            <div class="progress-bar"><div class="progress-fill" style="--w:${percent(acc)}%"></div></div>
          </div>
          <div class="card metric-card flat">
            <div class="metric-value">${Math.round(this.averageLevel() * 10) / 10}</div>
            <div class="metric-label">综合难度等级</div>
            <div class="metric-note">自动升降级</div>
          </div>
        </div>
      </section>

      <div class="section-title-row">
        <div>
          <h2 class="section-title">今日训练</h2>
          <p class="section-note">${this.recommendedText()}</p>
        </div>
      </div>
      <section class="grid three">
        ${Object.entries(PLANS).map(([key, plan]) => `
          <article class="card plan-card" data-plan="${key}">
            <div class="icon">${plan.icon}</div>
            <h3>${plan.label}</h3>
            <p>${plan.note}</p>
            <div class="meta">
              ${plan.modules.map((m) => `<span class="pill">${MODULES[m].icon} ${MODULES[m].name}</span>`).join('')}
            </div>
          </article>
        `).join('')}
      </section>

      <div class="section-title-row">
        <div>
          <h2 class="section-title">核心模块</h2>
          <p class="section-note">可以单独训练某一项，也可以让系统自动组合。</p>
        </div>
        <button class="btn soft" id="viewModules">查看全部</button>
      </div>
      <section class="grid three">
        ${Object.values(MODULES).slice(0, 6).map((m) => this.moduleCardHtml(m)).join('')}
      </section>
    `);
    this.root.querySelectorAll('[data-plan]').forEach((el) => el.addEventListener('click', () => this.startPlan(el.dataset.plan)));
    this.root.querySelector('#viewModules')?.addEventListener('click', () => this.go('modules'));
    this.root.querySelectorAll('[data-module]').forEach((el) => el.addEventListener('click', () => this.go(`module/${el.dataset.module}`)));
  }

  moduleCardHtml(m) {
    const level = this.state.profile[m.id] || 1;
    return `
      <article class="card module-card" data-module="${m.id}">
        <div class="icon">${m.icon}</div>
        <h3>${m.name}</h3>
        <p>${m.ability}</p>
        <div class="meta">
          <span class="pill">等级 ${Math.round(level * 10) / 10}</span>
          <span class="pill">触屏训练</span>
        </div>
      </article>
    `;
  }

  renderModules() {
    this.html(`
      <div class="section-title-row">
        <div>
          <h2 class="section-title">训练模块</h2>
          <p class="section-note">这些模块不追求刺激，而是让孩子练习真实学习中会用到的专注能力。</p>
        </div>
      </div>
      <section class="grid three">
        ${Object.values(MODULES).map((m) => this.moduleCardHtml(m)).join('')}
      </section>
      <div class="card" style="margin-top:16px">
        <h3>使用建议</h3>
        <p class="section-note">每天 8–15 分钟即可。状态差时做轻量训练，状态好时做挑战训练。不要让孩子连续刷太久，训练结束后最好用 1 分钟和她聊聊“哪一步最难、下次怎么做”。</p>
      </div>
    `);
    this.root.querySelectorAll('[data-module]').forEach((el) => el.addEventListener('click', () => this.go(`module/${el.dataset.module}`)));
  }

  averageLevel() {
    const vals = Object.values(this.state.profile);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  getStreak() {
    const days = new Set(this.state.sessions.map((s) => s.day));
    let count = 0;
    const d = new Date();
    for (;;) {
      const key = todayKey(d);
      if (!days.has(key)) break;
      count += 1;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  startPlan(planKey) {
    const plan = PLANS[planKey] || PLANS.standard;
    this.currentRun = {
      type: planKey,
      plan,
      queue: ['breath', ...plan.modules, 'review'],
      index: 0,
      results: [],
      startedAt: new Date().toISOString()
    };
    this.renderCurrentStage();
  }

  startStandalone(moduleId) {
    if (!MODULES[moduleId]) return this.go('modules');
    this.currentRun = {
      type: 'single',
      plan: { label: MODULES[moduleId].name, minutes: 0, modules: [moduleId] },
      queue: [moduleId, 'review'],
      index: 0,
      results: [],
      startedAt: new Date().toISOString(),
      standalone: true
    };
    this.renderCurrentStage();
  }

  renderTrainingShell(body) {
    const run = this.currentRun;
    const progress = run ? Math.round((run.index / Math.max(1, run.queue.length - 1)) * 100) : 0;
    this.html(`
      <section class="training-shell">
        <div class="training-head">
          <div>
            <h2 class="training-title">${escapeHtml(run?.plan?.label || '训练')}</h2>
            <p class="training-sub">每一步只做一件事。看清楚、想一下、再操作。</p>
          </div>
          <button class="btn ghost" id="exitTraining">退出</button>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="--w:${progress}%"></div></div>
        ${body}
      </section>
    `, true);
    this.root.querySelector('#exitTraining')?.addEventListener('click', () => {
      if (confirm('确定退出当前训练吗？已经完成的本轮记录不会保存为完整训练。')) this.go('home');
    });
  }

  renderCurrentStage() {
    const stage = this.currentRun.queue[this.currentRun.index];
    if (stage === 'breath') return this.renderBreath();
    if (stage === 'review') return this.renderReview();
    if (stage === 'reading') return this.renderReading();
    if (stage === 'instruction') return this.renderInstruction();
    if (stage === 'errorCheck') return this.renderErrorCheck();
    if (stage === 'planning') return this.renderPlanning();
    if (stage === 'quiet') return this.renderQuiet();
    if (stage === 'return') return this.renderReturn();
  }

  nextStage() {
    this.currentRun.index += 1;
    this.renderCurrentStage();
  }

  finishModule(moduleId, result) {
    const enriched = {
      moduleId,
      moduleName: MODULES[moduleId]?.name || moduleId,
      finishedAt: new Date().toISOString(),
      ...result
    };
    this.currentRun.results.push(enriched);
    const old = this.state.profile[moduleId] || 1;
    const acc = enriched.accuracy ?? 0;
    let next = old;
    if (acc >= 0.88) next += 0.35;
    else if (acc >= 0.72) next += 0.05;
    else if (acc < 0.55) next -= 0.45;
    else next -= 0.12;
    this.state.profile[moduleId] = clamp(Number(next.toFixed(2)), 1, 5);
    this.persist();
    this.nextStage();
  }

  levelFor(moduleId) {
    return clamp(Math.round(this.state.profile[moduleId] || 1), 1, 5);
  }

  renderBreath() {
    this.renderTrainingShell(`
      <article class="card stage-card no-footer">
        <div class="stage-topline">
          <span class="stage-label">准备开始</span>
          <span class="pill">30秒安静过渡</span>
        </div>
        <div class="stage-body center">
          <div class="breath-orb" aria-hidden="true"></div>
          <h3 class="section-title">先把身体慢下来</h3>
          <p class="section-note">看着圆球：变大时吸气，变小时呼气。准备好后再开始训练。</p>
          <div class="spacer"></div>
          <button class="btn primary" id="breathReady">我准备好了，开始</button>
        </div>
      </article>
    `);
    this.root.querySelector('#breathReady').addEventListener('click', () => this.nextStage());
  }

  renderReading() {
    const level = this.levelFor('reading');
    const data = sampleByLevel(DATA.reading, level);
    let answers = Array(data.questions.length).fill(null);
    const renderQuestions = () => {
      this.renderTrainingShell(`
        <article class="card stage-card">
          <div class="stage-topline">
            <span class="stage-label">📖 阅读专注 · 等级 ${level}</span>
            <span class="pill">隐藏原文答题</span>
          </div>
          <div class="stage-body">
            <h3>${escapeHtml(data.title)}</h3>
            ${data.questions.map((q, i) => `
              <div class="question-card" data-q="${i}">
                <h4>${i + 1}. ${escapeHtml(q.q)}</h4>
                <div class="options">
                  ${q.options.map((op, oi) => `<button class="option" data-q="${i}" data-a="${oi}">${escapeHtml(op)}</button>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          <div class="stage-footer">
            <button class="btn ghost" id="showPassageAgain">再看一次原文</button>
            <button class="btn primary" id="submitReading">提交答案</button>
          </div>
        </article>
      `);
      this.root.querySelectorAll('.option').forEach((btn) => {
        btn.addEventListener('click', () => {
          const qi = Number(btn.dataset.q);
          answers[qi] = Number(btn.dataset.a);
          this.root.querySelectorAll(`.option[data-q="${qi}"]`).forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
      });
      this.root.querySelector('#showPassageAgain')?.addEventListener('click', () => this.toast(data.passage));
      this.root.querySelector('#submitReading')?.addEventListener('click', () => {
        if (answers.some((a) => a === null)) return this.toast('还有题目没有选择。');
        const correct = data.questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
        const acc = correct / data.questions.length;
        this.finishModule('reading', {
          score: correct,
          total: data.questions.length,
          accuracy: acc,
          note: acc >= 0.8 ? '阅读后回忆比较稳定。' : '建议慢一点读，先抓人物、地点、顺序和关键词。'
        });
      });
    };

    this.renderTrainingShell(`
      <article class="card stage-card">
        <div class="stage-topline">
          <span class="stage-label">📖 阅读专注 · 等级 ${level}</span>
          <span class="pill">先读，再隐藏原文答题</span>
        </div>
        <div class="stage-body">
          <h3 class="section-title">${escapeHtml(data.title)}</h3>
          <div class="reading-passage">${escapeHtml(data.passage)}</div>
          <p class="section-note">阅读时请找四类信息：谁、在哪里、先后顺序、关键细节。不要急着猜答案。</p>
        </div>
        <div class="stage-footer">
          <button class="btn ghost" id="skipReading">换一篇</button>
          <button class="btn primary" id="doneReading">我读完了，开始答题</button>
        </div>
      </article>
    `);
    this.root.querySelector('#doneReading').addEventListener('click', renderQuestions);
    this.root.querySelector('#skipReading').addEventListener('click', () => this.renderReading());
  }

  renderInstruction() {
    const level = this.levelFor('instruction');
    const data = sampleByLevel(DATA.instruction, level);
    let started = false;
    let sequence = [];
    let mistakes = 0;
    let avoidHits = 0;
    const items = shuffle(data.items);

    const speak = () => {
      if (!('speechSynthesis' in window)) return this.toast('当前浏览器不支持语音播放。');
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(data.instruction);
      u.lang = 'zh-CN';
      u.rate = 0.82;
      window.speechSynthesis.speak(u);
    };

    const renderTask = () => {
      started = true;
      this.renderTrainingShell(`
        <article class="card stage-card">
          <div class="stage-topline">
            <span class="stage-label">🎧 听指令 · 等级 ${level}</span>
            <span class="pill">按顺序执行</span>
          </div>
          <div class="stage-body">
            <div class="sequence-tray" id="sequenceTray">
              <span class="muted">已完成步骤会显示在这里。</span>
            </div>
            <div class="item-grid">
              ${items.map((item) => `<button class="item-btn" data-item="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}
            </div>
            <p class="section-note">提示：如果忘了顺序，先停一下，在脑中重新说一遍指令。</p>
          </div>
          <div class="stage-footer">
            <button class="btn ghost" id="repeatInstruction">再看一次指令</button>
            <button class="btn primary" id="finishInstruction">完成</button>
          </div>
        </article>
      `);
      const updateTray = () => {
        const tray = this.root.querySelector('#sequenceTray');
        tray.innerHTML = sequence.length ? sequence.map((s) => `<span class="sequence-chip">${escapeHtml(s)}</span>`).join('') : '<span class="muted">已完成步骤会显示在这里。</span>';
      };
      this.root.querySelectorAll('.item-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = btn.dataset.item;
          if (data.avoid.includes(item)) {
            avoidHits += 1;
            mistakes += 1;
            btn.classList.add('wrong');
            this.toast('这是“不要点击”的项目。先停一下。');
            return;
          }
          const expected = data.steps[sequence.length];
          if (item === expected) {
            sequence.push(item);
            btn.classList.add('correct');
            btn.disabled = true;
            updateTray();
            if (sequence.length === data.steps.length) this.toast('顺序完成，可以提交。');
          } else {
            mistakes += 1;
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 450);
            this.toast(`顺序不对，下一步应该想清楚再点。`);
          }
        });
      });
      this.root.querySelector('#repeatInstruction').addEventListener('click', () => this.toast(data.instruction));
      this.root.querySelector('#finishInstruction').addEventListener('click', () => {
        const done = sequence.length;
        const stepScore = done / data.steps.length;
        const penalty = Math.min(0.55, mistakes * 0.12 + avoidHits * 0.16);
        const accuracy = clamp(stepScore - penalty, 0, 1);
        this.finishModule('instruction', {
          score: done,
          total: data.steps.length,
          mistakes,
          accuracy,
          note: mistakes === 0 ? '顺序执行很好。' : '需要练习先听完整，再一步一步执行。'
        });
      });
    };

    this.renderTrainingShell(`
      <article class="card stage-card">
        <div class="stage-topline">
          <span class="stage-label">🎧 听指令 · 等级 ${level}</span>
          <span class="pill">${data.steps.length} 步指令</span>
        </div>
        <div class="stage-body">
          <h3 class="section-title">${escapeHtml(data.title)}</h3>
          <div class="instruction-box">${escapeHtml(data.instruction)}</div>
          <p class="section-note">先完整读/听一遍，再开始。开始后指令会隐藏。</p>
        </div>
        <div class="stage-footer">
          <button class="btn ghost" id="voiceInstruction">播放语音</button>
          <button class="btn primary" id="startInstruction">我记住了，开始</button>
        </div>
      </article>
    `);
    this.root.querySelector('#voiceInstruction').addEventListener('click', speak);
    this.root.querySelector('#startInstruction').addEventListener('click', renderTask);
    if (this.state.settings.voice) setTimeout(() => !started && speak(), 500);
  }

  renderErrorCheck() {
    const level = this.levelFor('errorCheck');
    const data = sampleByLevel(DATA.errorCheck, level);
    const selected = new Set();
    this.renderTrainingShell(`
      <article class="card stage-card">
        <div class="stage-topline">
          <span class="stage-label">🔎 错误检查 · 等级 ${level}</span>
          <span class="pill">找出有问题的行</span>
        </div>
        <div class="stage-body">
          <h3 class="section-title">${escapeHtml(data.title)}</h3>
          <p class="section-note">请像检查作业一样慢慢看。正确的行不要点，有错误或不合理的行才点。</p>
          <div class="worksheet">
            ${data.lines.map((line, i) => `
              <button class="row-option worksheet-line" data-line="${i}">
                <span class="line-index">${i + 1}</span>
                <span>${escapeHtml(line)}</span>
              </button>
            `).join('')}
          </div>
        </div>
        <div class="stage-footer">
          <button class="btn ghost" id="clearChecks">重新选择</button>
          <button class="btn primary" id="submitChecks">提交检查</button>
        </div>
      </article>
    `);
    this.root.querySelectorAll('[data-line]').forEach((row) => {
      row.addEventListener('click', () => {
        const i = Number(row.dataset.line);
        if (selected.has(i)) selected.delete(i); else selected.add(i);
        row.classList.toggle('selected');
      });
    });
    this.root.querySelector('#clearChecks').addEventListener('click', () => {
      selected.clear();
      this.root.querySelectorAll('[data-line]').forEach((row) => row.classList.remove('selected'));
    });
    this.root.querySelector('#submitChecks').addEventListener('click', () => {
      const wrongSet = new Set(data.wrong);
      let correctJudgments = 0;
      data.lines.forEach((_, i) => {
        const should = wrongSet.has(i);
        const did = selected.has(i);
        if (should === did) correctJudgments += 1;
      });
      const accuracy = correctJudgments / data.lines.length;
      this.root.querySelectorAll('[data-line]').forEach((row) => {
        const i = Number(row.dataset.line);
        if (wrongSet.has(i)) row.classList.add('correct');
        else if (selected.has(i)) row.classList.add('wrong');
      });
      this.toast(data.explain);
      setTimeout(() => {
        this.finishModule('errorCheck', {
          score: correctJudgments,
          total: data.lines.length,
          accuracy,
          note: accuracy >= 0.85 ? '检查细节很稳定。' : `检查提示：${data.explain}`
        });
      }, 1400);
    });
  }

  renderPlanning() {
    const level = this.levelFor('planning');
    const data = sampleByLevel(DATA.planning, level);
    const selected = new Set();
    let step = 1;
    let order = [];
    const renderSelect = () => {
      this.renderTrainingShell(`
        <article class="card stage-card">
          <div class="stage-topline">
            <span class="stage-label">🧭 任务计划 · 等级 ${level}</span>
            <span class="pill">第1步：选择需要的物品</span>
          </div>
          <div class="stage-body">
            <h3 class="section-title">${escapeHtml(data.title)}</h3>
            <div class="instruction-box">${escapeHtml(data.scenario)}</div>
            <div class="plan-items">
              ${data.items.map((item) => `<button class="plan-item" data-plan-item="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}
            </div>
          </div>
          <div class="stage-footer">
            <button class="btn ghost" id="clearPlanSelect">清空</button>
            <button class="btn primary" id="nextPlanStep">下一步：安排顺序</button>
          </div>
        </article>
      `);
      this.root.querySelectorAll('[data-plan-item]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = btn.dataset.planItem;
          if (selected.has(item)) selected.delete(item); else selected.add(item);
          btn.classList.toggle('selected');
        });
      });
      this.root.querySelector('#clearPlanSelect').addEventListener('click', () => renderSelect());
      this.root.querySelector('#nextPlanStep').addEventListener('click', () => {
        if (!selected.size) return this.toast('先选择需要的物品。');
        step = 2;
        renderOrder();
      });
    };
    const renderOrder = () => {
      const candidates = [...selected];
      this.renderTrainingShell(`
        <article class="card stage-card">
          <div class="stage-topline">
            <span class="stage-label">🧭 任务计划 · 等级 ${level}</span>
            <span class="pill">第2步：安排顺序</span>
          </div>
          <div class="stage-body">
            <h3 class="section-title">按你认为合理的顺序点击</h3>
            <div class="sequence-tray" id="orderTray">${order.length ? order.map((x) => `<span class="sequence-chip">${escapeHtml(x)}</span>`).join('') : '<span class="muted">顺序会显示在这里。</span>'}</div>
            <div class="plan-items">
              ${candidates.map((item) => `<button class="plan-item" data-order-item="${escapeHtml(item)}" ${order.includes(item) ? 'disabled' : ''}>${escapeHtml(item)}</button>`).join('')}
            </div>
            <p class="section-note">顺序不需要和系统完全一样，但要体现“先准备、再执行、最后检查”。</p>
          </div>
          <div class="stage-footer">
            <button class="btn ghost" id="backPlanSelect">返回选择</button>
            <button class="btn orange" id="undoOrder">撤回一步</button>
            <button class="btn primary" id="submitPlan">提交计划</button>
          </div>
        </article>
      `);
      this.root.querySelectorAll('[data-order-item]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = btn.dataset.orderItem;
          if (!order.includes(item)) order.push(item);
          renderOrder();
        });
      });
      this.root.querySelector('#backPlanSelect').addEventListener('click', () => renderSelect());
      this.root.querySelector('#undoOrder').addEventListener('click', () => { order.pop(); renderOrder(); });
      this.root.querySelector('#submitPlan').addEventListener('click', () => {
        const needed = new Set(data.needed);
        const selectedArr = [...selected];
        const itemJudgments = data.items.reduce((sum, item) => {
          const should = needed.has(item);
          const did = selected.has(item);
          return sum + (should === did ? 1 : 0);
        }, 0);
        const selectedNeededOrder = order.filter((item) => needed.has(item));
        let orderScore = 0;
        selectedNeededOrder.forEach((item, idx) => {
          const idealIdx = data.order.indexOf(item);
          if (idealIdx !== -1) {
            const positionDiff = Math.abs(idealIdx - idx);
            orderScore += Math.max(0, 1 - positionDiff * 0.22);
          }
        });
        const normalizedOrder = needed.size ? orderScore / needed.size : 0;
        const selectionAcc = itemJudgments / data.items.length;
        const accuracy = clamp(selectionAcc * 0.62 + normalizedOrder * 0.38, 0, 1);
        this.finishModule('planning', {
          score: Math.round(accuracy * 100),
          total: 100,
          accuracy,
          chosen: selectedArr,
          order,
          note: accuracy >= 0.8 ? '任务拆解和顺序安排比较清楚。' : '建议下次先想：需要什么、先做什么、最后怎么检查。'
        });
      });
    };
    renderSelect();
  }

  renderQuiet() {
    const level = this.levelFor('quiet');
    const minutes = clamp(this.state.settings.quietMinutes + level - 2, 5, 15);
    let seconds = minutes * 60;
    let elapsed = 0;
    let distractions = 0;
    let paused = true;
    let timer = null;
    const format = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const renderTime = () => {
      const val = this.root.querySelector('#quietTime');
      if (val) val.textContent = format(seconds);
      const cap = this.root.querySelector('#quietCaption');
      if (cap) cap.textContent = paused ? '暂停中' : '保持在真实任务上';
      const fill = this.root.querySelector('#quietFill');
      if (fill) fill.style.setProperty('--w', `${Math.round((elapsed / (minutes * 60)) * 100)}%`);
    };
    const tick = () => {
      if (!paused && seconds > 0) {
        seconds -= 1;
        elapsed += 1;
        renderTime();
        if (seconds === 0) finish();
      }
    };
    const finish = () => {
      clearInterval(timer);
      const completion = elapsed / (minutes * 60);
      const penalty = Math.min(0.4, distractions * 0.08);
      this.finishModule('quiet', {
        score: Math.round(elapsed / 60),
        total: minutes,
        accuracy: clamp(completion - penalty, 0, 1),
        distractions,
        note: distractions <= 1 ? '真实任务坚持得不错。' : '有分心也没关系，关键是能回到任务。'
      });
    };

    this.renderTrainingShell(`
      <article class="card stage-card">
        <div class="stage-topline">
          <span class="stage-label">⏳ 安静完成 · 等级 ${level}</span>
          <span class="pill">真实任务 ${minutes} 分钟</span>
        </div>
        <div class="stage-body">
          <h3 class="section-title">选择一个真实任务，然后让屏幕安静陪伴</h3>
          <p class="section-note">可以读书、写字、做一页作业、画画或练琴。这个模块不是游戏，训练的是“我能坚持在任务上”。</p>
          <div class="timer-card">
            <div>
              <div class="timer-value" id="quietTime">${format(seconds)}</div>
              <div class="timer-caption" id="quietCaption">暂停中</div>
              <div class="progress-bar" style="margin-top:16px"><div class="progress-fill" id="quietFill" style="--w:0%"></div></div>
              <div class="focus-actions">
                <button class="btn primary" id="toggleQuiet">开始</button>
                <button class="btn orange" id="markDistracted">我分心了</button>
                <button class="btn green" id="finishQuiet">完成任务</button>
              </div>
            </div>
          </div>
        </div>
        <div class="stage-footer">
          <span class="muted">分心不是失败。能发现并回到任务，就是训练的一部分。</span>
        </div>
      </article>
    `);
    timer = setInterval(tick, 1000);
    this.moduleCleanup = () => clearInterval(timer);
    this.root.querySelector('#toggleQuiet').addEventListener('click', (e) => {
      paused = !paused;
      e.currentTarget.textContent = paused ? '继续' : '暂停';
      renderTime();
    });
    this.root.querySelector('#markDistracted').addEventListener('click', () => {
      distractions += 1;
      this.toast('很好，已经觉察到分心。深呼吸一下，回到任务。');
    });
    this.root.querySelector('#finishQuiet').addEventListener('click', finish);
  }

  renderReturn() {
    const level = this.levelFor('return');
    const data = sampleByLevel(DATA.return, level);
    const selected = new Set();
    let distractorHits = 0;
    let popTimer = null;
    const makePopup = () => {
      const area = this.root.querySelector('#distractorArea');
      if (!area) return;
      const btn = document.createElement('button');
      btn.className = 'distractor-popup';
      btn.textContent = data.distractors[Math.floor(Math.random() * data.distractors.length)];
      btn.style.left = `${8 + Math.random() * 58}%`;
      btn.style.top = `${10 + Math.random() * 68}%`;
      btn.addEventListener('click', () => {
        distractorHits += 1;
        btn.remove();
        this.toast('这是干扰项。说一句：我回到任务。');
      });
      area.appendChild(btn);
      setTimeout(() => btn.remove(), 4200);
    };

    this.renderTrainingShell(`
      <article class="card stage-card">
        <div class="stage-topline">
          <span class="stage-label">↩️ 分心回归 · 等级 ${level}</span>
          <span class="pill">忽略干扰，回到规则</span>
        </div>
        <div class="stage-body">
          <h3 class="section-title">${escapeHtml(data.title)}</h3>
          <div class="instruction-box">${escapeHtml(data.rule)}</div>
          <div class="distractor-area" id="distractorArea">
            <div class="item-grid">
              ${shuffle(data.cards).map((card) => `<button class="item-btn" data-card="${escapeHtml(card)}">${escapeHtml(card)}</button>`).join('')}
            </div>
          </div>
        </div>
        <div class="stage-footer">
          <button class="btn ghost" id="repeatReturnRule">重新看规则</button>
          <button class="btn primary" id="submitReturn">我完成了</button>
        </div>
      </article>
    `);
    if (this.state.settings.gentleDistractions) {
      setTimeout(makePopup, 2200);
      popTimer = setInterval(makePopup, 5200);
      this.moduleCleanup = () => clearInterval(popTimer);
    }
    this.root.querySelectorAll('[data-card]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.dataset.card;
        if (selected.has(card)) selected.delete(card); else selected.add(card);
        btn.classList.toggle('selected');
      });
    });
    this.root.querySelector('#repeatReturnRule').addEventListener('click', () => this.toast(data.rule));
    this.root.querySelector('#submitReturn').addEventListener('click', () => {
      clearInterval(popTimer);
      const targets = new Set(data.targets);
      let correctJudgments = 0;
      data.cards.forEach((card) => {
        const should = targets.has(card);
        const did = selected.has(card);
        if (should === did) correctJudgments += 1;
      });
      const base = correctJudgments / data.cards.length;
      const accuracy = clamp(base - Math.min(0.36, distractorHits * 0.12), 0, 1);
      this.finishModule('return', {
        score: correctJudgments,
        total: data.cards.length,
        accuracy,
        distractorHits,
        note: distractorHits === 0 ? '干扰出现时保持了任务规则。' : '已经开始练习识别干扰，下次尝试不点击弹窗。'
      });
    });
  }

  renderReview() {
    const run = this.currentRun;
    const results = run.results || [];
    const avg = results.length ? results.reduce((s, r) => s + (r.accuracy || 0), 0) / results.length : 0;
    const minutes = run.plan.minutes || Math.max(1, Math.round(results.length * 3));
    const session = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      type: run.type,
      label: run.plan.label,
      startedAt: run.startedAt,
      endedAt: new Date().toISOString(),
      day: todayKey(),
      minutes,
      accuracy: avg,
      results
    };

    // Save only once per review render.
    if (!run.saved) {
      run.saved = true;
      if (run.standalone) this.state.standalone.unshift(session);
      else this.state.sessions.unshift(session);
      this.state.sessions = this.state.sessions.slice(0, 180);
      this.state.standalone = this.state.standalone.slice(0, 120);
      this.updateBadges(session);
      this.persist();
    }

    const best = [...results].sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0))[0];
    const weak = [...results].sort((a, b) => (a.accuracy || 0) - (b.accuracy || 0))[0];
    this.renderTrainingShell(`
      <article class="card stage-card no-footer">
        <div class="stage-topline">
          <span class="stage-label">训练复盘</span>
          <span class="pill">平均 ${percent(avg)}%</span>
        </div>
        <div class="stage-body">
          <h3 class="section-title">今天完成了 ${minutes} 分钟专注训练</h3>
          <div class="review-grid">
            <div class="review-card"><strong>${percent(avg)}%</strong><span>综合完成质量</span></div>
            <div class="review-card"><strong>${results.length}</strong><span>完成模块</span></div>
            <div class="review-card"><strong>${Math.round(this.averageLevel() * 10) / 10}</strong><span>当前综合等级</span></div>
          </div>
          <div class="grid two">
            <div class="card flat tight">
              <h3>表现较稳定</h3>
              <p class="section-note">${best ? `${best.moduleName}：${best.note || '完成不错。'}` : '暂无数据'}</p>
            </div>
            <div class="card flat tight">
              <h3>下次重点</h3>
              <p class="section-note">${weak ? `${weak.moduleName}：${weak.note || '可以继续练习。'}` : '暂无数据'}</p>
            </div>
          </div>
          <div class="card flat tight">
            <h3>建议亲子复盘问题</h3>
            <p class="section-note">刚才哪一步最容易分心？你是怎么回到任务的？下次开始前，你想先提醒自己什么？</p>
          </div>
          <div class="badge-list">${this.state.badges.slice(0, 8).map((b) => `<span class="badge">${escapeHtml(b)}</span>`).join('') || '<span class="muted">完成更多训练后会出现徽章。</span>'}</div>
          <div class="focus-actions">
            <button class="btn primary" id="backHomeAfterReview">回到首页</button>
            <button class="btn ghost" id="parentAfterReview">查看家长中心</button>
          </div>
        </div>
      </article>
    `);
    this.root.querySelector('#backHomeAfterReview').addEventListener('click', () => this.go('home'));
    this.root.querySelector('#parentAfterReview').addEventListener('click', () => this.go('parent'));
  }

  updateBadges(session) {
    const add = (badge) => {
      if (!this.state.badges.includes(badge)) this.state.badges.unshift(badge);
    };
    if (session.accuracy >= 0.9) add('高质量完成者');
    if (session.results.some((r) => r.moduleId === 'errorCheck' && r.accuracy >= 0.9)) add('细心检查者');
    if (session.results.some((r) => r.moduleId === 'reading' && r.accuracy >= 0.85)) add('安静阅读者');
    if (session.results.some((r) => r.moduleId === 'planning' && r.accuracy >= 0.85)) add('任务计划师');
    if (session.results.some((r) => r.moduleId === 'return' && (r.distractorHits || 0) === 0)) add('分心回归高手');
    if (this.getStreak() >= 3) add('连续训练3天');
    this.state.badges = this.state.badges.slice(0, 30);
  }

  renderParent(unlocked) {
    const isUnlocked = unlocked || sessionStorage.getItem('focusStudioParentUnlocked') === '1';
    if (!isUnlocked) {
      this.html(`
        <section class="card parent-lock">
          <h2 class="section-title">家长中心</h2>
          <p class="section-note">默认 PIN：2580。建议第一次进入后改成你自己的 PIN。</p>
          <div class="input-row">
            <label for="pinInput">输入 PIN</label>
            <input class="input" id="pinInput" inputmode="numeric" type="password" placeholder="请输入 PIN" />
          </div>
          <button class="btn primary block" id="unlockParent">进入家长中心</button>
        </section>
      `);
      this.root.querySelector('#unlockParent').addEventListener('click', () => {
        const pin = this.root.querySelector('#pinInput').value.trim();
        if (pin === this.state.pin) {
          sessionStorage.setItem('focusStudioParentUnlocked', '1');
          this.renderParent(true);
        } else this.toast('PIN 不正确。');
      });
      return;
    }

    const recent = this.recentSessions();
    const moduleStats = Object.keys(MODULES).map((id) => {
      const results = this.state.sessions.flatMap((s) => s.results || []).filter((r) => r.moduleId === id);
      const avg = results.length ? results.reduce((sum, r) => sum + (r.accuracy || 0), 0) / results.length : 0;
      return { id, name: MODULES[id].name, avg, count: results.length, level: this.state.profile[id] || 1 };
    });

    this.html(`
      <section class="grid two">
        <div class="card">
          <h2 class="section-title">家长中心</h2>
          <p class="section-note">这里是家庭观察工具，不是医学诊断。重点看趋势：哪些能力稳定，哪些任务容易分心。</p>
          <div class="hero-pills">
            <span class="pill">近7天 ${recent.length} 次完整训练</span>
            <span class="pill">平均 ${percent(this.averageAccuracy(recent))}%</span>
            <span class="pill">今日 ${this.todayMinutes()} 分钟</span>
          </div>
        </div>
        <div class="card flat">
          <h3>孩子信息</h3>
          <div class="grid two">
            <div class="input-row"><label>名字</label><input class="input" id="childName" value="${escapeHtml(this.state.childName)}" /></div>
            <div class="input-row"><label>年龄</label><select class="select" id="childAge"><option ${this.state.age==8?'selected':''}>8</option><option ${this.state.age==9?'selected':''}>9</option><option ${this.state.age==10?'selected':''}>10</option></select></div>
          </div>
          <div class="grid two">
            <div class="input-row"><label>每日建议上限/分钟</label><input class="input" id="dailyLimit" inputmode="numeric" value="${this.state.settings.dailyLimit}" /></div>
            <div class="input-row"><label>真实任务基础分钟</label><input class="input" id="quietMinutes" inputmode="numeric" value="${this.state.settings.quietMinutes}" /></div>
          </div>
          <div class="focus-actions">
            <button class="btn primary" id="saveSettings">保存设置</button>
            <button class="btn ghost" id="lockParent">锁定</button>
          </div>
        </div>
      </section>

      <div class="section-title-row">
        <div>
          <h2 class="section-title">能力趋势</h2>
          <p class="section-note">等级会根据每次表现自动升降。70%–88% 保持；88%以上升级；55%以下降级。</p>
        </div>
      </div>
      <section class="card">
        <div class="stat-table">
          ${moduleStats.map((s) => `
            <div class="stat-row">
              <div class="stat-name">${escapeHtml(s.name)}</div>
              <div class="progress-bar"><div class="progress-fill" style="--w:${percent(s.avg)}%"></div></div>
              <div class="stat-value">${percent(s.avg)}%</div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="grid two" style="margin-top:16px">
        <div class="card">
          <h3>训练记录</h3>
          <div class="stat-table">
            ${this.state.sessions.slice(0, 8).map((s) => `
              <div class="stat-row">
                <div class="stat-name">${escapeHtml(s.day)}</div>
                <div class="muted">${escapeHtml(s.label)} · ${s.minutes}分钟</div>
                <div class="stat-value">${percent(s.accuracy)}%</div>
              </div>
            `).join('') || '<p class="section-note">还没有完整训练记录。</p>'}
          </div>
        </div>
        <div class="card">
          <h3>数据管理</h3>
          <p class="section-note">数据只保存在当前浏览器本地。换设备不会自动同步。</p>
          <div class="input-row"><label>修改家长 PIN</label><input class="input" id="newPin" inputmode="numeric" placeholder="留空则不修改" /></div>
          <div class="focus-actions">
            <button class="btn ghost" id="exportData">导出 JSON</button>
            <button class="btn orange" id="resetLevels">重置难度</button>
            <button class="btn red" id="clearData">清除全部数据</button>
          </div>
        </div>
      </section>
    `);
    this.root.querySelector('#saveSettings').addEventListener('click', () => {
      this.state.childName = this.root.querySelector('#childName').value.trim() || '孩子';
      this.state.age = Number(this.root.querySelector('#childAge').value) || 8;
      this.state.settings.dailyLimit = clamp(Number(this.root.querySelector('#dailyLimit').value) || 20, 5, 60);
      this.state.settings.quietMinutes = clamp(Number(this.root.querySelector('#quietMinutes').value) || 8, 3, 20);
      const pin = this.root.querySelector('#newPin')?.value.trim();
      if (pin) this.state.pin = pin;
      this.persist();
      this.toast('设置已保存。');
      this.renderParent(true);
    });
    this.root.querySelector('#lockParent').addEventListener('click', () => {
      sessionStorage.removeItem('focusStudioParentUnlocked');
      this.go('home');
    });
    this.root.querySelector('#exportData').addEventListener('click', () => this.exportData());
    this.root.querySelector('#resetLevels').addEventListener('click', () => {
      if (!confirm('确定重置所有模块难度吗？训练记录会保留。')) return;
      this.state.profile = clone(DEFAULT_STATE.profile);
      this.persist();
      this.renderParent(true);
    });
    this.root.querySelector('#clearData').addEventListener('click', () => {
      if (!confirm('确定清除全部本地数据吗？这个操作不能撤回。')) return;
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem('focusStudioParentUnlocked');
      this.state = clone(DEFAULT_STATE);
      this.go('home');
    });
  }

  exportData() {
    const blob = new Blob([JSON.stringify(this.state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-studio-data-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}

const app = new FocusStudioApp(document.getElementById('app'));
app.init();
