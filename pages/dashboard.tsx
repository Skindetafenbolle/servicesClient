import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";

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


function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users`);
                const data = await response.json();
                setUsers(data);
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
    const sortedUsers = users.sort((a, b) => a.id - b.id);

    const handleRegistration = async () => {
        const url = `http://localhost:8080/api/auth/register`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    router.push('/');
                } else {
                    setError('Registration failed');
                }
            })
            .catch(error => {
                console.error(error);
                setError('Registration failed');
            });
    };

    const handleDeleteAccount = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/deleteAccount/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Account deleted successfully');
                localStorage.removeItem('token');
                router.reload();
            } else {
                console.log('Failed to delete account');
            }
        } catch (error) {
            console.error('An error occurred while deleting account:', error);
        }
    };

    // @ts-ignore
    return (
        <div>
            <div className="flex justify-between items-center px-5">
                <div>
                    <h1 className="text-xl font-bold">Админ панель</h1>
                </div>
                <div>
                    <div className="space-y-4">
                        {error && <div className="text-red-500">{error}</div>}
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-5"
                            autoComplete="false"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                            autoComplete="new-password"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={handleRegistration}
                        >
                            Create new user
                        </button>
                    </div>
                </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200 mt-5">
                <thead>
                <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Email</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">First
                        Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Second
                        Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Avatar</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Tags</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Services</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Workplace</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Role</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Has
                        Record
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Dates</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Example
                        Works
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {sortedUsers.map((user) => {
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
                        <tr key={user.id} className="border">
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">{user.firstName}</td>
                            <td className="border px-4 py-2">{user.secondName}</td>
                            <td className="border px-4 py-2 text-center">
                                <div className="inline-block">
                                    {user.avatar && (
                                        <img src={user.avatar} alt="Avatar"
                                             className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"/>
                                    )}
                                </div>
                            </td>
                            <td className="border px-4 py-2">{user.tags?.join(', ')}</td>
                            <td className="border px-4 py-2">{user.services?.join(', ')}</td>
                            <td className="border px-4 py-2">{user.workplace}</td>
                            <td className="border px-4 py-2">{user.status}</td>
                            <td className="border px-4 py-2">
                                  <span
                                      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${user.role === 'admin' ? 'bg-red-500' : user.role === 'staff' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                    {user.role}
                                  </span>
                            </td>
                            <td className="border px-4 py-2">{user.hasRecord ? 'Yes' : 'No'}</td>
                            <td className="border px-4 py-2">
                                <div>
                                    {Object.entries(groupedSlotsByDate).map(([dateKey, slots]) => (
                                        <div key={dateKey}>
                                            <div>Дата: {" "}
                                                {`${("0" + new Date(slots[0].date).getDate()).slice(-2)}-${("0" + (new Date(slots[0].date).getMonth() + 1)).slice(-2)}-${new Date(slots[0].date).getFullYear()}`}
                                            </div>
                                            <div>Свободное время:</div>
                                            <select className="bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg">
                                                {slots.map((slot) => (
                                                    <option key={slot.id}>{slot.freeWindow}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="border px-4 py-2">
                                {user.exampleWorks.map((work, index) => (
                                    <div key={index}>
                                        <img src={work} alt={`Example work ${index}`}
                                             className="w-24 h-24 object-cover"/>
                                    </div>
                                ))}
                            </td>

                            <td className="border px-4 py-2">
                                <div className="flex flex-col space-y-2">
                                    <button
                                        className="font-bold py-2 px-4 rounded hover:bg-gray-200 focus:outline-none focus:shadow-outline transition ease-in-out duration-150 flex justify-center items-center min-w-[120px] border border-gray-300 hover:border-gray-400"
                                        onClick={() => router.push(`/profile/${user.id}`)}
                                    >
                                        Profile
                                    </button>
                                    <button
                                        className="font-bold py-2 px-4 rounded hover:bg-gray-200 focus:outline-none focus:shadow-outline transition ease-in-out duration-150 flex justify-center items-center min-w-[120px] border border-gray-300 hover:border-gray-400"
                                        onClick={() => router.push(`/settings/${user.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="font-bold py-2 px-4 rounded text-red-600 hover:bg-gray-200 focus:outline-none focus:shadow-outline transition ease-in-out duration-150 flex justify-center items-center min-w-[120px] border border-gray-300 hover:border-gray-400"
                                        onClick={() => handleDeleteAccount(user.id)}
                                    >
                                        Delete user
                                    </button>
                                </div>
                            </td>

                        </tr>
                    );
                })}
                </tbody>

            </table>
        </div>
    );
}

export default Dashboard;