"use client";

import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/hooks/dataHooks";
import { USERS_API } from "@/constants/api";
import { FaArrowLeft } from "react-icons/fa";
import { primaryNavItemClass } from "@/components/styles";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    // Basic validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post(USERS_API.FORGOT_PASSWORD, { email }, {}, false);
      setIsSuccess(true);
    } catch (error: unknown) {
      let errorMessage = "Failed to send reset email";

      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.data?.non_field_errors?.[0]) {
            errorMessage = parsedError.data.non_field_errors[0];
          } else {
            errorMessage = parsedError.statusText || error.message;
          }
        } catch {
          errorMessage = error.message;
        }
      }
      setErrors(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Reset Your Password
        </h1>

        {isSuccess ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
              Password reset email sent! Check your inbox for instructions.
            </div>
            <p className="mb-6 text-gray-600">
              If you don&apos;t see the email, check your spam folder or
              <button
                onClick={() => setIsSuccess(false)}
                className="ml-1 text-indigo-600 hover:text-indigo-800"
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600 text-center">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors border-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? "Sending..." : "Send Reset Link"}
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
