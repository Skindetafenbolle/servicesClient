import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

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
}

interface TimeSlot {
    id: number;
    date: string;
    freeWindow: number;
    userId: number;
}


export default function UserProfile() {
    const router = useRouter();
    const { userId } = router.query;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);


    console.log(process.env);
    console.log(process.env.URL_API);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/user/${userId}`);
                if (!response.ok) {
                    router.push('/');
                    return;
                }
                const userData = await response.json();
                setUser(userData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    useEffect(() => {
        const fetchTimeslot = async() =>{
            try {
                const response = await fetch(`http://localhost:8080/api/timeslots/${userId}`)
                const timeData = await response.json()
                setTimeSlots(timeData)
            } catch(error) {
                console.error('Error fetching user data:', error);
            }
        }
        if (userId) {
            fetchTimeslot();
        }
    }, [userId]);


    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!user) {
        return (
            <div>
                <h1>User not found</h1>
            </div>
        );
    }

    const groupedByDate = timeSlots.reduce((acc, slot) => {
        const date = slot.date.split('T')[0];
        // @ts-ignore
        if (!acc[date]) {
            // @ts-ignore
            acc[date] = [];
        }
        // @ts-ignore
        acc[date].push(slot.freeWindow);
        return acc;
    }, {});

    return (
        <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold">User Profile</h1>
            <div className="flex justify-center items-center space-x-4">
                {user.avatar && (
                    <img src={user.avatar} alt="Avatar" className="w-24 h-24 object-cover rounded-full"/>
                )}
                <div className="inline-flex items-center bg-blue-100 rounded-full p-2">
                    <div>{user.firstName} {user.secondName}</div>
                    <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${user.role === 'admin' ? 'bg-red-500' : user.role === 'staff' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {user.role}
            </span>
                </div>
            </div>
            <div className="mt-4">
                {/*<p className="font-semibold">User ID: {userId}</p>*/}
                <div className="font-bold">
                    <div>Email: {user.email}</div>
                    {user.tags && user.tags.length > 0 && (
                        <div>Tags: {user.tags.join(', ')}</div>
                    )}
                    {user.services && user.services.length > 0 && (
                        <div>Services: {user.services.join(', ')}</div>
                    )}
                    {user.workplace && <div>Workplace: {user.workplace}</div>}
                    {user.status && <div>Status: {user.status}</div>}
                    {/*{user.hasRecord && <div>{user.hasRecord ? 'Has Record' : 'No Record'}</div>}*/}
                    {Object.entries(groupedByDate).map(([date, freeWindows]) => (
                        <div key={date}>
                            <p>Дата: {new Date(date).toLocaleDateString()}</p>
                            <p>Свободное время:
                                <select>
                                    {/*@ts-ignore*/}
                                    {freeWindows.map((window, index) => (
                                        <option key={index}>{window}</option>
                                    ))}
                                </select>
                            </p>
                        </div>
                    ))}
                </div>
                <p className="font-bold mt-2">Пример работ:</p>
                <div className="border border-gray-300 p-2 flex flex-wrap gap-2 justify-center">
                    {user.exampleWorks.length > 0 && user.exampleWorks.map((work, index) => (
                        <img key={index} src={work} alt={`Example work ${index}`}
                             className="w-24 h-24 object-cover rounded"/>
                    ))}
                </div>
            </div>
        </div>
    );
}
