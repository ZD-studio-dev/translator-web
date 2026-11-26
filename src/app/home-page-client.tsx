"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AudioLines,
  LogIn,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { GetStartedButton } from "@/app/get-started-button";
import { MACOS_DOWNLOAD_URL, WINDOWS_DOWNLOAD_URL } from "@/config/downloads";
import { LanguageToggle } from "@/components/language-toggle";
import { PricingSection, type MembershipPlanTier } from "@/components/PricingSection";
import { useLanguage } from "@/i18n/language-provider";

type HomePageClientProps = {
  userEmail: string | null;
  isPro?: boolean;
  planTier?: MembershipPlanTier;
  customerPortalUrl?: string | null;
  winDownloadUrl?: string | null;
  macDownloadUrl?: string | null;
};

function emailLocalPart(email: string): string {
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

function avatarInitial(email: string): string {
  return (emailLocalPart(email).trim()[0] ?? "?").toUpperCase();
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-[0_10px_28px_rgba(37,99,235,0.25)] ${compact ? "h-9 w-9" : "h-11 w-11"}`}
      aria-hidden
    >
      <AudioLines className={compact ? "h-5 w-5" : "h-6 w-6"} />
    </span>
  );
}

function ProductPreview({ zh }: { zh: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[570px]">
      <div className="absolute -inset-4 -z-10 rounded-[38px] bg-blue-300/25 blur-3xl" />
      <div className="overflow-hidden rounded-[24px] border border-white/90 bg-white/85 p-3 shadow-[0_22px_65px_rgba(37,99,235,0.22)] backdrop-blur">
        <div className="flex h-10 items-center gap-2 px-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-4 flex items-center gap-2.5 text-sm font-bold text-slate-900">
            <BrandMark compact />
            Real-Time Translator
          </div>
        </div>

        <div className="rounded-[20px] bg-white/75 p-3.5">
          <section className="rounded-2xl border border-blue-100 bg-white/60 p-3.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Image src="/ui-icons/mic-blue.svg" alt="" width={23} height={23} className="h-5.5 w-5.5" />
              <span className="text-sm font-black text-slate-900">{zh ? "你说（中文）" : "You speak (Chinese)"}</span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{zh ? "实时翻译中" : "Live"}
              </span>
            </div>
            <p className="mt-2 pl-8 text-sm font-black text-slate-950 sm:text-base">我们下周一开项目评审会吧。</p>
            <div className="mt-3 grid grid-cols-[.8fr_28px_1.25fr] items-center gap-3 pl-8">
              <div className="flex h-10 items-center justify-center gap-1 px-2">
                {[6, 13, 23, 35, 17, 29, 40, 25, 32, 18, 27, 12, 7].map((height, index) => (
                  <span key={index} className="w-1 rounded-full bg-blue-500" style={{ height }} />
                ))}
              </div>
              <span className="text-center text-3xl font-light leading-none text-blue-600">→</span>
              <div>
                <div className="mb-1.5 flex items-center gap-2 text-xs font-black text-slate-900 sm:text-sm">
                  <Image src="/ui-icons/speaker-blue.svg" alt="" width={22} height={22} className="h-5.5 w-5.5" />
                  {zh ? "对方听到（英文）" : "They hear (English)"}
                </div>
                <p className="rounded-xl bg-blue-100 px-3 py-2 text-xs font-bold leading-4 text-slate-950 sm:text-sm">
                  Let&apos;s hold the project review meeting next Monday.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-3 rounded-2xl border border-blue-100 bg-white/70 p-3.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Image src="/ui-icons/user-blue.svg" alt="" width={23} height={23} className="h-5.5 w-5.5" />
              <span className="text-sm font-black text-slate-900">{zh ? "对方在说（English）" : "They speak (English)"}</span>
              <div className="ml-auto mr-3 flex h-6 items-center gap-0.5" aria-hidden>
                {[5, 10, 18, 28, 16, 23, 13, 8, 4].map((height, index) => (
                  <span key={index} className="w-1 rounded-full bg-blue-500" style={{ height }} />
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{zh ? "实时翻译中" : "Live"}
              </span>
            </div>
            <p className="mt-2.5 ml-8 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold leading-4 text-slate-950 sm:text-sm">
              The design is ready, and we can move to the testing phase next.
            </p>
            <div className="mt-3 flex items-start gap-2.5">
              <Image src="/ui-icons/cc-blue.svg" alt="" width={23} height={23} className="mt-1 h-5.5 w-5.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 sm:text-sm">{zh ? "双语字幕（实时显示）" : "Bilingual captions"}</p>
                <div className="mt-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold leading-4 text-slate-950 sm:text-sm">
                  <p>The design is ready, and we can move to the testing phase next.</p>
                  <p className="mt-0.5">设计已经完成，我们可以进入测试阶段了。</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function CapabilityCards({ zh }: { zh: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <article className="overflow-hidden rounded-2xl border border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f5f9ff_100%)] p-4 shadow-[0_10px_30px_rgba(59,130,246,0.08)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-200">
            <Image src="/ui-icons/speaker-white.svg" alt="" width={24} height={24} className="h-6 w-6" />
          </span>
          <h3 className="text-base font-black leading-6 text-slate-950 sm:text-lg">
            {zh ? "你说中文，对方只听到目标语言" : "Speak your language, they hear theirs"}
          </h3>
        </div>
        <div className="mt-4 rounded-2xl bg-blue-50/80 px-4 pb-2 pt-3">
          <div className="grid grid-cols-[minmax(0,1fr)_14px_minmax(0,1.12fr)_14px_minmax(0,1fr)] items-center gap-1 sm:grid-cols-[auto_auto_auto_auto_auto] sm:justify-center sm:gap-3">
            <span className="flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2 py-2 text-xs font-bold text-slate-800 shadow-sm sm:gap-2 sm:px-4 sm:text-sm">
              <Image src="/ui-icons/mic-blue.svg" alt="" width={20} height={20} className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <span>{zh ? "中文" : <><span className="sm:hidden">You</span><span className="hidden sm:inline">Your language</span></>}</span>
            </span>
            <span className="text-center text-base text-blue-500 sm:text-xl">→</span>
            <span className="flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-2 py-2 text-xs font-bold text-white shadow-lg shadow-blue-200 sm:gap-2 sm:px-4 sm:text-sm">
              <AudioLines className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span>{zh ? "实时翻译" : <><span className="sm:hidden">Live</span><span className="hidden sm:inline">Live translation</span></>}</span>
            </span>
            <span className="text-center text-base text-violet-500 sm:text-xl">→</span>
            <span className="flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2 py-2 text-xs font-bold text-slate-800 shadow-sm sm:gap-2 sm:px-4 sm:text-sm">
              <Image src="/ui-icons/speaker-blue.svg" alt="" width={20} height={20} className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <span>{zh ? "English" : <><span className="sm:hidden">Target</span><span className="hidden sm:inline">Target language</span></>}</span>
            </span>
          </div>
          <Image src="/ui-icons/waveform-gradient.svg" alt="" width={420} height={54} className="mx-auto mt-1 h-9 w-[88%]" />
        </div>
      </article>

      <article className="rounded-2xl border border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f7f5ff_100%)] p-4 shadow-[0_10px_30px_rgba(59,130,246,0.08)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-200">
            <Image src="/ui-icons/captions-white.svg" alt="" width={24} height={24} className="h-6 w-6" />
          </span>
          <h3 className="text-base font-black leading-6 text-slate-950 sm:text-lg">{zh ? "对方边说，双语字幕边出现" : "They speak, bilingual captions appear"}</h3>
        </div>
        <div className="mt-4 space-y-2 rounded-2xl bg-blue-50/65 p-3">
          <div className="grid grid-cols-[42px_minmax(0,1fr)] items-start gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm sm:px-4">
            <span className="mt-0.5 flex h-7 items-center justify-center rounded-full bg-blue-50 px-2 text-xs font-black text-blue-600">EN</span>
            <span className="min-w-0 leading-6">The design is ready, and we can move to the testing phase next.</span>
          </div>
          <div className="grid grid-cols-[42px_minmax(0,1fr)] items-start gap-3 rounded-xl bg-blue-100/60 px-3 py-2.5 text-sm font-semibold text-slate-800 sm:px-4">
            <span className="mt-0.5 flex h-7 items-center justify-center rounded-full bg-white px-2 text-xs font-black text-slate-800">中</span>
            <span className="min-w-0 leading-6">设计已经完成，我们可以进入测试阶段了。</span>
          </div>
        </div>
      </article>
    </div>
  );
}

function meetingAppsFor(zh: boolean) {
  return [
    { name: "Zoom", logo: "/brands/zoom.svg" },
    { name: "Google Meet", logo: "/brands/google-meet.svg" },
    { name: zh ? "飞书会议" : "Lark", logo: "/brands/feishu.svg" },
    { name: zh ? "腾讯会议" : "Tencent Meeting", logo: "/brands/tencent-meeting.svg" },
    { name: "Microsoft Teams", logo: "/brands/microsoft-teams.svg" },
  ];
}

const BLACKHOLE_URL = "https://existential.audio/blackhole/";
const VBCABLE_URL = "https://vb-audio.com/Cable/";

function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-blue-600 underline decoration-blue-200 underline-offset-2 hover:text-blue-700"
    >
      {children}
    </a>
  );
}

function InstallGuide({ zh }: { zh: boolean }) {
  const [activeId, setActiveId] = useState<"mac" | "windows">("mac");
  const guides: {
    id: "mac" | "windows";
    name: string;
    input: string;
    output: string;
    title: ReactNode;
    inputNote: string;
    outputNote: string;
    steps: ReactNode[];
  }[] = [
    {
      id: "mac",
      name: "macOS",
      input: "BlackHole 16ch",
      output: "BlackHole 2ch",
      title: zh ? (
        <>macOS 音频路由（使用 <GuideLink href={BLACKHOLE_URL}>BlackHole</GuideLink>）</>
      ) : (
        <>macOS audio routing (<GuideLink href={BLACKHOLE_URL}>BlackHole</GuideLink>)</>
      ),
      inputNote: zh ? "会议音频采集" : "Meeting audio capture",
      outputNote: zh ? "翻译麦克风输出" : "Translated mic output",
      steps: zh
        ? [
            <>安装 <GuideLink href={BLACKHOLE_URL}>BlackHole</GuideLink>（包含 BlackHole 16ch 和 BlackHole 2ch）</>,
            "在系统「声音」中，将会议软件的输出设备设为 BlackHole 16ch",
            "在会议软件中，将麦克风设为 BlackHole 2ch",
            "打开 Real-Time Translator，开始跨语言会议",
          ]
        : [
            <>Install <GuideLink href={BLACKHOLE_URL}>BlackHole</GuideLink> 16ch and BlackHole 2ch</>,
            "Set the meeting speaker to BlackHole 16ch",
            "Set the meeting microphone to BlackHole 2ch",
            "Open Real-Time Translator and start your meeting",
          ],
    },
    {
      id: "windows",
      name: "Windows",
      input: "CABLE A",
      output: "CABLE B",
      title: zh ? (
        <>Windows 音频路由（使用 <GuideLink href={VBCABLE_URL}>VB-Cable</GuideLink>）</>
      ) : (
        <>Windows audio routing (<GuideLink href={VBCABLE_URL}>VB-Cable</GuideLink>)</>
      ),
      inputNote: zh ? "会议音频采集" : "Meeting audio capture",
      outputNote: zh ? "翻译麦克风输出" : "Translated mic output",
      steps: zh
        ? [
            <>安装 <GuideLink href={VBCABLE_URL}>VB-Cable</GuideLink>（包含 CABLE A 和 CABLE B）</>,
            "在系统「声音」中，将会议软件的输出设备设为 CABLE A",
            "在会议软件中，将麦克风设为 CABLE B",
            "打开 Real-Time Translator，开始跨语言会议",
          ]
        : [
            <>Install <GuideLink href={VBCABLE_URL}>VB-Cable</GuideLink> (CABLE A and CABLE B)</>,
            "Set the meeting speaker to CABLE A Input",
            "Set the meeting microphone to CABLE B Output",
            "Open Real-Time Translator and start your meeting",
          ],
    },
  ];

  const guide = guides.find((item) => item.id === activeId) ?? guides[0];

  return (
    <div className="mt-5">
      <div className="mx-auto flex max-w-xl rounded-xl bg-slate-100 p-1" role="tablist" aria-label={zh ? "选择操作系统" : "Choose an operating system"}>
        {guides.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveId(item.id)}
              className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-bold ${
                active
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md shadow-blue-200"
                  : "text-slate-700"
              }`}
            >
              <Image
                src={item.id === "mac" ? "/ui-icons/apple-white.svg" : "/ui-icons/windows-blue.svg"}
                alt=""
                width={18}
                height={18}
                className={`h-4.5 w-4.5 ${
                  item.id === "mac" && !active
                    ? "brightness-0 opacity-70"
                    : item.id === "windows" && active
                      ? "brightness-0 invert"
                      : ""
                }`}
              />
              {item.name}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
          <article className="grid gap-5 rounded-2xl border border-blue-200 bg-blue-50/55 p-4 shadow-sm lg:grid-cols-[1.36fr_.64fr] lg:px-6">
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-950">{guide.title}</p>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[1fr_24px_1fr_62px_76px]">
                <div className="space-y-2">
                  <div className="flex h-[64px] min-w-0 items-center gap-2 rounded-xl bg-white px-2.5 shadow-sm sm:h-[58px] sm:px-3">
                    <Image src="/ui-icons/laptop-blue.svg" alt="" width={24} height={24} className="h-6 w-6 shrink-0" />
                    <div className="min-w-0"><p className="text-xs font-black leading-4 text-slate-800">{zh ? "会议声音" : "Meeting audio"}</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">{zh ? "（对方说话）" : "The other speaker"}</p></div>
                  </div>
                  <div className="flex h-[64px] min-w-0 items-center gap-2 rounded-xl bg-white px-2.5 shadow-sm sm:h-[58px] sm:px-3">
                    <Image src="/ui-icons/mic-blue.svg" alt="" width={24} height={24} className="h-6 w-6 shrink-0" />
                    <div className="min-w-0"><p className="text-xs font-black leading-4 text-slate-800">{zh ? "翻译后的语音输出" : "Translated voice output"}</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">{zh ? "（目标语言）" : "(Target language)"}</p></div>
                  </div>
                </div>
                <div className="space-y-[46px] text-center text-lg text-blue-500 sm:space-y-[42px] sm:text-xl"><div>→</div><div>→</div></div>
                <div className="space-y-2">
                  <div className="flex h-[64px] min-w-0 flex-col items-center justify-center rounded-2xl bg-blue-100/80 px-2 text-center sm:h-[58px] sm:rounded-full sm:px-3">
                    <p className="text-xs font-black leading-4 text-slate-800">{guide.input}</p><p className="mt-0.5 text-[9px] leading-3 text-slate-500">（{guide.inputNote}）</p>
                  </div>
                  <div className="flex h-[64px] min-w-0 flex-col items-center justify-center rounded-2xl bg-violet-100/70 px-2 text-center sm:h-[58px] sm:rounded-full sm:px-3">
                    <p className="text-xs font-black leading-4 text-slate-800">{guide.output}</p><p className="mt-0.5 text-[9px] leading-3 text-slate-500">（{guide.outputNote}）</p>
                  </div>
                </div>
                <Image src="/ui-icons/audio-route-merge.svg" alt="" width={62} height={86} className="hidden sm:block" />
                <div className="hidden flex-col items-center justify-center text-center sm:flex">
                  <BrandMark compact />
                  <p className="mt-1 text-[10px] font-black leading-3 text-slate-900">Real-Time<br />Translator</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 sm:hidden">
                <span className="text-lg text-blue-500">→</span>
                <BrandMark compact />
                <span>Real-Time Translator</span>
              </div>
            </div>
            <div className="border-t border-blue-200 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              <p className="text-sm font-black text-slate-950">{zh ? `安装步骤（${guide.name}）` : `Setup steps (${guide.name})`}</p>
              <ol className="mt-3 grid gap-2">
                {guide.steps.map((step, index) => (
                  <li key={index} className="flex gap-2 text-sm leading-6 text-slate-600 lg:text-[11px] lg:leading-4">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{index + 1}</span>
                    <span className="min-w-0">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </article>
      </div>
    </div>
  );
}

export function HomePageClient({
  userEmail,
  isPro = false,
  planTier = null,
  customerPortalUrl = null,
  winDownloadUrl = WINDOWS_DOWNLOAD_URL,
  macDownloadUrl = MACOS_DOWNLOAD_URL,
}: HomePageClientProps) {
  const { locale, t } = useLanguage();
  const zh = locale === "zh";
  const h = t.home;
  const c = t.common;
  const legal = t.legal;
  const isLoggedIn = Boolean(userEmail?.trim());

  const bullets = zh
    ? ["跨语言沟通，不让任何一方停下来。", "不改变你熟悉的会议方式。", "对方无需安装任何软件。"]
    : ["Keep every conversation moving across languages.", "Works with the meeting apps you already use.", "Nothing for the other participant to install."];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-5 px-5 sm:px-6">
          <Link href="https://www.zdtranslate.com/" className="flex items-center gap-3 font-bold tracking-tight text-slate-950">
            <BrandMark compact />
            <span className="hidden sm:inline">Real-Time Translator</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex">
            <a href="#core" className="transition hover:text-blue-600">{zh ? "核心能力" : "Core"}</a>
            <a href="#install" className="transition hover:text-blue-600">{zh ? "安装指南" : "Setup"}</a>
            <a href="#pricing-section" className="transition hover:text-blue-600">{zh ? "订阅付费" : "Pricing"}</a>
            <Link href="/faq" className="transition hover:text-blue-600">{zh ? "帮助中心" : "Help Center"}</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            {isLoggedIn && userEmail ? (
              <Link
                href="/dashboard"
                title={userEmail}
                className="inline-flex h-10 max-w-[190px] items-center gap-2 rounded-xl bg-blue-600 px-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 sm:px-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-black ring-1 ring-white/40">
                  {avatarInitial(userEmail)}
                </span>
                <span className="hidden truncate sm:inline">{emailLocalPart(userEmail)}</span>
              </Link>
            ) : (
              <Link href="/login" className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{c.signIn}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_82%_20%,rgba(147,197,253,0.52),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_48%,#dceeff_100%)]">
          <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="mx-auto grid min-h-[500px] max-w-6xl items-center gap-10 px-5 py-10 sm:px-6 sm:py-12 lg:grid-cols-[.86fr_1.14fr]">
            <div className="relative z-10 text-center lg:text-left">
              <h1 className="text-4xl font-black leading-[1.12] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[52px]">
                {zh ? "说中文，对方直接听到目标语言" : "Speak naturally. They hear their language."}
              </h1>
              <p className="mt-5 text-lg font-semibold leading-8 text-slate-600 sm:text-xl">
                {zh ? "对方说话，实时显示双语字幕。" : "When they speak, bilingual captions appear in real time."}
              </p>
              <ul className="mx-auto mt-6 max-w-xl space-y-3.5 text-left lg:mx-0">
                {bullets.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700 sm:text-base">
                    <Image src="/ui-icons/check-circle.svg" alt="" width={28} height={28} className="h-7 w-7 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                {macDownloadUrl ? (
                  <GetStartedButton
                    downloadUrl={macDownloadUrl}
                    className="inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-xl shadow-blue-300/45 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    <Image src="/ui-icons/apple-white.svg" alt="" width={20} height={20} className="h-5 w-5" />
                    <span className="whitespace-nowrap">{zh ? "下载 macOS 版" : "Download for macOS"}</span>
                  </GetStartedButton>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-slate-200 px-6 text-sm font-bold text-slate-500"
                  >
                    <Image src="/ui-icons/apple-white.svg" alt="" width={20} height={20} className="h-5 w-5 brightness-0 opacity-40" />
                    <span className="whitespace-nowrap">{c.downloadMacComingSoon}</span>
                  </button>
                )}
                <GetStartedButton
                  downloadUrl={winDownloadUrl}
                  className="inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border border-blue-300 bg-white/90 px-6 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-500 hover:bg-white"
                >
                  <Image src="/ui-icons/windows-blue.svg" alt="" width={20} height={20} className="h-5 w-5" />
                  <span className="whitespace-nowrap">{zh ? "下载 Windows 版" : "Download for Windows"}</span>
                </GetStartedButton>
              </div>
              <p className="mt-3 max-w-xl text-center text-xs leading-5 text-slate-500 lg:text-left">
                {c.downloadRequirements}
              </p>
            </div>
            <ProductPreview zh={zh} />
          </div>
        </section>

        <section id="core" className="scroll-mt-24 px-5 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-6xl">
            <CapabilityCards zh={zh} />
          </div>
        </section>

        <section className="bg-white px-5 pb-7 pt-3 sm:px-6 sm:pb-8 sm:pt-4">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-[28px]">{zh ? "支持常用会议软件" : "Works with the meeting apps you use"}</h2>
            <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">{zh ? "不改变你熟悉的会议方式，在常用软件中直接使用。" : "Keep your existing meeting workflow and start translating immediately."}</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-5">
              {meetingAppsFor(zh).map((app) => (
                <div key={app.name} className="flex h-[58px] items-center justify-center gap-2.5 rounded-[11px] border border-slate-200 bg-white px-3 shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                  <Image src={app.logo} alt="" width={30} height={30} className="h-[30px] w-[30px] shrink-0 object-contain" />
                  <span className="whitespace-nowrap text-xs font-bold text-slate-800 sm:text-[13px]">{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="install" className="scroll-mt-24 px-5 pb-3 pt-8 sm:px-6 sm:pb-4 sm:pt-10">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-3xl">macOS / Windows {zh ? "安装指南" : "Setup Guide"}</h2>
            </div>
            <InstallGuide zh={zh} />
          </div>
        </section>

        <PricingSection
          isPro={isPro}
          isLoggedIn={isLoggedIn}
          planTier={planTier}
          customerPortalUrl={customerPortalUrl}
        />

      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-10 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-3"><BrandMark compact /><span className="font-bold text-slate-800">Real-Time Translator</span></div>
          <p>{h.footer}</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-blue-600">{legal.termsOfService}</Link>
            <Link href="/privacy" className="hover:text-blue-600">{legal.privacyPolicy}</Link>
            <a href="mailto:support@zdtranslate.com" className="hover:text-blue-600">support@zdtranslate.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
