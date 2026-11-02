"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./lib/sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "motorlist",
  title: "Motorlist",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
