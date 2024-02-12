import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

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
    description: string;
}

interface TimeSlot {
    id: number;
    date: string;
    freeWindow: number;
    userId: number;
}

const serviceColors: { [key: string]: string } = {
    "Маникюр": "bg-[#e98074]",
    "Массаж": "bg-[#f84c3f]",
    "Ресницы": "bg-[#e85a4f]",
    "Клининг": "bg-[#e84f91]",
};

const Index: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users`);
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchTimeSlots = async (users: any[]) => {
            users.map(async (user) => {
                try {
                    const response = await fetch(`http://localhost:8080/api/timeSlots/${user.id}`);
                    const data = await response.json();
                    setTimeSlots((prevTimeSlots) => {
                        const newTimeSlots = data.filter((newSlot: { id: number; }) => (
                            !prevTimeSlots.some((prevSlot) => prevSlot.id === newSlot.id)
                        ));
                        return [...prevTimeSlots, ...newTimeSlots];
                    });

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            });
        };

        fetchTimeSlots(users);
    }, [users]);

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
        <div className="mt-8">
            <div className="flex justify-center items-center">
                <h1>Выбор мастера</h1>
                <br />
                <div>
                    {["Маникюр", "Массаж", "Ресницы", "Клининг"].map((tag) => (
                        <button
                            key={tag}
                            className={`rounded p-2 mx-2 ${serviceColors[tag]} ${
                                activeTags.includes(tag) ? "bg-gray-400 text-gray-800" : "text-white"
                            }`}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-wrap mt-4">
                {filteredUsers.length > 0 &&
                    filteredUsers.map((user) => {
                        if (user.role === "admin") {
                            const groupedSlotsByDate: { [key: string]: TimeSlot[] } = {};
                            timeSlots
                                .filter((slot) => slot.userId === user.id)
                                .forEach((slot) => {
                                    const dateKey = new Date(slot.date).toDateString();
                                    if (!groupedSlotsByDate[dateKey]) {
                                        groupedSlotsByDate[dateKey] = [];
                                    }
                                    groupedSlotsByDate[dateKey].push(slot);
                                });

                            return (
                                <div
                                    key={user.id}
                                    className="card flex flex-col items-center p-4 m-4 border border-gray-300 rounded-lg shadow-md"
                                    style={{backgroundColor: "#d8c3a5"}}
                                    onClick={() => router.push(`/profile/${user.id}`)}
                                >
                                    <div className="flex gap-2">
                                        {user.tags &&
                                            user.tags.map((tag, index) => (
                                                <div
                                                    key={index}
                                                    className={`text-white py-1 px-2 rounded ${serviceColors[tag]}`}
                                                >
                                                    {tag}
                                                </div>
                                            ))}
                                    </div>

                                    <div className="flex items-center mt-2">
                                        {user.avatar && (
                                            <div className="h-20 w-20 rounded-full overflow-hidden">
                                                <Image
                                                    className="object-cover object-center w-full h-full"
                                                    src={user.avatar}
                                                    alt="avatar"
                                                    width={100}
                                                    height={100}
                                                />
                                            </div>
                                        )}
                                        <div className="ml-4 text-lg font-semibold">
                                            {(user.secondName || user.firstName) && (
                                                <div>
                                                    {user.firstName} {user.secondName}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-500">
                                        {user.services && <p>Services: {user.services?.join(", ")}</p>}
                                    </div>

                                    <div className="break-words max-w-[300px]">
                                        {user.description}
                                    </div>

                                    <div>

                                    </div>

                                    <div>
                                        <div className="flex gap-2">
                                            {user.exampleWorks.map((work, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={work}
                                                        alt={`Example work ${index}`}
                                                        className="w-20 h-20 object-cover rounded"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleSubmit(user.id)}
                                            className="px-4 py-2 bg-[#efa198] text-white rounded hover:bg-[#dc3623]"
                                        >
                                            Запись
                                        </button>
                                        {/*<button*/}
                                        {/*    onClick={() => router.push(`/profile/${user.id}`)}*/}
                                        {/*    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"*/}
                                        {/*>*/}
                                        {/*    Профиль*/}
                                        {/*</button>*/}
                                    </div>
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
