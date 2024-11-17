import { RocknRoll_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { pricingData } from "@/PricingData";
import PriceActionButton from "./PriceActionButton";

const rocknroll = RocknRoll_One({ subsets: ["latin"], weight: "400" });

const Pricing = () => {
  return (
    <section className="py-14 container max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px] md:px-0">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className={`mb-3 text-[56px] font-bold text-gray-800 ${rocknroll.className} text-center`}
        >
          <span className="font-medium">Simple</span>{" "}
          <span
            style={{
              color: "white",
              WebkitTextStroke: "5px #04bc04",
              textShadow: "0px 0px 1px #995c23",
            }}
          >
            Pricing
          </span>
        </div>

        <p className="mb-8 text-lg text-color02">
          Choose the plan that{"'"}s best for you!
          <br />
          Need something different?{" "}
          <Link href="/contact">
            <span className="font-semibold text-color5">Contact us!</span>
          </Link>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-w-full px-0 lg:flex-row">
        {pricingData.map((plan) =>
          plan.index === 3 ? (
            <Link href="/contact" key={plan.index}>
              <div
                className={`p-11 md:w-[449px] md:h-[581px] flex items-center justify-center flex-col shadow-dark-gray m-4 price-box group transition-all duration-500 cursor-pointer ${
                  plan.index % 2 === 0
                    ? "mt-[40px] lg:-mt-[80px]"
                    : "mt-[40px] lg:mt-[150px]"
                }`}
              >
                <div>
                  <Image
                    src={plan.img}
                    alt={`${plan.title} image`}
                    className="mb-[30px] w-full"
                  />
                </div>
                <button className="px-12 py-3 text-2xl font-semibold text-white mb-[10px] bg-color01">
                  <p>{plan.title}</p>
                </button>
                <p className="text-xl font-normal text-[#1E1E1E] text-center">
                  {plan.text}
                </p>
                <p className="text-lg font-normal text-[#1E1E1E] text-center">
                  {plan?.subText}
                </p>
              </div>
            </Link>
          ) : (
            <div
              key={plan.index}
              className={`p-11 md:w-[449px] md:h-[581px] flex items-center justify-center flex-col shadow-dark-gray m-4 price-box group transition-all duration-500  ${
                plan.index % 2 === 0
                  ? "mt-[40px] lg:-mt-[80px]"
                  : "mt-[40px] lg:mt-[150px]"
              }`}
            >
              <div>
                <Image
                  src={plan.img}
                  alt={`${plan.title} image`}
                  className="mb-[30px] w-full"
                />
              </div>
              <PriceActionButton title={plan.title} priceId={plan.priceId} />

              <p className="text-3xl font-semibold text-[#995C23] my-2">
                ${plan?.price}/month
              </p>
              <p className="text-xl font-normal text-[#1E1E1E] text-center">
                {plan.text}
              </p>
              <p className="text-lg font-normal text-[#1E1E1E] text-center">
                {plan?.subText}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Pricing;
