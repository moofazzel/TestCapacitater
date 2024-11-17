function StickyOwnerNames({ dataByDealOwners, dealHeight }) {
  return (
    <>
      {/* owner list sticky */}
      <div className="sticky left-0 z-40 ">
        {/* sticky owner list */}
        <div className="absolute left-0 z-40 w-10 text-center bg-slate-200">
          {dataByDealOwners.map((owner, index) => {
            // Handle height dynamically based on dataByDealOwners.length
            const ownerHeight =
              dataByDealOwners.length === 1
                ? 600
                : dataByDealOwners.length === 2
                ? 300
                : owner.deals.length * dealHeight + 20;

            return (
              <div
                key={index}
                style={{
                  height: ownerHeight > 200 ? `${ownerHeight}px` : "200px",
                }}
                className="relative py-10 border bg-slate-200 border-slate-400"
              >
                {/* Sticky owner name at the top of this section */}
                <div className="sticky top-[20vh] z-50 text-vertical w-fit p-1">
                  {owner.owner}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* owner list border */}
      <div className="absolute z-20 w-full text-center">
        {dataByDealOwners.map((owner, index) => {
          // Handle height dynamically based on dataByDealOwners.length
          const ownerHeight =
            dataByDealOwners.length === 1
              ? 600
              : dataByDealOwners.length === 2
              ? 300
              : owner.deals.length * dealHeight + 20;

          return (
            <div
              key={index}
              style={{
                height: ownerHeight > 200 ? `${ownerHeight}px` : "200px",
              }}
              className="w-full border-t border-b border-l-0 border-r-0 border-dashed text-vertical border-slate-400 "
            ></div>
          );
        })}
      </div>
    </>
  );
}

export default StickyOwnerNames;
