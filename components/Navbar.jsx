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
import logo from "../public/assets/logo.png";
import logo1 from "../public/assets/logo1.png";
import Logout from "./logout";

// Formatting Date and Time as strings
function getCurrentFormattedDateTime() {
  const date = new Date(); // Gets the current date and time

  // Array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extracting Date parts
  const year = date.getFullYear();
  const month = monthNames[date.getMonth()]; // Get the month name
  const day = date.getDate();

  // Extracting Time parts
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Formatting Date and Time as strings
  const formattedDate = `${day < 10 ? "0" + day : day} ${month} ${year}`; // Example: "05 Sep 2024"
  const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

const Navbar = () => {
  const { data } = useSession();
  const emailName = data?.user?.email.split("@")[0];

  return (
    <nav className="w-full bg-[#995C23] mb-8">
      <div className="container max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px] flex items-center justify-between md:px-0 py-2 mx-auto mt-12 ">
        {/* Logo Section */}
        {data?.user ? (
          <div className="flex items-center">
            <Link href="/">
              <Image src={logo} alt="Logo" className="w-20 h-20 mr-2" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center">
            <Link href="/">
              <Image
                src={logo1}
                alt="Logo"
                className="w-32 h-12 mr-2 md:w-48"
              />
            </Link>
          </div>
        )}

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
                    <User as="button" name={emailName} className="px-6 py-2" />
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
                href="/register"
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
                    <User as="button" name={emailName} className="px-6 py-2" />
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
                  <DropdownItem key="Calendar">
                    <Link href="/calendar" className="block w-full">
                      Calendar
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
            <div className="flex gap-2">
              <Link
                href="/"
                className="px-2 py-2 text-[14px] font-medium text-white border border-white"
              >
                Home
              </Link>
              <Link
                href="/contact"
                className="px-2 py-2 text-[14px] font-medium text-white border border-white"
              >
                Contact
              </Link>
              <Link
                href="/register"
                className="px-2 py-2 text-[14px] font-medium text-[#281912] bg-white"
              >
                Sign Up
              </Link>
            </div>
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
