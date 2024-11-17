"use client";

import { colors } from "../../app/(utils)";

const GridCalendarColorKey = () => {
  return (
    <div className="flex px-[15px] py-[6px] xl:py-[15px] gap-[10px] lg:gap-[10px] xl:gap-[20px] border custom-shadow border-color5 text-[10px] lg:text-[12px] 3xl:text-[16px] text-color02 ">
      {Object.entries(colors).map(([status, item]) => {
        return (
          <div
            key={status}
            // style={{ display: "flex", alignItems: "center", margin: "5px" }}
            className="flex items-center"
          >
            <span
              className="size-[16px] lg:size-[25px] xl:size-[30px] mr-[6px] lg:mr-[8px] xl:mr-[10px]"
              style={{
                backgroundColor: item.bgColor,
                border: `1px solid ${item.stroke}`,
              }}
            />
            <span>{status.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
          </div>
        );
      })}

      <button
        onClick={() => {
          alert("add color key will be here");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="30"
          viewBox="0 0 29 30"
          fill="none"
        >
          <rect
            x="0.4"
            y="0.4"
            width="28.2"
            height="29.2"
            fill="#E6F7E5"
            stroke="#04BC04"
            stroke-width="0.8"
          />
          <path
            d="M23.727 16.3636H15.8179V24.5454H13.1816V16.3636H5.27246V13.6363H13.1816V5.45453H15.8179V13.6363H23.727V16.3636Z"
            fill="#04BC04"
          />
        </svg>
      </button>
    </div>
  );
};

export default GridCalendarColorKey;
