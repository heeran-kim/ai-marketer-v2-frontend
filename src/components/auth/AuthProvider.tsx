// src/components/auth/AuthProvider.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useFetchData } from "@/hooks/dataHooks";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/index";
import { USERS_API } from "@/constants/api";
import { mutate as globalMutate } from "swr";

// Define specific auth states with type safety using a discriminated union
// This ensures proper type checking based on the 'status' property
type AuthState = 
    | { status: "initializing" }                // Initial loading state before auth check completes
    | { status: "authenticated", user: User }   // User is logged in with data
    | { status: "unauthenticated" };            // User is not logged in


// Define the structure of the authentication context
// This is what components will access via useAuth()
interface AuthContextType {
    authState: AuthState;                                                       // Current authentication state
    login: (email: string, password: string) => Promise<void>;                  // Login function
    logout: () => Promise<void>;                                                // Logout function
    register: (name: string, email: string, password: string) => Promise<void>; // Register function
}

// Create the auth context with null as initial value
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Helper function to make authenticated API requests
 * 
 * @param url - The API endpoint URL
 * @param method - HTTP method (GET, POST, etc.)
 * @param body - Optional request body for POST/PUT requests
 * @returns Promise with the JSON response
 */
const fetchWithAuth = async (
    url: string,
    method: string,
    body?: object
) => {
    try {
        const res = await fetch(url, {
            method,
            credentials: "include", // Include cookies in the request
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

        return res.json();
    } catch (error) {
        throw error; // Re-throw to be handled by the caller
    }
};

/**
 * Authentication Provider Component
 * 
 * Manages authentication state and provides login/logout functionality
 * to all child components.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    // Initialize auth state as "initializing"
    const [authState, setAuthState] = useState<AuthState>({ status: "initializing" });
    
    // Fetch user data from API using SWR
    const { data: user, error, mutate } = useFetchData<User | null>(USERS_API.ME, {
        revalidateIfStale: false, // If cached data exists, don't re-fetch when mounting
        revalidateOnFocus: false, // Don't re-fetch when the window/tab gains focus
    });

    // Update auth state when user data or error changes
    useEffect(() => {
        // Check if we've received a response (data or error)
        if (user !== undefined || error) {
            // If there's an error or no user data, set to unauthenticated
            if (error || !user) setAuthState({ status: "unauthenticated" });
            // Otherwise set to authenticated with the user data
            else setAuthState({ status: "authenticated", user });
        }
    }, [user, error]);
    
    /**
     * Login function
     * Authenticates a user with email and password
     */
    const login = async (email: string, password: string) => {
        await fetchWithAuth(USERS_API.LOGIN, "POST", { 
            method: "traditional",
            credentials: {email, password}
        });
        await mutate(); // Refetch user data after login
        router.push("/dashboard");
    };

    /**
     * Logout function
     * Ends the user's session and clears authentication state
     */
    const logout = async () => {
        await fetchWithAuth(USERS_API.LOGOUT, "POST");
        setAuthState({ status: "unauthenticated" });
        // Clear all SWR caches on logout
        globalMutate(
            () => true,
            undefined,
            { revalidate: false }
        );
        router.push("/login");
    };

    /**
     * Register function
     * Creates a new user account and automatically logs in
     */
    const register = async (name: string, email: string, password: string) => {
        await fetchWithAuth(USERS_API.REGISTER, "POST", { name, email, password });
        await login(email, password); // Login after successful registration
        router.push("/dashboard");
    }

    // Provide auth state and functions to children
    return (
        <AuthContext.Provider value={{
            authState,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to use the authentication context
 * 
 * @returns The authentication context with state and functions
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};