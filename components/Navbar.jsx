"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import logo1 from "../public/assets/logo1.png";
import Logout from "./logout";

const Navbar = () => {
  const { data } = useSession();
  const emailName = data?.user?.name || data?.user?.email.split("@")[0];

  const avatar = data?.user?.image || "";

  return (
    <nav className="w-full bg-[#995C23] mb-8">
      <div className="container max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px] flex items-center justify-between md:px-0 py-2 mx-auto mt-6 ">
        {/* Logo Section */}

        <div className="flex items-center">
          <Link href="/">
            <Image src={logo1} alt="Logo" className="w-32 h-12 mr-2 md:w-48" />
          </Link>
        </div>

        {/* Desktop*/}
        {/* Links Section */}
        <div className="items-center hidden gap-12 space-x-4 md:flex">
          {" "}
          {data?.user ? (
            <>
              <Link
                href="/"
                className="text-lg font-medium text-white hover:underline"
              >
                Home
              </Link>
              <Link
                href="/app"
                className="text-lg font-medium text-white hover:underline"
              >
                App
              </Link>
              <Link
                href="/resources"
                className="text-lg font-medium text-white hover:underline"
              >
                Resources
              </Link>
              <Link
                href="/contact"
                className="text-lg font-medium text-white hover:underline"
              >
                Contact
              </Link>
              <Dropdown placement="bottom-end">
                {/* Hamburger menu button */}
                <DropdownTrigger>
                  <div className="text-lg font-medium text-[#281912] bg-white shadow-dark-gray ">
                    <User
                      classNames="uppercase"
                      as="button"
                      name={emailName}
                      avatarProps={{
                        name: emailName,
                        src: avatar,
                      }}
                      className="px-6 py-2"
                    />
                  </div>
                </DropdownTrigger>
                {/* Menu items */}
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="gap-2 h-14">
                    <p className="font-bold">Signed in with</p>
                    <p className="font-bold">{data?.user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="Profile">
                    <Link className="block w-full" href="/profile">
                      Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    className="text-danger"
                    key="Logout"
                    color="danger"
                  >
                    <Logout />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <div className="flex items-center gap-7">
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
                className="px-8 py-4 text-lg font-medium text-[#281912] bg-white"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 text-lg font-medium text-white border border-white"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
        <div className="md:hidden">
          {data?.user ? (
            <>
              <Dropdown placement="bottom-end">
                {/* Hamburger menu button */}
                <DropdownTrigger>
                  <div className="text-lg font-medium text-[#281912] bg-white shadow-dark-gray ">
                    <User
                      classNames="uppercase"
                      as="button"
                      name={emailName}
                      avatarProps={{
                        name: emailName,
                        src: avatar,
                      }}
                      className="px-6 py-2"
                    />
                  </div>
                </DropdownTrigger>
                {/* Menu items */}
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="gap-2 h-14">
                    <p className="font-bold">Signed in with</p>
                    <p className="font-bold">{data?.user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="Home">
                    <Link href="/" className="block w-full">
                      Home
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="App">
                    <Link href="/app" className="block w-full">
                      App
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="Resources">
                    <Link href="/resources" className="block w-full">
                      Resources
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="Profile">
                    <Link className="block w-full" href="/profile">
                      Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="Contact">
                    <Link href="/contact" className="block w-full">
                      Contact
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    className="text-danger"
                    key="Logout"
                    color="danger"
                  >
                    <Logout />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <Dropdown placement="bottom-end">
              {/* Hamburger menu button */}
              <DropdownTrigger>
                <button className="p-2 text-white bg-transparent border-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </DropdownTrigger>
              {/* Menu items */}
              <DropdownMenu aria-label="Guest Actions" variant="flat">
                <DropdownItem key="Home">
                  <Link href="/" className="block w-full">
                    Home
                  </Link>
                </DropdownItem>
                <DropdownItem key="Contact">
                  <Link href="/contact" className="block w-full">
                    Contact
                  </Link>
                </DropdownItem>
                <DropdownItem key="SignUp">
                  <Link href="/signup" className="block w-full">
                    Sign Up
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

{
  /* <DropdownTrigger>
  <div className="text-lg font-medium text-[#281912] bg-white shadow-dark-gray ">
    <User as="button" name={emailName} className="px-6 py-2" />
  </div>
</DropdownTrigger>; */
}
