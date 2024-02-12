import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import jwt, {JwtPayload} from "jsonwebtoken";
import {useRouter} from 'next/router';

interface UserInfo {
    firstName: string;
    email: string;
    secondName: string;
    avatar: string;
    tags: string;
    role: string;
    services: string;
    workplace: string;
    status: string;
    exampleWorks: string;
    dates: string[];
    description: string;
}

const ProfilePage: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        firstName: '',
        email: '',
        secondName: '',
        avatar: '',
        tags: '',
        role: '',
        services: '',
        workplace: '',
        status: '',
        exampleWorks: '',
        dates: [],
        description:'',
    });

    const router = useRouter();
    const { userId } = router.query;

    const [userRole, setUserRole] = useState<string | null>(null);
    const [dates, setDates] = useState<string[]>(['']);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwt.decode(token) as JwtPayload;
                const userRole = decodedToken?.role;
                setUserRole(userRole || null);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            [name]: value,
        }));
    };

    const handleDateChange = (index: number, value: string) => {
        const newDates = [...dates];
        newDates[index] = value;
        setDates(newDates);
    };

    const handleAddDate = () => {
        setDates([...dates, '']);
    };

    const handleRemoveDate = (index: number) => {
        const newDates = [...dates];
        newDates.splice(index, 1);
        setDates(newDates);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const filteredUserInfo = Object.fromEntries(
            Object.entries(userInfo).filter(([key, value]) => {
                return value !== '' && value !== null && value !== undefined;
            })
        );

        filteredUserInfo['dates'] = dates.join(', ');

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
                router.push(`/profile/${userId}`);
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
            } else {
                console.log('Failed to delete account');
            }
        } catch (error) {
            console.error('An error occurred while deleting account:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto my-8 space-y-4">
            {userRole === 'admin' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={userInfo.firstName}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Second Name:
                            <input
                                type="text"
                                name="secondName"
                                value={userInfo.secondName}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Avatar:
                            <input
                                type="text"
                                name="avatar"
                                value={userInfo.avatar || ''}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Description:
                            <input
                                type="text"
                                name="description"
                                value={userInfo.description}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Tags:
                            <input
                                type="text"
                                name="tags"
                                value={userInfo.tags}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Services:
                            <input
                                type="text"
                                name="services"
                                value={userInfo.services}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Workplace:
                            <input
                                type="text"
                                name="workplace"
                                value={userInfo.workplace}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Status:
                            <input
                                type="text"
                                name="status"
                                value={userInfo.status}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Role:
                            <select
                                name="role"
                                value={userInfo.role}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="font-semibold">
                            <div>
                                {dates.map((date, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <label>
                                            Date {index + 1}:
                                            <input
                                                type="datetime-local"
                                                value={date}
                                                onChange={(e) => handleDateChange(index, e.target.value)}
                                                className="ml-2 p-1 border border-gray-300 rounded"
                                            />
                                        </label>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDate(index)}
                                                className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-700 transition"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </label>
                        <button
                            type="button"
                            onClick={handleAddDate}
                            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                        >
                            Add Date
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded hover:bg-green-700 transition"
                    >
                        Save
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    <h1 className="text-xl font-bold">User Profile</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col">
                            <label className="font-semibold">
                                First Name:
                                <input
                                    type="text"
                                    name="firstName"
                                    value={userInfo.firstName}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-300 rounded"
                                />
                            </label>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">
                                Second Name:
                                <input
                                    type="text"
                                    name="secondName"
                                    value={userInfo.secondName}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-300 rounded"
                                />
                            </label>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">
                                Avatar:
                                <input
                                    type="text"
                                    name="avatar"
                                    value={userInfo.avatar}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-300 rounded"
                                />
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded hover:bg-green-700 transition"
                        >
                            Save
                        </button>
                    </form>
                </div>
            )}
            <button
                onClick={handleDeleteAccount}
                className="w-full py-2 px-4 mt-4 bg-red-600 text-white font-semibold rounded hover:bg-red-800 transition"
            >
                Delete Account
            </button>
        </div>

    );
};

export default ProfilePage;
