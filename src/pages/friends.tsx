import { homeLink } from "../styles/common";

export const FriendsPage = () => {
  return (
    <div class="relative">
      <a href="/" class={homeLink}>
        {"<-"}
      </a>

      <h1 class="text-center">Your friends list</h1>

      <div id="friends-list"></div>
    </div>
  );
};
