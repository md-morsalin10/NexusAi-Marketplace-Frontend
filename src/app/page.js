import Blogs from "@/components/Blogs";
import Categories from "@/components/Categories";
import FAQ from "@/components/FAQ";
import FeaturesSection from "@/components/FeaturesSection";
import HeroBanner from "@/components/HeroBanner";
import Highlights from "@/components/Highlights";
import Newsletter from "@/components/Newsletter";
import OurServices from "@/components/OurServices";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";


export default function Home() {
  return (
    <div>
      <HeroBanner/>
      <StatsSection/>
      <FeaturesSection/>
      <Categories/>
      <OurServices/>
      <Highlights/>
      <Testimonials/>
      <Blogs/>
      <Newsletter/>
      <FAQ/>
    </div>
  );
}
