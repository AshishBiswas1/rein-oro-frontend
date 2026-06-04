"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BrandStory() {
 useEffect(() => {
  // FIX: Wrap GSAP in a context for proper React unmounting
  let ctx = gsap.context(() => {
   const counters = document.querySelectorAll(".stat-counter");
   counters.forEach((counter) => {
    gsap.fromTo(
     counter,
     { textContent: 0 },
     {
      textContent: counter.getAttribute("data-target"),
      duration: 2.5,
      ease: "power2.out",
      snap: { textContent: 1 },
      scrollTrigger: { trigger: ".brand-story", start: "top 70%" },
     },
    );
   });
  });

  // Cleanup function: destroys the ScrollTrigger when you navigate away
  return () => ctx.revert();
 }, []);

 return (
  <section className="brand-story py-16 sm:py-24 bg-rein-black border-y border-rein-gold-dim/10 w-full overflow-hidden">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
    <div className="relative h-[320px] sm:h-[420px] lg:h-[500px] flex items-center justify-center w-full">
     <div className="absolute w-[78%] h-[78%] bg-rein-surface border border-rein-gold-dim/20 -rotate-3 z-10 shadow-2xl flex items-center justify-center text-rein-gray-mid font-ui text-sm">
      [Brand Image 1]
     </div>
     <div className="absolute w-[70%] h-[75%] bg-rein-charcoal border border-rein-gold-primary/30 rotate-3 translate-x-6 sm:translate-x-12 translate-y-4 sm:translate-y-8 z-20 shadow-2xl flex items-center justify-center text-rein-gray-mid font-ui text-sm">
      [Brand Image 2]
     </div>
    </div>

    <div className="flex flex-col space-y-6 text-center lg:text-left">
     <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-[48px] text-rein-cream leading-tight">
      The Art of the <br /> Exceptional Snack.
     </h2>
     <div className="space-y-4 font-ui font-light text-[17px] text-rein-gray-light leading-[1.85]">
      <p>
       For centuries, the lotus seed has been revered in Indian heritage. At
       Rein Oro, we elevate this humble superfood into an unparalleled luxury
       experience.
      </p>
      <p>
       Sourced directly from the premier aquatic farms of Bihar, every single
       makhana is hand-graded for size and bloom. Only the top 2% make it into a
       Rein Oro package.
      </p>
      <p>
       Roasted entirely without oil and dusted with exquisite global spices, we
       guarantee a crunch that echoes and flavors that linger. This is not just
       a snack; it is a statement.
      </p>
     </div>

     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-rein-gold-dim/20 mt-8">
      <div>
       <div className="font-accent font-semibold text-[40px] text-rein-gold-primary flex items-center">
        <span className="stat-counter" data-target="10000">
         0
        </span>
        +
       </div>
       <div className="font-ui font-normal text-[14px] text-rein-gray-light">
        Happy Customers
       </div>
      </div>
      <div>
       <div className="font-accent font-semibold text-[40px] text-rein-gold-primary flex items-center">
        <span className="stat-counter" data-target="50">
         0
        </span>
        +
       </div>
       <div className="font-ui font-normal text-[14px] text-rein-gray-light">
        Flavors Crafted
       </div>
      </div>
      <div>
       <div className="font-accent font-semibold text-[40px] text-rein-gold-primary flex items-center">
        <span className="stat-counter" data-target="100">
         0
        </span>
        %
       </div>
       <div className="font-ui font-normal text-[14px] text-rein-gray-light">
        Naturally Sourced
       </div>
      </div>
     </div>
    </div>
   </div>
  </section>
 );
}
