import { handleGoogleSheetError } from "@/components/handleGoogleSheetError";
import { getGoogleResourcesSheetData } from "@/queries/getGoogleResourcesSheetData";
import ResourcesTable from "./_components/ResourcesTable";

export default async function ResourcesPage() {
  const { status, data, error, message } = await getGoogleResourcesSheetData();

  const errorComponent = handleGoogleSheetError(status, message);
  if (errorComponent) {
    return errorComponent;
  }

  // console.log("🚀 ~ data:", data?.resources);

  return (
    <section className="container py-10 max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px]">
      {/* <div className="text-xl font-bold text-center">
        <h1> Your Resources</h1>
      </div> */}

      <ResourcesTable resourcesData={data?.resources} />
    </section>
  );
}
