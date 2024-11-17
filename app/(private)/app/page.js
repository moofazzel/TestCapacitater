import { handleGoogleSheetError } from "@/components/handleGoogleSheetError";
import { CategoryColorKeyProvider } from "@/context/CategoryColorKeyContext";
import { getGoogleSheetData } from "@/queries/getGoogleSheetData";
import {
  processDealsAndResources,
  processResourcesOnly,
} from "../calendar/_utils";
import TimeLineSection from "./(component)/TimeLineSection";

export default async function TimeLinePage() {
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

  const { resourcesData, totalResourcesLength } = processResourcesOnly(
    data?.deals,
    data?.resources
  );

  return (
    <section className="container ">
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
