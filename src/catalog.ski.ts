import { z } from "zod";

/**
 * 🎿  SKI-RESORT EDITION  🎿
 *
 * Every component in this catalog is a ski-related emoji. Every prop is named
 * after something a skier would actually say — chalets, schuss, traverses,
 * goggles, lift lines, après-ski. Underneath, each component still maps to a
 * real @alpic-ai/ui primitive, so the model can build entirely functional UIs
 * from a vocabulary lifted straight off a ski resort piste map.
 *
 * Flip back to the serious catalog in `src/active-catalog.ts`.
 */
export const skiComponentDefinitions = {
  // ── Build the resort (Layout) ─────────────────────────────────────────
  "🏨": {
    props: z.object({
      chaletName: z.string().nullable().describe("Card title"),
      notice: z.string().nullable().describe("Card description"),
      floor: z
        .enum(["studio", "suite", "wing", "compound"])
        .nullable()
        .describe("Max width: studio=sm, suite=md, wing=lg, compound=full"),
      heated: z.boolean().nullable().describe("Center the chalet on the page"),
      cozy: z.boolean().nullable().describe("Hover lifts the chalet's roof"),
    }),
    slots: ["default"],
    description:
      "🏨 A warm chalet that hosts content. Use for forms, gear lists, lift reports. Not for page-level headings.",
    example: { chaletName: "Lift pass", notice: "Valid until April 15" },
  },
  "🎿": {
    props: z.object({
      run: z
        .enum(["schuss", "traverse"])
        .nullable()
        .describe("schuss = vertical descent, traverse = horizontal cut"),
      spacing: z
        .enum(["edge-to-edge", "tight", "open", "wide", "expedition"])
        .nullable()
        .describe(
          "Gap between cairns. edge-to-edge=none, tight=sm, open=md, wide=lg, expedition=xl",
        ),
      align: z
        .enum(["uphill", "centerline", "downhill", "groomed"])
        .nullable()
        .describe(
          "Cross-axis. uphill=start, centerline=center, downhill=end, groomed=stretch",
        ),
      crowd: z
        .enum(["lift-line", "centered", "downhill", "evenly-tracked", "loose-pack"])
        .nullable()
        .describe(
          "Main-axis. lift-line=start, centered=center, downhill=end, evenly-tracked=between, loose-pack=around",
        ),
    }),
    slots: ["default"],
    description:
      "🎿 A pair of skis: a flex stack of children, running straight down the fall line or cutting across.",
    example: { run: "schuss", spacing: "open" },
  },
  "🗻": {
    props: z.object({
      slopes: z.number().describe("Number of columns (1-6)"),
      spacing: z
        .enum(["tight", "open", "wide", "expedition"])
        .nullable()
        .describe("Gap between slopes"),
    }),
    slots: ["default"],
    description: "🗻 A perfectly groomed grid of slopes (1–6 columns).",
    example: { slopes: 3, spacing: "open" },
  },
  "❄️": {
    props: z.object({
      axis: z
        .enum(["ridge", "crevasse"])
        .nullable()
        .describe("ridge = horizontal line, crevasse = vertical line"),
    }),
    description: "❄️ A line of fresh snow dividing the page.",
  },
  "🚡": {
    props: z.object({
      cabins: z.array(
        z.object({
          name: z.string().describe("Cabin name on its side"),
          station: z.string().describe("Internal id for the destination"),
        }),
      ),
      boarding: z
        .string()
        .nullable()
        .describe("Cabin selected at the start of the day"),
      aboard: z
        .string()
        .nullable()
        .describe("Currently boarded cabin. Bind with { $bindState }."),
      line: z
        .enum(["classic", "express", "panoramic"])
        .nullable()
        .describe(
          "Tab visual style. classic=default tab strip, express=pill, panoramic=line.",
        ),
    }),
    slots: ["default"],
    events: ["ride"],
    description: "🚡 An aerial tram with several cabins, each going somewhere different.",
  },
  "🪵": {
    props: z.object({
      logs: z.array(
        z.object({
          name: z.string().describe("Heading carved into the log"),
          rings: z.string().describe("What's inside the log"),
        }),
      ),
      splitting: z
        .enum(["single-axe", "rope-team"])
        .nullable()
        .describe(
          "single-axe = one log open at a time, rope-team = multiple logs open",
        ),
    }),
    description:
      "🪵 The lodge's woodpile: a stack of logs, each opening to reveal what's inside.",
  },
  "🌨️": {
    props: z.object({
      peak: z.string().describe("Modal title"),
      forecast: z.string().nullable().describe("Modal description"),
      visibility: z
        .string()
        .describe("Boolean state path controlling whether the storm is on us"),
      severity: z
        .enum(["flurry", "blizzard"])
        .nullable()
        .describe("flurry = small dialog, blizzard = large dialog"),
    }),
    slots: ["default"],
    description:
      "🌨️ A whiteout: a modal storm that takes over the screen until visibility clears.",
  },

  // ── On the mountain (Display) ─────────────────────────────────────────
  "🏔️": {
    props: z.object({
      inscription: z.string().describe("Heading text"),
      prominence: z
        .enum(["everest", "k2", "matterhorn", "denali"])
        .nullable()
        .describe(
          "everest=h1, k2=h2, matterhorn=h3, denali=h4. Bigger peaks, bigger letters.",
        ),
    }),
    description: "🏔️ A snow-capped peak with a heading carved into it.",
    example: { inscription: "Welcome to base camp", prominence: "everest" },
  },
  "🥶": {
    props: z.object({
      whisper: z.string().describe("Text content"),
      chattering: z
        .enum(["breath", "shiver", "lullaby", "frozen", "mutter"])
        .nullable()
        .describe(
          "breath=body, shiver=lead, lullaby=muted, frozen=code, mutter=caption",
        ),
    }),
    description: "🥶 Cold words muttered through the scarf. Paragraph text.",
    example: { whisper: "It's -22°C at the summit." },
  },
  "🥽": {
    props: z.object({
      lens: z.string().nullable().describe("Image URL — what's behind the goggles"),
      vista: z.string().describe("What we're looking at (alt text)"),
      width: z.number().nullable().describe("Width in pixels"),
      height: z.number().nullable().describe("Height in pixels"),
    }),
    description:
      "🥽 The view through a pair of goggles. Renders an image, or a fogged-up placeholder if the lens is missing.",
  },
  "⛷️": {
    props: z.object({
      skier: z.string().describe("Name of the skier"),
      portrait: z.string().nullable().describe("Avatar image URL"),
      speed: z
        .enum(["snowplow", "wedge", "parallel", "carving", "racing"])
        .nullable()
        .describe(
          "Sizes: snowplow=xs (cautious), wedge=sm, parallel=md, carving=lg, racing=xl",
        ),
    }),
    description:
      "⛷️ A skier's portrait, with initials fallback if the bib is lost in the powder.",
    example: { skier: "Lindsey Vonn", speed: "racing" },
  },
  "🌲": {
    props: z.object({
      tag: z.string().describe("Badge text"),
      difficulty: z
        .enum(["green", "blue", "red", "black", "doublered"])
        .nullable()
        .describe(
          "Slope colors. green=success (easy), blue=primary (intermediate), red=warning (hard), black=error (expert), doublered=secondary (off-piste).",
        ),
      size: z
        .enum(["seedling", "fir"])
        .nullable()
        .describe("seedling=sm, fir=md"),
    }),
    description: "🌲 A pine-tree slope marker. A badge with a slope-color tag.",
    example: { tag: "Easy slope", difficulty: "green" },
  },
  "⛄": {
    props: z.object({
      bulletin: z.string().describe("Alert title"),
      melt: z.string().nullable().describe("Alert body"),
      frost: z
        .enum(["fresh", "powder", "icy", "avalanche"])
        .nullable()
        .describe(
          "fresh=info, powder=success, icy=warning, avalanche=destructive.",
        ),
    }),
    description: "⛄ A snowman bulletin. Use for snow reports, warnings, success notes.",
    example: {
      bulletin: "Fresh powder",
      melt: "20 cm overnight on the north faces.",
      frost: "powder",
    },
  },
  "🛷": {
    props: z.object({
      cargo: z.array(z.string()).describe("Column headers carved into the sled"),
      payload: z
        .array(z.array(z.string()))
        .describe('2D array of cells, e.g. [["Day 1","75 km/h"],["Day 2","-18°C"]]'),
      manifest: z.string().nullable().describe("Optional table caption"),
    }),
    description:
      "🛷 A loaded sled: a table of data being dragged down the mountain. Use for race times, gear inventories, weather logs.",
    example: {
      cargo: ["Day", "Top speed"],
      payload: [
        ["Day 1", "75 km/h"],
        ["Day 2", "82 km/h"],
      ],
    },
  },
  "☃️": {
    props: z.object({
      chunkWidth: z.string().nullable().describe("CSS width of the snowball"),
      chunkHeight: z.string().nullable().describe("CSS height of the snowball"),
      sculpt: z
        .enum(["snowball", "snowbrick"])
        .nullable()
        .describe("snowball=circle, snowbrick=rectangle"),
    }),
    description:
      "☃️ A snowman taking shape: a skeleton placeholder shimmering while real data arrives.",
  },
  "🧊": {
    props: z.object({
      chill: z
        .enum(["shiver", "shake", "wobble", "spin"])
        .nullable()
        .describe("Spinner sizes: shiver=sm, shake=md, wobble=lg, spin=xl"),
      tint: z
        .enum(["crystal", "slush"])
        .nullable()
        .describe("crystal=primary, slush=secondary"),
      label: z.string().nullable().describe("Optional label next to the ice cube"),
    }),
    description: "🧊 A spinning ice cube. The loading spinner.",
  },
  "🧣": {
    props: z.object({
      whisper: z.string().describe("Phrase visible on the page"),
      confide: z.string().describe("What's whispered through the scarf on hover"),
    }),
    description: "🧣 A scarf-muffled whisper. Hover the phrase to hear the confidence.",
  },
  "🔥": {
    props: z.object({
      spark: z.string().describe("Label on the kindling button"),
      story: z.string().describe("The tale told once the fire catches"),
    }),
    description: "🔥 The lodge fireplace. Click to light it and read the tale.",
  },

  // ── Gear up (Form inputs) ─────────────────────────────────────────────
  "🌡️": {
    props: z.object({
      dial: z.string().describe("Label above the readout"),
      handle: z.string().describe("Internal name (form field name)"),
      kind: z
        .enum(["frost", "lightning", "secret", "altitude"])
        .nullable()
        .describe("frost=text, lightning=email, secret=password, altitude=number"),
      placeholder: z
        .string()
        .nullable()
        .describe("Greyed-out hint inside the dial"),
      reading: z
        .string()
        .nullable()
        .describe("Current value. Bind with { $bindState }."),
      nag: z.string().nullable().describe("Helper hint under the dial"),
      essential: z
        .boolean()
        .nullable()
        .describe("Required: skiing without it is reckless"),
      face: z
        .enum(["compact", "expedition"])
        .nullable()
        .describe("compact=sm, expedition=md"),
    }),
    events: ["freeze", "spike", "settle"],
    description:
      "🌡️ A thermometer/altimeter readout. Bind reading with { $bindState }.",
    example: {
      dial: "Wind chill",
      handle: "windchill",
      kind: "altitude",
      placeholder: "°C",
    },
  },
  "🍫": {
    props: z.object({
      wrapper: z.string().describe("Label on the chocolate wrapper"),
      handle: z.string().describe("Internal name"),
      placeholder: z.string().nullable().describe("Faded ink suggestion"),
      squares: z.number().nullable().describe("Number of writing rows"),
      scribble: z
        .string()
        .nullable()
        .describe("Notes scribbled on the wrapper. Bind with { $bindState }."),
      nag: z.string().nullable().describe("Helper hint at the bottom"),
      essential: z.boolean().nullable().describe("Required"),
    }),
    description:
      "🍫 Notes scribbled on a chocolate-bar wrapper after lunch. Multi-line text input.",
  },
  "🚠": {
    props: z.object({
      dispatcher: z.string().describe("Label above the lift map"),
      handle: z.string().describe("Internal name"),
      destinations: z.array(z.string()).describe("Possible lift destinations (options)"),
      placeholder: z
        .string()
        .nullable()
        .describe('Placeholder, e.g. "Pick a station"'),
      destination: z
        .string()
        .nullable()
        .describe("Currently chosen station. Bind with { $bindState }."),
    }),
    events: ["dispatch"],
    description: "🚠 The cableway dispatcher: choose a single lift destination. Select dropdown.",
  },
  "🧥": {
    props: z.object({
      layer: z.string().describe("Name of the layer (e.g. baselayer, shell)"),
      handle: z.string().describe("Internal name"),
      worn: z
        .boolean()
        .nullable()
        .describe("Is the layer on? Bind with { $bindState }."),
    }),
    events: ["layer"],
    description: "🧥 A clothing layer. Checkbox: are you wearing it?",
  },
  "🏂": {
    props: z.object({
      question: z.string().describe("Stance question"),
      handle: z.string().describe("Internal name"),
      stances: z.array(z.string()).describe("Possible board stances"),
      stance: z
        .string()
        .nullable()
        .describe("Currently set stance. Bind with { $bindState }."),
    }),
    events: ["stance"],
    description:
      "🏂 Snowboarder stance picker: a radio group where each option is a riding style (regular, goofy, switch…).",
  },
  "🧤": {
    props: z.object({
      hand: z.string().describe("Label beside the glove"),
      handle: z.string().describe("Internal name"),
      donned: z
        .boolean()
        .nullable()
        .describe("Glove on? Bind with { $bindState }."),
    }),
    events: ["don"],
    description: "🧤 A glove: switch toggle. Bind donned with { $bindState }.",
  },

  // ── Drop in (Actions) ─────────────────────────────────────────────────
  "⛸️": {
    props: z.object({
      cheer: z.string().describe("Words shouted by the skater (button label)"),
      push: z
        .enum([
          "downhill",
          "uphill",
          "drift",
          "wipeout",
          "glide",
          "shuffle",
          "rally",
        ])
        .nullable()
        .describe(
          "downhill=primary, uphill=secondary, drift=tertiary, wipeout=destructive, glide=link, shuffle=link-muted, rally=cta",
        ),
      reach: z
        .enum(["regular", "blade", "pirouette", "long-stride"])
        .nullable()
        .describe(
          "regular=default size, blade=icon, pirouette=icon-rounded, long-stride=pill",
        ),
      laced: z.boolean().nullable().describe("Disabled (lace broken)"),
      skating: z.boolean().nullable().describe("Loading (still in motion)"),
    }),
    events: ["push"],
    description:
      "⛸️ An ice-skate push: the action button. Bind on.push to launch the run.",
    example: { cheer: "Drop in!", push: "downhill" },
  },
  "🚞": {
    props: z.object({
      station: z.string().describe("Words on the station signpost"),
      track: z.string().describe("href of the train track"),
      polished: z
        .enum(["fresh", "worn"])
        .nullable()
        .describe("fresh=muted link, worn=primary link"),
    }),
    events: ["board"],
    description: "🚞 The mountain railway: an anchor link. Bind on.board to leave the slopes.",
  },
};

export type SkiComponentDefinitions = typeof skiComponentDefinitions;
