import { auth } from "@/auth";
import Data from "@/components/Home/Data";
import Pricing from "@/components/Home/Pricing";
import TopSection from "@/components/Home/TopSection";
import Visualize from "@/components/Home/Visualize";

const HomePage = () => {
  return (
    <div>
      <TopSection />
      <Visualize />
      <Data />
      <Pricing />
    </div>
  );
};

export default HomePage;
