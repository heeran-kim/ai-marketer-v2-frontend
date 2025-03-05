"use client"

import { useState, ChangeEvent, FormEvent} from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

const EmailPage: React.FC = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleBackToLoginOptions = () => {
        router.back();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Input Validation
    const validateForm = () => {
        const newErrors: {[key: string]: string } = {};

        if (!formData.email.includes("@")) newErrors.email = "Invalid email format.";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setErrors({});
        e.preventDefault();
        if (!validateForm()) {
            console.log("Validation failed", formData);
            return;
        }

        try {
            await login(formData.email, formData.password);
        } catch {
            setErrors({"message": "Invalid credentials"});
        }

    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Log in to Promoease</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        onChange={handleChange}
                    />
                    <button type="submit" className="socialbutton">
                        Log in
                    </button>
                    { errors && 
                        Object.entries(errors).map(
                            ([key, message]) => (
                            <p key={key} className="text-red-500">{message}</p>
                    ))}
                </form>
                <div className="mt-4 text-center">
                    <button onClick={handleBackToLoginOptions} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
                        ← Other Login Options
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailPage;
