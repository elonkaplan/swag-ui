import { AuthResult, User } from "../types";
import { useCallback, useEffect, useState } from "hono/jsx";

import axios from "axios";

export const useUserData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const checkUser = useCallback(async () => {
    try {
      if (
        !localStorage.getItem("accessToken") &&
        !localStorage.getItem("refreshToken")
      ) {
        setIsLoading(false);
        return;
      }

      const { data } = await axios.get<{ status: "ok"; user: User }>(
        `${import.meta.env.VITE_API_URL}/auth/session`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!data.user) {
        setIsLoading(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return;
      }

      setUser(data.user);
      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (error) {
      try {
        const { data } = await axios.post<AuthResult>(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          }
        );

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        setUser(data.user);
        setIsLoggedIn(true);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, []);

  return { isLoggedIn, user, isLoading };
};
