import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignUpPage() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sucmessage, setSucMessage] = useState('')
    const [errMessage, setErrMessage] = useState('')
    const router = useRouter()

    const handleSignup = async () => {
        if (!name || !username || !password) {
            setErrMessage("Please fill all of the fields")
            return
        }
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    name,
                    username,
                    password,
                }),
            });

            if (response.ok) {
                const { success } = await response.json();
                if (success) {
                    router.push('/login')
                }
                // localStorage.setItem('token', token); // Store the token in localStorage
                // Redirect to protected route or home page
            } else {
                // console.error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className='d-flex flex-column align-items-center mt-5'>
            <Head>
                <title>Signup | NU Q-Bank</title>
                <meta
                    name="description"
                    content={"NU Question Bank | Department of Physics"}
                    key="desc"
                />
            </Head>
            <h1>Sign Up</h1>
            <div className='d-flex flex-column gap-1'>
                <input type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrMessage('') }}
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setErrMessage('') }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrMessage('') }}
                />
                <button onClick={handleSignup}>Sign up</button>
            </div>
            <p>Have an account? <Link href={'/login'}>Login</Link></p>
            {errMessage && <p className="text-danger">{errMessage}</p>}
            {sucmessage && <p className="text-success">{sucmessage}</p>}
        </div>
    )
}