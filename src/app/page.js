import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import FeaturedCollection from "../components/FeaturedCollection";
import BrandStory from "../components/BrandStory";
import Bestsellers from "../components/Bestsellers";
import Footer from "../components/Footer";

export default function Home() {
 return (
  // FIX 1: Prevent the overall page from ever scrolling horizontally
  <div className="relative min-h-screen bg-rein-black flex flex-col overflow-x-hidden">
   {/* Fixed Navigation */}
   <Navbar />

   {/* FIX 2: min-w-0 completely blocks flex-grow from expanding beyond the screen width */}
   <main className="flex-grow z-10 w-full min-w-0 flex flex-col">
    <Hero />
    <TrustBar />
    <FeaturedCollection />
    <BrandStory />
    <Bestsellers />
   </main>

   <Footer />
  </div>
 );
}
