"use client";

import Link from "next/link";
import {
  Apple,
  CreditCard,
  LifeBuoy,
  Mail,
  Monitor,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/i18n/language-provider";

type FaqPageClientProps = { userEmail: string | null };

type FaqItem = {
  question: string;
  paragraphs?: string[];
  steps?: string[];
  tip?: string;
};

type FaqCategory = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  items: FaqItem[];
};

const SUPPORT_EMAIL = "support@zdtranslate.com";

const faqContent: Record<"zh" | "en", FaqCategory[]> = {
  zh: [
    {
      id: "start",
      label: "快速开始",
      description: "第一次使用与基本流程",
      icon: Rocket,
      items: [
        {
          question: "第一次使用 Real-Time Translator，需要先做什么？",
          steps: [
            "登录与官网相同的账户，确认客户端已经识别到当前会员和语音时长。",
            "在设置页选择真实麦克风、会议音频输入和翻译语音虚拟麦克风输出。",
            "选择你说的语言与目标语言，先启动字幕翻译确认音频采集正常。",
            "需要让对方听到译音时，再启动输入语音翻译（S2S）。",
          ],
          tip: "建议全程佩戴耳机，可显著减少回声、串音和重复翻译。",
        },
        {
          question: "对方也需要安装客户端或虚拟声卡吗？",
          paragraphs: [
            "不需要。Real-Time Translator 和虚拟声卡只需要安装在你的电脑上。对方继续使用原来的 Zoom、Google Meet、飞书、腾讯会议或 Microsoft Teams 即可。",
          ],
        },
        {
          question: "字幕翻译和语音翻译有什么区别？",
          paragraphs: [
            "字幕翻译（S2T）把会议声音实时显示为双语字幕，不会向会议麦克风发送声音。语音翻译（S2S）会把你说的话转换成目标语言，并通过虚拟麦克风发送给对方。",
          ],
        },
      ],
    },
    {
      id: "mac",
      label: "macOS 使用指南",
      description: "BlackHole 与会议软件设置",
      icon: Apple,
      items: [
        {
          question: "Mac 客户端和会议软件具体如何设置？",
          steps: [
            "安装 BlackHole 16ch 与 BlackHole 2ch，然后重新打开会议软件和 Real-Time Translator。",
            "打开 macOS「音频 MIDI 设置」，创建多输出设备，并勾选你的耳机或扬声器与 BlackHole 16ch。",
            "在会议软件中，将扬声器设为刚创建的多输出设备（或 BlackHole 16ch），将麦克风设为 BlackHole 2ch。",
            "在 Real-Time Translator 中，将「会议音频输入」设为 BlackHole 16ch，将「我的语言麦克风」设为真实麦克风。",
            "将「会议语言虚拟麦克风输出」设为 BlackHole 2ch，选择语言后启动翻译。",
          ],
          tip: "推荐会议软件扬声器使用“耳机 + BlackHole 16ch”的多输出设备，这样你能听到会议，同时客户端也能采集对方声音。",
        },
        {
          question: "为什么会议软件或客户端找不到 BlackHole 2ch / 16ch？",
          steps: [
            "在「音频 MIDI 设置」中确认 BlackHole 2ch 和 BlackHole 16ch 都存在。",
            "如果只看到一个设备，请分别重新安装 2ch 与 16ch 驱动。",
            "完全退出并重新打开会议软件；部分软件只在启动时读取音频设备列表。",
            "仍未出现时重启 Mac，并确认系统已允许音频驱动加载。",
          ],
        },
        {
          question: "Mac 上听不到对方声音，或者出现回声怎么办？",
          paragraphs: [
            "听不到声音通常是因为会议扬声器只输出到 BlackHole 16ch。请改用包含耳机/扬声器和 BlackHole 16ch 的多输出设备。",
            "出现回声或重复翻译时，请佩戴耳机，确认真实麦克风没有采集扬声器外放，并避免把 BlackHole 2ch 再路由回 BlackHole 16ch。",
          ],
        },
      ],
    },
    {
      id: "windows",
      label: "Windows 使用指南",
      description: "CABLE A / B 与会议软件设置",
      icon: Monitor,
      items: [
        {
          question: "Windows 客户端和会议软件具体如何设置？",
          steps: [
            "以管理员身份安装 VB-CABLE A 与 CABLE B 驱动，完成后重启 Windows。",
            "在会议软件中，将扬声器设为 CABLE A Input，将麦克风设为 CABLE B Output。",
            "在 Real-Time Translator 中，将「会议音频输入」设为 CABLE A Output，将「我的语言麦克风」设为真实麦克风。",
            "将「会议语言虚拟麦克风输出」设为 CABLE B Input，选择语言后启动翻译。",
            "如需同时听到会议声音，可在 Windows 声音设置中监听 CABLE A Output，或使用 Voicemeeter 路由到耳机。",
          ],
          tip: "设备名称中的 Input 是向虚拟线缆送入声音，Output 是从虚拟线缆读取声音；会议与客户端应分别选择一进一出。",
        },
        {
          question: "为什么 Windows 只有 CABLE，没有 CABLE A 和 CABLE B？",
          paragraphs: [
            "标准 VB-CABLE 通常只提供一组 CABLE。需要两条独立音频通道时，请另外安装 VB-CABLE A+B 驱动包，并使用管理员权限完成安装。安装后必须重启系统，会议软件才会刷新设备列表。",
          ],
        },
        {
          question: "Windows 翻译声音卡顿、模糊或有杂音怎么办？",
          steps: [
            "把真实麦克风、CABLE A、CABLE B 和客户端统一设置为 48,000 Hz。",
            "关闭 Windows 的音频增强、空间音效和不必要的自动增益。",
            "取消虚拟设备的独占模式，避免会议软件与客户端争用设备。",
            "优先使用有线耳机，并关闭其他正在占用麦克风或虚拟声卡的录音软件。",
          ],
        },
      ],
    },
    {
      id: "account",
      label: "账户与计费",
      description: "登录、会员与语音时长",
      icon: CreditCard,
      items: [
        {
          question: "网页账户如何同步到桌面客户端？",
          paragraphs: [
            "在客户端点击登录后，浏览器会打开官网。使用同一账户完成登录并允许回调，客户端会自动获得登录状态、会员权益和语音时长余额。",
          ],
        },
        {
          question: "字幕和实时语音翻译如何计费？",
          paragraphs: [
            "字幕翻译（S2T）与实时语音翻译（S2S）按当前方案分别提供。S2S 会按照实际使用时长从语音时长余额中扣减，剩余时长和消费记录可在 Dashboard 查看。",
          ],
        },
        {
          question: "可以随时取消订阅吗？",
          paragraphs: [
            "可以。登录 Dashboard 后进入订阅管理即可取消自动续费。取消后，已购买权益会持续到当前计费周期结束。额外购买的语音时长以购买页面说明为准。",
          ],
        },
      ],
    },
    {
      id: "support",
      label: "故障与反馈",
      description: "兼容性、隐私与定制需求",
      icon: LifeBuoy,
      items: [
        {
          question: "支持哪些会议软件？",
          paragraphs: [
            "只要会议软件允许选择扬声器和麦克风设备，通常都可以使用，包括 Zoom、Google Meet、飞书会议、腾讯会议、Microsoft Teams、Discord 及主流网课软件。",
          ],
        },
        {
          question: "客户端没有字幕或没有翻译声音，应该先检查什么？",
          steps: [
            "确认客户端已登录，且字幕翻译或输入语音翻译处于启动状态。",
            "检查会议软件与客户端的输入/输出设备是否与本页指南一致。",
            "观察客户端音量指示是否有变化；没有变化通常代表选错音频输入。",
            "确认系统已授予客户端麦克风权限，并关闭占用同一设备的其他软件。",
          ],
        },
        {
          question: "语音和会议内容会被保存吗？",
          paragraphs: [
            "客户端会为实时识别和翻译传输必要的音频数据。具体的数据处理、保存范围和服务商说明以官网隐私政策为准。请在涉及敏感会议时遵循所在组织的安全与合规要求。",
          ],
        },
        {
          question: "需要特殊定制、企业部署或想反馈功能怎么办？",
          paragraphs: [
            `请发送邮件至 ${SUPPORT_EMAIL}，并附上使用系统、会议软件、期望功能和可复现步骤。企业部署、专属模型、语言支持或音频路由定制也可以通过邮件沟通。`,
          ],
        },
      ],
    },
  ],
  en: [
    {
      id: "start",
      label: "Getting started",
      description: "First-time setup and workflow",
      icon: Rocket,
      items: [
        {
          question: "What should I do before my first translated meeting?",
          steps: [
            "Sign in with the same account you use on the website and confirm your membership and voice-time balance.",
            "Choose your physical microphone, meeting-audio input, and translated-voice virtual output in Settings.",
            "Select the source and target languages, then start captions first to verify audio capture.",
            "Start voice translation (S2S) when you want the other participant to hear the translated voice.",
          ],
          tip: "Use headphones throughout the meeting to reduce echo, audio loops, and repeated translation.",
        },
        {
          question: "Does the other participant need to install anything?",
          paragraphs: [
            "No. Only your computer needs Real-Time Translator and the virtual audio devices. Everyone else can continue using Zoom, Google Meet, Lark, Tencent Meeting, or Microsoft Teams as usual.",
          ],
        },
        {
          question: "What is the difference between captions and voice translation?",
          paragraphs: [
            "Captions (S2T) display meeting audio as bilingual text without sending sound to the meeting microphone. Voice translation (S2S) translates what you say and sends the target-language voice through a virtual microphone.",
          ],
        },
      ],
    },
    {
      id: "mac",
      label: "macOS guide",
      description: "BlackHole and meeting settings",
      icon: Apple,
      items: [
        {
          question: "How do I configure the Mac app and my meeting software?",
          steps: [
            "Install BlackHole 16ch and BlackHole 2ch, then reopen your meeting app and Real-Time Translator.",
            "In Audio MIDI Setup, create a Multi-Output Device containing your headphones or speakers and BlackHole 16ch.",
            "Set the meeting speaker to that Multi-Output Device (or BlackHole 16ch) and the meeting microphone to BlackHole 2ch.",
            "In Real-Time Translator, set Meeting Audio Input to BlackHole 16ch and My Microphone to your physical microphone.",
            "Set the translated meeting-microphone output to BlackHole 2ch, choose your languages, and start translation.",
          ],
          tip: "A Multi-Output Device with headphones plus BlackHole 16ch lets you hear the meeting while the app captures it.",
        },
        {
          question: "Why can’t the app find BlackHole 2ch or 16ch?",
          steps: [
            "Open Audio MIDI Setup and confirm both devices are listed.",
            "If only one appears, reinstall the missing 2ch or 16ch driver separately.",
            "Quit and reopen the meeting app because many apps only scan devices at launch.",
            "Restart the Mac if needed and confirm macOS allowed the audio driver to load.",
          ],
        },
        {
          question: "What should I do if I cannot hear the meeting or hear an echo?",
          paragraphs: [
            "If you cannot hear the meeting, use a Multi-Output Device containing both your headphones or speakers and BlackHole 16ch.",
            "For echo or repeated translation, use headphones, prevent your physical microphone from capturing speaker output, and do not route BlackHole 2ch back into BlackHole 16ch.",
          ],
        },
      ],
    },
    {
      id: "windows",
      label: "Windows guide",
      description: "CABLE A / B and meeting settings",
      icon: Monitor,
      items: [
        {
          question: "How do I configure the Windows app and my meeting software?",
          steps: [
            "Install VB-CABLE A and CABLE B as administrator, then restart Windows.",
            "Set the meeting speaker to CABLE A Input and the meeting microphone to CABLE B Output.",
            "In Real-Time Translator, set Meeting Audio Input to CABLE A Output and My Microphone to your physical microphone.",
            "Set the translated meeting-microphone output to CABLE B Input, choose your languages, and start translation.",
            "To hear the meeting locally, monitor CABLE A Output in Windows or route it to your headphones with Voicemeeter.",
          ],
          tip: "Input sends audio into a virtual cable, while Output reads audio from it. The meeting app and translator must use opposite ends.",
        },
        {
          question: "Why do I only see CABLE, not CABLE A and CABLE B?",
          paragraphs: [
            "The standard VB-CABLE package usually provides one cable. Install the separate VB-CABLE A+B driver pack as administrator, then restart Windows so meeting apps can refresh their device list.",
          ],
        },
        {
          question: "How can I fix choppy, muffled, or noisy translated audio?",
          steps: [
            "Set the physical microphone, CABLE A, CABLE B, and the app to 48,000 Hz.",
            "Disable Windows audio enhancements, spatial audio, and unnecessary automatic gain control.",
            "Turn off exclusive mode for virtual devices to prevent device contention.",
            "Prefer wired headphones and close other recording apps using the same devices.",
          ],
        },
      ],
    },
    {
      id: "account",
      label: "Account & billing",
      description: "Sign-in, membership, and voice time",
      icon: CreditCard,
      items: [
        {
          question: "How does my web account sync with the desktop app?",
          paragraphs: [
            "Click Sign in in the desktop app. Complete sign-in in the browser and allow the callback. The app will receive your session, membership benefits, and voice-time balance automatically.",
          ],
        },
        {
          question: "How are captions and voice translation billed?",
          paragraphs: [
            "Captions (S2T) and live voice translation (S2S) are provided according to your current plan. S2S deducts from your voice-time balance based on session usage. Your remaining time and transaction history are available in the Dashboard.",
          ],
        },
        {
          question: "Can I cancel my subscription at any time?",
          paragraphs: [
            "Yes. Open subscription management from the Dashboard to cancel renewal. Your paid benefits remain active until the end of the current billing period. Additional voice time follows the terms shown at purchase.",
          ],
        },
      ],
    },
    {
      id: "support",
      label: "Troubleshooting & feedback",
      description: "Compatibility, privacy, and custom needs",
      icon: LifeBuoy,
      items: [
        {
          question: "Which meeting apps are supported?",
          paragraphs: [
            "Any meeting app that lets you select speaker and microphone devices will usually work, including Zoom, Google Meet, Lark, Tencent Meeting, Microsoft Teams, Discord, and common online-class platforms.",
          ],
        },
        {
          question: "What should I check when there are no captions or translated voice?",
          steps: [
            "Confirm the app is signed in and the relevant caption or voice-translation session is running.",
            "Verify the meeting and app devices match the setup instructions on this page.",
            "Watch the input meter. No movement usually means the wrong audio input is selected.",
            "Confirm microphone permission is granted and close other apps holding the same device.",
          ],
        },
        {
          question: "Are voice and meeting contents stored?",
          paragraphs: [
            "The app sends the audio needed for live recognition and translation. See the website Privacy Policy for details about processing and retention, and follow your organization’s security requirements for sensitive meetings.",
          ],
        },
        {
          question: "How do I request custom features, enterprise deployment, or send feedback?",
          paragraphs: [
            `Email ${SUPPORT_EMAIL} with your operating system, meeting app, expected behavior, and reproduction steps. You can also contact us about enterprise deployment, dedicated models, additional languages, or custom audio routing.`,
          ],
        },
      ],
    },
  ],
};

export function FaqPageClient({ userEmail }: FaqPageClientProps) {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const categories = faqContent[locale];

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      <SiteHeader userEmail={userEmail} contentMaxWidthClass="max-w-7xl" />

      <main className="w-full flex-1 px-5 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-20">
            <div className="border-b border-slate-200 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
              <p className="text-sm font-bold tracking-[0.16em] text-blue-600">
                {zh ? "帮助中心" : "HELP CENTER"}
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {zh ? "使用帮助" : "Product help"}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {zh ? "选择分类快速定位内容" : "Choose a category to jump to its guide"}
              </p>

              <nav
                className="mt-5 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 lg:grid-cols-1"
                aria-label={zh ? "问题分类" : "FAQ categories"}
              >
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <a
                      key={category.id}
                      href={`#faq-${category.id}`}
                      className="group flex items-center gap-3 border-l-2 border-transparent px-3 py-3 text-slate-600 transition hover:border-blue-600 hover:bg-blue-50/70 hover:text-blue-700"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-blue-600" aria-hidden />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold sm:text-base">{category.label}</span>
                        <span className="mt-0.5 hidden text-xs text-slate-400 lg:block">
                          {category.items.length} {zh ? "个问题" : "articles"}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-bold tracking-[0.18em] text-blue-600">FAQ</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {zh ? "常见问题与配置指南" : "Frequently asked questions & setup guides"}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                {zh
                  ? "这里整理了客户端使用、虚拟声卡、会议软件设置、账户计费和故障排查方法。"
                  : "Find client setup, virtual audio, meeting configuration, billing, and troubleshooting guidance."}
              </p>
            </header>

            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <section
                  key={category.id}
                  id={`faq-${category.id}`}
                  className="scroll-mt-24 border-b border-slate-200 py-10 last:border-b-0"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-2xl font-black text-slate-950">{category.label}</h2>
                      <p className="mt-1 text-sm text-slate-500">{category.description}</p>
                    </div>
                  </div>

                  <div className="mt-7 divide-y divide-slate-200">
                    {category.items.map((item) => (
                      <article key={item.question} className="py-7 first:pt-0 last:pb-0">
                        <h3 className="text-lg font-bold leading-8 text-slate-950 sm:text-xl">
                          {item.question}
                        </h3>
                        <div className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
                          {item.paragraphs?.map((paragraph) => (
                            <p key={paragraph} className="mt-3 first:mt-0">{paragraph}</p>
                          ))}
                          {item.steps ? (
                            <ol className="space-y-3">
                              {item.steps.map((step, index) => (
                                <li key={step} className="flex gap-3">
                                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                    {index + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          ) : null}
                          {item.tip ? (
                            <p className="mt-5 border-l-2 border-blue-500 pl-4 text-sm font-medium leading-7 text-blue-800">
                              <span className="font-bold">{zh ? "建议：" : "Tip: "}</span>
                              {item.tip}
                            </p>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}

            <section className="border-t border-slate-200 py-10">
              <div className="flex gap-4">
                <Mail className="mt-1 h-6 w-6 shrink-0 text-blue-600" aria-hidden />
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    {zh ? "需要特殊定制或功能反馈？" : "Need a custom solution or want to share feedback?"}
                  </h2>
                  <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
                    {zh
                      ? "如需企业部署、专属功能、特殊语言或音频路由定制，请发送邮件并附上使用系统、会议软件和具体需求。"
                      : "For enterprise deployment, dedicated features, additional languages, or custom audio routing, email us with your system, meeting app, and requirements."}
                  </p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="mt-3 inline-block text-base font-bold text-blue-600 transition hover:text-blue-700"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
            </section>

            <p className="pb-4 text-sm text-slate-500">
              <Link href="/" className="font-semibold text-blue-600 transition hover:text-blue-700">
                {zh ? "返回首页" : "Back to home"}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
