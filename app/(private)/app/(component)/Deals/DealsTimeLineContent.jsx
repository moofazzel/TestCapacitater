import AllDealItems, { widthPerWeek } from "./AllDealItems";
import DateAndMonth from "./DateAndMonth";
import DealsBorder from "./DealsBorder";
import TimelineGridLine from "./TimelineGridLine";

const DealsTimeLineContent = ({
  dataByDealOwners,
  dealHeight,
  allResources,
}) => {
  const totalOwnerHeight =
    dataByDealOwners.length <= 2
      ? 600
      : dataByDealOwners.reduce((totalHeight, owner) => {
          // 20 extra for padding
          const ownerHeight = owner.deals.length * dealHeight + 20;

          return totalHeight + (ownerHeight > 200 ? ownerHeight : 200);
        }, 0);

  return (
    <div className="relative w-max">
      {/* <div className="absolute top-0 left-0 w-full h-full ">
        <div className="sticky left-0 border-2 border-dashed w-fullf h-fullf bg-red-400f border-color5"></div>
      </div> */}

      <div style={{ height: `${totalOwnerHeight}px` }} className="flex w-max">
        {/* timeline grid line */}
        <TimelineGridLine
          widthPerWeek={widthPerWeek}
          dataByDealOwners={dataByDealOwners}
        />
        {/*all Deal items  */}
        <AllDealItems
          dataByDealOwners={dataByDealOwners}
          dealHeight={dealHeight}
          allResources={allResources}
        />

        {/* Deals Border */}
        <DealsBorder
          dealHeight={dealHeight}
          dataByDealOwners={dataByDealOwners}
        />
      </div>

      {/* date and month */}
      <DateAndMonth widthPerWeek={widthPerWeek} />
    </div>
  );
};

export default DealsTimeLineContent;
