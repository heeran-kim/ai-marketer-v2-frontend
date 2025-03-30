"use client";
import { useState } from "react";
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from "next/navigation";


export default function TwoFactorAuth() {
  const [check,setCheck] = useState(false); //the check var storing if 2fa has been checked
  const [qrCode, setQrCode] = useState(""); //stores string data for qr code
  const [twofa,setTwoFA] = useState(false); //stores 2fa status value
  const [buttonDisabled,setButtonDisabled] = useState(true);  //enable button
  const [rmButtonDisabled,setRMButtonDisabled] = useState(true);  //remove button
  const router = useRouter();

  const { handle2FA, logout } = useAuth();

  const getUser = async () => {
    const storedUser = sessionStorage.getItem("userDetails");
        if (storedUser) {
          return (JSON.parse(storedUser));
        }
        return null;
  }

  const checkFunction = async () => {
    const userdetails=await getUser();
    if(userdetails===null)
    {
      await logout();
      router.push("/login/");
      return;
    }
    
    try {
      const response = await handle2FA(userdetails.email, userdetails.password,'check');
      setTwoFA(response.status);
      console.log(response,"Check");
  } catch (error: unknown) {
      // Handle authentication errors
      const errorMessage = error instanceof Error 
          ? error.message 
          : "Error Checking 2FA.";
      console.log(errorMessage);
  } finally {
    setButtonDisabled(false);
    setRMButtonDisabled(false);
    setCheck(true);
  }
}

  const displayQR = async () => {
    const userdetails=await getUser();
    if(userdetails===null)
    {
      return;
    }
    setButtonDisabled(true);
    try {
      const response = await handle2FA(userdetails.email, userdetails.password,'enable');
      setQrCode(response.qr_code);
      console.log(response.qr_code,"Enable");
    } catch (error: unknown) {
        // Handle authentication errors
        const errorMessage = error instanceof Error 
            ? error.message 
            : "Error Enabling 2FA.";
        console.log(errorMessage);
    } finally {
      setRMButtonDisabled(false);
    }
  }

  const remove2FA = async () => {
    const userdetails=await getUser();
    if(userdetails===null)
    {
      return;
    }
    setRMButtonDisabled(true);
    try {
      const response = await handle2FA(userdetails.email, userdetails.password,'remove');
      setTwoFA(response.status);
      console.log(response,"Remove");
    } catch (error: unknown) {
        // Handle authentication errors
        const errorMessage = error instanceof Error 
            ? error.message 
            : "Error Enabling 2FA.";
        console.log(errorMessage);
    } finally {
      setButtonDisabled(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      {!check?
      <button
      className={`px-4 py-1.5 text-sm font-medium rounded-md transition flex items-center justify-center min-w-[75px] bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300`}
      onClick={checkFunction}
      disabled={false}
    >
      View Status
    </button>
    :<>
      {twofa?
      <>
      <p>Enabled</p>
      <button
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition flex items-center justify-center min-w-[75px] ${
              buttonDisabled 
              ? "bg-gray-400 text-white cursor-not-allowed" 
              : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"
          }`}
          onClick={remove2FA}
          disabled={rmButtonDisabled}
      >
        Remove 2FA
      </button>
      </>
      :
      <>
      {buttonDisabled===false?
      <><p>Disabled</p>
      <button
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition flex items-center justify-center min-w-[75px] ${
              buttonDisabled 
              ? "bg-gray-400 text-white cursor-not-allowed" 
              : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"
          }`}
          onClick={displayQR}
          disabled={buttonDisabled}
      >
        Enable
      </button></>
      :
      <>
        <h2 className="text-xl font-bold mb-4">Scan this QR Code</h2>
        {qrCode ? (
          <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
        ) : (
          <p>Loading QR Code...</p>
        )}
      </>
    }</>}</>
  }
    </div>
  );
}
