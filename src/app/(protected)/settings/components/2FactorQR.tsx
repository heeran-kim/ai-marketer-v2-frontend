"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ChangeEvent, FormEvent } from "react";
import { primaryNavItemClass } from "@/components/styles";

export default function TwoFactorAuth() {
  const [check, setCheck] = useState(false); //the check var storing if 2fa has been checked
  const [qrCode, setQrCode] = useState(""); //stores string data for qr code
  const [twofa, setTwoFA] = useState(false); //stores 2fa status value
  const [buttonDisabled, setButtonDisabled] = useState(true); //enable button
  const [rmButtonDisabled, setRMButtonDisabled] = useState(true); //remove button

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
  });

  const { handle2FA } = useAuth();

  const check2FA = async () => {
    try {
      const response = await handle2FA("check");
      setTwoFA(response.status);
      //console.log(response,"Check");
    } catch (error: unknown) {
      // Handle authentication errors
      const errorMessage =
        error instanceof Error ? error.message : "Error Checking 2FA.";
      console.log(errorMessage);
    } finally {
      setButtonDisabled(false);
      setRMButtonDisabled(false);
      setCheck(true);
    }
  };

  const enable2FA = async () => {
    setButtonDisabled(true);
    try {
      const response = await handle2FA("enable");
      setQrCode(response.qr_code);
      //console.log(response.qr_code,"Enable");
    } catch (error: unknown) {
      // Handle authentication errors
      const errorMessage =
        error instanceof Error ? error.message : "Error Enabling 2FA.";
      console.log(errorMessage);
    } finally {
      setRMButtonDisabled(false);
    }
  };

  const remove2FA = async () => {
    setRMButtonDisabled(true);
    try {
      const response = await handle2FA("remove");
      setTwoFA(response.status);
      //console.log(response,"Remove");
    } catch (error: unknown) {
      // Handle authentication errors
      const errorMessage =
        error instanceof Error ? error.message : "Error Enabling 2FA.";
      console.log(errorMessage);
    } finally {
      setButtonDisabled(false);
    }
  };

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
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      //await login(formData.email, formData.password,'2fa', formData.code);
      const response = await handle2FA("check", formData.code);
      //console.log(response)
      setTwoFA(response.status);
      setButtonDisabled(true);
      setRMButtonDisabled(false);
      // Successful login will redirect via AuthProvider
    } catch (error: unknown) {
      // Handle authentication errors
      console.log(error);
      const errorMessage = "Error - Wrong Code!";

      setErrors({ server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!check ? (
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition flex items-center justify-center min-w-[75px] bg-black text-white hover:bg-gray-800`}
          onClick={check2FA}
          disabled={false}
        >
          View Status
        </button>
      ) : (
        <>
          {twofa ? (
            <>
              <p>Enabled</p>
              <button
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition flex items-center justify-center min-w-[75px] ${
                  rmButtonDisabled
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                onClick={remove2FA}
                disabled={rmButtonDisabled}
              >
                Remove 2FA
              </button>
            </>
          ) : (
            <>
              {buttonDisabled === false ? (
                <>
                  <p>Disabled</p>
                  <button
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition flex items-center justify-center min-w-[75px] ${
                      buttonDisabled
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                    onClick={enable2FA}
                    disabled={buttonDisabled}
                  >
                    Enable
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-4">
                    Scan this QR Code with your Authenticator App
                  </h2>
                  {qrCode ? (
                    <>
                      <img
                        src={qrCode}
                        alt="2FA QR Code"
                        className="w-48 h-48"
                      />
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
                            <p className="mt-1 text-sm text-red-600">
                              {errors.code}
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
                          {isLoading ? "Authenticating..." : "Enable 2FA"}
                        </button>
                      </form>
                    </>
                  ) : (
                    <p>Loading QR Code...</p>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
