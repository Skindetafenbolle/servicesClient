import React, { useState, useEffect, ChangeEvent } from 'react';
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from 'next/router';

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
        exampleWorks: ''
    });

    const router = useRouter();
    const { userId } = router.query;

    const [userRole, setUserRole] = useState<string | null>(null);

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


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(userInfo);

        const filteredUserInfo = Object.fromEntries(
            Object.entries(userInfo).filter(([key, value]) => {
                return value !== '' && value !== null && value !== undefined;
            })
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
                window.location.href = `/profile/${userId}`;
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

    console.log(userInfo);

    return (
        <div>
            {userRole === 'admin' ? (
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
                            value={userInfo.avatar || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <br/>
                    <label>
                        Tags:
                        <input
                            type="text"
                            name="tags"
                            value={userInfo.tags}
                            onChange={handleChange}
                        />
                    </label>
                    <br/>
                    <label>
                        Services:
                        <input
                            type="text"
                            name="services"
                            value={userInfo.services}
                            onChange={handleChange}
                        />
                    </label>
                    <br/>
                    <label>
                        Workplace:
                        <input
                            type="text"
                            name="workplace"
                            value={userInfo.workplace}
                            onChange={handleChange}
                        />
                    </label>
                    <br/>
                    <label>
                        Status:
                        <input
                            type="text"
                            name="status"
                            value={userInfo.status}
                            onChange={handleChange}
                        />
                    </label>
                    <br/>
                    <label>
                        Role:
                        <select
                            name="role"
                            value={userInfo.role}
                            onChange={handleChange}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>
                    <br/>
                    <label>
                        Example Works:
                        <input
                            type="text"
                            name="exampleWorks"
                            value={userInfo.exampleWorks}
                            onChange={handleChange}
                        />
                    </label>
                    <br/>
                    <button type="submit">
                        Save
                    </button>
                </form>
            ) : (
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
                        <br />
                        <label>
                            Second Name:
                            <input
                                type="text"
                                name="secondName"
                                value={userInfo.secondName}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            Avatar:
                            <input
                                type="text"
                                name="avatar"
                                value={userInfo.avatar}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <button type="submit">
                            Save
                        </button>
                    </form>
                </div>
            )}
            <button onClick={handleDeleteAccount}>
                Delete Account
            </button>
        </div>
    );
};

export default ProfilePage;
