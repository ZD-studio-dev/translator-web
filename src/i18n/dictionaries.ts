export type Locale = "en" | "zh";

export const LOCALE_STORAGE_KEY = "locale";

export const dictionaries = {
  en: {
    common: {
      brand: "Real-Time Translator",
      signIn: "Sign In",
      dashboard: "Dashboard",
      loading: "Loading…",
      perMonth: "/mo",
      perQuarter: "/quarter",
      downloadMacComingSoon: "macOS (Coming Soon)",
      downloadRequirements:
        'v1.0.0 · Windows 10/11 (64-bit). If prompted by your browser or Windows SmartScreen, choose "Keep" or "More info → Run anyway".',
    },
    home: {
      heroTitle: "Real-Time AI Translation, Right on Your Screen.",
      heroSubtitle:
        "Translate meetings, streams, games, and documents instantly without switching windows. Powered by next-gen AI for native-level accuracy.",
      ctaPrimary: "Get Started Free",
      ctaSecondary: "View Pricing",
      demoBadge:
        "🎬 Interactive Demo Coming Soon — Live Screen & Audio Translation",
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
            "Go beyond literal word-for-word translation. Real-Time Translator understands idioms, technical jargon, and context to deliver natural results.",
          label: "AI Context Engine",
        },
      ],
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "How does the desktop app sync with my Pro account?",
          a: "Simply sign in to the Real-Time Translator desktop client using the same email account. Your Pro privileges unlock automatically in real time.",
        },
        {
          q: "Can I cancel my subscription at any time?",
          a: "Yes. You can manage or cancel your subscription anytime with one click from your Dashboard via our billing portal—no hidden fees.",
        },
        {
          q: "Does it work in meetings and online classes?",
          a: "Yes. It works with the meeting apps you already use, including online classes, and shows bilingual captions in real time.",
        },
      ],
      footer: "© 2026 Real-Time Translator. All rights reserved.",
    },
    pricing: {
      title: "Membership + Extra Translation Time",
      subtitle:
        "Real-time subtitles (S2T) and voice interpretation (S2S) share one time pool, billed per second. Buy extra time anytime.",
      currentPlan: "Current Plan",
      switchToQuarterly: "Switch to Quarterly",
      grantedMembershipNotice:
        "This membership was granted directly by the system and does not need to be managed in the billing center.",
      tabAria: "Pricing options",
      tabMembership: "Pro Membership",
      tabPacks: "Extra Time Packs",
      footnote:
        "Secure checkout via Lemon Squeezy. Time packs are for Pro members only and never expire.",
      packsProOnly:
        "Time packs are for Pro members only. Subscribe to Pro first.",
      embeddedTitle: "Buy extra time or upgrade",
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
          badge: "Special Offer",
          name: "Pro Monthly",
          highlight:
            "360 minutes (6 hours) of meeting translation each month (subtitles & voice)",
          benefits: [
            "Real-time bilingual subtitles (S2T) and voice interpretation (S2S)",
            "0.3s ultra-low latency for S2S voice",
            "Voice cloning & premium audio",
            "Overlay for Zoom, Teams, Google Meet, and more",
          ],
          cta: "Subscribe — $7.90/mo",
        },
        proQuarterly: {
          badge: "Save 55%",
          name: "Pro Quarterly",
          compareAtNote: "3× the original monthly price",
          savingsCallout: "Equivalent to $6.63/mo (save $24.80 vs the original price)",
          highlight:
            "1,080 minutes (18 hours) granted once per quarter · use anytime within 3 months (subtitles & voice)",
          benefits: [
            "Everything in Pro Monthly",
            "Best value for daily meetings",
            "Quarterly billing, stack extra time packs",
          ],
          cta: "Subscribe — $19.90/quarter",
        },
      },
      packs: {
        neverExpire: "Pro members only · Never expires",
        pack1h: {
          name: "1 Hour Pack",
          price: "$3.90",
          timeLine: "+60 minutes, subtitles & voice",
          bullets: [
            "Top-up for ad-hoc meetings",
            "Adds meeting time to your Pro balance",
          ],
          cta: "Buy 1 Hour",
        },
        pack3h: {
          name: "3 Hour Pack",
          badge: "Most Popular",
          price: "$7.90",
          timeLine: "+180 minutes, subtitles & voice",
          bullets: [
            "Business interpretation favorite",
            "Lower cost per minute",
          ],
          cta: "Buy 3 Hours",
        },
        pack10h: {
          name: "10 Hour Pack",
          price: "$21.90",
          timeLine: "+600 minutes, subtitles & voice",
          bullets: [
            "All-day events and marathon meetings",
            "Lowest cost per minute",
          ],
          cta: "Buy 10 Hours",
        },
      },
    },
    login: {
      title: "Sign in to your account",
      signupTitle: "Create your account",
      subtitle: "Use Google or your email to continue",
      authFailed: "Sign-in failed. Please try again.",
      continueGoogle: "Continue with Google",
      redirecting: "Redirecting…",
      or: "OR",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      passwordMismatch: "The two passwords do not match.",
      forgotPassword: "Forgot password?",
      forgotEmailRequired: "Enter your email address first.",
      resetEmailSent: "Password reset email sent. Check your inbox.",
      sendingReset: "Sending…",
      downloadAfterSignIn: "Sign in to download the desktop client.",
      resetTitle: "Set a new password",
      resetSubtitle: "Choose a new password for your account.",
      resetNeedLink: "Open this page from the link in your password reset email.",
      resetSubmit: "Update password",
      resetSuccess: "Password updated. Taking you to your dashboard…",
      emailPlaceholder: "you@example.com",
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
      paymentSuccessBanner:
        "🎉 Payment successful! Your membership and translation time have been updated.",
      creditsOverview: "Account & translation time",
      voiceTimeLabel: "Remaining meeting translation time",
      subscriptionExpires: "Membership renews / expires",
      badgeFree: "Free",
      badgePro: "Pro",
      topUpCredits: "Buy Extra Time",
      subscription: "Membership",
      freeSummary:
        "Free plan: subtitles (S2T) and voice (S2S) share one balance and are billed per second. Upgrade to Pro for included meeting time each cycle.",
      proSummary:
        "Pro is active. Subtitles and voice share your balance and are billed per second. Each cycle adds the included meeting time. Buy extra time anytime.",
      manageSubscription: "Manage Subscription",
      grantedMembershipNotice:
        "This membership was granted directly by the system and does not need to be managed in the billing center.",
      desktopTitle: "Desktop Client Download",
      desktopBody:
        "Download the desktop app and sign in with your account to start translating across any window.",
      desktopIntro:
        "Run real-time interpretation on your desktop. Subtitles and voice are billed per second from the same balance.",
      desktopSteps: [
        "Download and install the client for your OS.",
        "Sign in with the same email you use on this website.",
        "Press Start — subtitles and voice use 1 second of balance per second.",
      ],
      downloadDesktop: "Download Desktop App",
      downloadWindows: "Download for Windows (.exe)",
      downloadMac: "Download for macOS (.zip)",
      downloadWindowsSoon: "Coming soon",
      downloadMacSoon: "Coming soon",
      recentActivity: "Recent usage & top-ups",
      noTransactions:
        "No activity yet. Start a session in the desktop client to see per-second usage here.",
      colTime: "Time",
      colType: "Type",
      colDescription: "Description",
      colAmount: "Amount",
      colBalance: "Balance after",
      transactionTypes: {
        session_usage: "Session usage",
        signup_bonus: "Signup bonus",
        purchase: "Time pack purchase",
        topup: "Time top-up",
        subscription_grant: "Included meeting time",
        adjustment: "Adjustment",
      },
      signOut: "Sign Out",
      upgradePro: "Upgrade to Pro — $7.90/mo",
      upgradeRedirecting: "Redirecting…",
      checkoutFailed: "Failed to create checkout session",
      footerHome: "Home",
      footerInstall: "Setup guide",
      footerFaq: "FAQ",
    },
    legal: {
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
    },
    desktopAuth: {
      authorizingTitle: "Authorizing Real-Time Translator Desktop…",
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
      brand: "Real-Time Translator",
      signIn: "登录",
      dashboard: "控制台",
      loading: "加载中…",
      perMonth: "/月",
      perQuarter: "/季",
      downloadMacComingSoon: "macOS（即将推出）",
      downloadRequirements:
        "v1.0.0 · Windows 10/11 (64-bit)。首次下载或运行如遇浏览器/Windows 提示，选择“保留”或“更多信息 → 仍要运行”即可。",
    },
    home: {
      heroTitle: "实时 AI 翻译，就在你的屏幕上。",
      heroSubtitle:
        "会议、直播、游戏与文档即时翻译，无需切换窗口。新一代 AI 驱动，接近母语级准确度。",
      ctaPrimary: "免费开始",
      ctaSecondary: "查看价格",
      demoBadge: "🎬 互动演示即将上线 — 屏幕与音频实时翻译",
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
            "超越逐词直译。Real-Time Translator 理解习语、术语与语境，输出自然流畅的译文。",
          label: "AI 语境引擎",
        },
      ],
      faqTitle: "常见问题",
      faqs: [
        {
          q: "桌面端如何与 Pro 账户同步？",
          a: "使用同一邮箱登录 Real-Time Translator 桌面客户端，Pro 权益将实时自动解锁。",
        },
        {
          q: "可以随时取消订阅吗？",
          a: "可以。在控制台通过账单门户一键管理或取消订阅，无隐藏费用。",
        },
        {
          q: "会议和网课里能用吗？",
          a: "可以。它适用于你正在使用的会议软件和网课，并实时显示双语字幕。",
        },
      ],
      footer: "© 2026 Real-Time Translator. 保留所有权利。",
    },
    pricing: {
      title: "会员订阅 + 额外翻译时长",
      subtitle:
        "实时字幕（S2T）与语音同传（S2S）共享统一时长池，按秒精准扣减，随时可购加时包。",
      currentPlan: "当前方案",
      switchToQuarterly: "升级至季度方案",
      grantedMembershipNotice:
        "当前会员由系统直接授予，无需通过账单中心管理。",
      tabAria: "定价选项",
      tabMembership: "Pro 会员",
      tabPacks: "额外加时包",
      footnote:
        "通过 Lemon Squeezy 安全结账。加时包仅限 Pro 会员叠加使用，且永不过期。",
      packsProOnly: "加时包仅限 Pro 会员购买，请先订阅 Pro 会员。",
      embeddedTitle: "购买加时包或升级会员",
      membership: {
        free: {
          badge: "免费体验",
          name: "免费体验",
          timeLine: "注册即送 600 秒（10 分钟）免费体验时长",
          benefits: [
            "体验 S2T 字幕与 S2S 语音 — 按秒计费",
            "标准模型与延迟",
            "桌面端同账号登录",
          ],
          cta: "免费开始",
        },
        proMonthly: {
          badge: "特惠价",
          name: "Pro 月度会员",
          highlight:
            "每月含 360 分钟（6 小时）会议翻译时长（字幕 & 语音通用）",
          benefits: [
            "实时双语字幕 (S2T) 与语音同传 (S2S) 通用",
            "S2S 语音 0.3 秒极速延迟",
            "原声克隆与高品质音频",
            "Zoom / Teams / Google Meet 等会议悬浮窗",
          ],
          cta: "订阅 — $7.90/月",
        },
        proQuarterly: {
          badge: "省 55%",
          name: "Pro 季度会员",
          compareAtNote: "按月度原价合计",
          savingsCallout: "相当于每月仅需 $6.63（比原价立省 $24.80）",
          highlight:
            "每季一次性发放 1,080 分钟（18 小时）· 3 个月内自由分配（字幕 & 语音通用）",
          benefits: [
            "包含月度会员全部权益",
            "高频会议翻译更划算",
            "按季计费，可叠加加时包",
          ],
          cta: "订阅 — $19.90/季",
        },
      },
      packs: {
        neverExpire: "仅限 Pro 会员叠加使用 · 永不过期",
        pack1h: {
          name: "1 小时加时包",
          price: "$3.90",
          timeLine: "+60 分钟会议翻译时长，字幕与语音通用",
          bullets: ["临时会议加时", "时长计入同一余额"],
          cta: "购买 1 小时",
        },
        pack3h: {
          name: "3 小时加时包",
          badge: "推荐",
          price: "$7.90",
          timeLine: "+180 分钟会议翻译时长，字幕与语音通用",
          bullets: ["商务同传首选", "单分钟价格更低"],
          cta: "购买 3 小时",
        },
        pack10h: {
          name: "10 小时加时包",
          price: "$21.90",
          timeLine: "+600 分钟会议翻译时长，字幕与语音通用",
          bullets: ["全天活动与长时间会议", "单分钟价格最低"],
          cta: "购买 10 小时",
        },
      },
    },
    login: {
      title: "登录你的账户",
      signupTitle: "创建你的账户",
      subtitle: "使用 Google 或邮箱继续",
      authFailed: "登录失败，请重试。",
      continueGoogle: "使用 Google 继续",
      redirecting: "跳转中…",
      or: "或",
      email: "邮箱",
      password: "密码",
      confirmPassword: "确认密码",
      passwordMismatch: "两次输入的密码不一致。",
      forgotPassword: "忘记密码？",
      forgotEmailRequired: "请先填写邮箱。",
      resetEmailSent: "重置邮件已发送，请查收邮箱。",
      sendingReset: "发送中…",
      downloadAfterSignIn: "登录后即可下载桌面客户端",
      resetTitle: "设置新密码",
      resetSubtitle: "为你的账户设置一个新密码。",
      resetNeedLink: "请从密码重置邮件中的链接打开此页面。",
      resetSubmit: "更新密码",
      resetSuccess: "密码已更新，正在进入控制台…",
      emailPlaceholder: "you@example.com",
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
      paymentSuccessBanner:
        "🎉 支付成功！您的会员权益与翻译时长已更新。",
      creditsOverview: "账户与翻译时长",
      voiceTimeLabel: "剩余会议翻译时长",
      subscriptionExpires: "会员到期 / 续费时间",
      badgeFree: "FREE",
      badgePro: "PRO",
      topUpCredits: "购买加时包",
      subscription: "会员订阅",
      freeSummary:
        "免费方案：实时字幕（S2T）与语音同传（S2S）共用同一时长，按秒扣减。升级 Pro 后每个周期获赠会议翻译时长。",
      proSummary:
        "Pro 已生效。字幕与语音共用余额，按秒扣减；每周期自动补充所含时长，可随时购买加时包。",
      manageSubscription: "管理订阅",
      grantedMembershipNotice:
        "当前会员由系统直接授予，无需通过账单中心管理。",
      desktopTitle: "桌面客户端下载",
      desktopBody:
        "下载桌面应用并使用本账户登录，即可在任意窗口开始翻译。",
      desktopIntro:
        "桌面端实时同传：字幕与语音从同一余额按秒扣减。",
      desktopSteps: [
        "下载并安装对应系统的客户端。",
        "使用与本站相同的账号登录软件。",
        "点击开始 — 字幕与语音均按 1 秒余额 / 秒使用扣费。",
      ],
      downloadDesktop: "下载桌面应用",
      downloadWindows: "Windows 版下载 (.exe)",
      downloadMac: "macOS 版下载 (.zip)",
      downloadWindowsSoon: "即将推出",
      downloadMacSoon: "即将推出",
      recentActivity: "最近用量与充值",
      noTransactions:
        "暂无记录。在客户端开始会话后，可在此查看按秒扣费。",
      colTime: "时间",
      colType: "类型",
      colDescription: "说明",
      colAmount: "变动",
      colBalance: "变动后余额",
      transactionTypes: {
        session_usage: "会话消耗",
        signup_bonus: "注册赠送",
        purchase: "加时包购买",
        topup: "时长充值",
        subscription_grant: "订阅发放",
        adjustment: "调整",
      },
      signOut: "退出登录",
      upgradePro: "升级 Pro — $7.90/月",
      upgradeRedirecting: "跳转中…",
      checkoutFailed: "创建支付会话失败",
      footerHome: "返回首页",
      footerInstall: "安装指南",
      footerFaq: "常见问题",
    },
    legal: {
      termsOfService: "服务条款",
      privacyPolicy: "隐私政策",
    },
    desktopAuth: {
      authorizingTitle: "正在授权登录 Real-Time Translator 桌面客户端…",
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
