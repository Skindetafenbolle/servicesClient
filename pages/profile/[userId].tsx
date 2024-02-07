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
        <div>
            <h1>User Profile</h1>
            <p>User ID: {userId}</p>
            <div>
                <div style={{fontWeight:'bolder'}}>Email: {user.email}</div>
                {user.firstName && <div style={{fontWeight:'bolder'}}>FirstName: {user.firstName}</div>}
                {user.secondName && <div style={{fontWeight:'bolder'}}>SecondName: {user.secondName}</div>}
                {user.avatar && <img src={user.avatar} alt="avatar" style={{width: '100px', height: '100px'}}/>}

                {user.tags && user.tags.length > 0 && (
                    <div style={{fontWeight:'bolder'}}>
                        Tags: {user.tags.join(', ')}
                    </div>
                )}

                {user.services && user.services.length > 0 && (
                    <div>
                        Services: {user.services.join(', ')}
                    </div>
                )}

                {user.workplace && <div style={{fontWeight:'bolder'}}>Workplace: {user.workplace}</div>}
                {user.status && <div style={{fontWeight:'bolder'}}>Status: {user.status}</div>}
                {user.role && <div style={{fontWeight:'bolder'}}>Role: {user.role}</div>}
                {user.hasRecord && <div style={{fontWeight:'bolder'}}>{user.hasRecord}</div>}
                <p style={{fontWeight:'bolder'}} >Пример работ:</p>
                {user.exampleWorks.length > 0 && <div style={{border: '1px solid black', padding: '8px', display: 'flex', flexWrap:'wrap'}}>

                    {user.exampleWorks.map((work, index) => (
                        <div key={index}>
                            <img src={work} alt={`Example work ${index}`} style={{width: '100px', height: '100px'}}/>
                        </div>
                    ))}
                </div>}
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        <th>{new Date().toLocaleDateString()}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({length: 9}, (_, index) => {
                        const startTime = `${index.toString().padStart(2, '10')}:00`;
                        const endTime = `${(index + 1).toString().padStart(2, '10')}:00`;
                        return (
                            <tr key={index}>
                                <td>{`${startTime}-${endTime}`}</td>
                                <td>{user.hasRecord ? 'Запись' : 'Записи нет'}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                    <thead>
                    <tr>
                        <th></th>
                        <th>{new Date().toLocaleDateString()}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({length: 9}, (_, index) => {
                        const startTime = `${index.toString().padStart(2, '10')}:00`;
                        const endTime = `${(index + 1).toString().padStart(2, '10')}:00`;
                        return (
                            <tr key={index}>
                                <td>{`${startTime}-${endTime}`}</td>
                                <td>{user.hasRecord ? 'Запись' : 'Записи нет'}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
