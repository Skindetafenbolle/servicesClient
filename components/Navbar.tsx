import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"
import Link from "next/link";
import jwt, { JwtPayload } from "jsonwebtoken";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwt.decode(token) as JwtPayload;
                const userId = decodedToken?.id;
                const userRole = decodedToken?.role;
                setUserId(userId || null);
                setUserRole(userRole || null);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        await router.push('/');
        router.reload();
    };

    return (
        <nav className="bg-white p-5">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-black font-bold text-xl">Services</Link>
                <div className="flex gap-4">
                    {isLoggedIn ? (
                        <>
                            {userRole === 'admin' && (
                                <button className="btn text-black font-bold py-2 px-4 rounded"><Link href="/dashboard">Админка</Link></button>
                            )}
                            <button className="btn text-black font-bold py-2 px-4 rounded"><Link href={`/profile/${userId}`}>Профиль</Link></button>
                            <button className="btn text-black font-bold py-2 px-4 rounded">
                                <Link href={`/settings/${userId}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                                    </svg>
                                </Link>
                            </button>
                            <button
                                className="btn text-black font-bold py-2 px-4 rounded" onClick={handleLogout}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn"><Link href="/login" className="text-black py-2 px-4 rounded-md hover:underline">Login</Link></button>
                            <button className="btn"><Link href="/register" className="text-black py-2 px-4 rounded-md hover:underline">Register</Link></button>
                        </>
                    )}
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
