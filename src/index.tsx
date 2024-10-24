import { AppEnv } from "./types";
import { FriendsPage } from "./pages/friends";
import { HomePage } from "./pages/home";
import { Hono } from "hono";
import { LoginPage } from "./pages/login";
import { NotFoundPage } from "./pages/not-found";
import { RegisterPage } from "./pages/register";
import axios from "axios";
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

app.get("/api/*", async (c) => {
  const { data } = await axios.get(
    c.env.API_URL + c.req.path.replace("/api", ""),
    {
      params: c.req.query(),
      headers: c.req.header("Authorization")
        ? { Authorization: c.req.header("Authorization") }
        : {},
    }
  );

  return c.json(data);
});

app.post("/api/*", async (c) => {
  const { data } = await axios.post(
    c.env.API_URL + c.req.path.replace("/api", ""),
    await c.req.json(),
    {
      headers: c.req.header("Authorization")
        ? { Authorization: c.req.header("Authorization") }
        : {},
    }
  );

  return c.json(data);
});

app.delete("/api/*", async (c) => {
  const { data } = await axios.delete(
    c.env.API_URL + c.req.path.replace("/api", ""),
    {
      headers: c.req.header("Authorization")
        ? { Authorization: c.req.header("Authorization") }
        : {},
    }
  );

  return c.json(data);
});

app.get("*", (c) => {
  return c.render(<NotFoundPage />);
});

export default app;
