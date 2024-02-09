// pages/login.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    username,
                    password,
                }),
            });

            if (response.ok) {
                const { success } = await response.json();
                if (success) {
                    router.push('/')
                }
                // localStorage.setItem('token', token); // Store the token in localStorage
                // Redirect to protected route or home page
            } else {
                // console.error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='d-flex flex-column align-items-center mt-5'>
            <Head>
                <title>Login | NU Q-Bank</title>
                <meta
                    name="description"
                    content={"NU Question Bank | Department of Physics"}
                    key="desc"
                />
            </Head>
            <h1>Login</h1>
            <div className='d-flex flex-column gap-1'>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
            <p>Don&apos;t have an account? <Link href={'/signup'}>Sign up</Link></p>
        </div>
    );
}