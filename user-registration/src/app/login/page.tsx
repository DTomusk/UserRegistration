// indicates client component, cannot use async/await
"use client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface FormData {
    email: string;
    password: string;
}

export default function LoginForm() {
    const { 
        register, handleSubmit, formState: { errors } 
    } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // gets called on site load, if the user has a valid token then redirect them to root
    // TODO: move verification into backend 
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                const expirationDate = new Date(decoded.exp * 1000);
                if (expirationDate < new Date()) {
                    localStorage.removeItem('token');
                } else {
                    router.push('/');
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        setError('');

        // calls the login endpoint at app/api/login/route.ts
        // with a json body containing the email and password
        // throws an error if the response is not ok
        // redirects to the root otherwise 
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Invalid credentials');
            }

            const token = await res.json();
            localStorage.setItem('token', token.access_token);

            router.push('/');
        } catch (error: any) {
            setError('An error occurred: ' + error.message);
        }
        setLoading(false);
    };
    
    // returns a simple form with two text fields 
    // both fields are required
    // register registers an input and adds validation 
    // errors are stored in the errors object, if an input doesn't meet a rule 
    // then the error message is displayed
    // onSubmit is defined in the root of the form and is called when the form is submitted 
    // e.g. button type submit pressed 
    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}>
                <h1>Login form</h1>
                {error && <p>{error}</p>}
                <div>
                    <label>Email</label>
                    <input type="email" 
                    {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email?.message && <p>{String(errors.email.message)}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" 
                    {...register('password', { required: 'Password is required' })}
                    />
                    {errors.password?.message && <p>{String(errors.password.message)}</p>}
                </div>
                <button 
                    type="submit"
                    disabled={loading}>Login</button>
            </form>
        </div>
    )
}