/**
 * EmailRegisterPage Component
 *
 * Handles traditional email registration with name, email, and password.
 * This is a separate flow from the unified authentication approach,
 * kept for users who prefer the explicit registration form.
 */
"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { primaryNavItemClass } from "@/components/styles";

export default function EmailRegisterPage() {
  const { register, authState } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  // Input Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

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

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Registration
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Remove confirmPassword before sending the request
      const { confirmPassword, ...formDataToSend } = formData;
      void confirmPassword;

      await register(
        formDataToSend.name,
        formDataToSend.email,
        formDataToSend.password
      );
      // Successful registration will redirect via AuthProvider
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";

      setErrors({ server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors
                                ${
                                  errors.name
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

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
              placeholder="Password (6+ characters)"
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

          {/* Confirm Password field */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors
                                ${
                                  errors.confirmPassword
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
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
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Help links */}
        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
