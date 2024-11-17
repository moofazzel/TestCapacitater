import Pricing from "@/components/Home/Pricing";
import { checkSubscriptionStatus } from "@/utils/checkSubscriptionStatus";

export default async function SubscriptionNotice() {
  const { status, message } = await checkSubscriptionStatus();

  return (
    <section className="container ">
      <h1
        className={` ${
          status ? " text-color5 h-[40vh]" : "text-red-600 "
        } text-4xl font-bold text-center`}
      >
        {message}
      </h1>

      {!status && (
        <>
          <h3 className="mt-5 text-2xl font-bold text-center">
            Please upgrade your subscription to continue using CapaciTater
          </h3>
          <Pricing />
        </>
      )}
    </section>
  );
}
