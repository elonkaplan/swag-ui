import { AuthForm } from "./components/auth-form";
import { FriendsList } from "./components/friends-list";
import { HomeButtons } from "./components/home-buttons";
import { Welcome } from "./components/welcome";
import { render } from "hono/jsx/dom";

const loginForm = document.getElementById("login-form");

if (loginForm) {
  render(<AuthForm type="login" />, loginForm);
}

const registerForm = document.getElementById("register-form");

if (registerForm) {
  render(<AuthForm type="register" />, registerForm);
}

const welcome = document.getElementById("welcome");

if (welcome) {
  render(<Welcome />, welcome);
}

const homeButtons = document.getElementById("home-buttons");

if (homeButtons) {
  render(<HomeButtons />, homeButtons);
}

const friendsList = document.getElementById("friends-list");

if (friendsList) {
  render(<FriendsList />, friendsList);
}
