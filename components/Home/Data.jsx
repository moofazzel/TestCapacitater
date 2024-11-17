"use client";
import { RocknRoll_One } from "next/font/google";
import Image from "next/image";
import visualize from "../../public/assets/capacitater.png";
import sheet from "../../public/assets/sheet.png";
import tick from "../../public/assets/tick.png";

const rocknroll = RocknRoll_One({ subsets: ["latin"], weight: "400" });

const Data = () => {
  return (
    <section className="py-14 md:pb-28 container max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px] md:px-0">
      <div className="max-w-3xl mx-auto text-center ">
        <div
          className={`mb-3 text-[56px] font-bold text-gray-800 ${rocknroll.className} text-center`}
        >
          Integrated <span className="text-[#995C23] text-stroke">Data</span>
        </div>
        <style jsx>{`
          .text-stroke {
            color: white;
            -webkit-text-stroke: 5px #04bc04;
            text-shadow: 0px 0px 1px #995c23;
          }
        `}</style>
        <p className="mb-8 text-lg text-color02">
          No complicated setup. Bring your data down to a Google sheet and
          connect to our app! Still need help? We are happy to help with setup.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 mt-14 md:flex-row md:justify-center">
        <div className="w-[180px] md:w-[300px] flex flex-col items-center">
          <Image
            src={sheet}
            alt="Google sheet"
            layout="responsive"
            objectFit="contain"
          />
          <p className="mt-4 text-lg font-medium md:text-2xl text-color02">
            Google Sheet
          </p>
        </div>
        <div className="w-[80px] md:w-[368px] rotate-45 md:rotate-0">
          <Image
            src={tick}
            alt="Tick icon"
            layout="responsive"
            objectFit="contain"
          />
        </div>
        <div className="w-[300px] md:w-[716px] flex flex-col items-center">
          <Image
            src={visualize}
            alt="Data visualization"
            layout="responsive"
            objectFit="contain"
          />
          <p className="mt-4 text-lg font-medium md:text-2xl text-color02">
            Capacitater
          </p>
        </div>
      </div>
    </section>
  );
};

export default Data;
