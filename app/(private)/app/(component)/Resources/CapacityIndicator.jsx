import { darken, lighten } from "polished";
import PointerShapes from "./PointerShapes";

const CapacityIndicator = ({ startX, width, usedCapacity, periodIndex }) => {
  const barStyle =
    usedCapacity <= 85
      ? "yellow"
      : usedCapacity > 85 && usedCapacity <= 100
      ? "green"
      : usedCapacity > 100
      ? "red"
      : "";
  return (
    <div
      title={usedCapacity}
      style={{
        position: "absolute",
        left: `${periodIndex === 0 ? startX + 50 : startX}px`,
        width: `${width}px`,
        zIndex: `${usedCapacity > 100 ? "50" : null}`,
      }}
      className={` flex items-center justify-start my-2 relative `}
    >
      <>
        <div
          style={{
            border: `1px solid ${barStyle}`,
            backgroundColor: lighten(0.15, barStyle),
          }}
          className="z-[45]  border  py-[2px] px-1 relative"
        >
          {/* pointer shapes */}
          <PointerShapes color={barStyle} usedCapacity={usedCapacity} />
          <span
            style={{
              border: `1px solid ${darken(0.05, barStyle)}`,
              //   backgroundColor: barStyle,
            }}
            className="px-1 text-[10px] font-normal text-black"
          >
            {usedCapacity}%
          </span>
        </div>
        {/* Progress bar */}
        <div
          style={{
            backgroundColor: usedCapacity === 0 ? "transparent" : barStyle,
            border: `1px solid ${barStyle}`,
          }}
          className="w-full h-[10px]  absolute z-40"
        ></div>
      </>
    </div>
  );
};

export default CapacityIndicator;
