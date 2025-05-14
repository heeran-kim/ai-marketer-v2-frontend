"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname } from "next/navigation";

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Waiting for response...");
  const [code, setCode] = useState(""); //oauth code
  const [error, setError] = useState(""); //oauth error
  const { handleOAuth } = useAuth();

  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const subpage = pathSegments[pathSegments.length - 1];
  const parentPath = "/" + pathSegments.slice(0, -1).join("/");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus(`Error: ${error}`);
      return;
    }

    if (code) {
      setStatus(
        "Authorization code received! Please Click the button to complete the linking process."
      );
      setCode(code);
    }
  }, [searchParams]);

  const confirmLink = async () => {
    try {
      //const response = await apiClient.post<Record<string,any>>(SETTINGS_API.CONNECT_SOCIAL(provider), {});
      setStatus("Waiting for response...");
      const response = await handleOAuth("POST", subpage, code);
      //console.log(response);
      setError(response.message);
      window.location.href = parentPath;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to link account.";
      //console.log(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">OAuth Redirect Handler</h1>
      <p>{status}</p>
      <button
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition flex items-center justify-center min-w-[75px] bg-black text-white hover:bg-gray-800"} ${
          status !==
          "Authorization code received! Please Click the button to complete the linking process."
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
        onClick={confirmLink}
        disabled={
          status !==
          "Authorization code received! Please Click the button to complete the linking process."
        }
      >
        Complete Link
      </button>
      {error.length > 0 && (
        <div
          className={`p-3 border rounded-lg ${
            error === "Successfully linked!"
              ? "bg-green-100 border-green-300 text-green-700"
              : "bg-red-100 border-red-300 text-red-700"
          }`}
        >
          {error}
        </div>
      )}
    </div>
  );
}
