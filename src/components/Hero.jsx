"use client";
import { useEffect, useCallback } from "react";
import gsap from "gsap";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { ArrowDown } from "phosphor-react";

export default function Hero() {
 useEffect(() => {
  gsap.fromTo(
   ".hero-stack > *",
   { opacity: 0, y: 40 },
   {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.2,
   },
  );

  gsap.to(".scroll-arrow", {
   y: 10,
   repeat: -1,
   yoyo: true,
   ease: "power1.inOut",
   duration: 1.5,
  });
 }, []);

 const particlesInit = useCallback(async (engine) => {
  await loadSlim(engine);
 }, []);

 return (
  <section className="relative w-full h-screen flex items-center bg-rein-black overflow-hidden pt-20">
   <div className="absolute inset-0 z-0 opacity-40">
    <Particles
     id="tsparticles"
     init={particlesInit}
     options={{
      background: { color: { value: "transparent" } },
      particles: {
       color: { value: "#C9A84C" },
       number: { value: 60, density: { enable: true, area: 800 } },
       opacity: { value: 0.3 },
       size: { value: { min: 1, max: 3 } },
       move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        straight: false,
       },
       links: { enable: false },
      },
     }}
    />
   </div>

   <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 items-center relative z-10">
    <div className="hero-stack flex flex-col items-start space-y-6">
     <span className="font-ui font-medium text-[11px] tracking-[0.35em] text-rein-gold-primary uppercase">
      Crafted for the Discerning
     </span>
     <h1 className="font-display font-bold text-[clamp(48px,7vw,96px)] text-rein-cream leading-[1.1] tracking-[-0.02em]">
      The Gold Standard <br />
      <span className="italic text-rein-gold-light font-normal">
       of Healthy Snacking.
      </span>
     </h1>
     <p className="font-ui font-light text-[18px] text-rein-gray-light max-w-[480px] leading-[1.7]">
      Rein Oro brings you India's finest Makhana — roasted to perfection,
      seasoned with heritage, delivered to your door.
     </p>
     <div className="flex items-center space-x-8 pt-4">
      <button className="bg-gradient-to-br from-rein-gold-primary to-rein-gold-light text-rein-black font-ui font-semibold text-[14px] tracking-[0.2em] uppercase px-10 py-4 rounded-sm hover:shadow-[0_0_40px_rgba(201,168,76,0.35)] hover:-translate-y-[2px] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
       Explore Collection
      </button>
      <button className="font-ui font-normal text-[14px] text-rein-gray-light hover:text-rein-gold-primary transition-colors duration-300">
       Watch Our Story →
      </button>
     </div>
    </div>

    <div className="relative flex justify-center items-center">
     <div className="absolute w-[600px] h-[600px] bg-rein-gold-primary/10 blur-[120px] rounded-full pointer-events-none" />
     <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px] rounded-full p-[2px] bg-gradient-to-br from-rein-gold-primary to-rein-gold-dim animate-[float_6s_ease-in-out_infinite]">
      <div className="w-full h-full bg-rein-surface rounded-full overflow-hidden flex items-center justify-center">
       <div className="w-3/4 h-3/4 bg-rein-charcoal rounded-full border border-rein-gold-dim/20 flex items-center justify-center text-rein-gold-primary/50 text-sm font-ui">
        Product Image Placeholder
       </div>
      </div>
     </div>
    </div>
   </div>

   <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-60">
    <span className="font-ui text-[11px] text-rein-gray-light tracking-[0.2em] uppercase">
     Scroll to Discover
    </span>
    <ArrowDown size={20} className="text-rein-gold-primary scroll-arrow" />
   </div>
  </section>
 );
}
