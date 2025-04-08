'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider';
import { usePathname } from 'next/navigation';

export default function OAuthCallbackPage() {

  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Waiting for response...');
  const [code, setCode] = useState(''); //oauth code
  const {handleOAuth} = useAuth();

  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const subpage = pathSegments[pathSegments.length - 1];
  const parentPath = "/" + pathSegments.slice(0, -1).join("/");

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      setStatus(`Error: ${error}`);
      return;
    }

    if (code) {
      setStatus('Authorization code received!');
      setCode(code);
    }
  }, [searchParams])

  const confirmLink = async()=>{
    try{
        //const response = await apiClient.post<Record<string,any>>(SETTINGS_API.CONNECT_SOCIAL(provider), {});
        setStatus('Waiting for response...');
        const response = await handleOAuth("POST",subpage,code);
        console.log(response);
        window.location.href = parentPath;
      }
      catch(error)
      {
        console.log(error);
      }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">OAuth Redirect Handler</h1>
      <p>{status}</p>
      <button
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition flex items-center justify-center min-w-[75px] bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"} ${status !== 'Authorization code received!'? "bg-gray-400 text-white cursor-not-allowed" : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"}`}
        onClick={confirmLink}
        disabled={status !== 'Authorization code received!'}
      >
        Complete Link
      </button>
    </div>
  )
}
