import { useEffect, useRef, useState } from "react";
import { useBoundProp, useStateBinding } from "@json-render/react";

/**
 * 🎿 SKI EDITION — EMOJI-ONLY RENDERER 🎿
 *
 * The catalog (`src/catalog.ski.ts`) still describes ski components in
 * ski-resort vocabulary. The IMPLEMENTATIONS below render those components
 * using nothing but emojis and bare HTML. There are zero @alpic-ai/ui
 * imports here on purpose — the entire visible UI is composed of emoji
 * borders, emoji icons, emoji state indicators and emoji decorations.
 *
 * Pure layout helpers (flex / grid / gap) and basic text sizing are kept
 * because they're invisible — the user only sees emojis and the strings
 * the model passes through props.
 */

type Ctx = {
  props: Record<string, any>;
  children?: React.ReactNode;
  emit: (event: string) => void;
  on: (event: string) => {
    emit: () => void;
    shouldPreventDefault: boolean;
    bound: boolean;
  };
  bindings?: Record<string, string>;
};

// ── Emoji helpers ────────────────────────────────────────────────────────
const SNOW_LINE = "❄️ ❄️ ❄️ ❄️ ❄️ ❄️ ❄️ ❄️";
const PINE_LINE = "🌲 🌲 🌲 🌲 🌲 🌲 🌲";

function SnowBorder() {
  return (
    <div className="text-center select-none leading-none">{SNOW_LINE}</div>
  );
}

function repeat(emoji: string, n: number) {
  return Array.from({ length: n }, () => emoji).join("");
}

// ── Mapping tables (ski slang → behaviour) ───────────────────────────────
const floorPadding: Record<string, string> = {
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
  everest: "text-3xl",
  k2: "text-2xl",
  matterhorn: "text-xl",
  denali: "text-base",
};
const prominenceMountains: Record<string, number> = {
  everest: 3,
  k2: 2,
  matterhorn: 1,
  denali: 1,
};

const chatteringSize: Record<string, string> = {
  breath: "text-base",
  shiver: "text-xl",
  lullaby: "text-sm opacity-70",
  frozen: "font-mono text-sm",
  mutter: "text-xs opacity-70",
};

const speedSize: Record<string, string> = {
  snowplow: "text-base",
  wedge: "text-xl",
  parallel: "text-3xl",
  carving: "text-5xl",
  racing: "text-7xl",
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
  shiver: "text-sm",
  shake: "text-xl",
  wobble: "text-3xl",
  spin: "text-5xl",
};

const kindToInputType: Record<string, "text" | "email" | "password" | "number"> =
  {
    frost: "text",
    lightning: "email",
    secret: "password",
    altitude: "number",
  };

const pushEmoji: Record<string, { left: string; right: string }> = {
  downhill: { left: "⬇️", right: "⬇️" },
  uphill: { left: "⬆️", right: "⬆️" },
  drift: { left: "🌊", right: "🌊" },
  wipeout: { left: "💥", right: "💥" },
  glide: { left: "✨", right: "✨" },
  shuffle: { left: "〰️", right: "〰️" },
  rally: { left: "🎉", right: "🎉" },
};

const reachPadding: Record<string, string> = {
  regular: "px-3 py-1.5",
  blade: "px-1.5 py-1",
  pirouette: "px-2 py-2 rounded-full",
  "long-stride": "px-6 py-2 rounded-full",
};

// ── Ski components — emoji-only renderers ────────────────────────────────
export const skiComponents = {
  // 🏨 Card — a chalet framed top and bottom by snowflakes
  "🏨": ({ props, children }: Ctx) => (
    <div
      className={`${floorPadding[props.floor ?? "compound"] ?? "w-full"} ${
        props.heated ? "mx-auto" : ""
      } flex flex-col`}
    >
      <SnowBorder />
      <div className="px-2 py-2">
        {(props.chaletName || props.notice) && (
          <div className="flex flex-col gap-1 mb-2">
            {props.chaletName && (
              <div className="flex items-center gap-2 text-lg">
                <span>🏨</span>
                <strong>{props.chaletName}</strong>
              </div>
            )}
            {props.notice && (
              <div className="text-sm opacity-70 pl-7">{props.notice}</div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">{children}</div>
      </div>
      <SnowBorder />
    </div>
  ),

  // 🎿 Stack — children separated visually by skis
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

  // ❄️ Separator — a literal line of snowflakes
  "❄️": ({ props }: Ctx) =>
    props.axis === "crevasse" ? (
      <div
        className="flex flex-col text-center select-none leading-none"
        aria-hidden
      >
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i}>❄️</span>
        ))}
      </div>
    ) : (
      <div className="my-2">
        <SnowBorder />
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="select-none">🚡</span>
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
                className={`px-2 py-1 text-sm cursor-pointer ${active ? "font-semibold" : "opacity-60"}`}
              >
                {active ? "🟢" : "⚪"} {cabin.name}
              </button>
            );
          })}
        </div>
        <div>{children}</div>
      </div>
    );
  },

  // 🪵 Accordion — stack of logs that open
  "🪵": ({ props }: Ctx) => {
    const logs: { name: string; rings: string }[] = props.logs ?? [];
    const isMultiple = props.splitting === "rope-team";
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [openMulti, setOpenMulti] = useState<Set<number>>(new Set());
    return (
      <div className="flex flex-col gap-1">
        {logs.map((log, i) => {
          const isOpen = isMultiple
            ? openMulti.has(i)
            : openIndex === i;
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
                <span>🪵</span>
                <strong className="flex-1">{log.name}</strong>
                <span>{isOpen ? "🔽" : "▶️"}</span>
              </button>
              {isOpen && (
                <div className="pl-7 pb-2 text-sm">{log.rings}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  },

  // 🌨️ Dialog — whiteout modal
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
        className="backdrop:bg-black/30 p-0 rounded-md max-w-md"
      >
        <div className="flex flex-col">
          <div className="text-center select-none leading-none py-1">
            🌨️🌨️🌨️🌨️🌨️🌨️🌨️🌨️🌨️🌨️
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌨️</span>
              <strong>{props.peak}</strong>
            </div>
            {props.forecast && (
              <div className="text-sm opacity-80">{props.forecast}</div>
            )}
            <div className="flex flex-col gap-2">{children}</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="self-end mt-2 cursor-pointer text-sm"
            >
              ❌ close
            </button>
          </div>
          <div className="text-center select-none leading-none py-1">
            🌨️🌨️🌨️🌨️🌨️🌨️🌨️🌨️🌨️🌨️
          </div>
        </div>
      </dialog>
    );
  },

  // 🏔️ Heading — a row of snow-capped peaks before the text
  "🏔️": ({ props }: Ctx) => {
    const level = props.prominence ?? "k2";
    const peaks = repeat("🏔️", prominenceMountains[level] ?? 1);
    const size = prominenceSize[level] ?? "text-2xl";
    return (
      <div className={`flex items-center gap-2 ${size} font-bold leading-snug`}>
        <span aria-hidden>{peaks}</span>
        <span>{props.inscription}</span>
      </div>
    );
  },

  // 🥶 Text — cold-face whisper
  "🥶": ({ props }: Ctx) => {
    const cls = chatteringSize[props.chattering ?? "breath"] ?? "text-base";
    return (
      <div className={`flex items-start gap-2 ${cls}`}>
        <span aria-hidden>🥶</span>
        <span>{props.whisper}</span>
      </div>
    );
  },

  // 🥽 Image — what you'd see through goggles
  "🥽": ({ props }: Ctx) => (
    <div
      className="flex flex-col items-center justify-center gap-1 select-none border-2 border-dashed rounded-md p-3"
      style={{
        width: props.width ?? 160,
        height: props.height ?? 100,
        borderColor: "transparent",
      }}
    >
      <div className="text-4xl">🥽</div>
      <div className="text-xs opacity-70 text-center">{props.vista}</div>
    </div>
  ),

  // ⛷️ Avatar — a skier at the chosen speed
  "⛷️": ({ props }: Ctx) => {
    const cls = speedSize[props.speed ?? "parallel"] ?? "text-3xl";
    return (
      <div
        className="flex items-center gap-2"
        title={props.skier ? `Skier: ${props.skier}` : undefined}
      >
        <span className={`${cls} leading-none`}>⛷️</span>
        <div className="flex flex-col">
          <span className="text-xs opacity-70">{props.skier}</span>
        </div>
      </div>
    );
  },

  // 🌲 Badge — a pine-tree slope marker with a difficulty dot
  "🌲": ({ props }: Ctx) => {
    const dot = difficultyDot[props.difficulty ?? "blue"] ?? "🔵";
    const size = props.size === "fir" ? "text-base" : "text-sm";
    return (
      <span className={`inline-flex items-center gap-1 ${size}`}>
        <span aria-hidden>
          {dot}
          🌲
        </span>
        <span>{props.tag}</span>
      </span>
    );
  },

  // ⛄ Alert — snowman bulletin
  "⛄": ({ props }: Ctx) => {
    const icon = frostIcon[props.frost ?? "fresh"] ?? "❄️";
    return (
      <div className="flex flex-col gap-1 py-2">
        <div className="text-center select-none leading-none">{SNOW_LINE}</div>
        <div className="flex items-start gap-3 px-2">
          <span className="text-3xl leading-none">
            {icon}
            ⛄
          </span>
          <div className="flex flex-col">
            <strong>{props.bulletin}</strong>
            {props.melt && (
              <span className="text-sm opacity-80">{props.melt}</span>
            )}
          </div>
        </div>
        <div className="text-center select-none leading-none">{SNOW_LINE}</div>
      </div>
    );
  },

  // 🛷 Table — a loaded sled
  "🛷": ({ props }: Ctx) => {
    const cargo: string[] = props.cargo ?? [];
    const payload: string[][] = (props.payload ?? []).map((row: unknown[]) =>
      row.map(String),
    );
    return (
      <div className="flex flex-col gap-1">
        {props.manifest && (
          <div className="flex items-center gap-2">
            <span>🛷</span>
            <strong>{props.manifest}</strong>
          </div>
        )}
        <div className="text-center select-none leading-none">{PINE_LINE}</div>
        <table className="text-sm">
          <thead>
            <tr>
              {cargo.map((c, i) => (
                <th key={c} className="text-left px-2 py-1 font-semibold">
                  {i === 0 ? "🛷 " : ""}
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payload.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="px-2 py-1">
                    {j === 0 ? "🎿 " : ""}
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center select-none leading-none">{PINE_LINE}</div>
      </div>
    );
  },

  // ☃️ Skeleton — a row of snowmen taking shape
  "☃️": ({ props }: Ctx) => {
    const isBall = props.sculpt === "snowball";
    const sample = isBall ? "⚪" : "☃️";
    const length = Math.max(
      4,
      Math.min(
        20,
        typeof props.chunkWidth === "string" && props.chunkWidth.endsWith("%")
          ? 10
          : 8,
      ),
    );
    return (
      <div
        className="flex items-center gap-1 select-none animate-pulse"
        style={{
          width: props.chunkWidth ?? "100%",
          minHeight: props.chunkHeight ?? "1.25rem",
        }}
      >
        {Array.from({ length }, (_, i) => (
          <span key={i}>{sample}</span>
        ))}
      </div>
    );
  },

  // 🧊 Spinner — a spinning ice cube
  "🧊": ({ props }: Ctx) => (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block animate-spin leading-none ${
          chillSize[props.chill ?? "shake"] ?? "text-xl"
        }`}
      >
        🧊
      </span>
      {props.label && <span className="text-sm opacity-80">{props.label}</span>}
    </div>
  ),

  // 🧣 Tooltip — scarf whisper, via the native title attribute
  "🧣": ({ props }: Ctx) => (
    <span
      title={props.confide}
      className="underline decoration-dotted cursor-help text-sm"
    >
      🧣 {props.whisper}
    </span>
  ),

  // 🔥 Popover — fireplace that lights up on click (HTML <details>)
  "🔥": ({ props }: Ctx) => (
    <details className="inline-block">
      <summary className="cursor-pointer list-none select-none text-sm">
        🔥 {props.spark}
      </summary>
      <div className="mt-1 pl-5 text-sm opacity-90 border-l-2 border-dashed">
        <span aria-hidden>🪵 </span>
        {props.story}
      </div>
    </details>
  ),

  // 🌡️ Input — thermometer-decorated input
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
            <span>🌡️</span>
            <strong>{props.dial}</strong>
            {props.essential && <span title="essential">❗</span>}
          </span>
        )}
        <span className="inline-flex items-center gap-2">
          <span aria-hidden>📏</span>
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
            className="flex-1 border-b outline-none bg-transparent px-1 py-1"
          />
        </span>
        {props.nag && <span className="text-xs opacity-70 pl-6">🌬️ {props.nag}</span>}
      </label>
    );
  },

  // 🍫 Textarea — notes scribbled on a chocolate-bar wrapper
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
            <span>🍫</span>
            <strong>{props.wrapper}</strong>
          </span>
        )}
        <textarea
          id={props.handle ?? undefined}
          name={props.handle ?? undefined}
          placeholder={props.placeholder ?? ""}
          rows={props.squares ?? 3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border rounded-md p-2 bg-transparent outline-none"
        />
        {props.nag && <span className="text-xs opacity-70">🌬️ {props.nag}</span>}
      </label>
    );
  },

  // 🚠 Select — cableway dispatcher
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
            <span>🚠</span>
            <strong>{props.dispatcher}</strong>
          </span>
        )}
        <select
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            emit("dispatch");
          }}
          className="border rounded-md p-1 bg-transparent outline-none"
        >
          <option value="">
            🏔️ {props.placeholder ?? "Pick a station…"}
          </option>
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
        <span className="text-xl leading-none">{checked ? "🧥" : "🥶"}</span>
        <span>{props.layer}</span>
        <span className="opacity-60">{checked ? "(worn)" : "(off)"}</span>
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
            <span>🏂</span>
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
                <span>{active ? "🏂" : "⚪"}</span>
                <span>{s}</span>
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
        <span className="text-2xl leading-none">{checked ? "🧤" : "🖐️"}</span>
      </button>
    );
  },

  // ⛸️ Button — emoji-flanked ice-skate push
  "⛸️": ({ props, emit }: Ctx) => {
    const wing = pushEmoji[props.push ?? "downhill"] ?? pushEmoji.downhill;
    const pad = reachPadding[props.reach ?? "regular"] ?? "px-3 py-1.5";
    const disabled = !!props.laced;
    const loading = !!props.skating;
    return (
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => emit("push")}
        className={`inline-flex items-center gap-2 cursor-pointer select-none border rounded-md ${pad} ${
          disabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <span aria-hidden>{loading ? "🧊" : wing.left}</span>
        <span>⛸️ {props.cheer}</span>
        <span aria-hidden>{loading ? "🧊" : wing.right}</span>
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
      <span aria-hidden>🚞</span>
      <span>{props.station}</span>
      <span aria-hidden>➡️</span>
    </a>
  ),
};
