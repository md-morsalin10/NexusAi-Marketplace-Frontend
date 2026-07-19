import Categories from "@/components/Categories";
import FeaturesSection from "@/components/FeaturesSection";
import HeroBanner from "@/components/HeroBanner";
import Highlights from "@/components/Highlights";
import Navbar from "@/components/Navbar";
import OurServices from "@/components/OurServices";
import StatsSection from "@/components/StatsSection";


export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroBanner/>
      <StatsSection/>
      <FeaturesSection/>
      <Categories/>
      <OurServices/>
      <Highlights/>
    </div>
  );
}
