import dbConnect from "@/lib/mongodb";
import { Poppins } from "next/font/google";

import "../globals.css";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Provider from "@/providers/Provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata = {
  title: "Capacitater",
  description: "Capacitater",
};

export default async function RootLayout({ children }) {
  await dbConnect();
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Provider>
          <SessionProvider>
            <Navbar />
            {children}
            <Footer />
          </SessionProvider>
        </Provider>
      </body>
    </html>
  );
}
