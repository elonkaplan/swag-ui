import { Context } from "hono";
import { Env } from "hono";

interface Bindings {
  API_URL: string;
}

export interface AppEnv extends Env {
  Bindings: Bindings;
}

export type AppContext = Context<AppEnv>;

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface AuthResult {
  status: "ok";
  user: User;
  accessToken: string;
  refreshToken: string;
}
