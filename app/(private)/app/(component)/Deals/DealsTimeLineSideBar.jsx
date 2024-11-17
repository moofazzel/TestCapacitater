const DealsTimeLineSideBar = ({ dataByDealOwners, dealHeight, children }) => {
  return (
    <>
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
          >
            <div className="  sticky top-0 px-2 py-2 text-[14px] xl:text-lg font-medium text-center border lg:py-6 lg:px-6 border-color5 text-color02 ">
              {owner.owner}
            </div>
          </div>
        );
      })}
      {children}
    </>
  );
};

export default DealsTimeLineSideBar;
