const DealsBorder = ({ dataByDealOwners, dealHeight }) => {
  return (
    <div className="absolute w-full">
      {dataByDealOwners.map((owner, index) => {
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
            className="w-full border-b border-dashed border-color05"
          ></div>
        );
      })}
    </div>
  );
};

export default DealsBorder;
