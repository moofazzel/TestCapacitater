"use client";
import { updateUser } from "@/actions/user";
import Link from "next/link";
import { useState } from "react";

const PrivacyPolicy = ({ user }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleUpdate = async () => {
    try {
      const email = user.email;
      const updatedUser = await updateUser(email, {
        privacy_policy: true,
      });
    } catch (error) {
      console.error("Failed to update privacy policy:", error);
    }
  };

  return (
    <div className="container mt-20">
      <div className="mt-5 text-lg">
        <p className="text-lg text-center">
          CapaciTater values your privacy. All information collected through
          this website is securely managed by{" "}
          <Link href={"https://savvy-software.com/"}>
            <span className="font-semibold underline text-color5">
              Savvy Software LLC
            </span>
          </Link>{" "}
          in accordance with our privacy policies. We are committed to
          protecting your data and ensuring its confidentiality, recognizing
          that all information belongs to you, not us.
        </p>
        <h3 className="mt-10 text-3xl font-bold text-center text-color5">
          Privacy Policy & User Agreement
        </h3>
        <h3 className="text-xl font-bold text-center text-[#995C23] mt-2">
          Effective Date: 15 December 2025
        </h3>
        <p className="mt-5 text-lg text-center">
          At CapaciTater, we prioritize your privacy and the security of your
          information. This Privacy Policy and User Agreement outlines how Savvy
          Software LLC manages your data, what you can expect from our platform,
          and your rights as a user.
        </p>
        <h2 className="mt-5 text-2xl font-bold text-color5">
          1. Information We Collect
        </h2>
        <p>
          To provide the best experience, we may collect the following types of
          information when you use CapaciTater:
        </p>
        <ul className="mt-2">
          <li>
            <strong className="text-[#995C23]">Account Information:</strong>{" "}
            Name, email address, and other contact details you provide when
            signing up.
          </li>
          <li>
            <strong className="text-[#995C23] ">Usage Data:</strong>{" "}
            Interactions with the platform, including features accessed and
            performance metrics.
          </li>
          <li>
            <strong className="text-[#995C23] ">
              Project and Resource Data:
            </strong>{" "}
            Any data entered into CapaciTater for project or resource management
            purposes.
          </li>
          <li>
            <strong className="text-[#995C23] ">Google Sheets Access:</strong>{" "}
            Read & write access to one Google Sheet file in your Google Drive
            that will be used to manage capacity planning table data.
          </li>
        </ul>
        <p className="mt-2">
          When using Google Login/OAuth, we will access limited information from
          your Google account, such as your name, email address, and profile
          picture. This information is used solely to authenticate your identity
          and streamline your login process.
        </p>
        <p className="mt-2">
          We do not access or store any other data from your Google account
          without your explicit permission. By using Google Login, you agree to
          Google&rsquo;s Privacy Policy.
        </p>

        <h2 className="mt-5 text-2xl font-bold text-color5">
          2. How We Use Your Information
        </h2>
        <p className="mt-2">
          Your information is used strictly for the following purposes:
        </p>
        <ul className="container mt-2 list-disc">
          <li>To provide, support, and improve the CapaciTater platform.</li>
          <li>To deliver personalized features and recommendations.</li>
          <li>To respond to user inquiries or provide technical support.</li>
          <li>
            To enhance platform security and monitor for potential misuse.
          </li>
        </ul>
        <p className="mt-2">
          We will never sell, rent, or trade your data to third parties for
          marketing purposes.
        </p>

        <h2 className="mt-5 text-2xl font-bold text-color5">
          3. Data Ownership and Confidentiality
        </h2>
        <p className="mt-2">
          <strong className="text-[#995C23]">You Own Your Data:</strong>{" "}
          CapaciTater is a tool for you to manage your projects and resources.
          Any information you enter into the platform remains your property, not
          ours.
        </p>
        <p>
          <strong className="text-[#995C23]">Our Responsibility:</strong> Savvy
          Software LLC ensures the data you share with us is securely stored and
          handled with care. We act solely as custodians of your data, enabling
          you to control, access, and retrieve it at any time.
        </p>

        <h2 className="mt-5 text-2xl font-bold text-color5">4. Data Sharing</h2>
        <p className="mt-2">
          Savvy Software LLC only shares your information with third parties in
          the following limited circumstances:
        </p>
        <ul className="mt-2">
          <li>
            <strong className="text-[#995C23]">Service Providers:</strong>{" "}
            Third-party vendors that assist with platform functionality (e.g.,
            cloud hosting or payment processors). These providers adhere to
            strict confidentiality agreements and use your data solely to
            perform their services.
          </li>
          <li>
            <strong className="text-[#995C23]">Legal Compliance:</strong> When
            required by law or necessary to enforce legal rights.
          </li>
        </ul>

        <h2 className="mt-5 text-2xl font-bold text-color5">
          5. Security Measures
        </h2>
        <p className="mt-2">
          We implement industry-standard practices to safeguard your data,
          including:
        </p>
        <ul className="container mt-2 list-disc">
          <li>Encrypted data transmission (SSL/TLS protocols).</li>
          <li>Secure storage with access limited to authorized personnel.</li>
          <li>Regular system audits and vulnerability testing.</li>
        </ul>
        <p className="mt-2">
          While we strive to protect your information, no system is 100% secure.
          Please take steps to protect your account, such as using strong
          passwords and not sharing login credentials.
        </p>

        <h2 className="mt-5 text-2xl font-bold text-color5">6. Your Rights</h2>
        <p className="mt-2">
          As a user of CapaciTater, you have the following rights:
        </p>
        <ul className="mt-2 ">
          <li>
            <strong className="text-[#995C23]">Access:</strong> View and
            download your data at any time.
          </li>
          <li>
            <strong className="text-[#995C23]">Correction:</strong> Update or
            correct inaccuracies in your data.
          </li>
          <li>
            <strong className="text-[#995C23]">Deletion:</strong> Request
            deletion of your data from our systems, subject to any legal or
            contractual obligations.
          </li>
          <li>
            <strong className="text-[#995C23]">Data Portability:</strong> Export
            your data in a machine-readable format for use elsewhere.
          </li>
        </ul>
        <p className="mt-2">
          To exercise these rights, contact us at{" "}
          <a
            href="mailto:hello@savvy.website"
            className="font-semibold underline text-color5"
          >
            hello@savvy.website
          </a>
          .
        </p>

        <h2 className="mt-5 text-2xl font-bold text-color5">
          7. User Responsibilities
        </h2>
        <p className="mt-2">
          By using CapaciTater, you agree to the following:
        </p>
        <ul className="container mt-2 list-disc">
          <li>
            You will not use the platform for any illegal activities or to
            upload malicious content.
          </li>
          <li>
            You are responsible for the accuracy of the information you enter
            into the platform.
          </li>
          <li>
            You agree to abide by applicable laws and regulations when using the
            platform.
          </li>
        </ul>

        <h2 className="mt-5 text-2xl font-bold text-color5">
          8. Changes to This Policy
        </h2>
        <p className="mt-2">
          We may update this Privacy Policy and User Agreement from time to time
          to reflect changes in our practices or legal requirements. When we do,
          we will notify you by email or through the platform. Your continued
          use of CapaciTater after any updates constitutes acceptance of the
          revised policy.
        </p>

        <h2 className="mt-5 text-2xl font-bold text-color5">9. Contact Us</h2>
        <p className="mt-2">
          If you have questions or concerns about this Privacy Policy or User
          Agreement, you can reach us at:
        </p>
        <ul className="mt-2">
          <li>
            <strong className="text-[#995C23]">Email:</strong>{" "}
            <a
              href="mailto:hello@savvy.website"
              className="font-semibold underline text-color5"
            >
              hello@savvy.website
            </a>
          </li>
          <li>
            <strong className="text-[#995C23]">Mailing Address:</strong>
            <a
              href="https://www.google.com/maps/search/?api=1&query=6+Rice+Lane,+Ozark,+AL+36360"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline text-color5"
            >
              {" "}
              6 Rice Lane, Ozark, AL 36360
            </a>
          </li>
        </ul>
        <p className="mt-10">
          This policy is designed to ensure transparency, trust, and respect for
          your data as you use CapaciTater to simplify your resource and project
          management needs.
        </p>
        <p className="mt-10 text-3xl font-bold text-center text-color5">
          Thank you for choosing CapaciTater!
        </p>
      </div>
      {user && !user.privacyPolicy && (
        <>
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="agree-checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="agree-checkbox" className="text-lg">
              I have read & agreed to the Privacy Policy
            </label>
          </div>
          <button
            type="button"
            disabled={!isChecked}
            onClick={handleUpdate}
            className={`mt-4 px-4 py-2 text-white font-bold rounded text-center ${
              isChecked ? "bg-color5" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Agree
          </button>
        </>
      )}
    </div>
  );
};

export default PrivacyPolicy;
