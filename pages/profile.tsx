import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
}

function Profile() {
    const { userId } = useParams<{ userId: string }>();
    const [message, setMessage] = useState("Loading");
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        fetch(`https://services-nig3.onrender.com/api/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setUser(data);
                setMessage("Profile loaded");
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
                setMessage('Error loading profile data');
            });
    }, [userId]);

    return (
        <div>
            {
                isLoggedIn ? (
                    <>
                        <div>{message}</div>
                        {user && (
                            <div>
                                <div>Email: {user.email}</div>
                                {user.firstName && <div>FirstName: {user.firstName}</div>}
                                {user.secondName && <div>SecondName: {user.secondName}</div>}
                                {user.avatar && <img src={user.avatar} alt="avatar" style={{ width: '100px', height: '100px' }} />}

                                {user.tags && user.tags.length > 0 && (
                                    <div>
                                        Tags: {user.tags.join(', ')}
                                    </div>
                                )}

                                {user.services && user.services.length > 0 && (
                                    <div>
                                        Services: {user.services.join(', ')}
                                    </div>
                                )}

                                {user.workplace && <div>Workplace: {user.workplace}</div>}
                                {user.status && <div>Status: {user.status}</div>}
                                {user.role && <div>Role: {user.role}</div>}
                                <table>
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>{new Date().toLocaleDateString()}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Array.from({ length: 9 }, (_, index) => {
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
                                    {Array.from({ length: 9 }, (_, index) => {
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
                        )}
                    </>
                ) : (
                    <div>
                        Отказано в доступе(не выполнен вход в аккаунт)
                    </div>
                )
            }
        </div>
    )
}

export default Profile;