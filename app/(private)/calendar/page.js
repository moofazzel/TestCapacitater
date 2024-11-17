import { handleGoogleSheetError } from "@/components/handleGoogleSheetError";
import { getGoogleSheetData } from "@/queries/getGoogleSheetData";
import GridCalendarAndHeader from "./_component/GridCalendarAndHeader";
import { processDealsAndResources, processResourcesOnly } from "./_utils";

const CalendarPage = async () => {
  // Fetch data from Google Sheets
  const { status, data, error, message } = await getGoogleSheetData();

  // Handle error using the utility function
  const errorComponent = handleGoogleSheetError(status, message);
  if (errorComponent) {
    return errorComponent;
  }

  // Process the data to get unique owners and structured data
  const { structuredDataByDealOwner, resourcesForDeals, allResources } =
    processDealsAndResources(data?.deals, data?.resources);

  const { resourcesData, totalResourcesLength } = processResourcesOnly(
    data?.deals,
    data?.resources
  );
  return (
    <>
      <GridCalendarAndHeader
        dataByDealOwners={structuredDataByDealOwner}
        allResources={allResources}
        resourcesForDeals={resourcesForDeals}
        resourcesData={resourcesData}
        totalResourcesLength={totalResourcesLength}
      />
    </>
  );
};

export default CalendarPage;
