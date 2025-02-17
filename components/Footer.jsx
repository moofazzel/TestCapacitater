"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import footer from "../public/assets/footer.png";
import BottomFooter from "./BottomFooter";

const Footer = () => {
  const { data } = useSession();
  const emailName = data?.user?.email.split("@")[0];
  return (
    <>
      <footer className="bg-[#995C23] md:mt-28">
        <div className="flex flex-col items-center justify-center max-w-3xl px-8 mx-auto space-y-8 py-14">
          <Image src={footer} alt="" />
          <p className="text-white text-center text-[16px]">
            &quot;CapaciTater values your privacy. All information collected on
            this website is the property of Savvy Software LLC and is handled in
            compliance with our privacy policies to ensure the protection and
            confidentiality of your data.&quot;
          </p>
          <div className="flex gap-2 md:gap-5">
            {data?.user ? (
              <>
                <Link
                  href="/"
                  className="text-lg font-medium text-white hover:underline"
                >
                  Home
                </Link>
                <Link
                  href="/calendar"
                  className="text-lg font-medium text-white hover:underline"
                >
                  Calendar
                </Link>
                <Link
                  href="/resources"
                  className="text-lg font-medium text-white hover:underline"
                >
                  Resources
                </Link>
                <Link
                  href="/profile"
                  className="text-lg font-medium text-white hover:underline"
                >
                  Profile
                </Link>
                <Link
                  href="/contact"
                  className="text-lg font-medium text-white hover:underline"
                >
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="text-lg font-medium text-white hover:underline"
                >
                  Home
                </Link>
                <Link
                  href="/contact"
                  className="text-lg font-medium text-white hover:underline"
                >
                  Contact
                </Link>
                <Link
                  href="/signup"
                  className="text-lg font-medium text-white hover:underline"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="text-lg font-medium text-white hover:underline"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </footer>
      {/* bottom footer section */}
      <BottomFooter />
    </>
  );
};

export default Footer;
