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
   className="relative min-h-[80vh] md:min-h-screen w-full bg-rein-black flex items-center px-4 sm:px-6 py-16 md:py-24 overflow-hidden"
  >
   {/* Background Texture Overlay */}
   <div
    className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{ backgroundImage: "url(/noise.svg)" }}
   />

   {/* Radial Gold Glow */}
   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] bg-rein-gold-primary/[0.04] blur-[120px] rounded-full pointer-events-none" />

   <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 lg:gap-12 items-center">
    <div className="hero-stack space-y-5 sm:space-y-6 text-center md:text-left items-center md:items-start flex flex-col">
     <span className="hero-animate block text-rein-gold-primary text-[11px] tracking-[0.35em] uppercase font-medium">
      CRAFTED FOR THE DISCERNING
     </span>
     <h1 className="hero-animate font-display text-[clamp(28px,8vw,72px)] md:text-[clamp(56px,7vw,96px)] leading-tight md:leading-[0.95] text-rein-cream">
      The Gold Standard <br />
      <span className="italic text-rein-gold-light">of Healthy Snacking.</span>
     </h1>
     <p className="hero-animate text-rein-gray-light text-sm sm:text-base max-w-[90%] md:max-w-[480px] leading-relaxed">
      Rein Oro brings you India's finest Makhana — roasted to perfection,
      seasoned with heritage, delivered to your door.
     </p>
     <div className="hero-animate flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-2 sm:pt-4 w-full sm:w-auto">
      <button className="bg-gradient-to-br from-rein-gold-primary to-rein-gold-light text-rein-black px-6 sm:px-10 py-3 sm:py-4 font-ui font-semibold tracking-[0.2em] uppercase hover:shadow-[0_0_40px_rgba(201,168,76,0.35)] transition-all">
       Explore Collection
      </button>
      <a
       href="/about"
       className="text-rein-gray-light hover:text-rein-gold-primary transition-colors uppercase tracking-[0.1em] font-medium"
      >
       Watch Our Story →
      </a>
     </div>
    </div>

    {/* Floating Product Platform Area */}
    {/* Mobile product preview (visible only on small screens) */}
    <div className="hero-animate md:hidden w-full flex justify-center mt-8">
     <div className="w-[220px] h-[220px] rounded-full overflow-hidden border border-rein-gold-primary/10">
      <Image
       src="/images/hero_image.png"
       alt="Rein Oro Premium Roasted Gold Makhana"
       width={220}
       height={220}
       className="object-cover"
       sizes="100vw"
      />
     </div>
    </div>
    <div
     ref={imageContainerRef}
     className="hero-animate relative hidden md:flex items-center justify-center mt-8 md:mt-0"
    >
     <div
      className="w-[320px] h-[320px] lg:w-[460px] lg:h-[460px] rounded-full border border-transparent bg-clip-padding p-[2px] overflow-hidden shadow-[0_0_60px_rgba(201,168,76,0.05)]"
      style={{
       background:
        "linear-gradient(#0A0A0A,#0A0A0A) padding-box, linear-gradient(135deg,#C9A84C,#8A6F32) border-box",
      }}
     >
      {/* Mask Wrapper matching the round gold border profile perfectly */}
      <div className="w-full h-full bg-rein-surface rounded-full relative overflow-hidden flex items-center justify-center">
       <Image
        src="/images/hero_image.png"
        alt="Rein Oro Premium Roasted Gold Makhana"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 450px"
        className="object-cover scale-105"
       />
      </div>
     </div>
    </div>
   </div>
  </section>
 );
}
