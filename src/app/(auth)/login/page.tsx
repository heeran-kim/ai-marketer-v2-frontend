/**
 * LoginPage Component
 *
 * Provides a unified authentication interface that combines login and registration.
 * Users can authenticate via social providers, or email/password.
 * will be created automatically if they don't exist.
 */
"use client";

import Link from "next/link";
import { FaGoogle, FaApple, FaFacebook, FaEnvelope } from "react-icons/fa";
import { primaryNavItemClass } from "@/components/styles";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

// Authentication method button component for social auth
interface AuthButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function AuthButton({ icon, label, onClick }: AuthButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${primaryNavItemClass} w-full py-3 flex items-center justify-start space-x-3 px-4`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function LoginPage() {
  const { authState } = useAuth();
  const router = useRouter();

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

  // Auth provider handlers - would connect to actual auth implementation
  const handleSocialAuth = (provider: string) => {
    console.log(`Authenticating with ${provider}`);
    // Would trigger social auth flow here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Get Started with AI Marketer
        </h1>

        {/* Social authentication options */}
        <div className="space-y-3 mb-6">
          <AuthButton
            icon={<FaGoogle />}
            label="Continue with Google"
            onClick={() => handleSocialAuth("Google")}
          />
          <AuthButton
            icon={<FaApple />}
            label="Continue with Apple"
            onClick={() => handleSocialAuth("Apple")}
          />
          <AuthButton
            icon={<FaFacebook />}
            label="Continue with Facebook"
            onClick={() => handleSocialAuth("Facebook")}
          />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">or</span>
          </div>
        </div>

        {/* Alternative auth methods */}
        <Link
          href="/login/email"
          className="w-full flex items-center justify-center space-x-3 px-4 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <FaEnvelope />
          <span>Continue with Email</span>
        </Link>
      </div>
    </div>
  );
}
