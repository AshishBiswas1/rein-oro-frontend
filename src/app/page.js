"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, Star } from "phosphor-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Shared Components (Assuming you have these built based on your spec)
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
 const heroRef = useRef(null);
 const heroStackRef = useRef(null);
 const featuresRef = useRef(null);
 const storyRef = useRef(null);
 const giftRef = useRef(null);

 useGSAP(() => {
  // 02. HERO ANIMATIONS
  const tl = gsap.timeline();
  tl.fromTo(
   ".hero-element",
   { y: 40, opacity: 0 },
   {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.2,
   },
  );

  // 04. FEATURED COLLECTION SCROLL REVEAL
  gsap.fromTo(
   ".featured-card",
   { opacity: 0, y: 60 },
   {
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
     trigger: featuresRef.current,
     start: "top 80%",
    },
   },
  );

  // 05. BRAND STORY COUNTERS
  const counters = gsap.utils.toArray(".stat-counter");
  counters.forEach((counter) => {
   const target = parseInt(counter.getAttribute("data-target"), 10);
   gsap.to(counter, {
    innerHTML: target,
    duration: 2,
    snap: { innerHTML: 1 },
    scrollTrigger: {
     trigger: storyRef.current,
     start: "top 75%",
    },
    onUpdate: function () {
     counter.innerHTML =
      Math.ceil(this.targets()[0].innerHTML) + (counter.dataset.suffix || "");
    },
   });
  });

  // 08. GIFTING PARALLAX & REVEAL
  gsap.fromTo(
   ".gift-content",
   { opacity: 0, y: 30 },
   {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
     trigger: giftRef.current,
     start: "top 60%",
    },
   },
  );
 }, []);

 return (
  <main
   className="bg-rein-black min-h-screen text-rein-cream overflow-hidden"
   suppressHydrationWarning
  >
   {/* SECTION 01: Navbar */}
   <Navbar />

   {/* SECTION 02: HERO */}
   <section
    ref={heroRef}
    className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden"
   >
    {/* Particle Overlay Background (Simulated via CSS/radial here, integrate particles.js if preferred) */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rein-gold-primary/5 via-rein-black/0 to-rein-black" />

    <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-[55%_45%] gap-12 items-center relative z-10">
     {/* Left Stack */}
     <div ref={heroStackRef} className="flex flex-col items-start space-y-6">
      <span className="hero-element font-ui font-medium text-[11px] tracking-[0.35em] text-rein-gold-primary uppercase">
       Crafted For The Discerning
      </span>
      <h1 className="hero-element font-display font-bold text-[clamp(56px,7vw,96px)] leading-[1.05]">
       <span className="text-rein-cream block">The Gold Standard</span>
       <span className="text-rein-gold-light italic font-normal block">
        of Healthy Snacking.
       </span>
      </h1>
      <p className="hero-element font-ui font-light text-[18px] text-rein-gray-light max-w-[480px] leading-relaxed">
       Rein Oro brings you India's finest Makhana — roasted to perfection,
       seasoned with heritage, delivered to your door.
      </p>

      <div className="hero-element flex items-center gap-8 pt-4">
       <Link
        href="/shop"
        className="bg-gradient-to-br from-rein-gold-primary to-rein-gold-light text-rein-black font-ui font-semibold text-[14px] tracking-[0.2em] uppercase px-10 py-4 rounded-sm hover:shadow-[0_0_40px_rgba(201,168,76,0.35)] hover:-translate-y-[2px] transition-all duration-300"
        suppressHydrationWarning
       >
        Explore Collection
       </Link>
       <Link
        href="/our-story"
        className="font-ui text-[14px] text-rein-gray-light hover:text-rein-gold-primary transition-colors group flex items-center gap-2"
        suppressHydrationWarning
       >
        Watch Our Story{" "}
        <span className="group-hover:translate-x-1 transition-transform">
         →
        </span>
       </Link>
      </div>
     </div>

     {/* Right Product Podium */}
     <div className="hero-element relative flex justify-center items-center">
      <div className="absolute w-[600px] h-[600px] bg-rein-gold-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full p-[2px] bg-gradient-to-br from-rein-gold-primary to-rein-gold-dim animate-float relative shadow-[0_0_80px_rgba(201,168,76,0.15)]">
       <div className="w-full h-full bg-rein-surface rounded-full overflow-hidden relative border-[4px] border-rein-surface">
        <Image
         src="/images/hero_image.png"
         alt="Premium Makhana"
         fill
         className="object-cover"
         priority
        />
       </div>
      </div>
     </div>
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-rein-gray-light opacity-60">
     <span className="font-ui text-[10px] uppercase tracking-[0.2em]">
      Scroll to Discover
     </span>
     <ArrowDown size={16} className="animate-bounce text-rein-gold-primary" />
    </div>
   </section>

   {/* SECTION 03: TRUST BAR */}
   <div className="w-full bg-rein-surface border-y border-rein-gold-primary/20 overflow-hidden py-4">
    <div className="flex w-[200%] animate-marquee">
     <div className="flex-1 flex justify-around items-center font-ui font-medium text-[13px] tracking-[0.2em] uppercase text-rein-gray-light">
      <span>✦ 100% Natural</span>
      <span>✦ No Preservatives</span>
      <span>✦ Cold-Pressed Oils</span>
      <span>✦ Premium Grade A Makhana</span>
      <span>✦ Lab Certified</span>
      <span>✦ Free Shipping on ₹599+</span>
     </div>
     {/* Duplicate for seamless infinite scroll */}
     <div className="flex-1 flex justify-around items-center font-ui font-medium text-[13px] tracking-[0.2em] uppercase text-[#9A9485]">
      <span>✦ 100% Natural</span>
      <span>✦ No Preservatives</span>
      <span>✦ Cold-Pressed Oils</span>
      <span>✦ Premium Grade A Makhana</span>
      <span>✦ Lab Certified</span>
      <span>✦ Free Shipping on ₹599+</span>
     </div>
    </div>
   </div>

   {/* SECTION 04: FEATURED COLLECTION */}
   <section
    ref={featuresRef}
    className="py-20 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto"
   >
    <div className="text-center mb-10 sm:mb-16">
     <span className="text-[#C9A84C] font-ui font-medium text-[11px] tracking-[0.4em] uppercase mb-4 block">
      Our Collection
     </span>
     <h2 className="font-display font-bold text-[32px] sm:text-[42px] md:text-[52px] text-[#F5EDD6]">
      Flavors Worthy of the Crown
     </h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
     {/* Card 1 */}
     <div className="featured-card h-full">
      <ProductCard
       product={{
        id: 1,
        slug: "himalayan-pink-salt",
        name: "Himalayan Pink Salt",
        price: 249,
        weight: "90g",
        rating: 5,
        images: ["/images/makhana-salt.jpg"],
       }}
      />
     </div>

     {/* Card 2 */}
     <div className="featured-card h-full">
      <ProductCard
       product={{
        id: 2,
        slug: "peri-peri-gold",
        name: "Peri Peri Gold",
        price: 299,
        weight: "90g",
        rating: 5,
        images: ["/images/makhana-peri.jpg"],
       }}
      />
     </div>

     {/* Card 3 */}
     <div className="featured-card h-full">
      <ProductCard
       product={{
        id: 3,
        slug: "truffle-zest",
        name: "Truffle Zest",
        price: 350,
        weight: "90g",
        rating: 5,
        images: ["/images/makhana-truffle.jpg"],
       }}
      />
     </div>

     {/* Card 4 */}
     <div className="featured-card h-full">
      <ProductCard
       product={{
        id: 4,
        slug: "classic-salted",
        name: "Classic Salted",
        price: 220,
        weight: "90g",
        rating: 4,
        images: ["/images/classic-salted.jpg"],
       }}
      />
     </div>
    </div>

    <div className="mt-16 text-center">
     <Link
      href="/shop"
      className="font-ui font-medium text-[12px] sm:text-[13px] tracking-[0.2em] uppercase text-[#C9A84C] hover:border-b hover:border-[#C9A84C] pb-1 transition-all"
      suppressHydrationWarning
     >
      View All Products →
     </Link>
    </div>
   </section>

   {/* SECTION 05: BRAND STORY */}
   <section
    ref={storyRef}
    className="py-24 px-6 bg-[#111] border-y border-[#C9A84C]/10"
   >
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
     {/* Editorial Image Stack */}
     <div className="relative h-[600px] w-full hidden md:block">
      {/* First Story Image Frame (Harvest) */}
      <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-[#1C1A16] rotate-[-3deg] border border-[#C9A84C]/20 rounded-sm overflow-hidden z-10 shadow-2xl">
       <Image
        src="/images/story-1.png"
        alt="Harvest"
        fill
        sizes="(max-width: 768px) 100vw, 50vw" // <-- Prevents the performance warning
        className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
       />
      </div>

      {/* Second Story Image Frame (Roasting) */}
      <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-[#0A0A0A] rotate-[3deg] border border-[#C9A84C]/30 rounded-sm overflow-hidden z-20 shadow-2xl">
       <Image
        src="/images/story-2.png"
        alt="Roasting"
        fill
        sizes="(max-width: 768px) 100vw, 50vw" // <-- Prevents the performance warning
        className="object-cover"
       />
      </div>
     </div>

     {/* Text Block */}
     <div className="space-y-8">
      <h2 className="font-display font-bold text-[48px] leading-tight text-[#F5EDD6]">
       The Art of the <br />
       <span className="italic text-[#E8C97A]">Exceptional Snack.</span>
      </h2>
      <div className="font-ui font-light text-[17px] text-[#9A9485] leading-[1.85] space-y-6">
       <p>
        Makhana is more than a seed; it is a legacy of wellness. Sourced
        exclusively from the pristine, mineral-rich wetlands of Bihar, our
        master curators hand-select only the largest, most flawless pops.
       </p>
       <p>
        We honor this ancient superfood through slow, methodical
        ghee-roasting—never frying—ensuring a transcendent crunch that shatters
        perfectly on the palate.
       </p>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#C9A84C]/20">
       <div>
        <div
         className="font-accent font-semibold text-[32px] md:text-[48px] text-[#C9A84C] stat-counter"
         data-target="10000"
         data-suffix="+"
         suppressHydrationWarning
        >
         0
        </div>
        <div className="font-ui text-[12px] md:text-[14px] text-[#9A9485]">
         Happy Customers
        </div>
       </div>
       <div>
        <div
         className="font-accent font-semibold text-[32px] md:text-[48px] text-[#C9A84C] stat-counter"
         data-target="12"
         data-suffix="+"
         suppressHydrationWarning
        >
         0
        </div>
        <div className="font-ui text-[12px] md:text-[14px] text-[#9A9485]">
         Signature Flavors
        </div>
       </div>
       <div>
        <div
         className="font-accent font-semibold text-[32px] md:text-[48px] text-[#C9A84C] stat-counter"
         data-target="100"
         data-suffix="%"
        >
         0
        </div>
        <div className="font-ui text-[12px] md:text-[14px] text-[#9A9485]">
         Naturally Sourced
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* SECTION 06: BESTSELLERS SWIPER */}
   <section className="py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto mb-10 sm:mb-16 flex flex-col items-center text-center">
     <span className="text-[#C9A84C] font-ui font-medium text-[11px] tracking-[0.4em] uppercase mb-4 block">
      Bestsellers
     </span>
     <h2 className="font-display font-bold text-[32px] sm:text-[42px] md:text-[52px] text-[#F5EDD6]">
      What Everyone's Ordering
     </h2>
    </div>

    <div className="max-w-[1400px] mx-auto px-0 sm:px-6 cursor-grab active:cursor-grabbing">
     <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={16}
      slidesPerView={1.05}
      navigation={true}
      breakpoints={{
       640: { slidesPerView: 2.1, spaceBetween: 20 },
       1024: { slidesPerView: 3.2, spaceBetween: 24 },
       1280: { slidesPerView: 3.5, spaceBetween: 24 },
      }}
      loop={true}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      pagination={{ clickable: true, dynamicBullets: true }}
      className="pb-12 sm:pb-16 product-swiper"
     >
      {/* Card 1 */}
      <SwiperSlide>
       <div className="h-full">
        <ProductCard
         product={{
          id: 1,
          slug: "peri-peri-gold",
          name: "Peri Peri Gold",
          price: 299,
          weight: "90g",
          rating: 5,
          images: ["/images/peri-peri-gold.jpg"],
         }}
        />
       </div>
      </SwiperSlide>

      {/* Card 2 */}
      <SwiperSlide>
       <div className="pointer-events-none h-full">
        <ProductCard
         product={{
          id: 2,
          slug: "himalayan-pink-salt",
          name: "Himalayan Pink Salt",
          price: 249,
          weight: "90g",
          rating: 5,
          images: ["/images/makhana-salt.jpg"],
         }}
        />
       </div>
      </SwiperSlide>

      {/* Card 3 */}
      <SwiperSlide>
       <div className="pointer-events-none h-full">
        <ProductCard
         product={{
          id: 3,
          slug: "classic-salted",
          name: "Classic Salted",
          price: 220,
          weight: "90g",
          rating: 4,
          images: ["/images/classic-salted.jpg"],
         }}
        />
       </div>
      </SwiperSlide>

      {/* Card 4 */}
      <SwiperSlide>
       <div className="pointer-events-none h-full">
        <ProductCard
         product={{
          id: 4,
          slug: "truffle-zest",
          name: "Truffle Zest",
          price: 350,
          weight: "90g",
          rating: 5,
          images: ["/images/truffle-zest.jpg"],
         }}
        />
       </div>
      </SwiperSlide>

      {/* Card 5 */}
      <SwiperSlide>
       <div className="pointer-events-none h-full">
        <ProductCard
         product={{
          id: 5,
          slug: "cheesy-jalapeno",
          name: "Cheesy Jalapeño",
          price: 275,
          weight: "90g",
          rating: 4,
          images: ["/images/cheesy-jalapeno.jpg"],
         }}
        />
       </div>
      </SwiperSlide>
     </Swiper>
    </div>
   </section>

   {/* SECTION 07: UGC / TESTIMONIALS */}
   <section className="py-24 bg-[#0E0E0E]">
    <div className="max-w-7xl mx-auto px-6">
     <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {/* Map 6-8 testimonials here. Example Single Card: */}
      <div className="bg-[#141414] border-l-[3px] border-[#C9A84C] p-7 break-inside-avoid shadow-lg">
       <div className="flex gap-1 text-[#C9A84C] mb-4">
        {[...Array(5)].map((_, i) => (
         <Star key={i} weight="fill" size={14} />
        ))}
       </div>
       <p className="font-display italic text-[18px] text-[#F5EDD6] mb-6">
        "Absolutely transcendent. The crunch is unlike any other brand, and the
        truffle flavor is perfectly balanced without being overwhelming. A
        staple in my pantry."
       </p>
       <div>
        <p className="font-ui font-semibold text-[13px] tracking-[0.15em] uppercase text-[#C9A84C]">
         Aisha Sharma
        </p>
        <p className="font-ui font-light text-[13px] text-[#9A9485]">
         Mumbai, IN
        </p>
       </div>
      </div>
      {/* Add more cards for masonry effect */}
     </div>
    </div>
   </section>

   {/* SECTION 08: GIFTING CTA */}
   <section
    ref={giftRef}
    className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden"
   >
    {/* Parallax Background */}
    <div
     className="absolute inset-0 bg-cover bg-right lg:bg-center bg-fixed z-0"
     style={{ backgroundImage: "url('/images/gift-bg.png')" }}
    />
    <div className="absolute inset-0 bg-[#0A0A0A]/80 z-10 backdrop-blur-[2px]" />

    <div className="gift-content relative z-20 max-w-2xl px-6 flex flex-col items-center">
     <span className="font-ui font-medium text-[11px] tracking-[0.4em] uppercase text-[#C9A84C] mb-6">
      Gift Rein Oro
     </span>
     <h2 className="font-display font-bold text-[48px] md:text-[64px] leading-tight text-[#F5EDD6] italic mb-6">
      When Ordinary Gifts Won't Do.
     </h2>
     <p className="font-ui font-light text-[18px] text-[#9A9485] mb-10">
      Handcrafted gift hampers. Premium velvet-touch packaging. Guaranteed
      Pan-India luxury delivery.
     </p>
     <Link
      href="/gifting"
      className="bg-[#C9A84C] text-[#0A0A0A] font-ui font-semibold text-[14px] tracking-[0.2em] uppercase px-10 py-4 rounded-sm hover:bg-[#E8C97A] transition-colors shadow-[0_0_30px_rgba(201,168,76,0.3)]"
      suppressHydrationWarning
     >
      Build Your Gift Box
     </Link>
    </div>
   </section>

   {/* SECTION 09: FOOTER */}
   <Footer />
  </main>
 );
}
