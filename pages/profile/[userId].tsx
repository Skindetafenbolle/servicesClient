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


export default function UserProfile() {
    const router = useRouter();
    const { userId } = router.query;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
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

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">User Profile</h1>
            <div className="flex items-center space-x-4">
                {user.avatar && (
                    <img src={user.avatar} alt="Avatar" className="w-24 h-24 object-cover rounded-full"/>
                )}
                <div>
                    <div className="text-xl font-bold">{user.firstName} {user.secondName}</div>
                </div>
            </div>
            <div className="mt-4">
                <p className="font-semibold">User ID: {userId}</p>
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
                    {user.role && <div>Role: {user.role}</div>}
                    {user.hasRecord && <div>{user.hasRecord ? 'Has Record' : 'No Record'}</div>}
                </div>
                <p className="font-bold mt-2">Пример работ:</p>
                {user.exampleWorks.length > 0 && (
                    <div className="border border-gray-300 p-2 flex flex-wrap gap-2">
                        {user.exampleWorks.map((work, index) => (
                            <img key={index} src={work} alt={`Example work ${index}`}
                                 className="w-24 h-24 object-cover rounded"/>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
}
