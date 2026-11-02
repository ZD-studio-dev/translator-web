import type { Locale } from "@/i18n/dictionaries";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalDocumentContent = {
  pageTitle: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

const supportEmail = "support@zdtranslate.com";

export const legalContent: Record<
  Locale,
  { terms: LegalDocumentContent; privacy: LegalDocumentContent }
> = {
  en: {
    terms: {
      pageTitle: "Terms of Service",
      lastUpdated: "Last updated: October 25, 2026",
      intro:
        "These Terms of Service (“Terms”) govern your access to and use of the ZD Translate website, desktop application, and related services (collectively, the “Service”) operated by ZD Translate (“we,” “us,” or “our”). By creating an account, downloading our software, or using the Service, you agree to these Terms.",
      sections: [
        {
          title: "1. Eligibility and Accounts",
          paragraphs: [
            "You must be at least 16 years old (or the age of digital consent in your jurisdiction) to use the Service. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.",
            "You agree to provide accurate registration information and to update it as needed. We may suspend or terminate accounts that violate these Terms or pose a security risk.",
          ],
        },
        {
          title: "2. Description of the Service",
          paragraphs: [
            "ZD Translate provides AI-powered screen, text, OCR, and audio translation tools for desktop and related web experiences. Features may vary by plan (Free or Pro) and platform. We may modify, add, or remove features to improve performance, security, or compliance.",
          ],
        },
        {
          title: "3. Subscriptions, Credit Packs, and Billing",
          paragraphs: [
            "Pro Monthly is a recurring membership billed through our authorized payment provider (Lemon Squeezy). Each billing cycle includes 7,200 credits (approximately 120 minutes of live AI voice interpretation at 1 credit = 1 second). Prices, billing cycles, and taxes are shown at checkout. By subscribing, you authorize us and our payment partner to charge your payment method until you cancel.",
            "We also offer Pay-As-You-Go Credit Packs for one-time purchase. Pack credits are added to your account balance, are not tied to a subscription, and do not expire. Usage of live interpretation consumes credits at one credit per second of session time, as shown in your Dashboard.",
            "You may manage or cancel Pro renewal through the billing portal linked from your Dashboard. Cancellation stops future subscription charges; Pro membership and any remaining credits typically continue until the end of the current paid period unless otherwise stated at checkout.",
          ],
        },
        {
          title: "4. Refund Policy",
          paragraphs: [
            "New accounts receive 600 free credits at registration so you can test live interpretation before paying. Real-time AI voice interpretation incurs immediate compute cost when used.",
            `For any Pro subscription or Credit Pack purchase, refunds are not available once credits from that purchase have been partially or fully consumed. If, within 14 days of purchase, none of the credits from that purchase have been used (zero consumption), you may contact us at ${supportEmail} to request a full refund. We may verify usage via your account and credit transaction history.`,
            `You may cancel upcoming Pro renewals at any time to avoid charges for the next billing cycle. Refund requests and billing questions: ${supportEmail}.`,
          ],
        },
        {
          title: "5. Acceptable Use",
          paragraphs: [
            "You may not use the Service to violate laws, infringe intellectual property, distribute malware, reverse engineer our software except as permitted by law, abuse API or rate limits, or resell access without authorization.",
            "We may investigate misuse and suspend or terminate access to protect users, partners, and the integrity of the Service.",
          ],
        },
        {
          title: "6. Intellectual Property",
          paragraphs: [
            "We retain all rights in the Service, software, branding, and documentation. You receive a limited, non-exclusive, non-transferable license to use the Service according to your plan and these Terms.",
            "You retain ownership of content you submit for translation. You grant us a license to process that content solely to provide and improve the Service, subject to our Privacy Policy.",
          ],
        },
        {
          title: "7. Third-Party Services",
          paragraphs: [
            "The Service may integrate with third-party authentication, payment, analytics, or AI providers. Your use of those services may be subject to their terms. We are not responsible for third-party websites or services linked from the Service.",
          ],
        },
        {
          title: "8. Disclaimers",
          paragraphs: [
            "The Service is provided “as is” and “as available.” AI translations may contain errors; you should verify critical content. We disclaim warranties to the fullest extent permitted by law, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
          ],
        },
        {
          title: "9. Limitation of Liability",
          paragraphs: [
            "To the maximum extent permitted by law, ZD Translate and its affiliates shall not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits, data, or goodwill arising from your use of the Service.",
            "Our aggregate liability for claims relating to the Service shall not exceed the greater of (a) amounts you paid us in the twelve months before the claim or (b) USD $50.",
          ],
        },
        {
          title: "10. Changes and Contact",
          paragraphs: [
            "We may update these Terms from time to time. Material changes will be posted on this page with an updated date. Continued use after changes constitutes acceptance.",
            `Questions about these Terms: ${supportEmail}.`,
          ],
        },
      ],
    },
    privacy: {
      pageTitle: "Privacy Policy",
      lastUpdated: "Last updated: October 25, 2026",
      intro:
        "This Privacy Policy explains how ZD Translate (“we,” “us,” or “our”) collects, uses, shares, and protects information when you use our website, desktop application, and related services (the “Service”).",
      sections: [
        {
          title: "1. Information We Collect",
          paragraphs: [
            "Account data: email address, authentication identifiers, subscription status, and profile preferences when you register or sign in (including via Google OAuth).",
            "Usage and device data: app version, feature usage, performance logs, crash diagnostics, and approximate technical metadata needed to operate and secure the Service.",
            "Payment data: subscriptions are processed by Lemon Squeezy; we receive billing status and customer identifiers but do not store full payment card numbers on our servers.",
            "Translation content: text, audio, or screen regions you submit for translation are processed to deliver results. We minimize retention and do not use your private translation content to train public models unless you opt in where offered.",
          ],
        },
        {
          title: "2. How We Use Information",
          paragraphs: [
            "We use information to provide and improve the Service, authenticate users, sync Pro entitlements, process subscriptions, respond to support requests, prevent fraud and abuse, and comply with legal obligations.",
          ],
        },
        {
          title: "3. Legal Bases (EEA/UK)",
          paragraphs: [
            "Where applicable, we process personal data based on contract performance (providing the Service), legitimate interests (security, product improvement), consent (where required), and legal obligations.",
          ],
        },
        {
          title: "4. Sharing and Processors",
          paragraphs: [
            "We share data with trusted processors such as Supabase (hosting and authentication), Lemon Squeezy (payments), cloud AI/infrastructure providers, and analytics tools under contractual safeguards. We do not sell your personal information.",
          ],
        },
        {
          title: "5. International Transfers",
          paragraphs: [
            "Your information may be processed in countries other than your own. We implement appropriate safeguards (such as standard contractual clauses where required) for cross-border transfers.",
          ],
        },
        {
          title: "6. Retention and Security",
          paragraphs: [
            "We retain information only as long as needed for the purposes described in this Policy, unless a longer period is required by law. We apply administrative, technical, and organizational measures to protect data; no method of transmission is 100% secure.",
          ],
        },
        {
          title: "7. Your Rights and Choices",
          paragraphs: [
            "Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data, and to object or withdraw consent. Contact support@zdtranslate.com to exercise these rights. You may also manage cookie preferences in your browser.",
          ],
        },
        {
          title: "8. Children",
          paragraphs: [
            "The Service is not directed to children under 16. If you believe we collected data from a child, contact us and we will take appropriate steps to delete it.",
          ],
        },
        {
          title: "9. Changes and Contact",
          paragraphs: [
            "We may update this Privacy Policy periodically. The “Last updated” date reflects the latest revision. Continued use after changes constitutes acknowledgment.",
            `Privacy inquiries: ${supportEmail}.`,
          ],
        },
      ],
    },
  },
  zh: {
    terms: {
      pageTitle: "服务条款",
      lastUpdated: "最后更新：2026 年 10 月 25 日",
      intro:
        "本服务条款（「条款」）规范您对 ZD Translate 网站、桌面应用程序及相关服务（统称「服务」）的访问与使用。创建账户、下载软件或使用服务，即表示您同意本条款。",
      sections: [
        {
          title: "1. 资格与账户",
          paragraphs: [
            "您须年满 16 周岁（或您所在司法辖区规定的数字同意年龄）方可使用服务。您应妥善保管登录凭据，并对账户下的一切活动负责。",
            "您承诺提供真实、准确的注册信息并及时更新。若违反条款或存在安全风险，我们可暂停或终止账户。",
          ],
        },
        {
          title: "2. 服务说明",
          paragraphs: [
            "ZD Translate 提供基于 AI 的屏幕、文本、OCR 与音频翻译能力，涵盖桌面端及相关网页体验。功能因方案（免费版或 Pro 版）及平台而异。我们可为提升性能、安全或合规而调整、增加或移除功能。",
          ],
        },
        {
          title: "3. 订阅、积分加油包与计费",
          paragraphs: [
            "Pro 月度会员为周期性订阅，通过授权支付服务商 Lemon Squeezy 扣费。每个计费周期自动发放 7,200 积分（按 1 积分 = 1 秒实时同传，约 120 分钟）。价格、计费周期与税费以结账页展示为准。订阅即表示您授权我们及支付伙伴在您取消前向您的支付方式扣款。",
            "我们还提供单次购买的积分加油包（Pay-As-You-Go Credit Packs）。加油包积分计入账户余额，不绑定订阅且永不过期。实时同传按会话时长以每秒 1 积分扣减，用量可在控制台查看。",
            "您可通过控制台中的账单门户管理或取消 Pro 续费。取消后不再产生未来订阅扣款；Pro 权益及剩余积分通常保留至当前已付费周期结束，除非结账页另有说明。",
          ],
        },
        {
          title: "4. 退款政策",
          paragraphs: [
            "注册即赠送 600 免费积分，供您在付费前测试实时同传。实时 AI 语音同传一经使用即产生即时算力成本。",
            `对于 Pro 订阅或积分加油包：若该笔购买所得积分已被部分或全部消耗，不支持退款。若购买后 14 天内该笔积分完全未被使用（0 消耗），可联系 ${supportEmail} 申请全额退款；我们可能通过账户及积分流水核实使用情况。`,
            `您可随时取消 Pro 后续续费，以免被收取下一计费周期费用。退款申请与账单问题请联系：${supportEmail}。`,
          ],
        },
        {
          title: "5. 可接受使用",
          paragraphs: [
            "您不得利用服务违法、侵犯知识产权、传播恶意软件、在法律允许范围外逆向工程、滥用 API 或速率限制，或未经授权转售访问权限。",
            "我们可调查滥用行为，并暂停或终止访问以保护用户、合作伙伴及服务的完整性。",
          ],
        },
        {
          title: "6. 知识产权",
          paragraphs: [
            "我们保留服务、软件、品牌及文档的一切权利。您获得有限的、非独占、不可转让的许可，仅可按您的方案及本条款使用服务。",
            "您保留所提交待译内容的所有权。您授予我们仅为提供和改进服务而处理该内容的许可，并受隐私政策约束。",
          ],
        },
        {
          title: "7. 第三方服务",
          paragraphs: [
            "服务可能集成第三方认证、支付、分析或 AI 提供商。您使用这些服务可能受其条款约束。我们对服务中链接的第三方网站或服务不承担责任。",
          ],
        },
        {
          title: "8. 免责声明",
          paragraphs: [
            "服务按「现状」及「可用性」提供。AI 翻译可能存在错误，重要内容请您自行核实。在法律允许的最大范围内，我们否认明示或默示保证，包括适销性、特定用途适用性及不侵权保证。",
          ],
        },
        {
          title: "9. 责任限制",
          paragraphs: [
            "在法律允许的最大范围内，ZD Translate 及其关联公司不对间接、附带、特殊、后果性或惩罚性损害，或利润、数据、商誉损失承担责任。",
            "就与服务相关的索赔，我们的总责任不超过以下较高者：（a）索赔前十二个月您向我们支付的金额；或（b）50 美元。",
          ],
        },
        {
          title: "10. 变更与联系",
          paragraphs: [
            "我们可不时更新本条款。重大变更将发布于本页并更新日期。变更后继续使用即视为接受。",
            "条款相关问题请联系：support@zdtranslate.com。",
          ],
        },
      ],
    },
    privacy: {
      pageTitle: "隐私政策",
      lastUpdated: "最后更新：2026 年 10 月 25 日",
      intro:
        "本隐私政策说明 ZD Translate（「我们」）在您使用网站、桌面应用程序及相关服务（「服务」）时如何收集、使用、共享及保护信息。",
      sections: [
        {
          title: "1. 我们收集的信息",
          paragraphs: [
            "账户信息：注册或登录（含 Google OAuth）时的电子邮箱、认证标识、订阅状态及资料偏好。",
            "使用与设备信息：应用版本、功能使用、性能日志、崩溃诊断及运营和安全所需的技术元数据。",
            "支付信息：订阅由 Lemon Squeezy 处理；我们接收账单状态与客户标识，不在服务器存储完整银行卡号。",
            "翻译内容：您提交的文本、音频或屏幕区域用于生成翻译结果。我们最小化留存，除非您明确 opt-in，否则不使用私人翻译内容训练公开模型。",
          ],
        },
        {
          title: "2. 信息使用方式",
          paragraphs: [
            "我们使用信息以提供和改进服务、认证用户、同步 Pro 权益、处理订阅、响应支持请求、防止欺诈与滥用，并履行法定义务。",
          ],
        },
        {
          title: "3. 法律依据（EEA/英国）",
          paragraphs: [
            "在适用情况下，我们基于合同履行、合法利益（安全与产品改进）、同意（如法律要求）及法定义务处理个人数据。",
          ],
        },
        {
          title: "4. 共享与处理方",
          paragraphs: [
            "我们在合同保障下与 Supabase（托管与认证）、Lemon Squeezy（支付）、云 AI/基础设施及分析工具等可信处理方共享数据。我们不出售您的个人信息。",
          ],
        },
        {
          title: "5. 跨境传输",
          paragraphs: [
            "您的信息可能在您所在国以外处理。我们实施适当保障措施（如法律要求的标准合同条款）以规范跨境传输。",
          ],
        },
        {
          title: "6. 保留与安全",
          paragraphs: [
            "我们仅在实现本政策目的所需期间保留信息，法律要求更长期限的除外。我们采取管理、技术与组织措施保护数据；任何传输方式均无法保证百分之百安全。",
          ],
        },
        {
          title: "7. 您的权利与选择",
          paragraphs: [
            "根据您所在地区，您可能享有访问、更正、删除或限制处理个人数据等权利，以及反对或撤回同意。请联系 support@zdtranslate.com 行使权利。您亦可在浏览器中管理 Cookie 偏好。",
          ],
        },
        {
          title: "8. 儿童",
          paragraphs: [
            "服务不面向 16 岁以下儿童。若您认为我们收集了儿童数据，请联系我们，我们将采取适当删除措施。",
          ],
        },
        {
          title: "9. 变更与联系",
          paragraphs: [
            "我们可定期更新本隐私政策。「最后更新」日期反映最新版本。变更后继续使用即视为知悉。",
            "隐私相关问题请联系：support@zdtranslate.com。",
          ],
        },
      ],
    },
  },
};
