import { useRouter } from 'next/router';
import React, { useState } from 'react';

const RegistrationComponent: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const router = useRouter();

    const handleRegistration = async () => {
        const url = 'https://services-nig3.onrender.com/api/auth/register';

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
            <button onClick={handleRegistration}>Register</button>
        </div>
    );
};

export default RegistrationComponent;
