export type Locale = "en" | "zh";

export const LOCALE_STORAGE_KEY = "locale";

export const dictionaries = {
  en: {
    common: {
      brand: "ZD Translate",
      signIn: "Sign In",
      dashboard: "Dashboard",
      loading: "Loading…",
      perMonth: "/mo",
    },
    home: {
      heroTitle: "Real-Time AI Translation, Right on Your Screen.",
      heroSubtitle:
        "Translate meetings, streams, games, and documents instantly without switching windows. Powered by next-gen AI for native-level accuracy.",
      ctaPrimary: "Get Started Free",
      ctaSecondary: "View Pricing",
      demoBadge:
        "🎬 Interactive Demo Coming Soon — Live Screen & Audio Translation",
      proofTitle: "TRUSTED BY GLOBAL PROFESSIONALS, GAMERS & CREATORS",
      testimonials: [
        {
          quote:
            "Cut my cross-border meeting prep to zero. The real-time audio translation feels like having a human interpreter.",
          author: "Alex M., Product Manager",
        },
        {
          quote:
            "Finally I can play unlocalized games and read foreign research papers right on my screen with a single hotkey.",
          author: "David K., Software Engineer",
        },
        {
          quote:
            "Way faster and more accurate than browser extensions. It stays out of the way until the exact second I need it.",
          author: "Sarah L., UX Designer",
        },
      ],
      featuresTitle: "Built for Speed, Accuracy, and Zero Friction",
      features: [
        {
          title: "Instant Screen & OCR Translation",
          description:
            "Select any area on your screen—from unselectable UI text and images to PDFs—and get an instant overlay translation with one shortcut.",
          label: "Screen OCR Overlay",
        },
        {
          title: "Real-Time System Audio & Voice Captions",
          description:
            "Capture system audio or microphone input during calls, lectures, or livestreams and read live bilingual subtitles in real time.",
          label: "Live Audio Captions",
        },
        {
          title: "Context-Aware AI Engine",
          description:
            "Go beyond literal word-for-word translation. ZD Translate understands idioms, technical jargon, and context to deliver natural results.",
          label: "AI Context Engine",
        },
      ],
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "How does the desktop app sync with my Pro account?",
          a: "Simply sign in to the ZD Translate desktop client using the same email account. Your Pro privileges unlock automatically in real time.",
        },
        {
          q: "Can I cancel my subscription at any time?",
          a: "Yes. You can manage or cancel your subscription anytime with one click from your Dashboard via our billing portal—no hidden fees.",
        },
        {
          q: "Does it work over fullscreen apps, games, and video calls?",
          a: "Absolutely. ZD Translate runs as a lightweight native overlay that works seamlessly across any window, PDF, browser, or meeting app.",
        },
      ],
      footer: "© 2026 ZD Translate. All rights reserved.",
    },
    pricing: {
      title: "Membership + Credit Packs",
      subtitle:
        "1 Credit = 1 second of live AI voice interpretation. Choose a monthly plan for power users, or top up credits anytime—they never expire.",
      tabAria: "Pricing options",
      tabMembership: "Membership Plans",
      tabPacks: "Credit Packs",
      footnote:
        "Secure checkout via Lemon Squeezy. Credit packs are ideal for one-time purchases (including regional payment methods where available).",
      embeddedTitle: "Top up credits or upgrade",
      membership: {
        free: {
          badge: "Free Trial",
          name: "Free Trial",
          creditsLine: "600 Credits included (≈ 10 min live interpretation)",
          benefits: [
            "600 credits on signup — try real-time interpretation",
            "Standard voice models & latency",
            "Desktop client access with pay-as-you-go usage",
          ],
          cta: "Get Started Free",
        },
        pro: {
          badge: "Best for daily use",
          name: "Pro Monthly",
          creditsLine:
            "7,200 Credits every month (≈ 120 min live interpretation)",
          benefits: [
            "0.3s ultra-low latency pipeline",
            "Voice cloning & premium audio quality",
            "Floating overlay for Zoom, Discord & lectures",
            "Member discount on credit pack top-ups",
          ],
          cta: "Subscribe — $19/mo",
        },
      },
      packs: {
        neverExpire: "Credits never expire · pay once, use anytime",
        starter: {
          name: "Starter Pack",
          price: "$4.99",
          creditsLine: "1,800 Credits (≈ 30 min)",
          bullets: ["Great for occasional meetings", "Stack with any plan"],
          cta: "Buy Starter Pack",
        },
        popular: {
          name: "Popular Pack",
          badge: "Most Popular",
          price: "$12.99",
          creditsLine: "5,400 Credits (≈ 90 min)",
          bullets: ["Best value for regular interpreters", "Works with Free or Pro"],
          cta: "Buy Popular Pack",
        },
        pro: {
          name: "Pro Pack",
          price: "$29.99",
          creditsLine: "14,400 Credits (≈ 4 hours)",
          bullets: ["Marathon sessions & all-day events", "Priority fulfillment"],
          cta: "Buy Pro Pack",
        },
      },
    },
    login: {
      title: "Sign in to your account",
      subtitle: "Use Google or your email to continue",
      authFailed: "Sign-in failed. Please try again.",
      continueGoogle: "Continue with Google",
      redirecting: "Redirecting…",
      or: "OR",
      email: "Email",
      password: "Password",
      emailPlaceholder: "you@company.com",
      pleaseWait: "Please wait…",
      signIn: "Sign in",
      signUp: "Sign up",
      createAccount: "Create account",
      useSignIn: "Use sign in",
      confirmEmail:
        "Check your email to confirm your account, then sign in.",
      signInFailed: "Sign-in failed. Please try again.",
      signUpFailed: "Sign-up failed. Please try again.",
      backHome: "← Back to home",
    },
    dashboard: {
      account: "Account",
      proPlan: "Pro Plan",
      freePlan: "Free Plan",
      creditsOverview: "Credits & account",
      badgeFree: "Free",
      badgePro: "Pro",
      topUpCredits: "Top Up Credits",
      subscription: "Membership",
      freeSummary:
        "You are on the Free plan with pay-as-you-go credits. Upgrade to Pro for 7,200 monthly credits, ultra-low latency, and voice cloning.",
      proSummary:
        "Pro is active — you receive 7,200 credits each billing cycle plus member perks. Top up anytime with credit packs.",
      manageSubscription: "Manage Subscription",
      desktopTitle: "Desktop Client Download",
      desktopBody:
        "Download the desktop app and sign in with your account to start translating across any window.",
      desktopIntro:
        "Run real-time interpretation on your desktop. Usage is billed per second from your credit balance.",
      desktopSteps: [
        "Download and install the client for your OS.",
        "Sign in with the same email you use on this website.",
        "Press Start in the app — live interpretation consumes 1 credit per second.",
      ],
      downloadDesktop: "Download Desktop App",
      downloadWindows: "Download for Windows (.exe)",
      downloadMac: "Download for macOS (.dmg)",
      downloadWindowsSoon:
        "Windows (.exe) download link is not configured yet — check back soon.",
      downloadMacSoon:
        "macOS (.dmg) download link is not configured yet — check back soon.",
      recentActivity: "Recent Credit Activity",
      noTransactions:
        "No credit activity yet. Start a session in the desktop client to see per-second usage here.",
      colTime: "Time",
      colType: "Type",
      colDescription: "Description",
      colAmount: "Amount",
      colBalance: "Balance after",
      transactionTypes: {
        session_usage: "Session usage",
        signup_bonus: "Signup bonus",
        purchase: "Credit purchase",
        subscription_grant: "Subscription credits",
        adjustment: "Adjustment",
      },
      signOut: "Sign Out",
      upgradePro: "Upgrade to Pro — $19/mo",
      upgradeRedirecting: "Redirecting…",
      checkoutFailed: "Failed to create checkout session",
    },
    legal: {
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
    },
  },
  zh: {
    common: {
      brand: "ZD Translate",
      signIn: "登录",
      dashboard: "控制台",
      loading: "加载中…",
      perMonth: "/月",
    },
    home: {
      heroTitle: "实时 AI 翻译，就在你的屏幕上。",
      heroSubtitle:
        "会议、直播、游戏与文档即时翻译，无需切换窗口。新一代 AI 驱动，接近母语级准确度。",
      ctaPrimary: "免费开始",
      ctaSecondary: "查看价格",
      demoBadge: "🎬 互动演示即将上线 — 屏幕与音频实时翻译",
      proofTitle: "深受全球职场人、玩家与创作者信赖",
      testimonials: [
        {
          quote:
            "跨国会议准备时间几乎归零。实时语音翻译就像身边有一位同声传译。",
          author: "Alex M.，产品经理",
        },
        {
          quote:
            "终于可以用一个快捷键，在屏幕上畅玩未本地化游戏并阅读外文论文。",
          author: "David K.，软件工程师",
        },
        {
          quote:
            "比浏览器插件更快、更准。只在需要的那一秒出现，完全不打扰。",
          author: "Sarah L.，UX 设计师",
        },
      ],
      featuresTitle: "为速度、准确与零摩擦而生",
      features: [
        {
          title: "即时屏幕与 OCR 翻译",
          description:
            "框选屏幕上任意区域——不可选 UI 文本、图片或 PDF——一键获得悬浮翻译。",
          label: "屏幕 OCR 悬浮层",
        },
        {
          title: "实时系统音频与语音字幕",
          description:
            "在通话、网课或直播中捕获系统音频或麦克风，实时显示双语字幕。",
          label: "实时音频字幕",
        },
        {
          title: "上下文感知 AI 引擎",
          description:
            "超越逐词直译。ZD Translate 理解习语、术语与语境，输出自然流畅的译文。",
          label: "AI 语境引擎",
        },
      ],
      faqTitle: "常见问题",
      faqs: [
        {
          q: "桌面端如何与 Pro 账户同步？",
          a: "使用同一邮箱登录 ZD Translate 桌面客户端，Pro 权益将实时自动解锁。",
        },
        {
          q: "可以随时取消订阅吗？",
          a: "可以。在控制台通过账单门户一键管理或取消订阅，无隐藏费用。",
        },
        {
          q: "全屏应用、游戏与视频会议能用吗？",
          a: "可以。ZD Translate 以轻量原生悬浮层运行，适用于任意窗口、PDF、浏览器或会议应用。",
        },
      ],
      footer: "© 2026 ZD Translate. 保留所有权利。",
    },
    pricing: {
      title: "会员订阅 + 积分加油包",
      subtitle:
        "1 积分 = 1 秒实时 AI 语音同传。高频用户选月度会员，按需用户可随时购买永不过期的积分包。",
      tabAria: "定价选项",
      tabMembership: "会员方案",
      tabPacks: "积分加油包",
      footnote:
        "通过 Lemon Squeezy 安全结账。积分包适合单次购买（在支持的地区可使用本地支付方式）。",
      embeddedTitle: "充值积分或升级会员",
      membership: {
        free: {
          badge: "免费体验",
          name: "Free Trial",
          creditsLine: "注册即送 600 积分（约 10 分钟实时同传）",
          benefits: [
            "注册赠送 600 积分，体验实时同传",
            "基础语音模型与标准延迟",
            "桌面客户端按秒消耗积分",
          ],
          cta: "免费开始",
        },
        pro: {
          badge: "高频用户首选",
          name: "Pro 月度会员",
          creditsLine: "每月自动发放 7,200 积分（约 120 分钟同传）",
          benefits: [
            "0.3 秒极速延迟通道",
            "原声克隆（Voice Cloning）",
            "Zoom / Discord / 网课全场景悬浮窗",
            "加油包会员专享折扣",
          ],
          cta: "订阅 Pro — $19/月",
        },
      },
      packs: {
        neverExpire: "积分永不过期 · 一次购买随时使用",
        starter: {
          name: "Starter 加油包",
          price: "$4.99",
          creditsLine: "1,800 积分（约 30 分钟）",
          bullets: ["适合偶尔开会", "可与任意会员等级叠加"],
          cta: "购买 Starter",
        },
        popular: {
          name: "Popular 加油包",
          badge: "主推",
          price: "$12.99",
          creditsLine: "5,400 积分（约 90 分钟）",
          bullets: ["常规同传性价比之选", "Free / Pro 均可使用"],
          cta: "购买 Popular",
        },
        pro: {
          name: "Pro 加油包",
          price: "$29.99",
          creditsLine: "14,400 积分（约 4 小时）",
          bullets: ["马拉松会议与全天活动", "大额充值更省心"],
          cta: "购买 Pro 包",
        },
      },
    },
    login: {
      title: "登录你的账户",
      subtitle: "使用 Google 或邮箱继续",
      authFailed: "登录失败，请重试。",
      continueGoogle: "使用 Google 继续",
      redirecting: "跳转中…",
      or: "或",
      email: "邮箱",
      password: "密码",
      emailPlaceholder: "you@company.com",
      pleaseWait: "请稍候…",
      signIn: "登录",
      signUp: "注册",
      createAccount: "创建账户",
      useSignIn: "改为登录",
      confirmEmail: "请查收邮件确认账户后再登录。",
      signInFailed: "登录失败，请重试。",
      signUpFailed: "注册失败，请重试。",
      backHome: "← 返回首页",
    },
    dashboard: {
      account: "账户",
      proPlan: "Pro 方案",
      freePlan: "免费方案",
      creditsOverview: "账户与算力",
      badgeFree: "FREE",
      badgePro: "PRO",
      topUpCredits: "充值积分",
      subscription: "会员订阅",
      freeSummary:
        "当前为 Free 方案，按积分按秒计费。升级 Pro 可每月获得 7,200 积分，并解锁极速延迟与原声克隆。",
      proSummary:
        "Pro 会员已生效 — 每周期自动发放 7,200 积分及会员权益。可随时购买加油包补充算力。",
      manageSubscription: "管理订阅",
      desktopTitle: "桌面客户端下载",
      desktopBody:
        "下载桌面应用并使用本账户登录，即可在任意窗口开始翻译。",
      desktopIntro:
        "在桌面端运行实时同传，按秒从积分余额扣费。",
      desktopSteps: [
        "下载并安装对应系统的客户端。",
        "使用与本站相同的账号登录软件。",
        "在客户端点击开始 — 实时同传按 1 积分 / 秒消耗。",
      ],
      downloadDesktop: "下载桌面应用",
      downloadWindows: "Windows 版下载 (.exe)",
      downloadMac: "macOS 版下载 (.dmg)",
      downloadWindowsSoon: "Windows (.exe) 下载链接尚未配置，敬请期待。",
      downloadMacSoon: "macOS (.dmg) 下载链接尚未配置，敬请期待。",
      recentActivity: "最近积分明细",
      noTransactions:
        "暂无积分流水。在桌面客户端开始同传后，可在此查看按秒扣费记录。",
      colTime: "时间",
      colType: "类型",
      colDescription: "说明",
      colAmount: "变动",
      colBalance: "变动后余额",
      transactionTypes: {
        session_usage: "会话消耗",
        signup_bonus: "注册赠送",
        purchase: "积分购买",
        subscription_grant: "订阅发放",
        adjustment: "调整",
      },
      signOut: "退出登录",
      upgradePro: "升级 Pro — $19/月",
      upgradeRedirecting: "跳转中…",
      checkoutFailed: "创建支付会话失败",
    },
    legal: {
      termsOfService: "服务条款",
      privacyPolicy: "隐私政策",
    },
  },
};

export type Dictionary = (typeof dictionaries)[Locale];
