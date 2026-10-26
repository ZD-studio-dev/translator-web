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
      pricingTitle: "Simple, Transparent Pricing",
      planFree: "Free",
      planPro: "Pro",
      freeBenefits: [
        "Basic daily text & shortcut translations",
        "Standard translation speed & models",
        "Community support",
      ],
      proBenefits: [
        "Unlimited real-time screen, OCR & audio translation",
        "Ultra-low latency Pro AI models",
        "Custom hotkeys, overlay styles & priority support",
      ],
      getStarted: "Get Started",
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
      subscription: "Subscription",
      freeSummary:
        "You are currently on the Free plan. Upgrade to Pro for unlimited real-time translations.",
      proSummary:
        "Your Pro membership is active. You have full access to unlimited AI translations, real-time audio captions, and priority models.",
      manageSubscription: "Manage Subscription",
      desktopTitle: "ZD Translate Desktop Client",
      desktopBody:
        "Download the desktop app and sign in with your account to start translating across any window.",
      downloadDesktop: "Download Desktop App",
      signOut: "Sign Out",
      upgradePro: "Upgrade to Pro ($9.9/mo)",
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
      pricingTitle: "简单透明的定价",
      planFree: "免费版",
      planPro: "Pro 版",
      freeBenefits: [
        "基础每日文本与快捷键翻译",
        "标准翻译速度与模型",
        "社区支持",
      ],
      proBenefits: [
        "无限实时屏幕、OCR 与音频翻译",
        "超低延迟 Pro AI 模型",
        "自定义快捷键、悬浮样式与优先支持",
      ],
      getStarted: "立即开始",
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
      subscription: "订阅",
      freeSummary:
        "你当前为免费方案。升级 Pro 即可解锁无限实时翻译。",
      proSummary:
        "Pro 会员已生效。你可使用无限 AI 翻译、实时音频字幕与优先模型。",
      manageSubscription: "管理订阅",
      desktopTitle: "ZD Translate 桌面客户端",
      desktopBody:
        "下载桌面应用并使用本账户登录，即可在任意窗口开始翻译。",
      downloadDesktop: "下载桌面应用",
      signOut: "退出登录",
      upgradePro: "升级 Pro（$9.9/月）",
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
