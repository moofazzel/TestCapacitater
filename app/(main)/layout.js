import dbConnect from "@/lib/mongodb";
import Provider from "@/providers/Provider";
import { Poppins } from "next/font/google";
import "../globals.css";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import GoogleAnalytics from "@/GoogleAnalytics";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata = {
  title: "Capacitater",
  description: "Capacitater",
  keywords:
    "resource capacity planner excel template, agency capacity planner tool, capacity planner, resource planning software, capacity software, resource management saas products, resource planning tools, salesforce integration, integration in salesforce, salesforce integrations, hubspot salesforce integration, hubspot integrations, hubspot integration, hubspot marketplace, hubspot app marketplace, resource allocation in project management, project resource allocation chart excel, resource scheduling software, resource planning scheduling software for business, sales pipeline management dashboard, sales pipeline management tools, effective pipeline management in b2b sales, 10 sales pipeline management tips to speed up your cycle, sales pipeline management software, b2b sales pipeline management, what is pipeline management in sales, sales and pipeline management, pipeline management meaning in sales, sales/bd pipeline management, salesloft pipeline management product alternatives, salesforce pipeline management, sales pipeline management open pipeline, pipeline crm, sales pipeline crm, software sales pipeline, sales and pipeline management, capacity planning tools, sales pipeline software, team capacity planning, deal tracking software, resource forecasting, production capacity planner, software sales pipeline, capacity planning in excel",
  author: "Savvy Software",
};

export default async function RootLayout({ children }) {
  await dbConnect();
  // const session = await auth();

  // if (!session?.user) redirect("/login");

  return (
    <html lang="en">
      <head>
        {/* Add Google Analytics */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        {/* Add Stripe.js to the head of the page */}
        <Script
          strategy="beforeInteractive" // Load the script before React starts
          src="https://js.stripe.com/v3/"
        />
      </head>
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
