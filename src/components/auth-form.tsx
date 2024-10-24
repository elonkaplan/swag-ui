import { FC, useEffect, useState } from "hono/jsx";

import { AuthResult } from "../types";
import axios from "axios";
import { css } from "hono/css";
import { useUserData } from "../hooks/useUserData";

const formClass = css`
  display: flex;
  flex-direction: column;
  width: 350px;
  margin: 0 auto;
  padding: 20px;
  position: relative;

  > .error {
    position: absolute;
    color: red;
    font-size: 12px;
    margin: 0;
    top: -14px;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    position: relative;

    &:not(:first-child) {
      margin-top: 20px;
    }

    .error {
      color: red;
      font-size: 12px;
      position: absolute;
      margin: 0;
      bottom: -14px;
    }
  }

  .submit {
    margin-top: 20px;
  }
`;

interface AuthFormProps {
  type: "login" | "register";
}

export const AuthForm: FC<AuthFormProps> = ({ type }) => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formError, setFormError] = useState(false);

  const { isLoggedIn } = useUserData();

  useEffect(() => {
    if (isLoggedIn) {
      window.open("/friends", "_self");
    }
  }, [isLoggedIn]);

  return (
    <form
      class={formClass}
      onSubmit={async (e) => {
        e.preventDefault();

        setFormError(false);

        let isError = false;

        if (!username) {
          setUsernameError("Username is required");
          isError = true;
        }

        if (username.length < 3 || username.length > 20) {
          setUsernameError("Username must be between 3 and 20 characters");
          isError = true;
        }

        if (!password) {
          setPasswordError("Password is required");
          isError = true;
        }

        if (password.length < 8 || password.length > 20) {
          setPasswordError("Password must be between 8 and 20 characters");
          isError = true;
        }

        if (isError) {
          return;
        }

        try {
          const { data } = await axios.post<AuthResult>(`/api/auth/${type}`, {
            username,
            password,
          });

          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          window.open("/friends", "_self");
        } catch (error) {
          setFormError(true);
        }
      }}
    >
      {formError && (
        <p class="error">
          {type === "login"
            ? "Invalid username or password"
            : "Username already exists"}
        </p>
      )}
      <div>
        <div class="input-container">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              const newUsername = (e.target as HTMLInputElement).value;

              setFormError(false);
              setUsername(newUsername);

              if (
                usernameError &&
                newUsername.length >= 3 &&
                newUsername.length <= 20
              ) {
                setUsernameError("");
              }
            }}
            onBlur={() => {
              if (!username) {
                setUsernameError("Username is required");
              } else if (username.length < 3 || username.length > 20) {
                setUsernameError(
                  "Username must be between 3 and 20 characters"
                );
              } else {
                setUsernameError("");
              }
            }}
          />
          {usernameError && <p class="error">{usernameError}</p>}
        </div>
        <div class="input-container">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              const newPassword = (e.target as HTMLInputElement).value;

              setFormError(false);
              setPassword(newPassword);

              if (
                passwordError &&
                newPassword.length >= 8 &&
                newPassword.length <= 20
              ) {
                setPasswordError("");
              }
            }}
            onBlur={() => {
              if (!password) {
                setPasswordError("Password is required");
              } else if (password.length < 8 || password.length > 20) {
                setPasswordError(
                  "Password must be between 8 and 20 characters"
                );
              } else {
                setPasswordError("");
              }
            }}
          />

          {passwordError && <p class="error">{passwordError}</p>}
        </div>
      </div>

      <button type="submit" class="submit">
        {type === "login" ? "Login" : "Register"}
      </button>

      {type === "login" ? (
        <p class="text-center">
          Don't have an account? <a href="/register">Register</a>
        </p>
      ) : (
        <p class="text-center">
          Already have an account? <a href="/login">Login</a>
        </p>
      )}
    </form>
  );
};
