"use client";

import Image from "next/image";

import { RocknRoll_One } from "next/font/google";
import visualize from "../../public/assets/visualize.png";

const rocknroll = RocknRoll_One({ subsets: ["latin"], weight: "400" });

const Visualize = () => {
  return (
    <section className="container max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px] flex flex-col items-center py-14 md:pb-28 md:px-0">
      <div className="max-w-2xl mx-auto ">
        <div
          className={`mb-3 text-[56px] font-bold text-gray-800 letter-spacing reduced-line-height ${rocknroll.className} text-center hidden md:block`}
        >
          Easy-To-<span className="text-[#995C23] text-stroke">Visualize</span>{" "}
        </div>
        <div
          className={`mb-3 text-[56px] font-bold text-gray-800 letter-spacing reduced-line-height ${rocknroll.className} text-center md:hidden`}
        >
          Easy <br />
          -To- <br />
          <span className="text-[#995C23] text-stroke">Visualize</span>{" "}
        </div>
        <style jsx>{`
          .text-stroke {
            color: white;
            -webkit-text-stroke: 5px #04bc04; /* Stroke width and color */
            text-shadow: 0px 0px 1px #995c23; /* Shadow to enhance the outline */
          }
          .letter-spacing {
            letter-spacing: -2px; /* Reduce spacing for all text */
          }
          .reduced-line-height {
            line-height: 1.2;
          }
        `}</style>
        <p className="text-lg text-center text-color02">
          Our platform helps leaders make important decisions by providing
          easy-to-digest visualizations of resource assignments.
        </p>
      </div>
      <div className="w-full px-0 mt-6 md:mt-10 shadow-dark-gray">
        <Image src={visualize} alt="" className="w-full"></Image>
      </div>
    </section>
  );
};

export default Visualize;
