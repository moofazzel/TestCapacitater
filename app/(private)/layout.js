import dbConnect from "@/lib/mongodb";
import Provider from "@/providers/Provider";
import { Poppins } from "next/font/google";
import "../globals.css";

import { auth } from "@/auth";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { checkSubscriptionStatus } from "@/utils/checkSubscriptionStatus";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata = {
  title: "Capacitater",
  description: "Capacitater",
};

export default async function RootLayout({ children }) {
  await dbConnect();
  const session = await auth();

  if (!session?.user) redirect("/login");

  const { status } = await checkSubscriptionStatus();
  if (!status) redirect("/subscription-notice");

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
        <Toaster />
      </body>
    </html>
  );
}
