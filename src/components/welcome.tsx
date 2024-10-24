import { css } from "hono/css";
import { useUserData } from "../hooks/useUserData";

const logoutClass = css`
  position: absolute;

  top: 0;
  left: -20px;
  transform: translateX(-100%);
`;

export const Welcome = () => {
  const { user, isLoggedIn } = useUserData();

  return (
    <>
      <h1>Welcome{user?.username ? `, ${user?.username}` : ""}</h1>

      {isLoggedIn && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.reload();
          }}
          class={logoutClass}
        >
          {"<--"} Logout
        </a>
      )}
    </>
  );
};
