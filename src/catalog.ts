import { z } from "zod";

/**
 * json-render component definitions targeting the @alpic-ai/ui design system.
 *
 * The shape mirrors @json-render/shadcn's catalog — `props` Zod schemas, `slots`,
 * `events`, `description`, and `example` — so json-render can drive auto-fix,
 * validation, and prompt generation. Variant names follow the @alpic-ai/ui
 * design system so the LLM can use it idiomatically.
 */
export const alpicComponentDefinitions = {
  // ── Layout ────────────────────────────────────────────────────────────
  Card: {
    props: z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      hoverable: z.boolean().nullable(),
      maxWidth: z.enum(["sm", "md", "lg", "full"]).nullable(),
      centered: z.boolean().nullable(),
      className: z.string().nullable().describe("Additional CSS classes"),
    }),
    slots: ["default"],
    description:
      "Container card for content sections. Use for forms/content boxes, NOT for page headers.",
    example: { title: "Overview", description: "Your account summary" },
  },
  Stack: {
    props: z.object({
      direction: z.enum(["horizontal", "vertical"]).nullable(),
      gap: z.enum(["none", "sm", "md", "lg", "xl"]).nullable(),
      align: z.enum(["start", "center", "end", "stretch"]).nullable(),
      justify: z
        .enum(["start", "center", "end", "between", "around"])
        .nullable(),
      className: z.string().nullable().describe("Additional CSS classes"),
    }),
    slots: ["default"],
    description: "Flex container for layouts",
    example: { direction: "vertical", gap: "md" },
  },
  Grid: {
    props: z.object({
      columns: z.number().nullable(),
      gap: z.enum(["sm", "md", "lg", "xl"]).nullable(),
      className: z.string().nullable().describe("Additional CSS classes"),
    }),
    slots: ["default"],
    description: "Grid layout (1-6 columns)",
    example: { columns: 3, gap: "md" },
  },
  Separator: {
    props: z.object({
      orientation: z.enum(["horizontal", "vertical"]).nullable(),
    }),
    description: "Visual separator line",
  },
  Tabs: {
    props: z.object({
      tabs: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      ),
      defaultValue: z.string().nullable(),
      value: z.string().nullable(),
      variant: z.enum(["default", "pill", "line"]).nullable(),
    }),
    slots: ["default"],
    events: ["change"],
    description:
      "Tab navigation. Use { $bindState } on value for active tab binding.",
  },
  Accordion: {
    props: z.object({
      items: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
        }),
      ),
      type: z.enum(["single", "multiple"]).nullable(),
    }),
    description:
      "Collapsible sections. Items as [{title, content}]. Type 'single' (default) or 'multiple'.",
  },
  Dialog: {
    props: z.object({
      title: z.string(),
      description: z.string().nullable(),
      openPath: z.string(),
      size: z.enum(["sm", "lg"]).nullable(),
    }),
    slots: ["default"],
    description:
      "Modal dialog. Set openPath to a boolean state path. Use setState to toggle.",
  },

  // ── Data Display ──────────────────────────────────────────────────────
  Heading: {
    props: z.object({
      text: z.string(),
      level: z.enum(["h1", "h2", "h3", "h4"]).nullable(),
    }),
    description: "Heading text (h1-h4)",
    example: { text: "Welcome", level: "h1" },
  },
  Text: {
    props: z.object({
      text: z.string(),
      variant: z.enum(["body", "caption", "muted", "lead", "code"]).nullable(),
    }),
    description: "Paragraph text",
    example: { text: "Hello, world!" },
  },
  Image: {
    props: z.object({
      src: z.string().nullable(),
      alt: z.string(),
      width: z.number().nullable(),
      height: z.number().nullable(),
    }),
    description:
      "Image component. Renders an img tag when src is provided, otherwise a placeholder.",
  },
  Avatar: {
    props: z.object({
      src: z.string().nullable(),
      name: z.string(),
      size: z.enum(["xs", "sm", "md", "lg", "xl"]).nullable(),
    }),
    description: "User avatar with fallback initials",
    example: { name: "Jane Doe", size: "md" },
  },
  Badge: {
    props: z.object({
      text: z.string(),
      variant: z
        .enum(["primary", "secondary", "success", "warning", "error"])
        .nullable(),
      size: z.enum(["sm", "md"]).nullable(),
    }),
    description: "Status badge using the Alpic design system palette",
    example: { text: "Active", variant: "success" },
  },
  Alert: {
    props: z.object({
      title: z.string(),
      message: z.string().nullable(),
      type: z.enum(["info", "success", "warning", "error"]).nullable(),
    }),
    description: "Alert banner",
    example: {
      title: "Note",
      message: "Your changes have been saved.",
      type: "success",
    },
  },
  Table: {
    props: z.object({
      columns: z.array(z.string()),
      rows: z.array(z.array(z.string())),
      caption: z.string().nullable(),
    }),
    description:
      'Data table. columns: header labels. rows: 2D array of cell strings, e.g. [["Alice","admin"],["Bob","user"]].',
    example: {
      columns: ["Name", "Role"],
      rows: [
        ["Alice", "Admin"],
        ["Bob", "User"],
      ],
    },
  },
  Skeleton: {
    props: z.object({
      width: z.string().nullable(),
      height: z.string().nullable(),
      shape: z.enum(["rectangle", "circle"]).nullable(),
    }),
    description: "Loading placeholder skeleton",
  },
  Spinner: {
    props: z.object({
      size: z.enum(["sm", "md", "lg", "xl"]).nullable(),
      variant: z.enum(["primary", "secondary"]).nullable(),
      label: z.string().nullable(),
    }),
    description: "Loading spinner indicator",
  },
  Tooltip: {
    props: z.object({
      content: z.string(),
      text: z.string(),
    }),
    description: "Hover tooltip. Shows content on hover over text.",
  },
  Popover: {
    props: z.object({
      trigger: z.string(),
      content: z.string(),
    }),
    description: "Popover that appears on click of trigger.",
  },

  // ── Form Inputs ───────────────────────────────────────────────────────
  Input: {
    props: z.object({
      label: z.string(),
      name: z.string(),
      type: z.enum(["text", "email", "password", "number"]).nullable(),
      placeholder: z.string().nullable(),
      value: z.string().nullable(),
      hint: z.string().nullable(),
      required: z.boolean().nullable(),
      size: z.enum(["sm", "md"]).nullable(),
    }),
    events: ["submit", "focus", "blur"],
    description:
      "Text input field. Use { $bindState } on value for two-way binding.",
    example: {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "you@example.com",
    },
  },
  Textarea: {
    props: z.object({
      label: z.string(),
      name: z.string(),
      placeholder: z.string().nullable(),
      rows: z.number().nullable(),
      value: z.string().nullable(),
      hint: z.string().nullable(),
      required: z.boolean().nullable(),
    }),
    description:
      "Multi-line text input. Use { $bindState } on value for binding.",
  },
  Select: {
    props: z.object({
      label: z.string(),
      name: z.string(),
      options: z.array(z.string()),
      placeholder: z.string().nullable(),
      value: z.string().nullable(),
    }),
    events: ["change"],
    description:
      "Dropdown select input. Use { $bindState } on value for binding.",
  },
  Checkbox: {
    props: z.object({
      label: z.string(),
      name: z.string(),
      checked: z.boolean().nullable(),
    }),
    events: ["change"],
    description: "Checkbox input. Use { $bindState } on checked for binding.",
  },
  Radio: {
    props: z.object({
      label: z.string(),
      name: z.string(),
      options: z.array(z.string()),
      value: z.string().nullable(),
    }),
    events: ["change"],
    description:
      "Radio button group. Use { $bindState } on value for binding.",
  },
  Switch: {
    props: z.object({
      label: z.string(),
      name: z.string(),
      checked: z.boolean().nullable(),
    }),
    events: ["change"],
    description: "Toggle switch. Use { $bindState } on checked for binding.",
  },

  // ── Actions ───────────────────────────────────────────────────────────
  Button: {
    props: z.object({
      label: z.string(),
      variant: z
        .enum([
          "primary",
          "secondary",
          "tertiary",
          "destructive",
          "link",
          "link-muted",
          "cta",
        ])
        .nullable(),
      size: z
        .enum(["default", "icon", "icon-rounded", "pill"])
        .nullable(),
      disabled: z.boolean().nullable(),
      loading: z.boolean().nullable(),
    }),
    events: ["press"],
    description:
      "Clickable button using the Alpic design system. Bind on.press for handler.",
    example: { label: "Submit", variant: "primary" },
  },
  Link: {
    props: z.object({
      label: z.string(),
      href: z.string(),
      variant: z.enum(["primary", "muted"]).nullable(),
    }),
    events: ["press"],
    description: "Anchor link. Bind on.press for click handler.",
  },
};

export type AlpicComponentDefinitions = typeof alpicComponentDefinitions;
