import { Button, Link } from "@nextui-org/react";

function LegacyMigration({ isLegacy }) {
  return (
    <section className="container">
      <div className="flex h-[80vh] sm:h-[55vh] flex-col items-center justify-center text-center my-16 md:my-28 custom-shadow p-6 bg-yellow-100 border border-yellow-300">
        <h2 className="text-2xl font-bold text-yellow-800">
          {isLegacy
            ? "Legacy System Detected"
            : "Set Up Your Google Sheets Access"}
        </h2>

        <p className="mt-4 text-gray-700">
          {isLegacy
            ? "Your account is using an older version of our system. To continue using the app, you need to migrate your Google Sheets data."
            : "Please set up your account to access Google Sheets features."}
        </p>

        {isLegacy ? (
          <>
            <p className="mt-4 text-gray-600">
              Grant permission and create a new Google Sheet with your existing
              data.
            </p>
            <div className="flex flex-col gap-3 mt-6 sm:gap-5 sm:flex-row">
              <Button
                radius="none"
                color="success"
                as={Link}
                href="/setup"
                className="px-6 py-2 border"
              >
                Go to Setup Page
              </Button>
              <Button
                color="primary"
                as={Link}
                href="/setup?migrate=true"
                radius="none"
                className="px-6 py-2"
              >
                Migrate to New System
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <Button
              color="primary"
              radius="none"
              as={Link}
              href="/setup"
              className="px-6 py-2"
            >
              Go to Setup Page
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default LegacyMigration;
