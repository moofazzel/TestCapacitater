import { handleGoogleSheetError } from "@/components/handleGoogleSheetError";
import { CategoryColorKeyProvider } from "@/context/CategoryColorKeyContext";
import { getGoogleSheetData } from "@/queries/getGoogleSheetData";

import { auth } from "@/auth";
import { getUserData } from "@/queries/getUser";
import { checkLegacyUser } from "@/utils/checkLegacyUser";
import LegacyMigration from "./(component)/LegacyMigration";
import TimeLineSection from "./(component)/TimeLineSection";
import {
  processDealsAndResources,
  processResourcesWithOverlappingPeriods,
} from "./_utils";

export default async function TimeLinePage() {
  const session = await auth();

  const userData = await getUserData(session?.user?.email);

  const { isLegacy } = await checkLegacyUser(session?.user?.email);

  if (isLegacy || !userData?.googleSheetPermission) {
    return <LegacyMigration isLegacy={isLegacy} />;
  }

  // Fetch data from Google Sheets
  const { status, data, error, message } = await getGoogleSheetData();

  // Handle error using the utility function
  const errorComponent = handleGoogleSheetError(status, message);
  if (errorComponent) {
    return errorComponent;
  }

  // Process the data to get unique owners and structured data
  const {
    structuredDataByDealOwner,
    resourcesForDeals,
    allResources,
    allDealStages,
  } = processDealsAndResources(data?.deals, data?.resources);

  const { resourcesData, totalResourcesLength } =
    processResourcesWithOverlappingPeriods(data?.deals, data?.resources);

  // const { resourcesData, totalResourcesLength } =
  //   processResourcesOnly(data?.deals, data?.resources);

  const dateAndTime = getCurrentFormattedDateTime();

  // !Info the perfect container size is max-w-[3170px] for full screen

  return (
    <section className="container">
      <h2 className="mb-2 text-xs font-normal">{`Last Data Sync: ${dateAndTime.date} ${dateAndTime.time}`}</h2>
      <CategoryColorKeyProvider>
        <TimeLineSection
          dataByDealOwners={structuredDataByDealOwner}
          allResources={allResources}
          resourcesForDeals={resourcesForDeals}
          resourcesData={resourcesData}
          totalResourcesLength={totalResourcesLength}
          allDealStages={allDealStages}
        />
      </CategoryColorKeyProvider>
    </section>
  );
}

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

  // Extracting Date parts in local time
  const year = date.getFullYear();
  const month = monthNames[date.getMonth()]; // Get the month name
  const day = date.getDate();

  // Extracting Time parts in local time
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Determine AM/PM
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format

  // Formatting Date
  const formattedDate = `${day < 10 ? "0" + day : day} ${month} ${year}`; // Example: "05 Sep 2024"

  // Formatting Time
  const formattedTime = `${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${amPm}`;

  // Getting UTC offset in hours
  const timezoneOffset = -date.getTimezoneOffset() / 60; // Negative because getTimezoneOffset() is opposite
  const timezoneString =
    timezoneOffset >= 0 ? `UTC+${timezoneOffset}` : `UTC${timezoneOffset}`;

  return {
    date: formattedDate,
    time: `${formattedTime} (${timezoneString})`,
  };
}

const dateAndTime = getCurrentFormattedDateTime();
