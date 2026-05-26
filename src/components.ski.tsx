import { useState } from "react";
import { useBoundProp, useStateBinding } from "@json-render/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@alpic-ai/ui/components/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@alpic-ai/ui/components/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@alpic-ai/ui/components/avatar";
import { Badge } from "@alpic-ai/ui/components/badge";
import { Button } from "@alpic-ai/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@alpic-ai/ui/components/card";
import { Checkbox } from "@alpic-ai/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@alpic-ai/ui/components/dialog";
import { Input } from "@alpic-ai/ui/components/input";
import { Label } from "@alpic-ai/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@alpic-ai/ui/components/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "@alpic-ai/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@alpic-ai/ui/components/select";
import { Separator } from "@alpic-ai/ui/components/separator";
import { Skeleton } from "@alpic-ai/ui/components/skeleton";
import { Spinner } from "@alpic-ai/ui/components/spinner";
import { Switch } from "@alpic-ai/ui/components/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@alpic-ai/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@alpic-ai/ui/components/tabs";
import { Textarea } from "@alpic-ai/ui/components/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@alpic-ai/ui/components/tooltip";
import { cn } from "@alpic-ai/ui/lib/cn";

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

// ── Lookup tables: ski slang → @alpic-ai/ui values ──────────────────────
const floorToWidth: Record<string, string> = {
  studio: "max-w-xs sm:min-w-[280px]",
  suite: "max-w-sm sm:min-w-[320px]",
  wing: "max-w-md sm:min-w-[360px]",
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
  wide: "gap-4",
  expedition: "gap-6",
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

const lineMap: Record<string, "default" | "line"> = {
  classic: "default",
  express: "default",
  panoramic: "line",
};

const prominenceMap: Record<string, "h1" | "h2" | "h3" | "h4"> = {
  everest: "h1",
  k2: "h2",
  matterhorn: "h3",
  denali: "h4",
};

const chatteringToVariant: Record<string, string> = {
  breath: "body",
  shiver: "lead",
  lullaby: "muted",
  frozen: "code",
  mutter: "caption",
};

const speedMap: Record<string, "xs" | "sm" | "md" | "lg" | "xl"> = {
  snowplow: "xs",
  wedge: "sm",
  parallel: "md",
  carving: "lg",
  racing: "xl",
};

const difficultyMap: Record<
  string,
  "primary" | "secondary" | "success" | "warning" | "error"
> = {
  green: "success",
  blue: "primary",
  red: "warning",
  black: "error",
  doublered: "secondary",
};

const frostMap: Record<
  string,
  "default" | "success" | "warning" | "destructive"
> = {
  fresh: "default",
  powder: "success",
  icy: "warning",
  avalanche: "destructive",
};

const chillMap: Record<string, "sm" | "md" | "lg" | "xl"> = {
  shiver: "sm",
  shake: "md",
  wobble: "lg",
  spin: "xl",
};

const tintMap: Record<string, "primary" | "secondary"> = {
  crystal: "primary",
  slush: "secondary",
};

const kindToInputType: Record<string, "text" | "email" | "password" | "number"> =
  {
    frost: "text",
    lightning: "email",
    secret: "password",
    altitude: "number",
  };

const pushMap: Record<
  string,
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "link"
  | "link-muted"
  | "cta"
> = {
  downhill: "primary",
  uphill: "secondary",
  drift: "tertiary",
  wipeout: "destructive",
  glide: "link",
  shuffle: "link-muted",
  rally: "cta",
};

const reachMap: Record<
  string,
  "default" | "icon" | "icon-rounded" | "pill"
> = {
  regular: "default",
  blade: "icon",
  pirouette: "icon-rounded",
  "long-stride": "pill",
};

// ── Ski components ───────────────────────────────────────────────────────
export const skiComponents = {
  // 🏨 Card
  "🏨": ({ props, children }: Ctx) => (
    <Card
      hoverable={props.cozy ?? false}
      className={cn(
        floorToWidth[props.floor ?? "compound"] ?? "w-full",
        props.heated ? "mx-auto" : "",
      )}
    >
      {(props.chaletName || props.notice) && (
        <CardHeader>
          {props.chaletName && <CardTitle>{props.chaletName}</CardTitle>}
          {props.notice && <CardDescription>{props.notice}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
  ),

  // 🎿 Stack
  "🎿": ({ props, children }: Ctx) => {
    const direction = runMap[props.run ?? "schuss"] ?? "vertical";
    const gapClass = spacingMap[props.spacing ?? "open"] ?? "gap-3";
    const alignClass = alignMap[props.align ?? "uphill"] ?? "items-start";
    const crowdClass = crowdMap[props.crowd ?? "lift-line"] ?? "";
    return (
      <div
        className={cn(
          "flex",
          direction === "horizontal" ? "flex-row flex-wrap" : "flex-col",
          gapClass,
          alignClass,
          crowdClass,
        )}
      >
        {children}
      </div>
    );
  },

  // 🗻 Grid
  "🗻": ({ props, children }: Ctx) => {
    const n = Math.max(1, Math.min(6, props.slopes ?? 1));
    return (
      <div
        className={cn(
          "grid",
          gridColsMap[n] ?? "grid-cols-1",
          spacingMap[props.spacing ?? "open"] ?? "gap-3",
        )}
      >
        {children}
      </div>
    );
  },

  // ❄️ Separator
  "❄️": ({ props }: Ctx) => (
    <Separator
      orientation={props.axis === "crevasse" ? "vertical" : "horizontal"}
      className={props.axis === "crevasse" ? "h-full mx-2" : "my-3"}
    />
  ),

  // 🚡 Tabs
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
      <Tabs
        value={value}
        onValueChange={(v: string) => {
          setValue(v);
          emit("ride");
        }}
      >
        <TabsList variant={lineMap[props.line ?? "classic"] ?? "default"}>
          {cabins.map((cabin) => (
            <TabsTrigger key={cabin.station} value={cabin.station}>
              {cabin.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    );
  },

  // 🪵 Accordion
  "🪵": ({ props }: Ctx) => {
    const logs: { name: string; rings: string }[] = props.logs ?? [];
    const isMultiple = props.splitting === "rope-team";
    const items = logs.map((log, i) => (
      <AccordionItem key={i} value={`log-${i}`}>
        <AccordionTrigger>{log.name}</AccordionTrigger>
        <AccordionContent>{log.rings}</AccordionContent>
      </AccordionItem>
    ));
    if (isMultiple) {
      return (
        <Accordion type="multiple" className="w-full">
          {items}
        </Accordion>
      );
    }
    return (
      <Accordion type="single" collapsible className="w-full">
        {items}
      </Accordion>
    );
  },

  // 🌨️ Dialog
  "🌨️": ({ props, children }: Ctx) => {
    const [open, setOpen] = useStateBinding<boolean>(props.visibility ?? "");
    return (
      <Dialog open={open ?? false} onOpenChange={(v) => setOpen(v)}>
        <DialogContent size={props.severity === "blizzard" ? "lg" : "sm"}>
          <DialogHeader>
            <DialogTitle>{props.peak}</DialogTitle>
            {props.forecast && (
              <DialogDescription>{props.forecast}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  },

  // 🏔️ Heading
  "🏔️": ({ props }: Ctx) => {
    const level = prominenceMap[props.prominence ?? "k2"] ?? "h2";
    const cls =
      level === "h1"
        ? "text-2xl font-bold"
        : level === "h3"
          ? "text-base font-semibold"
          : level === "h4"
            ? "text-sm font-semibold"
            : "text-lg font-semibold";
    const className = `${cls} text-left text-foreground`;
    if (level === "h1")
      return <h1 className={className}>{props.inscription}</h1>;
    if (level === "h3")
      return <h3 className={className}>{props.inscription}</h3>;
    if (level === "h4")
      return <h4 className={className}>{props.inscription}</h4>;
    return <h2 className={className}>{props.inscription}</h2>;
  },

  // 🥶 Text
  "🥶": ({ props }: Ctx) => {
    const variant = chatteringToVariant[props.chattering ?? "breath"] ?? "body";
    const cls =
      variant === "caption"
        ? "text-xs text-muted-foreground"
        : variant === "muted"
          ? "text-sm text-muted-foreground"
          : variant === "lead"
            ? "text-xl text-muted-foreground"
            : variant === "code"
              ? "font-mono text-sm bg-muted px-1.5 py-0.5 rounded"
              : "text-sm text-foreground";
    if (variant === "code") {
      return <code className={`${cls} text-left`}>{props.whisper}</code>;
    }
    return <p className={`${cls} text-left`}>{props.whisper}</p>;
  },

  // 🥽 Image
  "🥽": ({ props }: Ctx) => {
    if (props.lens) {
      return (
        <img
          src={props.lens}
          alt={props.vista ?? ""}
          width={props.width ?? undefined}
          height={props.height ?? undefined}
          className="rounded-md max-w-full"
        />
      );
    }
    return (
      <div
        className="bg-muted border border-border rounded-md flex items-center justify-center text-xs text-muted-foreground"
        style={{ width: props.width ?? 80, height: props.height ?? 60 }}
      >
        {props.vista || "fogged"}
      </div>
    );
  },

  // ⛷️ Avatar
  "⛷️": ({ props }: Ctx) => {
    const name: string = props.skier || "?";
    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <Avatar size={speedMap[props.speed ?? "parallel"] ?? "md"}>
        {props.portrait && <AvatarImage src={props.portrait} alt={name} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  },

  // 🌲 Badge
  "🌲": ({ props }: Ctx) => (
    <Badge
      variant={difficultyMap[props.difficulty ?? "blue"] ?? "primary"}
      size={props.size === "fir" ? "md" : "sm"}
    >
      {props.tag}
    </Badge>
  ),

  // ⛄ Alert
  "⛄": ({ props }: Ctx) => {
    const variant = frostMap[props.frost ?? "fresh"] ?? "default";
    return (
      <Alert variant={variant}>
        <AlertTitle>{props.bulletin}</AlertTitle>
        {props.melt && <AlertDescription>{props.melt}</AlertDescription>}
      </Alert>
    );
  },

  // 🛷 Table
  "🛷": ({ props }: Ctx) => {
    const cargo: string[] = props.cargo ?? [];
    const payload: string[][] = (props.payload ?? []).map((row: unknown[]) =>
      row.map(String),
    );
    return (
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          {props.manifest && <TableCaption>{props.manifest}</TableCaption>}
          <TableHeader>
            <TableRow>
              {cargo.map((c) => (
                <TableHead key={c}>{c}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {payload.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },

  // ☃️ Skeleton
  "☃️": ({ props }: Ctx) => (
    <Skeleton
      shape={props.sculpt === "snowball" ? "circle" : "rectangle"}
      style={{
        width: props.chunkWidth ?? "100%",
        height: props.chunkHeight ?? "1.25rem",
      }}
    />
  ),

  // 🧊 Spinner
  "🧊": ({ props }: Ctx) => (
    <div className="flex items-center gap-2">
      <Spinner
        size={chillMap[props.chill ?? "shake"] ?? "md"}
        variant={tintMap[props.tint ?? "crystal"] ?? "primary"}
      />
      {props.label && (
        <span className="text-sm text-muted-foreground">{props.label}</span>
      )}
    </div>
  ),

  // 🧣 Tooltip
  "🧣": ({ props }: Ctx) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm underline decoration-dotted cursor-help">
            {props.whisper}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{props.confide}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),

  // 🔥 Popover
  "🔥": ({ props }: Ctx) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="text-sm">
          {props.spark}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p className="text-sm">{props.story}</p>
      </PopoverContent>
    </Popover>
  ),

  // 🌡️ Input
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
      <Input
        id={props.handle ?? undefined}
        name={props.handle ?? undefined}
        type={kindToInputType[props.kind ?? "frost"] ?? "text"}
        label={props.dial ?? undefined}
        placeholder={props.placeholder ?? ""}
        hint={props.nag ?? undefined}
        required={props.essential ?? false}
        size={props.face === "compact" ? "sm" : "md"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") emit("freeze");
        }}
        onFocus={() => emit("spike")}
        onBlur={() => emit("settle")}
      />
    );
  },

  // 🍫 Textarea
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
      <Textarea
        id={props.handle ?? undefined}
        name={props.handle ?? undefined}
        label={props.wrapper ?? undefined}
        placeholder={props.placeholder ?? ""}
        hint={props.nag ?? undefined}
        required={props.essential ?? false}
        rows={props.squares ?? 3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },

  // 🚠 Select
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
      <div className="space-y-2">
        {props.dispatcher && <Label>{props.dispatcher}</Label>}
        <Select
          value={value}
          onValueChange={(v: string) => {
            setValue(v);
            emit("dispatch");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={props.placeholder ?? "Pick a station…"}
            />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((d, idx) => (
              <SelectItem key={`${idx}-${d}`} value={d || `station-${idx}`}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },

  // 🧥 Checkbox
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id={props.handle ?? undefined}
          checked={checked}
          onCheckedChange={(c) => {
            setChecked(c === true);
            emit("layer");
          }}
        />
        <Label htmlFor={props.handle ?? undefined} className="cursor-pointer">
          {props.layer}
        </Label>
      </div>
    );
  },

  // 🏂 Radio
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
      <div className="space-y-2">
        {props.question && <Label>{props.question}</Label>}
        <RadioGroup
          value={value}
          onValueChange={(v: string) => {
            setValue(v);
            emit("stance");
          }}
        >
          {stances.map((s, idx) => (
            <div key={`${idx}-${s}`} className="flex items-center space-x-2">
              <RadioGroupItem
                value={s || `stance-${idx}`}
                id={`${props.handle}-${idx}-${s}`}
              />
              <Label
                htmlFor={`${props.handle}-${idx}-${s}`}
                className="cursor-pointer"
              >
                {s}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  },

  // 🧤 Switch
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
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor={props.handle ?? undefined} className="cursor-pointer">
          {props.hand}
        </Label>
        <Switch
          id={props.handle ?? undefined}
          checked={checked}
          onCheckedChange={(c) => {
            setChecked(c);
            emit("don");
          }}
        />
      </div>
    );
  },

  // ⛸️ Button
  "⛸️": ({ props, emit }: Ctx) => (
    <Button
      variant={pushMap[props.push ?? "downhill"] ?? "primary"}
      size={reachMap[props.reach ?? "regular"] ?? "default"}
      disabled={props.laced ?? false}
      loading={props.skating ?? false}
      onClick={() => emit("push")}
    >
      {props.cheer}
    </Button>
  ),

  // 🚞 Link
  "🚞": ({ props, on }: Ctx) => (
    <a
      href={props.track ?? "#"}
      className={cn(
        "underline-offset-4 text-sm font-medium hover:underline",
        props.polished === "fresh" ? "text-link-muted" : "text-link",
      )}
      onClick={(e) => {
        const press = on("board");
        if (press.shouldPreventDefault) e.preventDefault();
        press.emit();
      }}
    >
      {props.station}
    </a>
  ),
};
