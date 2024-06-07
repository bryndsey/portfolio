import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "portfolioe",
  title: "Portfolio",
  projectId: "g0lewisa",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [
      /* your content types here*/
    ],
  },
});
