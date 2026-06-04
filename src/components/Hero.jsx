"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Hero() {
 const container = useRef(null);
 const imageContainerRef = useRef(null);

 useEffect(() => {
  const ctx = gsap.context(() => {
   // Text and interface elements reveal sequence
   gsap.fromTo(
    ".hero-animate",
    { opacity: 0, y: 40 },
    {
     opacity: 1,
     y: 0,
     duration: 0.9,
     stagger: 0.12,
     ease: "power3.out",
     delay: 0.2,
    },
   );

   // Subtle ambient continuous float for the entire platform container
   gsap.to(imageContainerRef.current, {
    y: -15,
    duration: 4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
   });
  }, container);

  return () => ctx.revert();
 }, []);

 return (
  <section
   ref={container}
   className="relative h-screen w-full bg-[#0A0A0A] flex items-center px-6 overflow-hidden"
  >
   {/* Background Texture Overlay */}
   <div
    className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{ backgroundImage: "url(/noise.svg)" }}
   />

   {/* Radial Gold Glow */}
   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[rgba(201,168,76,0.04)] blur-[120px] rounded-full pointer-events-none" />

   <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
    <div className="hero-stack space-y-6">
     <span className="hero-animate block text-[#C9A84C] text-[11px] tracking-[0.35em] uppercase font-medium">
      CRAFTED FOR THE DISCERNING
     </span>
     <h1 className="hero-animate font-display text-[clamp(56px,7vw,96px)] leading-[0.9] text-[#F5EDD6]">
      The Gold Standard <br />
      <span className="italic text-[#E8C97A]">of Healthy Snacking.</span>
     </h1>
     <p className="hero-animate text-[#9A9485] text-lg max-w-[480px] leading-relaxed">
      Rein Oro brings you India's finest Makhana — roasted to perfection,
      seasoned with heritage, delivered to your door.
     </p>
     <div className="hero-animate flex items-center gap-8 pt-4">
      <button className="bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] px-10 py-4 font-ui font-semibold tracking-[0.2em] uppercase hover:shadow-[0_0_40px_rgba(201,168,76,0.35)] transition-all">
       Explore Collection
      </button>
      <a
       href="/about"
       className="text-[#9A9485] hover:text-[#C9A84C] transition-colors uppercase tracking-[0.1em] font-medium"
      >
       Watch Our Story →
      </a>
     </div>
    </div>

    {/* Floating Product Platform Area */}
    <div
     ref={imageContainerRef}
     className="hero-animate relative hidden md:flex items-center justify-center"
    >
     <div
      className="w-[460px] h-[460px] rounded-full border border-transparent bg-clip-padding p-[2px] overflow-hidden shadow-[0_0_60px_rgba(201,168,76,0.05)]"
      style={{
       background:
        "linear-gradient(#0A0A0A,#0A0A0A) padding-box, linear-gradient(135deg,#C9A84C,#8A6F32) border-box",
      }}
     >
      {/* Mask Wrapper matching the round gold border profile perfectly */}
      <div className="w-full h-full bg-[#1C1A16] rounded-full relative overflow-hidden flex items-center justify-center">
       <Image
        src="/images/hero_image.png"
        alt="Rein Oro Premium Roasted Gold Makhana"
        fill
        priority
        sizes="(max-w-768px) 100vw, 450px"
        className="object-cover scale-105"
       />
      </div>
     </div>
    </div>
   </div>
  </section>
 );
}
