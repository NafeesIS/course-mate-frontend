"use client";

// import HeroWrapper from '@/components/shared/HeroWrapper';
// import { XCircleIcon } from 'lucide-react';
// import Image from 'next/image';
import { useSearchParams } from "next/navigation";
import { useState } from "react";
// import { RiLock2Fill } from 'react-icons/ri';
// import loginImg from '../../../../../../public/assets/login.svg';
import Auth from "../_components/Auth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectToPath = searchParams.get("redirectToPath");

  // Check if the redirectToPath is checkout page
  const isRedirectingToCheckout =
    redirectToPath?.includes("subscription/checkout/new-company-alert") ||
    redirectToPath?.includes("cart");

  // State to control the visibility of the message card
  const [showMessage, setShowMessage] = useState(isRedirectingToCheckout);

  return (
    <>
      {/* <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper> */}

      <div className="flex-col-center min-h-[80vh] pb-16 pt-8">
        {showMessage && (
          <div className="relative flex items-center justify-center px-6 pb-8">
            <div className="relative flex items-center rounded-lg bg-muted p-6 text-left text-foreground shadow-md">
              {/* <RiLock2Fill className='mr-3 size-6 flex-shrink-0 text-muted-foreground md:size-10' /> */}
              <div>
                <h2 className="text-sm font-semibold md:text-base">
                  Sign In Required
                </h2>
                <p className="mt-1 text-xs md:text-sm">
                  To proceed to checkout and complete your purchase, please{" "}
                  <strong>sign in</strong> or <strong>create an account</strong>
                  .
                </p>
              </div>
              <button
                onClick={() => setShowMessage(false)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                {/* <XCircleIcon className='h-5 w-5' /> */}
              </button>
            </div>
          </div>
        )}

        <section className="w-full">
          <div className="flex items-center justify-center">
            <Auth />
          </div>
        </section>
      </div>
    </>
  );
}
