// src/components/AuthProvider.tsx
"use client";
import { createContext, useContext } from "react";
import { useFetchData } from "@/hooks/dataHooks";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/index";
import { USERS_API } from "@/constants/api";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (name:string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const fetchWithAuth = async (
    url: string,
    method: string,
    mutate: () => Promise<User | null | undefined>,
    body?: object
) => {
    try {
        const res = await fetch(url, {
            method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            const errorData = await res.json();
            // Extract first error field dynamically
            const firstKey = Object.keys(errorData)[0]; 
            const errorMessage = firstKey ? errorData[firstKey].join(" ") : JSON.stringify(errorData);
            throw new Error(errorMessage);
        }

        await mutate(); // triggers a refetch to get the latest user data from the server
        return res.json();
    } catch (error) {
        throw error;
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    
    // Fetch user data
    const { data: user, mutate } = useFetchData<User>(USERS_API.ME, {
        revalidateIfStale: false, // If cached data exists, don't re-fetch when mounting
        revalidateOnFocus: false, // Don't re-fetch when the window/tab gains focus
    });
    
    const login = async (email: string, password: string) => {
        await fetchWithAuth(USERS_API.LOGIN, "POST", mutate, { credentials: {email, password} });
        router.push("/dashboard");
    };

    const logout = async () => {
        await fetchWithAuth(USERS_API.LOGOUT, "POST", mutate);
        router.push("/login");
    };

    const register = async (name: string, email: string, password: string) => {
        await fetchWithAuth(USERS_API.REGISTER, "POST", mutate, { name, email, password });
        await login(email, password);
        router.push("/dashboard");
    }

    return (
        <AuthContext.Provider value={{ user: user || null, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}