import { FC } from "hono/jsx";
import axios from "axios";

interface HomePageProps {
  apiUrl: string;
}

interface IUsersStats {
  status: "ok";
  stats: {
    totalUsers: number;
    totalFriends: number;
  };
}

export const HomePage: FC<HomePageProps> = async ({ apiUrl }) => {
  const { data } = await axios.get<IUsersStats>(`${apiUrl}/users/stats`);

  return (
    <>
      {/* <h1>Welcome</h1> */}
      <div id="welcome" class="relative"></div>
      <p class="text-center">
        We are your simple portal to save your friends contact information!
        <br />
        With <mark>{data?.stats?.totalUsers || 0} current users</mark> and an
        average of{" "}
        <mark>
          {Number(
            (data?.stats?.totalUsers
              ? data.stats.totalFriends / data.stats.totalUsers
              : 0
            ).toFixed(2)
          )}{" "}
          friends per user
        </mark>
        , our community is small but thriving. Get started by logging in or
        registering today to explore connections and enhance your social circle!
      </p>

      <div id="home-buttons"></div>
    </>
  );
};
