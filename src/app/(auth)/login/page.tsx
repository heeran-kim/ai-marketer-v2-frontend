"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { primaryNavItemClass } from "@/components/styles";

export default function EmailLoginPage() {
  const { login, authState } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);

  useEffect(() => {
    if (authState.status === "authenticated") router.push("/dashboard");
  }, [authState, router]);

  // Show loading UI
  if (authState.status !== "unauthenticated") {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (requires2FA)
        await login(formData.email, formData.password, "2fa", formData.code);
      else await login(formData.email, formData.password, "traditional");
      // Successful login will redirect via AuthProvider
    } catch (error: unknown) {
      // Handle authentication errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Authentication failed. Please check your credentials.";
      setErrors({ server: errorMessage });

      if (errorMessage === "Requires 2FA Code.") {
        //Push client to the 2FA Page
        setRequires2FA(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8">
        {requires2FA === false ? (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Sign in with Email
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors
                                ${
                                  errors.email
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors
                                ${
                                  errors.password
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Server errors */}
              {errors.server && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                  {errors.server}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className={`${primaryNavItemClass} w-full justify-center py-3`}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Please enter the code on your Authenticator App
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* AuthCode field */}
              <div>
                <input
                  type="code"
                  name="code"
                  placeholder="Code"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors
                                ${
                                  errors.code
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                  value={formData.code}
                  onChange={handleChange}
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
              </div>

              {/* Server errors */}
              {errors.server && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                  {errors.server}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className={`${primaryNavItemClass} w-full justify-center py-3`}
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Authenticate"}
              </button>
            </form>
          </>
        )}
        {/* Help links */}
        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>
            Don&apos;t have an account?
            <span className="ml-1 text-indigo-600">
              <Link
                href="/register"
                className="text-indigo-600 hover:text-indigo-800 transition"
              >
                Sign Up
              </Link>
            </span>
          </p>
          <p>
            <Link
              href="/password/forget"
              className="text-indigo-600 hover:text-indigo-800 transition"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
