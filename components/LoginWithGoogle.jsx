import { signIn } from "next-auth/react";
import Image from "next/image";

const LoginWithGoogle = ({ email }) => {
  // handle google login
  const handleGoogleSignIn = () => {
    signIn("google");
  };
  return (
    <>
      <p className="my-3 text-center text-white">or</p>
      <div className="flex items-center justify-center dark:bg-gray-800">
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="flex gap-2 px-4 py-2 transition duration-150 bg-white border border-slate-200 dark:border-slate-700 text-color5 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow"
        >
          <Image
            className="w-6 h-6"
            width={300}
            height={300}
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
          />
          <span>Login with Google</span>
        </button>
      </div>
    </>
  );
};

export default LoginWithGoogle;
