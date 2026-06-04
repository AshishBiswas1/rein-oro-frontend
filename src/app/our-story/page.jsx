"use client";
import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function OurStoryPage() {
 const storyRef = useRef(null);

 useEffect(() => {
  // 1. Reveal animation for narrative text and images
  gsap.fromTo(
   ".reveal-item",
   { opacity: 0, y: 40 },
   {
    opacity: 1,
    y: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: { trigger: storyRef.current, start: "top 75%" },
   },
  );

  // 2. Parallax effect on the editorial image
  gsap.to(".parallax-img", {
   yPercent: 20,
   ease: "none",
   scrollTrigger: {
    trigger: ".parallax-container",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
   },
  });
 }, []);

 return (
  <main className="bg-[#0A0A0A] min-h-screen text-[#F5EDD6]">
   <Navbar />

   {/* Hero Section with Cinematic Fixed Background */}
   <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
    {/* Replace src with your actual hero background image */}
    <div className="absolute inset-0 bg-[url('/images/story-hero-bg.jpg')] bg-cover bg-center bg-fixed opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/20 via-transparent to-[#0A0A0A]" />

    <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
     <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[11px] mb-8 block font-medium">
      Our Legacy
     </span>
     <h1 className="font-display text-[clamp(48px,8vw,84px)] leading-[1.05]">
      Purity Crowned <br />{" "}
      <span className="italic text-[#E8C97A]">in Gold.</span>
     </h1>
    </div>
   </section>

   {/* The Narrative Section: Asymmetrical & Sticky */}
   <section ref={storyRef} className="py-32 px-6 max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-[40%_1fr] gap-20 items-start">
     {/* Left Column: Sticky Title */}
     <div className="lg:sticky lg:top-32 space-y-8 reveal-item">
      <h2 className="font-display text-[clamp(40px,4vw,56px)] leading-[1.1] text-[#F5EDD6]">
       The Art of the <br />
       <span className="italic text-[#C9A84C]">Exceptional Snack</span>
      </h2>
      <div className="h-[1px] w-24 bg-[#C9A84C]/50" />
     </div>

     {/* Right Column: Scrolling Editorial Content */}
     <div className="space-y-24">
      <div className="reveal-item space-y-8">
       <p className="text-[#9A9485] text-[18px] leading-[2] font-ui font-light">
        Rein Oro was born from a simple observation: that the most sacred
        ingredients of Indian heritage had been relegated to the mundane. We
        looked at the Makhana—the ancient seed of the lotus—and saw not just a
        snack, but a masterpiece of nature.
       </p>

       {/* Editorial Parallax Image */}
       <div className="parallax-container relative h-[500px] w-full overflow-hidden border border-[#1C1A16]">
        {/* Ensure you have an image at public/images/story-1.png */}
        <div className="parallax-img absolute inset-[-20%] w-[140%] h-[140%]">
         <Image
          src="/images/story-1.png"
          alt="Makhana Harvesting"
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
         />
        </div>
       </div>
      </div>

      <div className="reveal-item space-y-8">
       <p className="text-[#9A9485] text-[18px] leading-[2] font-ui font-light">
        Our journey begins in the pristine water bodies of Bihar, where each
        seed is hand-selected. We do not just process; we curate. We slow-roast,
        we season with global flavors, and we refine, ensuring that every bite
        carries the weight of our promise: uncompromising luxury.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* Stats Section: Certificate of Authenticity Style */}
   <section className="py-24 border-y border-[#1C1A16] bg-gradient-to-b from-[#0c0c0c] to-[#0A0A0A]">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
     <StatCounter target={10000} label="Happy Customers" suffix="+" />
     <StatCounter target={50} label="Flavors Crafted" suffix="+" />
     <StatCounter target={100} label="Naturally Sourced" suffix="%" />
    </div>
   </section>
  </main>
 );
}

// Upgraded StatCounter with actual GSAP Number Animation
function StatCounter({ target, label, suffix = "" }) {
 const counterRef = useRef(null);

 useEffect(() => {
  const el = counterRef.current;

  gsap.fromTo(
   el,
   { innerText: 0 },
   {
    innerText: target,
    duration: 2.5,
    ease: "power2.out",
    snap: { innerText: 1 }, // Forces integers
    scrollTrigger: {
     trigger: el,
     start: "top 85%",
    },
    onUpdate: function () {
     // Format with commas and append suffix
     el.innerText =
      Math.ceil(this.targets()[0].innerText).toLocaleString() + suffix;
    },
   },
  );
 }, [target, suffix]);

 return (
  <div className="border-l border-[#C9A84C]/30 pl-8 flex flex-col justify-center">
   <div
    ref={counterRef}
    className="font-display text-[56px] text-[#F5EDD6] leading-none mb-3"
    suppressHydrationWarning
   >
    0
   </div>
   <div className="font-ui text-[11px] text-[#C9A84C] tracking-[0.3em] uppercase font-medium">
    {label}
   </div>
  </div>
 );
}
