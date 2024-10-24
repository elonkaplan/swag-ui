import { useUserData } from "../hooks/useUserData";

export const HomeButtons = () => {
  const { isLoggedIn } = useUserData();

  return (
    <>
      {isLoggedIn ? (
        <a href="/friends">Go to my friends list</a>
      ) : (
        <p class="flex fit-content">
          <a href="/login">Login</a>
          <span class="divider" />
          <a href="/register">Register</a>
        </p>
      )}
    </>
  );
};
