import HeroBanner from "@/components/HeroBanner";
import Navbar from "@/components/Navbar";
import StatsSection from "@/components/StatsSection";


export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroBanner/>
      <StatsSection/>
    </div>
  );
}
