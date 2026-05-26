import { useEffect, useRef, useState, type ReactNode } from "react";
import { useBoundProp, useStateBinding } from "@json-render/react";

/**
 * 🎿  SKI EDITION — MAXIMALIST EMOJI RENDERER  🎿
 *
 * Every visible element is built from emojis. Cards are wrapped in alpine
 * scenes (mountain ceiling, pine forests, animated snowfall). Headings are
 * crowned with rows of peaks. Body text is sprinkled with snowflakes between
 * words. Buttons explode with contextual icon walls. Avatars sit inside
 * snow globes. The catalog (`src/catalog.ski.ts`) is unchanged — only the
 * renderers are extreme.
 *
 * No @alpic-ai/ui imports here on purpose: every visible glyph is an emoji.
 */

type Ctx = {
  props: Record<string, any>;
  children?: ReactNode;
  emit: (event: string) => void;
  on: (event: string) => {
    emit: () => void;
    shouldPreventDefault: boolean;
    bound: boolean;
  };
  bindings?: Record<string, string>;
};

// ── Emoji building blocks ────────────────────────────────────────────────
function repeat(glyph: string, n: number): string {
  return Array.from({ length: n }, () => glyph).join("");
}

function EmojiRow({ glyph, count = 14 }: { glyph: string; count?: number }) {
  return (
    <div
      aria-hidden
      className="text-center select-none leading-none whitespace-nowrap overflow-hidden"
    >
      {repeat(glyph, count)}
    </div>
  );
}

function ThickBorder({
  glyph,
  rows = 3,
  count = 14,
}: {
  glyph: string;
  rows?: number;
  count?: number;
}) {
  return (
    <div aria-hidden className="flex flex-col leading-none">
      {Array.from({ length: rows }, (_, i) => (
        <EmojiRow key={i} glyph={glyph} count={count} />
      ))}
    </div>
  );
}

function PineColumn({ rows = 6 }: { rows?: number }) {
  return (
    <div
      aria-hidden
      className="flex flex-col items-center justify-around select-none leading-none px-1"
    >
      {Array.from({ length: rows }, (_, i) => (
        <span
          key={i}
          className="animate-wobble-tree"
          style={{ animationDelay: `${(i % 4) * 0.4}s` }}
        >
          🌲
        </span>
      ))}
    </div>
  );
}

function Snowfall({ flakes = 14 }: { flakes?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {Array.from({ length: flakes }, (_, i) => (
        <span
          key={i}
          className="absolute animate-snow-fall text-sm"
          style={{
            left: `${(i * 73) % 100}%`,
            top: `-10%`,
            animationDelay: `${(i * 0.6) % 6}s`,
            animationDuration: `${5 + (i % 5)}s`,
          }}
        >
          ❄️
        </span>
      ))}
    </div>
  );
}

/** Interleave a glyph between every word of a string. */
function snowdust(text: string, glyph = "❄️"): ReactNode {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  return words.flatMap((w, i) =>
    i === 0
      ? [<span key={`w${i}`}>{w}</span>]
      : [
          <span key={`g${i}`} aria-hidden className="opacity-70 mx-1">
            {glyph}
          </span>,
          <span key={`w${i}`}>{w}</span>,
        ],
  );
}

// ── Mapping tables (ski slang → behaviour) ───────────────────────────────
const floorWidth: Record<string, string> = {
  studio: "max-w-xs",
  suite: "max-w-md",
  wing: "max-w-xl",
  compound: "w-full",
};

const runMap: Record<string, "horizontal" | "vertical"> = {
  schuss: "vertical",
  traverse: "horizontal",
};

const spacingMap: Record<string, string> = {
  "edge-to-edge": "gap-0",
  tight: "gap-2",
  open: "gap-3",
  wide: "gap-5",
  expedition: "gap-8",
};

const alignMap: Record<string, string> = {
  uphill: "items-start",
  centerline: "items-center",
  downhill: "items-end",
  groomed: "items-stretch",
};

const crowdMap: Record<string, string> = {
  "lift-line": "",
  centered: "justify-center",
  downhill: "justify-end",
  "evenly-tracked": "justify-between",
  "loose-pack": "justify-around",
};

const gridColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const prominenceSize: Record<string, string> = {
  everest: "text-4xl",
  k2: "text-3xl",
  matterhorn: "text-2xl",
  denali: "text-xl",
};
const prominencePeaks: Record<string, number> = {
  everest: 9,
  k2: 7,
  matterhorn: 5,
  denali: 3,
};

const chatteringSize: Record<string, string> = {
  breath: "text-base",
  shiver: "text-2xl",
  lullaby: "text-sm opacity-70",
  frozen: "font-mono text-sm",
  mutter: "text-xs opacity-70",
};

const speedSize: Record<string, string> = {
  snowplow: "text-base",
  wedge: "text-2xl",
  parallel: "text-4xl",
  carving: "text-6xl",
  racing: "text-8xl",
};

const difficultyDot: Record<string, string> = {
  green: "🟢",
  blue: "🔵",
  red: "🔴",
  black: "⚫",
  doublered: "🔴🔴",
};

const frostIcon: Record<string, string> = {
  fresh: "❄️",
  powder: "🌟",
  icy: "⚠️",
  avalanche: "🚨",
};

const chillSize: Record<string, string> = {
  shiver: "text-base",
  shake: "text-2xl",
  wobble: "text-4xl",
  spin: "text-6xl",
};

const kindToInputType: Record<string, "text" | "email" | "password" | "number"> =
  {
    frost: "text",
    lightning: "email",
    secret: "password",
    altitude: "number",
  };

const pushFlair: Record<string, string> = {
  downhill: "⬇️",
  uphill: "⬆️",
  drift: "🌊",
  wipeout: "💥",
  glide: "✨",
  shuffle: "〰️",
  rally: "🎉",
};

const reachPadding: Record<string, string> = {
  regular: "px-4 py-2",
  blade: "px-2 py-1",
  pirouette: "px-3 py-3 rounded-full",
  "long-stride": "px-8 py-2 rounded-full",
};

// ── Ski components — MAXIMALIST emoji renderers ──────────────────────────
export const skiComponents = {
  // 🏨 Card — a full chalet scene: mountain ceiling, pine walls, snowfall
  "🏨": ({ props, children }: Ctx) => (
    <div
      className={`${floorWidth[props.floor ?? "compound"] ?? "w-full"} ${
        props.heated ? "mx-auto" : ""
      } relative overflow-hidden`}
    >
      <ThickBorder glyph="🏔️" rows={2} count={16} />
      <div className="relative flex">
        <PineColumn rows={8} />
        <div className="relative flex-1">
          <Snowfall flakes={10} />
          <div className="relative z-10 px-2 py-3 flex flex-col gap-3">
            {(props.chaletName || props.notice) && (
              <div className="flex flex-col gap-2">
                {props.chaletName && (
                  <div className="flex items-center justify-center gap-2 text-xl">
                    <span aria-hidden>🏨</span>
                    <span aria-hidden className="animate-drift">
                      ⛷️
                    </span>
                    <strong className="text-center">
                      {snowdust(props.chaletName, "🏨")}
                    </strong>
                    <span aria-hidden className="animate-drift">
                      🏂
                    </span>
                    <span aria-hidden>🏨</span>
                  </div>
                )}
                {props.notice && (
                  <div className="text-sm opacity-80 text-center">
                    {snowdust(props.notice, "❄️")}
                  </div>
                )}
                <EmojiRow glyph="❄️" count={16} />
              </div>
            )}
            <div className="flex flex-col gap-3">{children}</div>
          </div>
        </div>
        <PineColumn rows={8} />
      </div>
      <ThickBorder glyph="☃️" rows={2} count={16} />
    </div>
  ),

  // 🎿 Stack — children laid out, separated by skis
  "🎿": ({ props, children }: Ctx) => {
    const direction = runMap[props.run ?? "schuss"] ?? "vertical";
    return (
      <div
        className={[
          "flex",
          direction === "horizontal" ? "flex-row flex-wrap" : "flex-col",
          spacingMap[props.spacing ?? "open"] ?? "gap-3",
          alignMap[props.align ?? "uphill"] ?? "items-start",
          crowdMap[props.crowd ?? "lift-line"] ?? "",
        ].join(" ")}
      >
        {children}
      </div>
    );
  },

  // 🗻 Grid — slopes
  "🗻": ({ props, children }: Ctx) => {
    const n = Math.max(1, Math.min(6, props.slopes ?? 1));
    return (
      <div
        className={[
          "grid",
          gridColsMap[n] ?? "grid-cols-1",
          spacingMap[props.spacing ?? "open"] ?? "gap-3",
        ].join(" ")}
      >
        {children}
      </div>
    );
  },

  // ❄️ Separator — a thick avalanche of snowflakes
  "❄️": ({ props }: Ctx) =>
    props.axis === "crevasse" ? (
      <div
        aria-hidden
        className="flex flex-col items-center justify-around text-center select-none leading-none px-1"
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="animate-shimmer"
            style={{ animationDelay: `${(i % 5) * 0.2}s` }}
          >
            ❄️
          </span>
        ))}
      </div>
    ) : (
      <div className="my-3 flex flex-col gap-0.5">
        <EmojiRow glyph="❄️" count={18} />
        <EmojiRow glyph="🌨️" count={14} />
        <EmojiRow glyph="❄️" count={18} />
      </div>
    ),

  // 🚡 Tabs — cabins of an aerial tram
  "🚡": ({ props, children, bindings, emit }: Ctx) => {
    const cabins: { name: string; station: string }[] = props.cabins ?? [];
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.aboard,
      bindings?.aboard,
    );
    const [localValue, setLocalValue] = useState<string>(
      props.boarding ?? cabins[0]?.station ?? "",
    );
    const isBound = !!bindings?.aboard;
    const value = isBound
      ? (boundValue ?? cabins[0]?.station ?? "")
      : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    return (
      <div className="flex flex-col gap-2">
        <EmojiRow glyph="🚡" count={16} />
        <div className="flex flex-wrap items-center gap-2 justify-center">
          {cabins.map((cabin) => {
            const active = cabin.station === value;
            return (
              <button
                type="button"
                key={cabin.station}
                onClick={() => {
                  setValue(cabin.station);
                  emit("ride");
                }}
                className={`px-3 py-1 text-sm cursor-pointer rounded-md flex items-center gap-2 ${
                  active
                    ? "font-semibold border-2 border-double"
                    : "opacity-60"
                }`}
              >
                <span aria-hidden>{active ? "🟢🚡🟢" : "⚪🚡⚪"}</span>
                <span>{cabin.name}</span>
              </button>
            );
          })}
        </div>
        <EmojiRow glyph="🚠" count={16} />
        <div>{children}</div>
      </div>
    );
  },

  // 🪵 Accordion — stack of logs
  "🪵": ({ props }: Ctx) => {
    const logs: { name: string; rings: string }[] = props.logs ?? [];
    const isMultiple = props.splitting === "rope-team";
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [openMulti, setOpenMulti] = useState<Set<number>>(new Set());
    return (
      <div className="flex flex-col gap-1">
        <EmojiRow glyph="🪵" count={14} />
        {logs.map((log, i) => {
          const isOpen = isMultiple ? openMulti.has(i) : openIndex === i;
          return (
            <div key={i}>
              <button
                type="button"
                className="flex items-center gap-2 w-full text-left cursor-pointer py-1"
                onClick={() => {
                  if (isMultiple) {
                    const next = new Set(openMulti);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    setOpenMulti(next);
                  } else {
                    setOpenIndex(isOpen ? null : i);
                  }
                }}
              >
                <span aria-hidden>🪵🪵🪵</span>
                <strong className="flex-1">{log.name}</strong>
                <span aria-hidden>{isOpen ? "🔽" : "▶️"}</span>
              </button>
              {isOpen && (
                <div className="pl-9 pb-2 text-sm">
                  <span aria-hidden>🔥 </span>
                  {log.rings}
                </div>
              )}
            </div>
          );
        })}
        <EmojiRow glyph="🪵" count={14} />
      </div>
    );
  },

  // 🌨️ Dialog — whiteout takeover with falling snow
  "🌨️": ({ props, children }: Ctx) => {
    const [open, setOpen] = useStateBinding<boolean>(props.visibility ?? "");
    const ref = useRef<HTMLDialogElement | null>(null);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      if (open && !el.open) el.showModal();
      if (!open && el.open) el.close();
    }, [open]);
    return (
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        className="backdrop:bg-black/30 p-0 rounded-md max-w-lg relative overflow-hidden"
      >
        <ThickBorder glyph="🌨️" rows={3} count={18} />
        <div className="relative">
          <Snowfall flakes={16} />
          <div className="relative z-10 px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 text-2xl">
              <span aria-hidden className="animate-drift">
                🌨️
              </span>
              <strong>{snowdust(props.peak, "🌨️")}</strong>
              <span aria-hidden className="animate-drift">
                🌨️
              </span>
            </div>
            {props.forecast && (
              <div className="text-sm opacity-80 text-center">
                {snowdust(props.forecast, "❄️")}
              </div>
            )}
            <EmojiRow glyph="❄️" count={14} />
            <div className="flex flex-col gap-2">{children}</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="self-end mt-2 cursor-pointer text-sm"
            >
              ❌ close
            </button>
          </div>
        </div>
        <ThickBorder glyph="🌨️" rows={3} count={18} />
      </dialog>
    );
  },

  // 🏔️ Heading — multiple rows of peaks crowning the inscription
  "🏔️": ({ props }: Ctx) => {
    const level: string = props.prominence ?? "k2";
    const peakCount = prominencePeaks[level] ?? 5;
    const size = prominenceSize[level] ?? "text-3xl";
    return (
      <div className="flex flex-col items-center gap-1">
        <EmojiRow glyph="🏔️" count={peakCount} />
        <div
          className={`${size} font-extrabold tracking-wide text-center leading-tight`}
        >
          {snowdust(props.inscription, "🏔️")}
        </div>
        <EmojiRow glyph="🏔️" count={peakCount} />
      </div>
    );
  },

  // 🥶 Text — frosty whisper surrounded by snowflakes
  "🥶": ({ props }: Ctx) => {
    const cls = chatteringSize[props.chattering ?? "breath"] ?? "text-base";
    return (
      <div className={`flex items-start gap-2 ${cls}`}>
        <span aria-hidden className="animate-shimmer">
          🥶
        </span>
        <span>{snowdust(props.whisper, "❄️")}</span>
        <span aria-hidden className="animate-shimmer">
          🥶
        </span>
      </div>
    );
  },

  // 🥽 Image — fully fogged goggle viewport
  "🥽": ({ props }: Ctx) => (
    <div className="inline-flex flex-col items-center gap-1 select-none">
      <EmojiRow glyph="🏔️" count={8} />
      <div
        className="flex items-center justify-center"
        style={{
          width: props.width ?? 180,
          height: props.height ?? 120,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="text-6xl leading-none">🥽</div>
          <div className="text-xs opacity-70 text-center px-2">
            {snowdust(props.vista ?? "", "❄️")}
          </div>
        </div>
      </div>
      <EmojiRow glyph="🌲" count={8} />
    </div>
  ),

  // ⛷️ Avatar — skier inside a snow globe
  "⛷️": ({ props }: Ctx) => {
    const cls = speedSize[props.speed ?? "parallel"] ?? "text-4xl";
    return (
      <div className="inline-flex flex-col items-center gap-1">
        <EmojiRow glyph="❄️" count={6} />
        <div className="relative flex items-center justify-center">
          <span className={`${cls} leading-none animate-drift`}>⛷️</span>
          <span
            aria-hidden
            className="absolute text-base animate-orbit opacity-80"
            style={{ animationDelay: "0s" }}
          >
            ❄️
          </span>
          <span
            aria-hidden
            className="absolute text-base animate-orbit opacity-80"
            style={{ animationDelay: "-0.8s" }}
          >
            ❄️
          </span>
          <span
            aria-hidden
            className="absolute text-base animate-orbit opacity-80"
            style={{ animationDelay: "-1.6s" }}
          >
            ❄️
          </span>
        </div>
        <EmojiRow glyph="🌲" count={6} />
        {props.skier && (
          <span className="text-xs opacity-70">{props.skier}</span>
        )}
      </div>
    );
  },

  // 🌲 Badge — pine marker with slope-color dot and tree halo
  "🌲": ({ props }: Ctx) => {
    const dot = difficultyDot[props.difficulty ?? "blue"] ?? "🔵";
    const size = props.size === "fir" ? "text-base" : "text-sm";
    return (
      <span
        className={`inline-flex items-center gap-1 ${size} px-2 py-1 rounded-md`}
      >
        <span aria-hidden>🌲🌲</span>
        <span aria-hidden className="animate-shimmer">
          {dot}
        </span>
        <span>{props.tag}</span>
        <span aria-hidden className="animate-shimmer">
          {dot}
        </span>
        <span aria-hidden>🌲🌲</span>
      </span>
    );
  },

  // ⛄ Alert — snowman bulletin framed by frost icons
  "⛄": ({ props }: Ctx) => {
    const icon = frostIcon[props.frost ?? "fresh"] ?? "❄️";
    return (
      <div className="flex flex-col gap-1 py-2 relative overflow-hidden">
        <EmojiRow glyph={icon} count={14} />
        <EmojiRow glyph="⛄" count={10} />
        <div className="flex items-start gap-3 px-3 py-2">
          <span className="text-4xl leading-none animate-drift">
            {icon}
            ⛄
            {icon}
          </span>
          <div className="flex flex-col flex-1">
            <strong className="text-base">
              {snowdust(props.bulletin, icon)}
            </strong>
            {props.melt && (
              <span className="text-sm opacity-90 mt-1">
                {snowdust(props.melt, "❄️")}
              </span>
            )}
          </div>
        </div>
        <EmojiRow glyph="⛄" count={10} />
        <EmojiRow glyph={icon} count={14} />
      </div>
    );
  },

  // 🛷 Table — heavy sled-emoji frame, every row prefixed
  "🛷": ({ props }: Ctx) => {
    const cargo: string[] = props.cargo ?? [];
    const payload: string[][] = (props.payload ?? []).map((row: unknown[]) =>
      row.map(String),
    );
    return (
      <div className="flex flex-col gap-1">
        <EmojiRow glyph="🛷" count={14} />
        <EmojiRow glyph="🌲" count={14} />
        {props.manifest && (
          <div className="flex items-center justify-center gap-2 py-1">
            <span aria-hidden>🛷</span>
            <strong>{snowdust(props.manifest, "🛷")}</strong>
            <span aria-hidden>🛷</span>
          </div>
        )}
        <table className="text-sm">
          <thead>
            <tr>
              {cargo.map((c, i) => (
                <th
                  key={c}
                  className="text-left px-3 py-1 font-semibold border-b border-double"
                >
                  <span aria-hidden>{i === 0 ? "🛷 " : "🎿 "}</span>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payload.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-1">
                    <span aria-hidden>{j === 0 ? "🎿 " : "❄️ "}</span>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <EmojiRow glyph="🌲" count={14} />
        <EmojiRow glyph="🛷" count={14} />
      </div>
    );
  },

  // ☃️ Skeleton — multiple pulsing rows of snowmen
  "☃️": ({ props }: Ctx) => {
    const isBall = props.sculpt === "snowball";
    const sample = isBall ? "⚪" : "☃️";
    const length = 12;
    return (
      <div
        className="flex flex-col gap-1 select-none"
        style={{
          width: props.chunkWidth ?? "100%",
          minHeight: props.chunkHeight ?? "1.25rem",
        }}
      >
        {Array.from({ length: 3 }, (_, r) => (
          <div key={r} className="flex items-center gap-1">
            {Array.from({ length }, (_, i) => (
              <span
                key={i}
                className="animate-shimmer"
                style={{ animationDelay: `${((i + r * 3) % 8) * 0.15}s` }}
              >
                {sample}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  },

  // 🧊 Spinner — a halo of orbiting ice cubes
  "🧊": ({ props }: Ctx) => (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <span
          className={`inline-block animate-spin leading-none ${
            chillSize[props.chill ?? "shake"] ?? "text-2xl"
          }`}
        >
          🧊
        </span>
        <span
          aria-hidden
          className="absolute text-sm animate-orbit"
          style={{ animationDelay: "0s" }}
        >
          ❄️
        </span>
        <span
          aria-hidden
          className="absolute text-sm animate-orbit"
          style={{ animationDelay: "-0.8s" }}
        >
          🧊
        </span>
        <span
          aria-hidden
          className="absolute text-sm animate-orbit"
          style={{ animationDelay: "-1.6s" }}
        >
          ❄️
        </span>
      </div>
      {props.label && (
        <span className="text-sm opacity-80">{snowdust(props.label, "❄️")}</span>
      )}
    </div>
  ),

  // 🧣 Tooltip — scarf whisper using the title attribute
  "🧣": ({ props }: Ctx) => (
    <span
      title={props.confide}
      className="underline decoration-dotted cursor-help text-sm inline-flex items-center gap-1"
    >
      <span aria-hidden className="animate-drift">
        🧣
      </span>
      <span>{props.whisper}</span>
      <span aria-hidden className="animate-drift">
        🧣
      </span>
    </span>
  ),

  // 🔥 Popover — fireplace using <details>
  "🔥": ({ props }: Ctx) => (
    <details className="inline-block">
      <summary className="cursor-pointer list-none select-none text-sm inline-flex items-center gap-2">
        <span aria-hidden className="animate-drift">
          🔥🔥🔥
        </span>
        <span>{props.spark}</span>
        <span aria-hidden className="animate-drift">
          🔥🔥🔥
        </span>
      </summary>
      <div className="mt-2 pl-5 text-sm opacity-90 border-l-2 border-dashed">
        <span aria-hidden>🪵🔥 </span>
        {snowdust(props.story, "🔥")}
      </div>
    </details>
  ),

  // 🌡️ Input — thermometer column + frost-edged field
  "🌡️": ({ props, bindings, emit }: Ctx) => {
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.reading,
      bindings?.reading,
    );
    const [localValue, setLocalValue] = useState("");
    const isBound = !!bindings?.reading;
    const value = isBound ? (boundValue ?? "") : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    return (
      <label className="flex flex-col gap-1 text-sm">
        {props.dial && (
          <span className="flex items-center gap-2">
            <span aria-hidden>🌡️🌡️🌡️</span>
            <strong>{props.dial}</strong>
            {props.essential && (
              <span title="essential" className="animate-shimmer">
                ❗
              </span>
            )}
          </span>
        )}
        <span className="inline-flex items-stretch gap-2">
          <span
            aria-hidden
            className="flex flex-col items-center justify-center select-none leading-none"
          >
            <span>🌡️</span>
          </span>
          <span aria-hidden className="self-center">
            ❄️
          </span>
          <input
            id={props.handle ?? undefined}
            name={props.handle ?? undefined}
            type={kindToInputType[props.kind ?? "frost"] ?? "text"}
            placeholder={props.placeholder ?? ""}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") emit("freeze");
            }}
            onFocus={() => emit("spike")}
            onBlur={() => emit("settle")}
            className="flex-1 border-b-2 border-double outline-none bg-transparent px-1 py-1"
          />
          <span aria-hidden className="self-center">
            ❄️
          </span>
        </span>
        {props.nag && (
          <span className="text-xs opacity-70 pl-7">
            <span aria-hidden>🌬️ </span>
            {props.nag}
          </span>
        )}
      </label>
    );
  },

  // 🍫 Textarea — chocolate wrapper notes
  "🍫": ({ props, bindings }: Ctx) => {
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.scribble,
      bindings?.scribble,
    );
    const [localValue, setLocalValue] = useState("");
    const isBound = !!bindings?.scribble;
    const value = isBound ? (boundValue ?? "") : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    return (
      <label className="flex flex-col gap-1 text-sm">
        {props.wrapper && (
          <span className="flex items-center gap-2">
            <span aria-hidden>🍫🍫🍫</span>
            <strong>{props.wrapper}</strong>
            <span aria-hidden>🍫🍫🍫</span>
          </span>
        )}
        <EmojiRow glyph="🍫" count={14} />
        <textarea
          id={props.handle ?? undefined}
          name={props.handle ?? undefined}
          placeholder={props.placeholder ?? ""}
          rows={props.squares ?? 3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border-2 border-dashed rounded-md p-2 bg-transparent outline-none"
        />
        <EmojiRow glyph="🍫" count={14} />
        {props.nag && (
          <span className="text-xs opacity-70">
            <span aria-hidden>🌬️ </span>
            {props.nag}
          </span>
        )}
      </label>
    );
  },

  // 🚠 Select — cableway dispatcher with station glyphs
  "🚠": ({ props, bindings, emit }: Ctx) => {
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.destination,
      bindings?.destination,
    );
    const [localValue, setLocalValue] = useState("");
    const isBound = !!bindings?.destination;
    const value = isBound ? (boundValue ?? "") : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    const destinations: string[] = (props.destinations ?? []).map(
      (opt: unknown) => (typeof opt === "string" ? opt : String(opt ?? "")),
    );
    return (
      <label className="flex flex-col gap-1 text-sm">
        {props.dispatcher && (
          <span className="flex items-center gap-2">
            <span aria-hidden>🚠🚠🚠</span>
            <strong>{props.dispatcher}</strong>
            <span aria-hidden>🚠🚠🚠</span>
          </span>
        )}
        <select
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            emit("dispatch");
          }}
          className="border-2 border-double rounded-md p-1 bg-transparent outline-none"
        >
          <option value="">🏔️ {props.placeholder ?? "Pick a station…"}</option>
          {destinations.map((d, i) => (
            <option key={`${i}-${d}`} value={d || `station-${i}`}>
              🚡 {d}
            </option>
          ))}
        </select>
      </label>
    );
  },

  // 🧥 Checkbox — coat layer (worn / not worn)
  "🧥": ({ props, bindings, emit }: Ctx) => {
    const [boundChecked, setBoundChecked] = useBoundProp<boolean>(
      props.worn,
      bindings?.worn,
    );
    const [localChecked, setLocalChecked] = useState<boolean>(!!props.worn);
    const isBound = !!bindings?.worn;
    const checked = isBound ? (boundChecked ?? false) : localChecked;
    const setChecked = isBound ? setBoundChecked : setLocalChecked;
    return (
      <button
        type="button"
        onClick={() => {
          setChecked(!checked);
          emit("layer");
        }}
        className="flex items-center gap-2 cursor-pointer text-left text-sm"
      >
        <span aria-hidden className="text-2xl leading-none">
          {checked ? "🧥" : "🥶"}
        </span>
        <span>{props.layer}</span>
        <span aria-hidden>{checked ? "✅" : "❌"}</span>
      </button>
    );
  },

  // 🏂 Radio — snowboarder stance picker
  "🏂": ({ props, bindings, emit }: Ctx) => {
    const stances: string[] = (props.stances ?? []).map((opt: unknown) =>
      typeof opt === "string" ? opt : String(opt ?? ""),
    );
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.stance,
      bindings?.stance,
    );
    const [localValue, setLocalValue] = useState<string>(stances[0] ?? "");
    const isBound = !!bindings?.stance;
    const value = isBound ? (boundValue ?? "") : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    return (
      <div className="flex flex-col gap-1 text-sm">
        {props.question && (
          <span className="flex items-center gap-2">
            <span aria-hidden>🏂🏂🏂</span>
            <strong>{props.question}</strong>
          </span>
        )}
        <div className="flex flex-col gap-1">
          {stances.map((s, i) => {
            const active = s === value;
            return (
              <button
                type="button"
                key={`${i}-${s}`}
                onClick={() => {
                  setValue(s);
                  emit("stance");
                }}
                className="flex items-center gap-2 text-left cursor-pointer"
              >
                <span aria-hidden className={active ? "animate-drift" : ""}>
                  {active ? "🏂" : "⚪"}
                </span>
                <span>{s}</span>
                {active && <span aria-hidden>🎿</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  },

  // 🧤 Switch — glove on / off
  "🧤": ({ props, bindings, emit }: Ctx) => {
    const [boundChecked, setBoundChecked] = useBoundProp<boolean>(
      props.donned,
      bindings?.donned,
    );
    const [localChecked, setLocalChecked] = useState<boolean>(!!props.donned);
    const isBound = !!bindings?.donned;
    const checked = isBound ? (boundChecked ?? false) : localChecked;
    const setChecked = isBound ? setBoundChecked : setLocalChecked;
    return (
      <button
        type="button"
        onClick={() => {
          setChecked(!checked);
          emit("don");
        }}
        className="flex items-center gap-3 text-sm cursor-pointer"
      >
        <span>{props.hand}</span>
        <span
          aria-hidden
          className="text-3xl leading-none animate-drift"
        >
          {checked ? "🧤" : "🖐️"}
        </span>
        <span aria-hidden>{checked ? "✅" : "❌"}</span>
      </button>
    );
  },

  // ⛸️ Button — emoji-walled ice-skate push
  "⛸️": ({ props, emit }: Ctx) => {
    const flair = pushFlair[props.push ?? "downhill"] ?? "⬇️";
    const pad = reachPadding[props.reach ?? "regular"] ?? "px-4 py-2";
    const disabled = !!props.laced;
    const loading = !!props.skating;
    return (
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => emit("push")}
        className={`inline-flex flex-col items-center gap-1 cursor-pointer select-none border-2 border-double rounded-md ${pad} ${
          disabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <span aria-hidden>{loading ? "🧊🧊🧊🧊🧊🧊🧊" : repeat(flair, 7)}</span>
        <span className="flex items-center gap-1 text-base font-semibold">
          <span aria-hidden>⛸️⛸️</span>
          <span>{props.cheer}</span>
          <span aria-hidden>⛸️⛸️</span>
        </span>
        <span aria-hidden>{loading ? "🧊🧊🧊🧊🧊🧊🧊" : repeat(flair, 7)}</span>
      </button>
    );
  },

  // 🚞 Link — mountain railway signpost
  "🚞": ({ props, on }: Ctx) => (
    <a
      href={props.track ?? "#"}
      onClick={(e) => {
        const press = on("board");
        if (press.shouldPreventDefault) e.preventDefault();
        press.emit();
      }}
      className={`inline-flex items-center gap-1 underline-offset-4 text-sm font-medium hover:underline ${
        props.polished === "fresh" ? "opacity-70" : ""
      }`}
    >
      <span aria-hidden className="animate-drift">
        🚞
      </span>
      <span aria-hidden>🛤️</span>
      <span>{props.station}</span>
      <span aria-hidden>🛤️</span>
      <span aria-hidden className="animate-drift">
        ➡️
      </span>
    </a>
  ),
};
