import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface User {
  id: number;
  firstName?: string;
  secondName?: string;
  email: string;
  password: string;
  avatar?: string;
  tags?: string[];
  services?: string[];
  workplace?: string;
  status?: string;
  role?: string;
  hasRecord: boolean;
  exampleWorks: string[];
  dates: string[];
}

const Index: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTagClick = (tag: string) => {
    const index = activeTags.indexOf(tag);
    if (index === -1) {
      setActiveTags([...activeTags, tag]);
    } else {
      const newActiveTags = [...activeTags];
      newActiveTags.splice(index, 1);
      setActiveTags(newActiveTags);
    }
  };

  useEffect(() => {
    const filteredUsers = users.filter((user) =>
        activeTags.every((tag) => user.tags?.includes(tag))
    );
    setFilteredUsers(filteredUsers);
  }, [users, activeTags]);

  const handleSubmit = async (userId: number) => {
    try {
      const response = await fetch(
          `http://localhost:8080/api/settings/user/${userId}/hasRecord`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              hasRecord: true,
            }),
          }
      );
      const data = await response.json();
      console.log(data);
      router.reload();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
      <div>
        <h1>Выбор мастера</h1>
        <div>
          <h2>Тэги</h2>
          <div>
            {["Маникюр", "Массаж", "Ресницы", "Клининг"].map((tag) => (
                <button
                    key={tag}
                    style={{
                      margin: "5px",
                      background: activeTags.includes(tag) ? "blue" : "gray",
                      color: "white",
                    }}
                    onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
            ))}
          </div>
        </div>
        <div style={{display: "flex", flexWrap: "wrap"}}>
          {filteredUsers.length > 0 &&
              filteredUsers.map((user) => {
                if (user.role === "admin") {
                  return (
                      <div
                          key={user.id}
                          className="card"
                          style={{marginRight: 20}}
                      >
                        {user.firstName && <p>First Name: {user.firstName}</p>}
                        {user.secondName && <p>Second Name: {user.secondName}</p>}
                        {user.email && <p>Email: {user.email}</p>}
                        {user.avatar && (
                            <img
                                src={user.avatar}
                                alt="avatar"
                                style={{width: "100px", height: "100px"}}
                            />
                        )}
                        {user.tags && <p>Tags: {user.tags?.join(", ")}</p>}
                        {user.services && (
                            <p>Services: {user.services?.join(", ")}</p>
                        )}
                        {user.workplace && <p>Workplace: {user.workplace}</p>}
                        {user.status && <p>Status: {user.status}</p>}
                        {user.role && <p>Role: {user.role}</p>}
                        {user.hasRecord && (
                            <p>Has Record: {user.hasRecord ? "Yes" : "No"}</p>
                        )}
                        {user.exampleWorks.length > 0 && (
                            <div>
                              <h3>Example Works</h3>
                              {user.exampleWorks.map((work, index) => (
                                  <img
                                      key={index}
                                      src={work}
                                      alt={`Example work ${index}`}
                                      style={{width: "100px", height: "100px"}}
                                  />
                              ))}
                            </div>
                        )}
                        {user.dates.length > 0 && (
                            <div>
                              <h3>Доступное время</h3>
                              <select>
                                {user.dates.map((date, index) => (
                                    <option key={index}>{new Date(date).toLocaleString('en-US', { timeZone: 'UTC', hour12: false })}</option>
                                ))}
                              </select>
                            </div>
                        )}

                        <button onClick={() => handleSubmit(user.id)}>Запись</button>
                        <button onClick={() => router.push(`/profile/${user.id}`)}>
                          Профиль
                        </button>
                      </div>
                  );
                }
                return null;
              })}
        </div>

      </div>
  );
};

export default Index;
