"use client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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
    const [success, setSuccess] = useState('');

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        setError('');

        try {
            if (data.email === "me@email.com" && data.password === "password") {
                setSuccess('Login successful');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('An error occurred');
        }
        setLoading(false);
    };
    
    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}>
                <h1>Login form</h1>
                {error && <p>{error}</p>}
                {success && <p>{success}</p>}
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