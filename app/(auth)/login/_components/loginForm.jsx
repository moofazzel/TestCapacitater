"use client";

import { credentialLogin } from "@/actions";
import LoginWithGoogle from "@/components/LoginWithGoogle";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import logo from "../../../../public/assets/contact.png";

const LoginForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage(null); // Reset error message

    const formData = new FormData(event.currentTarget);

    try {
      const res = await credentialLogin(formData);

      if (res.success) {
        // Redirect based on the setup status
        router.push(res.redirectPath);
      } else {
        setLoading(false);
        setErrorMessage(res.message);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <div className="container max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px]  flex flex-col mt-28 overflow-hidden px-0">
      <div className="flex flex-col mt-12 overflow-hidden shadow-dark-gray md:flex-row mb-36">
        <div className="p-10 md:p-32 md:w-1/2 bg-color10">
          <Image
            src={logo}
            alt="Capacitater company logo"
            layout="responsive"
          />
        </div>

        <div className="p-10 md:p-24 bg-color3 md:w-1/2">
          <div className="mb-8 text-center text-white">
            <p className="mt-6 text-3xl font-semibold">Login In</p>
            <p className="mt-2 text-lg">
              See your growth and get consulting support!
            </p>
          </div>
          <form onSubmit={onSubmit}>
            {errorMessage && (
              <div
                className="px-4 py-3 text-center text-black bg-red-100 border border-red-500 rounded-lg"
                aria-live="assertive"
              >
                <p className="font-bold">Warning</p>
                <p>{errorMessage}</p>
              </div>
            )}
            <div className="space-y-2 text-lg font-medium">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className="w-full px-5 py-2 placeholder-color02"
                required
              />
            </div>
            <div className="mt-5 space-y-2 text-lg font-medium">
              <label htmlFor="password" className="text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-5 py-2 placeholder-color02"
                required
              />
            </div>
            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="flex items-center justify-center w-full px-8 py-4 text-lg font-semibold bg-white text-color3"
                disabled={loading} // Optionally disable the button while loading
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-2 text-current animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>
          <LoginWithGoogle />
          <p className="mt-5 text-lg text-center text-white">
            See{" "}
            <Link href="/privacy-policy">
              <span className="underline"> Privacy Policy </span>
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
