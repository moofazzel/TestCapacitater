"use client";

import { RocknRoll_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import hero from "../../public/assets/hero.png";

const rocknroll = RocknRoll_One({ subsets: ["latin"], weight: "400" });

const TopSection = () => {
  return (
    <section className="container max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px] flex flex-col items-center justify-center gap-10 py-14 md:py-28 md:flex-row lg:gap-20 md:px-0">
      <div className="flex-1 text-center md:text-left">
        <div
          className={`mb-3 text-[64px] font-bold text-gray-800 letter-spacing reduced-line-height ${rocknroll.className}`}
        >
          <span className="text-[#995C23] text-stroke">Simplified</span>{" "}
          Capacity
          <br />
          Planning
        </div>
        <style jsx>{`
          .text-stroke {
            color: white;
            -webkit-text-stroke: 5px #995c23;
            text-shadow: 0px 0px 2px #995c23;
          }
          .letter-spacing {
            letter-spacing: -5px;
          }
          .reduced-line-height {
            line-height: 1.2;
          }
        `}</style>

        <p className="mb-8 text-lg text-center text-color02 md:text-left">
          CapaciTater saves you time by providing a better way to observe your
          team assignments.
          <br />
          Understanding your team allocations leads to better decision making --
          saving you time and money.
        </p>
        <div className="flex justify-center md:justify-start">
          <Link
            href="/"
            className="inline-block py-4 text-lg font-medium text-white px-9 bg-color5"
          >
            Get Started
          </Link>
        </div>
      </div>
      <div className="flex justify-center flex-1 mt-20 md:mt-0">
        <Image src={hero} alt="" width={555} height={518} />
      </div>
    </section>
  );
};

export default TopSection;
