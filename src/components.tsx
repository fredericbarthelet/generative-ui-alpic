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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@alpic-ai/ui/components/tabs";
import { Textarea } from "@alpic-ai/ui/components/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@alpic-ai/ui/components/tooltip";
import { cn } from "@alpic-ai/ui/lib/cn";

type ComponentProps = {
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

const gapMap: Record<string, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};

const alignMap: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyMap: Record<string, string> = {
  start: "",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const gridColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export const alpicComponents = {
  // ── Layout ────────────────────────────────────────────────────────────
  Card: ({ props, children }: ComponentProps) => {
    const maxWidthClass =
      props.maxWidth === "sm"
        ? "max-w-xs sm:min-w-[280px]"
        : props.maxWidth === "md"
          ? "max-w-sm sm:min-w-[320px]"
          : props.maxWidth === "lg"
            ? "max-w-md sm:min-w-[360px]"
            : "w-full";
    const centeredClass = props.centered ? "mx-auto" : "";
    return (
      <Card
        hoverable={props.hoverable ?? false}
        className={cn(maxWidthClass, centeredClass, props.className)}
      >
        {(props.title || props.description) && (
          <CardHeader>
            {props.title && <CardTitle>{props.title}</CardTitle>}
            {props.description && (
              <CardDescription>{props.description}</CardDescription>
            )}
          </CardHeader>
        )}
        <CardContent className="flex flex-col gap-3">{children}</CardContent>
      </Card>
    );
  },

  Stack: ({ props, children }: ComponentProps) => {
    const isHorizontal = props.direction === "horizontal";
    const gapClass = gapMap[props.gap ?? "md"] ?? "gap-3";
    const alignClass = alignMap[props.align ?? "start"] ?? "items-start";
    const justifyClass = justifyMap[props.justify ?? "start"] ?? "";
    return (
      <div
        className={cn(
          "flex",
          isHorizontal ? "flex-row flex-wrap" : "flex-col",
          gapClass,
          alignClass,
          justifyClass,
          props.className,
        )}
      >
        {children}
      </div>
    );
  },

  Grid: ({ props, children }: ComponentProps) => {
    const n = Math.max(1, Math.min(6, props.columns ?? 1));
    const cols = gridColsMap[n] ?? "grid-cols-1";
    const gridGap = gapMap[props.gap ?? "md"] ?? "gap-3";
    return (
      <div className={cn("grid", cols, gridGap, props.className)}>
        {children}
      </div>
    );
  },

  Separator: ({ props }: ComponentProps) => (
    <Separator
      orientation={props.orientation ?? "horizontal"}
      className={props.orientation === "vertical" ? "h-full mx-2" : "my-3"}
    />
  ),

  Tabs: ({ props, children, bindings, emit }: ComponentProps) => {
    const tabs: { label: string; value: string }[] = props.tabs ?? [];
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.value,
      bindings?.value,
    );
    const [localValue, setLocalValue] = useState<string>(
      props.defaultValue ?? tabs[0]?.value ?? "",
    );
    const isBound = !!bindings?.value;
    const value = isBound ? (boundValue ?? tabs[0]?.value ?? "") : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    return (
      <Tabs
        value={value}
        onValueChange={(v: string) => {
          setValue(v);
          emit("change");
        }}
      >
        <TabsList variant={props.variant === "line" ? "line" : "default"}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    );
  },

  Accordion: ({ props }: ComponentProps) => {
    const items: { title: string; content: string }[] = props.items ?? [];
    const isMultiple = props.type === "multiple";
    const itemElements = items.map((item, i) => (
      <AccordionItem key={i} value={`item-${i}`}>
        <AccordionTrigger>{item.title}</AccordionTrigger>
        <AccordionContent>{item.content}</AccordionContent>
      </AccordionItem>
    ));
    if (isMultiple) {
      return (
        <Accordion type="multiple" className="w-full">
          {itemElements}
        </Accordion>
      );
    }
    return (
      <Accordion type="single" collapsible className="w-full">
        {itemElements}
      </Accordion>
    );
  },

  Dialog: ({ props, children }: ComponentProps) => {
    const [open, setOpen] = useStateBinding<boolean>(props.openPath ?? "");
    return (
      <Dialog open={open ?? false} onOpenChange={(v) => setOpen(v)}>
        <DialogContent size={props.size ?? undefined}>
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            {props.description && (
              <DialogDescription>{props.description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  },

  // ── Data Display ──────────────────────────────────────────────────────
  Heading: ({ props }: ComponentProps) => {
    const level = props.level ?? "h2";
    const headingClass =
      level === "h1"
        ? "text-2xl font-bold"
        : level === "h3"
          ? "text-base font-semibold"
          : level === "h4"
            ? "text-sm font-semibold"
            : "text-lg font-semibold";
    const className = `${headingClass} text-left text-foreground`;
    if (level === "h1") return <h1 className={className}>{props.text}</h1>;
    if (level === "h3") return <h3 className={className}>{props.text}</h3>;
    if (level === "h4") return <h4 className={className}>{props.text}</h4>;
    return <h2 className={className}>{props.text}</h2>;
  },

  Text: ({ props }: ComponentProps) => {
    const textClass =
      props.variant === "caption"
        ? "text-xs text-muted-foreground"
        : props.variant === "muted"
          ? "text-sm text-muted-foreground"
          : props.variant === "lead"
            ? "text-xl text-muted-foreground"
            : props.variant === "code"
              ? "font-mono text-sm bg-muted px-1.5 py-0.5 rounded"
              : "text-sm text-foreground";
    if (props.variant === "code") {
      return <code className={`${textClass} text-left`}>{props.text}</code>;
    }
    return <p className={`${textClass} text-left`}>{props.text}</p>;
  },

  Image: ({ props }: ComponentProps) => {
    if (props.src) {
      return (
        <img
          src={props.src}
          alt={props.alt ?? ""}
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
        {props.alt || "img"}
      </div>
    );
  },

  Avatar: ({ props }: ComponentProps) => {
    const name = props.name || "?";
    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <Avatar size={props.size ?? "md"}>
        {props.src && <AvatarImage src={props.src} alt={name} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  },

  Badge: ({ props }: ComponentProps) => (
    <Badge variant={props.variant ?? "primary"} size={props.size ?? "md"}>
      {props.text}
    </Badge>
  ),

  Alert: ({ props }: ComponentProps) => {
    const variant =
      props.type === "error"
        ? "destructive"
        : props.type === "warning"
          ? "warning"
          : props.type === "success"
            ? "success"
            : "default";
    return (
      <Alert variant={variant}>
        <AlertTitle>{props.title}</AlertTitle>
        {props.message && <AlertDescription>{props.message}</AlertDescription>}
      </Alert>
    );
  },

  Table: ({ props }: ComponentProps) => {
    const columns: string[] = props.columns ?? [];
    const rows: string[][] = (props.rows ?? []).map((row: unknown[]) =>
      row.map(String),
    );
    return (
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          {props.caption && <TableCaption>{props.caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
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

  Skeleton: ({ props }: ComponentProps) => (
    <Skeleton
      shape={props.shape === "circle" ? "circle" : "rectangle"}
      style={{
        width: props.width ?? "100%",
        height: props.height ?? "1.25rem",
      }}
    />
  ),

  Spinner: ({ props }: ComponentProps) => (
    <div className="flex items-center gap-2">
      <Spinner size={props.size ?? "md"} variant={props.variant ?? "primary"} />
      {props.label && (
        <span className="text-sm text-muted-foreground">{props.label}</span>
      )}
    </div>
  ),

  Tooltip: ({ props }: ComponentProps) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm underline decoration-dotted cursor-help">
            {props.text}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{props.content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),

  Popover: ({ props }: ComponentProps) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="text-sm">
          {props.trigger}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p className="text-sm">{props.content}</p>
      </PopoverContent>
    </Popover>
  ),

  // ── Form Inputs ───────────────────────────────────────────────────────
  Input: ({ props, bindings, emit }: ComponentProps) => {
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.value,
      bindings?.value,
    );
    const [localValue, setLocalValue] = useState("");
    const isBound = !!bindings?.value;
    const value = isBound ? (boundValue ?? "") : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    return (
      <Input
        id={props.name ?? undefined}
        name={props.name ?? undefined}
        type={props.type ?? "text"}
        label={props.label ?? undefined}
        placeholder={props.placeholder ?? ""}
        hint={props.hint ?? undefined}
        required={props.required ?? false}
        size={props.size ?? "md"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") emit("submit");
        }}
        onFocus={() => emit("focus")}
        onBlur={() => emit("blur")}
      />
    );
  },

  Textarea: ({ props, bindings }: ComponentProps) => {
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.value,
      bindings?.value,
    );
    const [localValue, setLocalValue] = useState("");
    const isBound = !!bindings?.value;
    const value = isBound ? (boundValue ?? "") : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    return (
      <Textarea
        id={props.name ?? undefined}
        name={props.name ?? undefined}
        label={props.label ?? undefined}
        placeholder={props.placeholder ?? ""}
        hint={props.hint ?? undefined}
        required={props.required ?? false}
        rows={props.rows ?? 3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },

  Select: ({ props, bindings, emit }: ComponentProps) => {
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.value,
      bindings?.value,
    );
    const [localValue, setLocalValue] = useState("");
    const isBound = !!bindings?.value;
    const value = isBound ? (boundValue ?? "") : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    const options: string[] = (props.options ?? []).map((opt: unknown) =>
      typeof opt === "string" ? opt : String(opt ?? ""),
    );
    return (
      <div className="space-y-2">
        {props.label && <Label>{props.label}</Label>}
        <Select
          value={value}
          onValueChange={(v: string) => {
            setValue(v);
            emit("change");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={props.placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt, idx) => (
              <SelectItem
                key={`${idx}-${opt}`}
                value={opt || `option-${idx}`}
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },

  Checkbox: ({ props, bindings, emit }: ComponentProps) => {
    const [boundChecked, setBoundChecked] = useBoundProp<boolean>(
      props.checked,
      bindings?.checked,
    );
    const [localChecked, setLocalChecked] = useState<boolean>(!!props.checked);
    const isBound = !!bindings?.checked;
    const checked = isBound ? (boundChecked ?? false) : localChecked;
    const setChecked = isBound ? setBoundChecked : setLocalChecked;
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={props.name ?? undefined}
          checked={checked}
          onCheckedChange={(c) => {
            setChecked(c === true);
            emit("change");
          }}
        />
        <Label htmlFor={props.name ?? undefined} className="cursor-pointer">
          {props.label}
        </Label>
      </div>
    );
  },

  Radio: ({ props, bindings, emit }: ComponentProps) => {
    const options: string[] = (props.options ?? []).map((opt: unknown) =>
      typeof opt === "string" ? opt : String(opt ?? ""),
    );
    const [boundValue, setBoundValue] = useBoundProp<string>(
      props.value,
      bindings?.value,
    );
    const [localValue, setLocalValue] = useState<string>(options[0] ?? "");
    const isBound = !!bindings?.value;
    const value = isBound ? (boundValue ?? "") : localValue;
    const setValue = isBound ? setBoundValue : setLocalValue;
    return (
      <div className="space-y-2">
        {props.label && <Label>{props.label}</Label>}
        <RadioGroup
          value={value}
          onValueChange={(v: string) => {
            setValue(v);
            emit("change");
          }}
        >
          {options.map((opt, idx) => (
            <div
              key={`${idx}-${opt}`}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem
                value={opt || `option-${idx}`}
                id={`${props.name}-${idx}-${opt}`}
              />
              <Label
                htmlFor={`${props.name}-${idx}-${opt}`}
                className="cursor-pointer"
              >
                {opt}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  },

  Switch: ({ props, bindings, emit }: ComponentProps) => {
    const [boundChecked, setBoundChecked] = useBoundProp<boolean>(
      props.checked,
      bindings?.checked,
    );
    const [localChecked, setLocalChecked] = useState<boolean>(!!props.checked);
    const isBound = !!bindings?.checked;
    const checked = isBound ? (boundChecked ?? false) : localChecked;
    const setChecked = isBound ? setBoundChecked : setLocalChecked;
    return (
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor={props.name ?? undefined} className="cursor-pointer">
          {props.label}
        </Label>
        <Switch
          id={props.name ?? undefined}
          checked={checked}
          onCheckedChange={(c) => {
            setChecked(c);
            emit("change");
          }}
        />
      </div>
    );
  },

  // ── Actions ───────────────────────────────────────────────────────────
  Button: ({ props, emit }: ComponentProps) => (
    <Button
      variant={props.variant ?? "primary"}
      size={props.size ?? "default"}
      disabled={props.disabled ?? false}
      loading={props.loading ?? false}
      onClick={() => emit("press")}
    >
      {props.label}
    </Button>
  ),

  Link: ({ props, on }: ComponentProps) => {
    const variantClass =
      props.variant === "muted"
        ? "text-link-muted hover:underline"
        : "text-link hover:underline";
    return (
      <a
        href={props.href ?? "#"}
        className={cn(
          "underline-offset-4 text-sm font-medium",
          variantClass,
        )}
        onClick={(e) => {
          const press = on("press");
          if (press.shouldPreventDefault) e.preventDefault();
          press.emit();
        }}
      >
        {props.label}
      </a>
    );
  },
};
