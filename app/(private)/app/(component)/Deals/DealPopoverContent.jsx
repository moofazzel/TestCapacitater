import ConnectIcon from "@/components/icons/ConnectIcon";
import { formatDate, getColor } from "../../(utils)";
import AllDealComments from "./AllDealComments";

function DealPopoverContent({ deal }) {
  return (
    <div className="space-y-3 ">
      {/* Deal name */}
      <h3 className="text-2xl font-semibold ">{deal["Project"]}</h3>
      {/* Deal ID */}
      <div className="text-base ">
        <span className="text-color01">Deal ID:</span>{" "}
        <span className="text-color03">{deal["Deal ID"]}</span>
      </div>

      {/* Deal stage */}
      <div className="text-base ">
        <span className="text-color01">Deal Stage</span>{" "}
        <span className="text-color03">{deal["Deal Stage"]}</span>
      </div>

      {/* Client */}
      <div className="text-base ">
        <span className="text-color01">Client:</span>{" "}
        <span className="text-color03">{deal["Client"]}</span>
      </div>

      {/* Custom Fields (Dynamically Rendered) */}
      {Object.entries(deal).map(([key, value]) => {
        // Skip known standard fields
        if (
          [
            "id",
            "Deal ID",
            "Client",
            "Project",
            "Deal Stage",
            "Start Date",
            "End Date",
            "Deal Owner",
            "dealOwnerColumnName",
            "resources",
            "row",
          ].includes(key)
        ) {
          return null;
        }

        return (
          <div key={key} className="text-base">
            <span className="text-color01">{key}:</span>{" "}
            <span className="text-color03">{value || "N/A"}</span>
          </div>
        );
      })}

      {/* Deal dates */}
      <div className="flex items-center gap-2 px-5 py-2 text-sm bg-white border border-color02 max-w-fit">
        <span className="text-color02">{formatDate(deal["Start Date"])}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M6.30592 0.308161C6.11004 0.505537 6 0.773199 6 1.05229C6 1.33138 6.11004 1.59904 6.30592 1.79641L11.4779 7.00635L6.30592 12.2163C6.11559 12.4148 6.01028 12.6807 6.01266 12.9566C6.01504 13.2326 6.12492 13.4966 6.31865 13.6917C6.51237 13.8869 6.77443 13.9976 7.04839 14C7.32235 14.0024 7.58628 13.8963 7.78334 13.7045L13.6941 7.75048C13.89 7.55311 14 7.28544 14 7.00635C14 6.72727 13.89 6.4596 13.6941 6.26223L7.78334 0.308161C7.5874 0.110846 7.32169 -2.91918e-07 7.04463 -3.04029e-07C6.76757 -3.16139e-07 6.50186 0.110846 6.30592 0.308161Z"
            fill="#373737"
          />
          <path
            d="M12.5 8C13.0523 8 13.5 7.55228 13.5 7C13.5 6.44772 13.0523 6 12.5 6V8ZM12.5 6H0V8H12.5V6Z"
            fill="#555555"
          />
        </svg>
        <span className="text-color02">{formatDate(deal["End Date"])}</span>
      </div>

      {/* Deal resources */}
      <div className="flex items-start gap-5 mt-2">
        {/* icon */}
        <ConnectIcon />

        {deal.resources?.length > 0 ? (
          <div className="flex flex-wrap gap-3 mt-2">
            {deal.resources?.map((resource, resourceIndex) => {
              // Find the correct deal capacity for this resource
              const dealId = deal["Deal ID"];
              let dealCapacity = null;
              // Loop through each deal ID and capacity field in the resource data
              for (let i = 1; i <= 4; i++) {
                // Assuming you have up to 4 deals per resource
                if (resource[`Deal ID ${i}`] === dealId) {
                  dealCapacity = resource[`Deal Capacity ${i}(%)`];
                  break;
                }
              }
              return (
                <div key={resourceIndex} className="z-50 ">
                  <div className="  min-w-fit h-full max-h-4 text-[12px]">
                    <span
                      style={{
                        border: `1px solid ${getColor(
                          deal["Deal Stage"],
                          "border"
                        )}`,
                        borderRight: "none",
                      }}
                      className=" bg-white text-color01 px-1.5 font-medium border border-[#C29555] capitalize"
                    >
                      {resource.Resources}
                    </span>

                    <span className="  text-white px-1.5 bg-[#F08B17] font-medium border border-[#C29555] border-l-0">
                      {dealCapacity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className=" bg-white text-color01 px-1.5 font-medium border border-[#C29555] capitalize">
            No Resources
          </div>
        )}
      </div>

      {/* Deal comments */}
      <div className="pt-3">
        <AllDealComments dealId={deal["Deal ID"]} />
      </div>
    </div>
  );
}

export default DealPopoverContent;
