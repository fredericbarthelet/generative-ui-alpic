import "@/index.css";

import { defineCatalog, type Spec } from "@json-render/core";
import { defineRegistry, JSONUIProvider, Renderer } from "@json-render/react";
import { schema } from "@json-render/react/schema";

import { componentDefinitions, components } from "../active-catalog.js";
import { useToolInfo } from "../helpers.js";

const catalog = defineCatalog(schema, {
  components: componentDefinitions,
  actions: {},
});

const { registry } = defineRegistry(catalog, {
  components,
});

function RenderWidget() {
  const { output } = useToolInfo<"render">();
  const spec = (output?.spec ?? null) as Spec | null;

  if (!spec) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Waiting for UI spec…
      </div>
    );
  }

  return (
    <div className="p-4 bg-background text-foreground">
      <JSONUIProvider registry={registry}>
        <Renderer spec={spec} registry={registry} />
      </JSONUIProvider>
    </div>
  );
}

export default RenderWidget;
