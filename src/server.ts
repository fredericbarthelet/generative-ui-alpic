import { intentMiddleware } from "@alpic-ai/insights";
import type { Spec } from "@json-render/core";
import {
  autoFixSpec,
  defineCatalog,
  formatSpecIssues,
  validateSpec,
} from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { McpServer } from "skybridge/server";

import { alpicComponentDefinitions } from "./catalog.js";

const catalog = defineCatalog(schema, {
  components: alpicComponentDefinitions,
  actions: {},
});

const catalogPrompt = catalog.prompt();
const specSchema = catalog.zodSchema();

const server = new McpServer(
  {
    name: "generative-ui-alpic",
    version: "0.0.1",
  },
  { capabilities: {} },
)
  .mcpMiddleware(intentMiddleware())
  .registerTool(
    {
      name: "get-ui-catalog",
      description:
        "Returns the full UI component catalog (Alpic design system). Call this before render to learn available components, their props, and the spec format.",
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
    },
    async () => ({
      content: [{ type: "text" as const, text: catalogPrompt }],
    }),
  )
  .registerTool(
    {
      name: "render",
      description:
        "Render a dynamic UI from a json-render spec, using the Alpic design system. Call get-ui-catalog first to learn available components and the spec format.",
      inputSchema: {
        spec: specSchema.describe("The json-render UI spec to render"),
      },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      view: {
        component: "render",
        description:
          "Renders a json-render UI spec using @alpic-ai/ui components",
      },
    },
    async ({ spec: rawSpec }) => {
      const { spec: fixedSpec } = autoFixSpec(rawSpec as Spec);

      const structural = validateSpec(fixedSpec);
      if (!structural.valid) {
        return {
          structuredContent: {},
          content: [
            {
              type: "text" as const,
              text: `Spec structural errors:\n${formatSpecIssues(structural.issues)}`,
            },
          ],
          isError: true,
        };
      }

      return {
        structuredContent: { spec: fixedSpec },
        content: [
          {
            type: "text" as const,
            text: "UI rendered successfully.",
          },
        ],
        isError: false,
      };
    },
  );

if (process.env.NODE_ENV === "production") {
  const { default: manifest } = await import("./vite-manifest.js");
  server.setViteManifest(manifest);
}

export default await server.run();

export type AppType = typeof server;
