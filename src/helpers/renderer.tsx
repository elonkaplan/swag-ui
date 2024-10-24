import { ErrorBoundary } from "hono/jsx";
import { InternalErrorPage } from "../pages/internal-error";
import { Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link
          rel="stylesheet"
          href="https://cdn.simplecss.org/simple.min.css"
        />
        {import.meta.env.PROD ? (
          <>
            <link rel="stylesheet" href="/static/style.css" />
            <script type="module" src="/static/client.js"></script>
          </>
        ) : (
          <>
            <link rel="stylesheet" href="/public/static/style.css" />
            <script type="module" src="/src/client.tsx"></script>
          </>
        )}
        <Style />
      </head>
      <body>
        <div id="root">
          <ErrorBoundary fallback={<InternalErrorPage />}>
            {children}
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
});
