"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/language-provider";

type SceneId = "zoom" | "discord" | "lecture";

type Scenario = {
  id: SceneId;
  tabEn: string;
  tabZh: string;
  zh: string;
  en: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "zoom",
    tabEn: "🌐 Zoom",
    tabZh: "🌐 Zoom",
    zh: "这部分底层接口我们已经重构完了，下周就能上线测试。",
    en: "We've finished refactoring this core API, and it will be ready for testing next week.",
  },
  {
    id: "discord",
    tabEn: "💬 Discord",
    tabZh: "💬 Discord",
    zh: "左侧有人吗？我缺个辅助，这把必须拿下。",
    en: "Anyone on left lane? I need support—we have to win this one.",
  },
  {
    id: "lecture",
    tabEn: "🎓 Lecture",
    tabZh: "🎓 Lecture",
    zh: "今天我们将讨论量子纠缠在分布式计算中的潜在应用。",
    en: "Today we'll discuss the potential applications of quantum entanglement in distributed computing.",
  },
];

type Phase = "idle" | "zh" | "delay" | "en";

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const t = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort);
  });
}

function estimateSpeechMs(text: string, lang: "zh" | "en") {
  const perChar = lang === "zh" ? 120 : 55;
  return Math.min(Math.max(text.length * perChar, 1800), 12000);
}

function pickVoice(langPrefix: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.replace("_", "-").startsWith(langPrefix)) ??
    voices.find((v) =>
      v.lang.toLowerCase().includes(langPrefix.split("-")[0]),
    ) ??
    null
  );
}

function speak(text: string, lang: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang.startsWith("zh") ? 0.95 : 1;
    const voice = pickVoice(lang.startsWith("zh") ? "zh" : "en");
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    signal.addEventListener("abort", () => {
      window.speechSynthesis.cancel();
      resolve();
    });
    window.speechSynthesis.speak(utterance);
  });
}

async function typewriter(
  text: string,
  onUpdate: (value: string) => void,
  durationMs: number,
  signal: AbortSignal,
) {
  onUpdate("");
  if (!text.length) return;
  const step = durationMs / text.length;
  for (let i = 1; i <= text.length; i++) {
    if (signal.aborted) return;
    onUpdate(text.slice(0, i));
    await sleep(step, signal);
  }
}

function Waveform({
  active,
  variant,
  compact = false,
}: {
  active: boolean;
  variant: "input" | "output";
  compact?: boolean;
}) {
  const bars = compact ? 14 : 22;
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: bars }, () => 14),
  );

  useEffect(() => {
    if (!active) {
      setHeights(Array.from({ length: bars }, () => 10));
      return;
    }
    let raf = 0;
    const tick = () => {
      setHeights(
        Array.from({ length: bars }, (_, i) => {
          const base = variant === "output" ? 16 : 12;
          const wave = Math.sin(Date.now() / 110 + i * 0.5) * 20;
          const jitter = Math.random() * (variant === "output" ? 26 : 18);
          return Math.max(6, base + wave + jitter);
        }),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, variant]);

  const color =
    variant === "output"
      ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
      : "bg-sky-400/90 shadow-[0_0_8px_rgba(56,189,248,0.4)]";

  return (
    <div
      className={`flex items-end justify-center gap-[2px] px-1 ${compact ? "h-6 w-20" : "h-12"}`}
    >
      {heights.slice(0, bars).map((h, i) => (
        <div
          key={i}
          className={`rounded-full transition-[height] duration-75 ${compact ? "w-[2px]" : "w-[3px]"} ${color} ${active ? "opacity-100" : "opacity-30"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

type SubtitleOverlayProps = {
  inputLabel: string;
  outputLabel: string;
  status: string;
  delayLabel: string;
  zhDisplay: string;
  enDisplay: string;
  zhActive: boolean;
  enActive: boolean;
  delayActive: boolean;
  placement?: "bottom" | "video";
};

function SceneSubtitleOverlay({
  inputLabel,
  outputLabel,
  status,
  delayLabel,
  zhDisplay,
  enDisplay,
  zhActive,
  enActive,
  delayActive,
  placement = "bottom",
}: SubtitleOverlayProps) {
  const positionClass =
    placement === "video"
      ? "absolute inset-x-2 bottom-[50%] sm:inset-x-3 sm:bottom-[46%]"
      : "absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3";

  return (
    <>
      <div className="absolute right-2 top-2 z-20 flex max-w-[55%] items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 backdrop-blur-sm sm:max-w-none">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
        <span className="truncate text-[7px] text-zinc-300 sm:text-[8px]">
          {status}
        </span>
      </div>

      <div className={`${positionClass} z-20 flex flex-col gap-1`}>
        {delayActive ? (
          <p className="text-center text-[8px] font-medium text-amber-300 sm:text-[9px]">
            ⚡ {delayLabel}
          </p>
        ) : null}

        <div
          className={`rounded-md border bg-black/85 px-2 py-1.5 backdrop-blur-sm ${
            zhActive
              ? "border-sky-500/50 ring-1 ring-sky-500/20"
              : "border-zinc-700/60"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[7px] font-semibold uppercase tracking-wide text-sky-400 sm:text-[8px]">
              {inputLabel}
            </span>
            <Waveform active={zhActive} variant="input" compact />
          </div>
          <p className="mt-0.5 min-h-[1.25rem] text-[10px] leading-snug text-white sm:text-[11px]">
            {zhDisplay}
            {zhActive ? (
              <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-sky-400 align-middle" />
            ) : null}
          </p>
        </div>

        <div
          className={`rounded-md border bg-black/85 px-2 py-1.5 backdrop-blur-sm ${
            enActive
              ? "border-emerald-500/50 ring-1 ring-emerald-500/20"
              : "border-zinc-700/60"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[7px] font-semibold uppercase tracking-wide text-emerald-400 sm:text-[8px]">
              {outputLabel}
            </span>
            <Waveform active={enActive} variant="output" compact />
          </div>
          <p className="mt-0.5 min-h-[1.25rem] text-[10px] leading-snug text-emerald-50 sm:text-[11px]">
            {enDisplay}
            {enActive ? (
              <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-emerald-400 align-middle" />
            ) : null}
          </p>
        </div>
      </div>
    </>
  );
}

function AvatarPlaceholder({
  label,
  speaking,
  muted,
}: {
  label: string;
  speaking?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`relative flex aspect-video flex-col items-center justify-end overflow-hidden rounded-lg bg-zinc-800/90 pb-2 ${
        speaking ? "ring-2 ring-sky-400/60" : "ring-1 ring-zinc-700/80"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-700/40 to-zinc-900/90" />
      <div className="relative mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-600 text-xs font-medium text-zinc-300">
        {label.slice(0, 2).toUpperCase()}
      </div>
      <span className="relative z-10 truncate px-1 text-[9px] text-zinc-400">
        {label}
      </span>
      {muted ? (
        <span className="absolute right-1.5 top-1.5 rounded bg-red-500/80 px-1 text-[8px] text-white">
          Muted
        </span>
      ) : null}
    </div>
  );
}

function SceneStage({
  scene,
  subtitles,
}: {
  scene: SceneId;
  subtitles: SubtitleOverlayProps;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {SCENARIOS.map((s) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-500 ease-out ${
            scene === s.id ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={scene !== s.id}
        >
          {s.id === "zoom" ? <ZoomScene /> : null}
          {s.id === "discord" ? <DiscordScene /> : null}
          {s.id === "lecture" ? <LectureScene /> : null}
        </div>
      ))}
      <SceneSubtitleOverlay
        {...subtitles}
        placement={scene === "lecture" ? "video" : "bottom"}
      />
    </div>
  );
}

function ZoomScene() {
  return (
    <div className="flex h-full flex-col bg-[#1a1a1a] p-2 pb-[7.5rem] sm:pb-[8rem]">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-[10px] font-medium text-zinc-400">
          Weekly Sync — APAC × US Engineering
        </span>
        <div className="flex gap-1">
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[8px] text-zinc-500">
            Rec
          </span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[8px] text-emerald-500">
            00:42:18
          </span>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-1.5 sm:grid-cols-3">
        <AvatarPlaceholder label="You (CN)" speaking />
        <AvatarPlaceholder label="Sarah" />
        <AvatarPlaceholder label="Mike" muted />
        <div className="col-span-2 flex flex-col rounded-lg border border-sky-500/30 bg-zinc-900/80 p-2 sm:col-span-2">
          <span className="text-[9px] text-sky-400/90">Screen share — API diagram</span>
          <div className="mt-1 flex-1 rounded border border-dashed border-zinc-700 bg-zinc-950/60" />
        </div>
        <AvatarPlaceholder label="Priya" />
      </div>
    </div>
  );
}

function DiscordScene() {
  const channels = ["# general", "# memes", "🔊 Squad Room", "🔊 Ranked"];
  const members = ["Nova", "Kite", "You", "Echo", "Mira"];
  return (
    <div className="flex h-full bg-[#313338] text-[#dbdee1]">
      <div className="hidden w-[28%] min-w-[72px] flex-col border-r border-[#1e1f22] bg-[#2b2d31] py-2 sm:flex">
        <p className="px-2 text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
          Channels
        </p>
        {channels.map((c, i) => (
          <div
            key={c}
            className={`mx-1 mt-0.5 truncate rounded px-2 py-1 text-[10px] ${
              i === 2 ? "bg-[#404249] text-white" : "text-zinc-400"
            }`}
          >
            {c}
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col p-2 pb-[7.5rem] sm:pb-[8rem]">
        <p className="text-[10px] font-medium text-emerald-400/90">
          🔊 Squad Room — 5 connected
        </p>
        <div className="mt-2 grid flex-1 grid-cols-3 gap-2 content-start">
          {members.map((m) => (
            <div key={m} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#5865f2]/30 text-[10px] font-bold ${
                  m === "You"
                    ? "ring-[3px] ring-emerald-400 ring-offset-2 ring-offset-[#313338]"
                    : m === "Nova"
                      ? "ring-2 ring-emerald-500/50"
                      : ""
                }`}
              >
                {m.slice(0, 1)}
              </div>
              <span className="max-w-full truncate text-[9px]">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LectureScene() {
  return (
    <div className="flex h-full flex-col bg-[#0f0f0f]">
      <div className="relative h-[48%] min-h-[120px] w-full shrink-0 bg-black sm:h-[52%]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 to-zinc-900" />
        <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[9px] text-white">
          CS 229 — Live Stream
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
          <div className="h-full w-1/3 bg-red-600" />
        </div>
      </div>
      <div className="flex flex-1 gap-2 p-2">
        <div className="flex flex-1 flex-col rounded border border-zinc-800 bg-zinc-900/80 p-2">
          <span className="text-[9px] text-zinc-500">Slide 12 / 48</span>
          <p className="mt-1 text-[11px] font-medium text-zinc-300">
            Quantum Entanglement & Distributed Systems
          </p>
          <div className="mt-2 flex-1 rounded bg-zinc-950/80" />
        </div>
        <div className="hidden w-1/3 flex-col gap-1 sm:flex">
          {["Notes", "Chat", "Q&A"].map((t) => (
            <div
              key={t}
              className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-1 text-[9px] text-zinc-500"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InteractiveDemo() {
  const { locale } = useLanguage();
  const [scenarioId, setScenarioId] = useState<SceneId>("zoom");
  const [phase, setPhase] = useState<Phase>("idle");
  const [playing, setPlaying] = useState(false);
  const [zhDisplay, setZhDisplay] = useState("");
  const [enDisplay, setEnDisplay] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const scenarioIdRef = useRef(scenarioId);

  useEffect(() => {
    scenarioIdRef.current = scenarioId;
  }, [scenarioId]);

  const ui =
    locale === "zh"
      ? {
          title: "ZD Translate Live Engine Demo",
          status: "🟢 ZD Translate 运行中 • 0.3s 延迟 • 声线克隆",
          inputLabel: "You Speak — 中文",
          outputLabel: "Teammate Hears — 英文（你的声线）",
          play: "▶ Play Live S2S Demo",
          pause: "⏸ Pause Demo",
          delay: "0.3s 同传延迟",
          zoomSub: "职场跨国会议",
          discordSub: "游戏开黑 / 语音社交",
          lectureSub: "海外网课 / 学术讲座",
        }
      : {
          title: "ZD Translate Live Engine Demo",
          status: "🟢 ZD Translate Active • 0.3s Latency • Voice Cloning",
          inputLabel: "You Speak — Chinese",
          outputLabel: "Teammate Hears — English in Your Voice",
          play: "▶ Play Live S2S Demo",
          pause: "⏸ Pause Demo",
          delay: "0.3s S2S latency",
          zoomSub: "Cross-border meetings",
          discordSub: "Gaming & voice chat",
          lectureSub: "Online lectures",
        };

  const tabLabel = (s: Scenario) => {
    const sub =
      s.id === "zoom"
        ? ui.zoomSub
        : s.id === "discord"
          ? ui.discordSub
          : ui.lectureSub;
    const base = locale === "zh" ? s.tabZh : s.tabEn;
    return { base, sub };
  };

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    window.speechSynthesis?.cancel();
    setPlaying(false);
    setPhase("idle");
  }, []);

  const resetDisplays = useCallback(() => {
    setZhDisplay("");
    setEnDisplay("");
  }, []);

  const runSequence = useCallback(
    async (signal: AbortSignal, data: Scenario) => {
      setPhase("zh");
      const zhMs = estimateSpeechMs(data.zh, "zh");
      await Promise.all([
        speak(data.zh, "zh-CN", signal),
        typewriter(data.zh, setZhDisplay, zhMs, signal),
      ]);
      if (signal.aborted) return;

      setPhase("delay");
      await sleep(300, signal);
      if (signal.aborted) return;

      setPhase("en");
      const enMs = estimateSpeechMs(data.en, "en");
      await Promise.all([
        speak(data.en, "en-US", signal),
        typewriter(data.en, setEnDisplay, enMs, signal),
      ]);
      if (signal.aborted) return;

      setPhase("idle");
      await sleep(1400, signal);
    },
    [],
  );

  const startDemo = useCallback(async () => {
    stop();
    resetDisplays();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;
    setPlaying(true);

    try {
      while (!signal.aborted) {
        resetDisplays();
        const current =
          SCENARIOS.find((s) => s.id === scenarioIdRef.current) ??
          SCENARIOS[0];
        await runSequence(signal, current);
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    } finally {
      if (!signal.aborted) {
        setPlaying(false);
        setPhase("idle");
        abortRef.current = null;
      }
    }
  }, [stop, resetDisplays, runSequence]);

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis?.getVoices();
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
      stop();
    };
  }, [stop]);

  useEffect(() => {
    if (!playing) {
      resetDisplays();
      setPhase("idle");
    }
  }, [scenarioId, playing, resetDisplays]);

  const zhActive = phase === "zh";
  const enActive = phase === "en";
  const delayActive = phase === "delay";

  const subtitleProps: SubtitleOverlayProps = {
    inputLabel: ui.inputLabel,
    outputLabel: ui.outputLabel,
    status: ui.status,
    delayLabel: ui.delay,
    zhDisplay,
    enDisplay,
    zhActive,
    enActive,
    delayActive,
  };

  return (
    <div className="flex w-full flex-col items-center justify-between gap-3 overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-950 p-3 shadow-2xl shadow-black/50 sm:gap-4 sm:p-4">
      <header className="w-full shrink-0 rounded-xl bg-zinc-900/90 px-2 py-2.5 sm:px-3">
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-500 sm:text-xs">
          {ui.title}
        </p>
        <div className="flex gap-1.5">
          {SCENARIOS.map((s) => {
            const { base, sub } = tabLabel(s);
            const active = scenarioId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                disabled={playing}
                onClick={() => setScenarioId(s.id)}
                className={`flex flex-1 flex-col items-center rounded-lg px-1 py-2 transition-all duration-300 sm:px-2 ${
                  active
                    ? "bg-zinc-800 text-white ring-1 ring-zinc-600"
                    : "text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-300 disabled:opacity-50"
                }`}
              >
                <span className="text-[11px] font-semibold sm:text-xs">
                  {base}
                </span>
                <span className="mt-0.5 hidden text-[9px] text-zinc-500 sm:block">
                  {sub}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <section className="relative h-80 w-full shrink-0 overflow-hidden rounded-xl border border-zinc-800/80 sm:h-96">
        <SceneStage scene={scenarioId} subtitles={subtitleProps} />
      </section>

      <footer className="w-full shrink-0 pt-1">
        {playing ? (
          <button
            type="button"
            onClick={stop}
            className="flex h-11 w-full max-w-md items-center justify-center rounded-xl border border-zinc-600 bg-zinc-900 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-800 mx-auto"
          >
            {ui.pause}
          </button>
        ) : (
          <button
            type="button"
            onClick={startDemo}
            className="mx-auto flex h-11 w-full max-w-md items-center justify-center rounded-xl bg-white text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            {ui.play}
          </button>
        )}
      </footer>
    </div>
  );
}
