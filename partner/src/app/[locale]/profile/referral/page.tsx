'use client';
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/store/hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clipboard, Check } from "lucide-react";

export default function Referral() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);
  const profileData = useAppSelector((state) => state.profileData);
  const profile = profileData?.data;

  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedNew, setIsCopiedNew] = useState(false);
  const [sharingUrl, setSharingUrl] = useState('');
  const [updatedReferralUrl, setUpdatedReferralUrl] = useState('https://www.rxtn.in');
  const inputRef = useRef(null);
  const inputRefNew = useRef(null);
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value).then(() => {
        setIsCopied(true);
        // Reset to default state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const handleCopyNew = () => {
    if (inputRefNew.current) {
      navigator.clipboard.writeText(inputRefNew.current.value).then(() => {
        setIsCopiedNew(true);

        // Reset to default state after 2 seconds
        setTimeout(() => setIsCopiedNew(false), 2000);
      });
    }
  };

  function isValidRxTnUrl(url: string | URL) {
    try {
      // Parse the URL
      const parsedUrl = new URL(url);

      // Check if the protocol is HTTPS and hostname matches
      return (
        parsedUrl.protocol === "https:" &&
        parsedUrl.hostname === "www.rxtn.in"
      );
    } catch (error) {
      // If URL constructor throws an error, the input is not a valid URL
      return false;
    }
  }

  const onNewUrlChange = (value: string) => {
    const trimmedValue = value.trim();
    const isValid = isValidRxTnUrl(trimmedValue);
    setSharingUrl(trimmedValue);
    if (!isValid) {
      setErrorMessage(`Please enter a valid RxTn URL. Example: https://www.rxtn.in/some-page`);
    } else {
      setErrorMessage('');
      setUpdatedReferralUrl(trimmedValue);
    }
  }


  return (
    <>
      <div id="default-styled-tab-content">
        <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]  min-h-[600px]">
          <div className="relative">
            <div className="w-full">
              <div className="mb-2 flex justify-between items-center">
                <label htmlFor="website-url" className="text-sm font-medium text-gray-900 dark:text-white">Your referral link:</label>
              </div>
              <TooltipProvider>
                <div className="flex items-center space-x-2">
                  {/* Input Field */}
                  <input
                    ref={inputRef}
                    disabled
                    type="text"
                    // defaultValue={`https://www.rxtn.in?rxt=${profile?.partner_user_id}`}
                    value={`https://www.rxtn.in?rxt=${profile?.partner_user_id}`}
                    className="px-4 py-2 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Copy Button with Tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopy}
                        className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300"
                      >
                        {isCopied ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clipboard className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isCopied ? "Copied!" : "Click to copy"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Share this link with your friends and earn rewards when they awailed our services.
              </p>
            </div>
            <div className="w-full mt-10">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Generate referral URL:</h3>
              </div>
              <div className="mb-2 flex justify-between items-center">
                <label htmlFor="website-url" className="text-sm font-medium text-gray-900 dark:text-white">
                  Paste the link to the page you want to share
                </label>
              </div>
              <div className="flex flex-col space-x-2">
                {/* Input Field */}
                <input
                  type="text"
                  value={sharingUrl}
                  placeholder="https://www.rxtn.in"
                  onChange={(e) => onNewUrlChange(e.target.value)}
                  className="px-4 py-2 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errorMessage && <p className="text-red-500 text-sm pt-1">{errorMessage}</p>}
              </div>


              <div className="mb-2 flex justify-between items-center mt-6">
                <label htmlFor="website-url" className="text-sm font-medium text-gray-900 dark:text-white">
                  Your referral link for the above url is:
                </label>
              </div>
              <TooltipProvider>
                <div className="flex items-center space-x-2">
                  {/* Input Field */}
                  <input
                    ref={inputRefNew}
                    disabled
                    type="text"
                    value={`${updatedReferralUrl}?rxt=${profile?.partner_user_id}`}
                    className="px-4 py-2 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Copy Button with Tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopyNew}
                        className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300"
                      >
                        {isCopiedNew ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clipboard className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isCopiedNew ? "Copied!" : "Click to copy"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Share this link with your friends and earn rewards when they awailed our services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
