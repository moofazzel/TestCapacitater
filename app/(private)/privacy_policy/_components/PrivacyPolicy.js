"use client";
import { updateUser } from "@/actions/user";
import { useState } from "react";

const PrivacyPolicy = ({ user }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleUpdate = async () => {
    try {
      const email = user.email;
      // Call the server action to update the deals tab name
      const updatedUser = await updateUser(email, {
        privacy_policy: true,
      });
      // Close the edit mode to show the Edit icon again
    } catch (error) {
      console.error("Failed to update privacy policy:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="container mt-10">
      <h3 className="text-3xl font-bold text-center text-green-500">
        Privacy Policy
      </h3>
      <p className="mt-5">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis
        excepturi earum ullam doloribus voluptatum natus quibusdam aspernatur
        quo. Accusamus et molestias dignissimos unde est dolores tenetur, nobis
        ab soluta. Quod cupiditate nostrum quis saepe porro eum officia quisquam
        sed eligendi perspiciatis fugiat quo minima voluptate in ipsum, dolor,
        doloremque, minus rerum voluptatum laborum facere! Mollitia nihil quasi
        excepturi tempora ea numquam. Vitae deserunt ea, hic nulla dolorum
        consequatur in optio facilis quisquam saepe culpa corporis quae
        consectetur velit eveniet repudiandae. Id aliquam maxime nisi aut illum
        est doloribus minus accusamus totam natus obcaecati laboriosam
        necessitatibus labore, delectus eius, ipsam temporibus!
      </p>
      {user.privacyPolicy || (
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
              isChecked ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"
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
