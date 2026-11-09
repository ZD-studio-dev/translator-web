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
      title: "Membership + Extra Voice Time",
      subtitle:
        "Pro members get unlimited real-time subtitles (S2T). Live voice interpretation (S2S) is billed per second from your voice time balance—top up anytime.",
      tabAria: "Pricing options",
      tabMembership: "Pro Membership",
      tabPacks: "Extra Voice Time Packs",
      footnote:
        "Secure checkout via Lemon Squeezy. Time packs never expire and stack with any plan.",
      embeddedTitle: "Buy voice time or upgrade",
      membership: {
        free: {
          badge: "Free Trial",
          name: "Free Trial",
          timeLine: "600 seconds free trial time (10 minutes)",
          benefits: [
            "Try S2T subtitles & S2S voice — billed per second",
            "Standard models & latency",
            "Desktop client with same account",
          ],
          cta: "Get Started Free",
        },
        proMonthly: {
          badge: "Monthly",
          name: "Pro Monthly",
          highlight: "♾️ Unlimited S2T subtitles + 120 min/mo S2S voice",
          s2sLine: "Includes 7,200 seconds (120 min) S2S voice each month",
          benefits: [
            "Unlimited live subtitle translation (S2T)",
            "0.3s ultra-low latency for S2S voice",
            "Voice cloning & premium audio",
            "Overlay for Zoom, Discord & lectures",
          ],
          cta: "Subscribe — $14.90/mo",
        },
        proQuarterly: {
          badge: "Save 22%",
          name: "Pro Quarterly",
          compareAtNote: "3× monthly price",
          savingsCallout: "🔥 Just $11.63/mo — save $9.80",
          highlight:
            "🔥 150 extra S2S minutes vs monthly (450 min/quarter total)",
          s2sLine: "Includes 27,000 seconds (450 min) S2S voice each quarter",
          benefits: [
            "Everything in Pro Monthly",
            "Best value for daily voice interpretation",
            "Quarterly billing, stack extra time packs",
          ],
          cta: "Subscribe — $34.90/3 mo",
        },
      },
      packs: {
        neverExpire: "Voice time never expires · stacks with membership",
        pack1h: {
          name: "1 Hour Pack",
          price: "$4.90",
          timeLine: "+60 minutes S2S voice (3,600 sec)",
          bullets: [
            "Top-up for ad-hoc meetings",
            "Never expires — stacks with any membership",
          ],
          cta: "Buy 1 Hour",
        },
        pack3h: {
          name: "3 Hour Pack",
          badge: "Most Popular",
          price: "$12.90",
          timeLine: "+180 minutes S2S voice (10,800 sec)",
          valueCallout: "🔥 ~$0.07/min (better value than 1 Hour Pack)",
          bullets: [
            "Business interpretation favorite",
            "Lower cost per minute",
            "Long-valid balance — use until depleted",
          ],
          cta: "Buy 3 Hours",
        },
        pack10h: {
          name: "10 Hour Pack",
          price: "$29.90",
          timeLine: "+600 minutes S2S voice (36,000 sec)",
          bestValueBadge: "💎 Power users · Save 15%",
          bullets: [
            "All-day events & marathon meetings",
            "Lowest per-minute rate — built for heavy users",
          ],
          cta: "Buy 10 Hours",
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
      creditsOverview: "Account & voice time",
      voiceTimeLabel: "Remaining S2S voice time",
      unlimitedS2t: "Subtitles (S2T): ♾️ Unlimited",
      subscriptionExpires: "Membership renews / expires",
      badgeFree: "Free",
      badgePro: "Pro",
      topUpCredits: "Buy Voice Time",
      subscription: "Membership",
      freeSummary:
        "Free plan: S2T and S2S use your voice-second balance (1 sec = 1 sec). Upgrade Pro for unlimited S2T plus monthly S2S voice time.",
      proSummary:
        "Pro is active — unlimited S2T subtitles. S2S voice uses your balance; each cycle adds included minutes. Top up with time packs anytime.",
      manageSubscription: "Manage Subscription",
      desktopTitle: "Desktop Client Download",
      desktopBody:
        "Download the desktop app and sign in with your account to start translating across any window.",
      desktopIntro:
        "Run real-time interpretation on your desktop. S2S voice is billed per second from your balance; Pro S2T subtitles are unlimited.",
      desktopSteps: [
        "Download and install the client for your OS.",
        "Sign in with the same email you use on this website.",
        "Press Start — S2S voice uses 1 second of balance per second of audio.",
      ],
      downloadDesktop: "Download Desktop App",
      downloadWindows: "Download for Windows (.exe)",
      downloadMac: "Download for macOS (.dmg)",
      downloadWindowsSoon:
        "Windows (.exe) download link is not configured yet — check back soon.",
      downloadMacSoon:
        "macOS (.dmg) download link is not configured yet — check back soon.",
      recentActivity: "Recent usage & top-ups",
      noTransactions:
        "No activity yet. Start a session in the desktop client to see per-second S2S usage here.",
      colTime: "Time",
      colType: "Type",
      colDescription: "Description",
      colAmount: "Amount",
      colBalance: "Balance after",
      transactionTypes: {
        session_usage: "Session usage",
        signup_bonus: "Signup bonus",
        purchase: "Credit purchase",
        topup: "Credit top-up",
        subscription_grant: "Subscription credits",
        adjustment: "Adjustment",
      },
      signOut: "Sign Out",
      upgradePro: "Upgrade to Pro — $14.90/mo",
      upgradeRedirecting: "Redirecting…",
      checkoutFailed: "Failed to create checkout session",
    },
    legal: {
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
    },
    desktopAuth: {
      authorizingTitle: "Authorizing ZD Translate Desktop…",
      authorizingBody:
        "Redirecting your login to the desktop app on this computer. If nothing happens, use the button below.",
      openClient: "Open desktop client",
      manualHint:
        "The desktop app must be running and listening on the local port shown in the client.",
      localPortLabel: "Local callback port",
      invalidPortTitle: "Invalid port",
      invalidPortBody:
        "The port parameter must be a number between 1 and 65535. Open the link from the desktop app again.",
      backHome: "Back to home",
      errorTitle: "Could not read your session",
      errorBody: "Please sign in again and retry from the desktop app.",
      signInAgain: "Sign in",
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
      title: "会员订阅 + 额外语音时长",
      subtitle:
        "Pro 会员无限畅享实时字幕（S2T）。实时语音同传（S2S）按秒从语音时长余额扣减，可随时购买加时包。",
      tabAria: "定价选项",
      tabMembership: "Pro 会员",
      tabPacks: "额外加时包",
      footnote:
        "通过 Lemon Squeezy 安全结账。加时包永不过期，可与任意方案叠加。",
      embeddedTitle: "购买语音时长或升级会员",
      membership: {
        free: {
          badge: "免费体验",
          name: "Free Trial",
          timeLine: "注册即送 600 秒（10 分钟）免费体验时长",
          benefits: [
            "体验 S2T 字幕与 S2S 语音 — 按秒计费",
            "标准模型与延迟",
            "桌面端同账号登录",
          ],
          cta: "免费开始",
        },
        proMonthly: {
          badge: "月度",
          name: "Pro 月度会员",
          highlight: "♾️ 无限 S2T 字幕 + 每月 120 分钟 S2S 语音",
          s2sLine: "每周期含 7,200 秒（120 分钟）S2S 语音时长",
          benefits: [
            "无限实时字幕翻译（S2T）",
            "S2S 语音 0.3 秒极速延迟",
            "原声克隆与高品质音频",
            "Zoom / Discord / 网课悬浮窗",
          ],
          cta: "订阅 — $14.90/月",
        },
        proQuarterly: {
          badge: "省 22%",
          name: "Pro 季度会员",
          compareAtNote: "按月度价合计",
          savingsCallout: "🔥 相当于每月仅需 $11.63（立省 $9.8）",
          highlight: "🔥 比月付多送 150 分钟（季度共 450 分钟 S2S）",
          s2sLine: "每周期含 27,000 秒（450 分钟）S2S 语音时长",
          benefits: [
            "包含月度会员全部权益",
            "高频语音同传更划算",
            "按季计费，可叠加加时包",
          ],
          cta: "订阅 — $34.90/季",
        },
      },
      packs: {
        neverExpire: "语音时长永不过期 · 可与会员叠加",
        pack1h: {
          name: "1 小时加时包",
          price: "$4.90",
          timeLine: "+60 分钟 S2S 语音（3,600 秒）",
          bullets: ["临时会议加餐", "永不过期，可与任意会员叠加"],
          cta: "购买 1 小时",
        },
        pack3h: {
          name: "3 小时加时包",
          badge: "推荐",
          price: "$12.90",
          timeLine: "+180 分钟 S2S 语音（10,800 秒）",
          valueCallout: "🔥 约合 $0.07/分钟（比 1 小时包更划算）",
          bullets: [
            "商务同传首选",
            "单分钟性价比更高",
            "长期有效，用完即止",
          ],
          cta: "购买 3 小时",
        },
        pack10h: {
          name: "10 小时加时包",
          price: "$29.90",
          timeLine: "+600 分钟 S2S 语音（36,000 秒）",
          bestValueBadge: "💎 适合高频会议·立省 15%",
          bullets: ["全天活动 / 马拉松会议", "单价最低，资深用户必备"],
          cta: "购买 10 小时",
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
      creditsOverview: "账户与语音时长",
      voiceTimeLabel: "剩余 S2S 语音翻译时长",
      unlimitedS2t: "字幕翻译（S2T）：♾️ 无限畅享",
      subscriptionExpires: "会员到期 / 续费时间",
      badgeFree: "FREE",
      badgePro: "PRO",
      topUpCredits: "购买语音时长",
      subscription: "会员订阅",
      freeSummary:
        "Free 方案：S2T / S2S 均按秒消耗余额。升级 Pro 可无限 S2T，并每周期获赠 S2S 语音时长。",
      proSummary:
        "Pro 已生效 — S2T 字幕无限。S2S 语音从余额按秒扣费；每周期自动补充含有时长，可随时购买加时包。",
      manageSubscription: "管理订阅",
      desktopTitle: "桌面客户端下载",
      desktopBody:
        "下载桌面应用并使用本账户登录，即可在任意窗口开始翻译。",
      desktopIntro:
        "桌面端实时同传：S2S 语音按秒扣余额；Pro 的 S2T 字幕无限畅享。",
      desktopSteps: [
        "下载并安装对应系统的客户端。",
        "使用与本站相同的账号登录软件。",
        "点击开始 — S2S 语音按 1 秒余额 / 秒音频扣费。",
      ],
      downloadDesktop: "下载桌面应用",
      downloadWindows: "Windows 版下载 (.exe)",
      downloadMac: "macOS 版下载 (.dmg)",
      downloadWindowsSoon: "Windows (.exe) 下载链接尚未配置，敬请期待。",
      downloadMacSoon: "macOS (.dmg) 下载链接尚未配置，敬请期待。",
      recentActivity: "最近用量与充值",
      noTransactions:
        "暂无记录。在客户端开始 S2S 会话后，可在此查看按秒扣费。",
      colTime: "时间",
      colType: "类型",
      colDescription: "说明",
      colAmount: "变动",
      colBalance: "变动后余额",
      transactionTypes: {
        session_usage: "会话消耗",
        signup_bonus: "注册赠送",
        purchase: "积分购买",
        topup: "积分充值",
        subscription_grant: "订阅发放",
        adjustment: "调整",
      },
      signOut: "退出登录",
      upgradePro: "升级 Pro — $14.90/月",
      upgradeRedirecting: "跳转中…",
      checkoutFailed: "创建支付会话失败",
    },
    legal: {
      termsOfService: "服务条款",
      privacyPolicy: "隐私政策",
    },
    desktopAuth: {
      authorizingTitle: "正在授权登录 ZD Translate 桌面客户端…",
      authorizingBody:
        "正在将登录凭证传回本机桌面应用。若未自动跳转，请点击下方按钮。",
      openClient: "打开客户端",
      manualHint: "请确保桌面客户端已启动并在本机端口上等待回调。",
      localPortLabel: "本机回调端口",
      invalidPortTitle: "端口号无效",
      invalidPortBody:
        "port 参数须为 1–65535 之间的数字。请从桌面客户端重新打开授权链接。",
      backHome: "返回首页",
      errorTitle: "无法读取登录状态",
      errorBody: "请重新登录后，再从桌面客户端发起授权。",
      signInAgain: "去登录",
    },
  },
};

export type Dictionary = (typeof dictionaries)[Locale];
