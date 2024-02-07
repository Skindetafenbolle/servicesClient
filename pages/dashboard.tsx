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
}

function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/users");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const sortedUsers = users.sort((a, b) => a.id - b.id);

    const handleRegistration = async () => {
        const url = 'http://localhost:8080/api/auth/register';

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
    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: '20px'}}>
                <div>
                    <h1>Dashboard Page</h1>
                </div>
                <div>
                    <h2>
                        <div>
                            {error && <div>{error}</div>}
                            <input
                                autoComplete="false"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                                autoComplete="new-password"
                            />
                            <button onClick={handleRegistration}>Create new user</button>
                        </div>
                    </h2>
                </div>
            </div>

            <table style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                <tr>
                    <th style={{border: '1px solid black', padding: '8px'}}>Email</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>First Name</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Second Name</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Avatar</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Tags</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Services</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Workplace</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Status</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Role</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Has Record</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Actions</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Example Works</th>
                </tr>
                </thead>
                <tbody>
                {sortedUsers.map((user) => (
                    <tr key={user.id} style={{border: '1px solid black'}}>
                        <td style={{border: '1px solid black', padding: '8px'}}>{user.email}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{user.firstName}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{user.secondName}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>
                            {user.avatar &&
                                <img src={user.avatar} alt="Avatar" style={{width: '100px', height: '100px'}}/>}
                        </td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{user.tags?.join(', ')}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{user.services?.join(', ')}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{user.workplace}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{user.status}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{user.role}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{user.hasRecord ? 'Yes' : 'No'}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>
                            <button style={{fontWeight: 'bold', margin: '10px'}}
                                    onClick={() => router.push(`/profile/${user.id}`)}>Profile
                            </button>
                            <br/>
                            <button style={{fontWeight: 'bold', margin: '10px'}}
                                    onClick={() => handleDeleteAccount(user.id)}>Delete user
                            </button>
                            <br/>
                            <button style={{fontWeight: 'bold', margin: '10px'}}
                                    onClick={() => router.push(`/settings/${user.id}`)}>Edit
                            </button>
                        </td>
                        <td style={{border: '1px solid black', padding: '8px'}}>
                            {user.exampleWorks.map((work, index) => (
                                <div key={index}>
                                    <img src={work} alt={`Example work ${index}`}
                                         style={{width: '100px', height: '100px'}}/>
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;