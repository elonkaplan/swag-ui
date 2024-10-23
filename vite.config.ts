import adapter from "@hono/vite-dev-server/cloudflare";
import build from "@hono/vite-build/cloudflare-pages";
import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      esbuild: {
        jsxImportSource: "hono/jsx/dom", // Optimized for hono/jsx/dom
      },
      build: {
        rollupOptions: {
          input: "./src/client.tsx",
          output: {
            entryFileNames: "static/client.js",
          },
        },
      },
    };
  } else {
    return {
      plugins: [
        build(),
        devServer({
          adapter,
          entry: "src/index.tsx",
        }),
      ],
    };
  }
});
