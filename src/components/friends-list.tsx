import { useCallback, useEffect, useMemo, useState } from "hono/jsx";

import axios from "axios";
import { css } from "hono/css";
import { isEmail } from "../helpers/isEmail";
import { useUserData } from "../hooks/useUserData";

interface Friend {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

interface Pagination {
  page: number;
  total: number;
}

interface FriendsResult {
  status: "ok";
  friends: Friend[];
  pagination: Pagination;
}

const PER_PAGE = 5;

const wrapperClass = css`
  display: flex;
  flex-direction: column;
  align-items: center;

  .form {
    display: flex;
    flex-wrap: wrap;
    column-gap: 10px;
    row-gap: 20px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    column-gap: 10px;
    row-gap: 20px;
    margin-top: 20px;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid var(--border);
    padding: 10px;
    border-radius: 5px;
  }

  .next-button {
    margin-left: 40px;
  }

  .pagination {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;

    @media screen and (min-width: 596px) {
      width: calc(100% / 3 - 10px);
    }

    .error {
      color: red;
      font-size: 12px;
      position: absolute;
      margin: 0;
      bottom: -14px;
    }
  }
`;

export const FriendsList = () => {
  const [page, setPage] = useState(1);
  const [friends, setFriends] = useState<Record<string, Friend>>({});
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const { user, isLoggedIn, isLoading } = useUserData();

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      window.open("/", "_self");
    }
  }, [isLoggedIn, isLoading]);

  const getFriendsList = useCallback(async () => {
    if (!user) {
      return;
    }

    const { data } = await axios.get<FriendsResult>(
      `/api/users/${user.id}/friends?page=${page}&limit=${PER_PAGE}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setFriends((prev) => ({
      ...prev,
      ...data.friends.reduce(
        (acc, friend) => ({ ...acc, [friend.id]: friend }),
        {}
      ),
    }));

    setTotal(data.pagination.total);
  }, [page, user]);

  useEffect(() => {
    getFriendsList();
  }, [getFriendsList]);

  const friendsToShow = useMemo(
    () => Object.values(friends).slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [friends, page, total]
  );

  return (
    <div class={wrapperClass}>
      <form
        class="form"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!user) {
            return;
          }

          let isError = false;

          if (!name) {
            setNameError("Name is required");
            isError = true;
          }

          if (name.length < 3 || name.length > 20) {
            setNameError("Name must be between 3 and 20 characters");
            isError = true;
          }

          if (!isEmail(email)) {
            setEmailError("Email is invalid");
            isError = true;
          }

          if (!phone) {
            setPhoneError("Phone is required");
            isError = true;
          }

          if (phone.length < 10 || phone.length > 20) {
            setPhoneError("Phone must be between 10 and 20 characters");
            isError = true;
          }

          if (isError) {
            return;
          }

          try {
            await axios.post(
              `/api/users/${user.id}/friends`,
              {
                name,
                email,
                phone,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );

            setName("");
            setEmail("");
            setPhone("");
            setTotal(9);
            setPage(1);
            setFriends({});
            getFriendsList();
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <div class="input-container">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              const newName = (e.target as HTMLInputElement).value;

              setName(newName);

              if (nameError && newName.length >= 3 && newName.length <= 20) {
                setNameError("");
              }
            }}
            onBlur={() => {
              if (!name) {
                setNameError("Name is required");
              } else if (name.length < 3 || name.length > 20) {
                setNameError("Name must be between 3 and 20 characters");
              } else {
                setNameError("");
              }
            }}
          />
          {nameError && <p class="error">{nameError}</p>}
        </div>
        <div class="input-container">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              const newEmail = (e.target as HTMLInputElement).value;

              setEmail(newEmail);

              if (emailError && newEmail.length >= 3 && newEmail.length <= 20) {
                setEmailError("");
              }
            }}
            onBlur={() => {
              if (!isEmail(email)) {
                setEmailError("Email is invalid");
              } else {
                setEmailError("");
              }
            }}
          />
          {emailError && <p class="error">{emailError}</p>}
        </div>
        <div class="input-container">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={phone}
            onChange={(e) => {
              const newPhone = (e.target as HTMLInputElement).value;

              setPhone(newPhone);

              if (
                phoneError &&
                newPhone.length >= 10 &&
                newPhone.length <= 20
              ) {
                setPhoneError("");
              }
            }}
            onBlur={() => {
              if (!phone) {
                setPhoneError("Phone is required");
              } else if (phone.length < 10 || phone.length > 20) {
                setPhoneError("Phone must be between 10 and 20 characters");
              } else {
                setPhoneError("");
              }
            }}
          />
          {phoneError && <p class="error">{phoneError}</p>}
        </div>

        <button type="submit">Add friend</button>
      </form>

      {!friendsToShow.length ? (
        <p>No friends found</p>
      ) : (
        <div class="list">
          {friendsToShow.map((friend) => (
            <div key={friend.id} class="item">
              <h2>{friend.name}</h2>
              <p>
                <mark>Email:</mark> {friend.email}
              </p>
              <p>
                <mark>Phone:</mark> {friend.phone}
              </p>

              <button
                onClick={async () => {
                  if (!user) {
                    return;
                  }

                  await axios.delete(
                    `/api/users/${user.id}/friends/${friend.id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                    }
                  );

                  setFriends((prev) => {
                    const newFriends = { ...prev };
                    delete newFriends[friend.id];
                    return newFriends;
                  });

                  setTotal((prev) => prev - 1);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div class="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {"<-"}
        </button>
        <button
          disabled={page * PER_PAGE >= total}
          onClick={() => setPage((prev) => prev + 1)}
          class="next-button"
        >
          {"->"}
        </button>
      </div>
    </div>
  );
};
