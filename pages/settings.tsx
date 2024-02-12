// Импортируем React компоненты и хуки
import React, { useState, useEffect } from 'react';
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from 'next/router';

const ProfilePage: React.FC = () => {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        email: '',
        secondName: '',
        avatar: '',
        tags: '',
        services: '',
        workplace: '',
        status: ''
    });

    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);

    const [userRole, setUserRole] = useState<string | null>(null);

    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (token) {
            try {
                const decodedToken = jwt.decode(token) as JwtPayload;
                const userId = decodedToken?.id;
                const userRole = decodedToken?.role;
                const email = decodedToken?.email;
                setUserId(userId || null);
                setUserRole(userRole || null);
                setUserEmail(email || null);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(userInfo);
    
        const filteredUserInfo = Object.fromEntries(
            Object.entries(userInfo).filter(([_, value]) => value !== '')
        );
        
        try {
            const response = await fetch(`http://localhost:8080/api/settings/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filteredUserInfo),
            });
    
            if (response.ok) {
                console.log('Data saved successfully');
                window.location.href = '/profile';
            } else {
                console.log('Failed to save data');
            }
        } catch (error) {
            console.log('An error occurred while saving data:', error);
        }
    };
    

    const handleDeleteAccount = async () => {
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
                router.push('/login');
                router.reload();
            } else {
                console.log('Failed to delete account');
            }
        } catch (error) {
            console.error('An error occurred while deleting account:', error);
        }
    };

    if (userRole === 'admin') {
        return (
            <div className="max-w-md mx-auto my-8">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={userInfo.firstName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Second Name:
                            <input
                                type="text"
                                name="secondName"
                                value={userInfo.secondName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Avatar:
                            <input
                                type="text"
                                name="avatar"
                                value={userInfo.avatar || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tags:
                            <input
                                type="text"
                                name="tags"
                                value={userInfo.tags}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Services:
                            <input
                                type="text"
                                name="services"
                                value={userInfo.services}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Workplace:
                            <input
                                type="text"
                                name="workplace"
                                value={userInfo.workplace}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Status:
                            <input
                                type="text"
                                name="status"
                                value={userInfo.status}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save
                    </button>
                </form>
                <button
                    onClick={handleDeleteAccount}
                    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Delete Account
                </button>
            </div>

        );
    }

    return (
        <div>
            <h1>User Profile</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={userInfo.firstName}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <label>
                    Second Name:
                    <input
                        type="text"
                        name="secondName"
                        value={userInfo.secondName}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <label>
                    Avatar:
                    <input
                        type="text"
                        name="avatar"
                        value={userInfo.avatar}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <button type="submit">
                    Save
                </button>
            </form>
            <button onClick={handleDeleteAccount}>
                Delete Account
            </button>
        </div>
    );
};

export default ProfilePage;
