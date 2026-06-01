"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Bestsellers() {
 const [canMountSwiper, setCanMountSwiper] = useState(false);

 // The 100ms delay ensures Next.js has completely finished restoring
 // the DOM and Flexbox bounds before Swiper attempts to measure the screen.
 useEffect(() => {
  const timer = setTimeout(() => {
   setCanMountSwiper(true);
  }, 100);

  return () => {
   clearTimeout(timer);
   setCanMountSwiper(false); // Resets when you leave the page
  };
 }, []);

 const carouselItems = [
  { id: 1, name: "Peri Peri Makhana", price: 249 },
  { id: 2, name: "Truffle & Parmesan", price: 349 },
  { id: 3, name: "Himalayan Salt", price: 229 },
  { id: 4, name: "Classic Roasted", price: 449 },
  { id: 5, name: "Smoked BBQ", price: 249 },
 ];

 return (
  // min-w-0 is the absolute key here to stop flexbox blowouts
  <section className="py-24 bg-rein-surface relative w-full min-w-0 max-w-full overflow-hidden block">
   <div className="max-w-7xl mx-auto px-6 mb-12">
    <span className="font-ui font-medium text-[11px] tracking-[0.4em] text-rein-gold-primary uppercase mb-2 block">
     Bestsellers
    </span>
    <h2 className="font-display font-bold text-4xl md:text-[52px] text-rein-cream">
     What Everyone&apos;s Ordering
    </h2>
   </div>

   <div className="relative w-full min-w-0 max-w-full overflow-hidden pl-6 md:pl-[calc((100vw-1280px)/2+24px)]">
    {canMountSwiper ? (
     <Swiper
      modules={[Autoplay]}
      spaceBetween={24}
      slidesPerView={1.2}
      grabCursor={true}
      loop={true}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      breakpoints={{
       640: { slidesPerView: 2.2 },
       1024: { slidesPerView: 3.5 },
      }}
      className="w-full"
     >
      {carouselItems.map((item, index) => (
       <SwiperSlide key={index}>
        <div className="group bg-rein-black border border-rein-gold-primary/10 rounded-sm overflow-hidden flex flex-col hover:border-rein-gold-primary/40 transition-colors h-full">
         <div className="aspect-square w-full bg-rein-charcoal flex items-center justify-center text-rein-gold-dim/20">
          [Image]
         </div>
         <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-display italic text-2xl text-rein-cream mb-4">
           {item.name}
          </h3>
          <div className="mt-auto flex justify-between items-center">
           <span className="font-accent text-xl text-rein-gold-primary">
            ₹{item.price}
           </span>
           <button className="text-rein-gold-primary font-ui text-xs uppercase tracking-widest border-b border-rein-gold-primary pb-1">
            Quick Add
           </button>
          </div>
         </div>
        </div>
       </SwiperSlide>
      ))}
     </Swiper>
    ) : (
     /* Invisible placeholder prevents layout jumping while waiting 100ms */
     <div className="flex gap-6 opacity-0 pointer-events-none w-full overflow-hidden">
      <div className="w-[80vw] sm:w-[40vw] lg:w-[25vw] aspect-square bg-rein-charcoal"></div>
      <div className="w-[80vw] sm:w-[40vw] lg:w-[25vw] aspect-square bg-rein-charcoal"></div>
     </div>
    )}
   </div>
  </section>
 );
}
