import { homeLink } from "../styles/common";

export const RegisterPage = () => {
  return (
    <div class="relative">
      <a href="/" class={homeLink}>
        {"<-"}
      </a>

      <h1 class="text-center">Register</h1>

      <div id="register-form"></div>
    </div>
  );
};
