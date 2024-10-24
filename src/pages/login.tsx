import { homeLink } from "../styles/common";

export const LoginPage = () => {
  return (
    <div class="relative">
      <a href="/" class={homeLink}>
        {"<-"}
      </a>

      <h1 class="text-center">Login</h1>

      <div id="login-form"></div>
    </div>
  );
};
