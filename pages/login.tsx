import { useRouter } from 'next/router';
import React, { useState } from 'react';

const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        const url = `http://localhost:8080/api/auth/login`;

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
                    localStorage.setItem('token', data.token);
                    router.push('/');
                    router.reload();
                } else {
                    setError('Login failed');
                }
            })
            .catch(error => {
                console.error(error);
                setError('Login failed');
            });
    };

    return (
        <div>
            {error && <div>{error}</div>}
            <input
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
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginComponent;
