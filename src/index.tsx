import { AppEnv } from "./types";
import { FriendsPage } from "./pages/friends";
import { HomePage } from "./pages/home";
import { Hono } from "hono";
import { LoginPage } from "./pages/login";
import { NotFoundPage } from "./pages/not-found";
import { RegisterPage } from "./pages/register";
import { jsxRenderer } from "hono/jsx-renderer";
import { renderer } from "./helpers/renderer";

const app = new Hono<AppEnv>();

app.use(jsxRenderer());

app.get("*", renderer);

app.get("/", (c) => {
  return c.render(<HomePage apiUrl={c.env.API_URL} />);
});

app.get("/login", (c) => {
  return c.render(<LoginPage />);
});

app.get("/register", (c) => {
  return c.render(<RegisterPage />);
});

app.get("/friends", (c) => {
  return c.render(<FriendsPage />);
});

app.get("*", (c) => {
  return c.render(<NotFoundPage />);
});

export default app;
