"use client";

import backgroundSVG from "@/public/assets/nameBg.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Image from "next/image";

const DealsTimeLineSideBar = ({ dataByDealOwners, dealHeight, children }) => {
  return (
    <>
      {dataByDealOwners.map((owner, index) => {
        const ownerHeight =
          dataByDealOwners.length === 1
            ? 600
            : dataByDealOwners.length === 2
            ? 300
            : owner.deals.length * dealHeight + 20;

        // Truncate long owner names
        const truncatedName =
          owner.owner.length > 12
            ? `${owner.owner.split(" ")[0]} ${owner.owner
                .split(" ")[1]
                ?.slice(0, 4)}..`
            : owner.owner;

        return (
          <div
            key={index}
            className="relative"
            style={{
              height: ownerHeight > 200 ? `${ownerHeight}px` : "200px",
            }}
          >
            <Popover key={index} backdrop="opaque" placement="right">
              <PopoverTrigger>
                <div
                  className="absolute left-0 top-0 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap px-6 py-5 text-lg font-medium text-color02 bg-white border border-color5 cursor-pointer"
                  style={{
                    transformOrigin: "center center",
                    transform: "translate(-50%, -50%) rotate(-90deg)",
                    left: "50%",
                    top: "50%",
                  }}
                >
                  {truncatedName}
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 bg-transparent border-none rounded-none"
                style={{
                  padding: 0,
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: 0,
                }}
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: "213px",
                    height: "54px",
                  }}
                >
                  {/* Set the background image for the entire popup */}
                  <Image
                    src={backgroundSVG}
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    className="absolute top-0 left-0 w-full h-full"
                  />
                  <div className="relative z-10 p-4">
                    <p className="font-medium text-lg">{owner.owner}</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      })}
      {children}
    </>
  );
};

export default DealsTimeLineSideBar;

// const DealsTimeLineSideBar = ({ dataByDealOwners, dealHeight, children }) => {
//   return (
//     <>
//       {dataByDealOwners.map((owner, index) => {
//         // Handle height dynamically based on dataByDealOwners.length
//         const ownerHeight =
//           dataByDealOwners.length === 1
//             ? 600
//             : dataByDealOwners.length === 2
//             ? 300
//             : owner.deals.length * dealHeight + 20;
//         return (
//           <div
//             key={index}
//             style={{
//               height: ownerHeight > 200 ? `${ownerHeight}px` : "200px",
//             }}
//           >
//             <div className="  sticky top-0 px-2 py-2 text-[11px] lg:text-[13px] xl:text-lg font-medium text-center border lg:py-3 lg:px-3 xl:py-6 xl:px-6 border-color5 text-color02 ">
//               {owner.owner}
//             </div>
//           </div>
//         );
//       })}
//       {children}
//     </>
//   );
// };

// export default DealsTimeLineSideBar;
