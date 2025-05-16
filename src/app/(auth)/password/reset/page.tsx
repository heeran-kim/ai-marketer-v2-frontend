"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/hooks/dataHooks";
import { USERS_API } from "@/constants/api";
import { FaArrowLeft } from "react-icons/fa";
import { primaryNavItemClass } from "@/components/styles";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get uid and token from URL
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    // Redirect if no uid or token
    if (!uid || !token) {
      router.push("/password/forgot");
    }
  }, [uid, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    // Validation
    if (password.length < 6) {
      setErrors("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrors("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post(
        USERS_API.RESET_PASSWORD,
        { uid, token, newPassword: password },
        {},
        false
      );
      setIsSuccess(true);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password";
      setErrors(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // If no uid or token, show loading while redirecting
  if (!uid || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Reset Your Password
        </h1>

        {isSuccess ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
              Password reset successful!
            </div>
            <p className="mb-6 text-gray-600">
              Your password has been updated. You can now log in with your new
              password.
            </p>
            <Link
              href="/login"
              className={`${primaryNavItemClass} inline-flex justify-center py-3 px-4`}
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600 text-center">
              Please enter your new password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors border-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors border-gray-300"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {errors && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                  {errors}
                </div>
              )}

              <button
                type="submit"
                className={`${primaryNavItemClass} w-full justify-center py-3`}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition"
          >
            <FaArrowLeft className="mr-2" size={14} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
