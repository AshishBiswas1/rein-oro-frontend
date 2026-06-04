"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { EnvelopeSimple, Buildings, Gift, UsersThree } from "phosphor-react";

export default function GiftingPage() {
 const containerRef = useRef(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isSuccess, setIsSuccess] = useState(false);

 const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  company: "",
  occasion: "",
  quantity: "",
  message: "",
 });

 // Elegant GSAP Entrance Animations
 useGSAP(
  () => {
   const tl = gsap.timeline();

   tl
    .fromTo(
     ".gifting-hero-text",
     { y: 50, opacity: 0 },
     { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
    )
    .fromTo(
     ".gifting-image",
     { scale: 1.05, opacity: 0 },
     { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" },
     "-=0.5",
    )
    .fromTo(
     ".gifting-card",
     { y: 30, opacity: 0 },
     { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" },
     "-=1",
    );
  },
  { scope: containerRef },
 );

 const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Simulate API Call to your backend (e.g., Resend to send you an email)
  setTimeout(() => {
   setIsSubmitting(false);
   setIsSuccess(true);
   setFormData({
    name: "",
    email: "",
    phone: "",
    company: "",
    occasion: "",
    quantity: "",
    message: "",
   });

   // Reset success message after 5 seconds
   setTimeout(() => setIsSuccess(false), 5000);
  }, 1500);
 };

 const giftingTiers = [
  {
   icon: Buildings,
   title: "Corporate Vaults",
   desc:
    "Elevate your corporate relationships with bespoke signature blends. Perfect for boardrooms, client appreciation, and executive gifting.",
  },
  {
   icon: UsersThree,
   title: "Wedding Curations",
   desc:
    "Celebrate your union with personalized, golden harvest boxes designed to leave a lasting impression on your honored guests.",
  },
  {
   icon: Gift,
   title: "Bespoke Personal",
   desc:
    "Curate a personalized assortment of our rarest harvests for family and friends. Customized ribbons and wax-sealed notes available.",
  },
 ];

 return (
  <main
   ref={containerRef}
   className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6"
  >
   <div className="max-w-7xl mx-auto">
    {/* HERO SECTION */}
    <section className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-20 sm:mb-32">
     <div className="order-2 lg:order-1">
      <span className="gifting-hero-text text-[#C9A84C] tracking-[0.4em] uppercase text-[11px] mb-6 block font-medium">
       The Art of Giving
      </span>
      <h1 className="gifting-hero-text font-display text-[clamp(34px,9vw,72px)] leading-[1.1] mb-6 sm:mb-8">
       Curated <span className="italic text-[#E8C97A]">Elegance.</span>
      </h1>
      <p className="gifting-hero-text font-ui text-[#9A9485] text-sm sm:text-base leading-relaxed max-w-md mb-10 sm:mb-12">
       Whether you are honoring a lifelong partnership, celebrating a union, or
       expressing gratitude to valued clients, a Rein Oro vault is the ultimate
       gesture of refined taste.
      </p>
      <button
       onClick={() =>
        document
         .getElementById("concierge-form")
         .scrollIntoView({ behavior: "smooth" })
       }
       className="gifting-hero-text border-b border-[#C9A84C] text-[#C9A84C] pb-1 font-ui text-[11px] uppercase tracking-[0.2em] hover:text-[#E8C97A] transition-colors"
      >
       Contact the Concierge →
      </button>
     </div>

     <div className="order-1 lg:order-2 gifting-image relative aspect-[4/5] lg:aspect-square bg-[#1C1A16] border border-[#4A4640] overflow-hidden">
      {/* Replace with a beautiful editorial image of your packaged boxes */}
      <div className="absolute inset-0 bg-[url('/images/gifting-hero.png')] bg-cover bg-center opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
     </div>
    </section>

    {/* TIERS GRID */}
    <section className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-32">
     {giftingTiers.map((tier, index) => {
      const Icon = tier.icon;
      return (
       <div
        key={index}
        className="gifting-card bg-[#111111] border border-[#1C1A16] p-6 sm:p-10 hover:border-[#C9A84C]/30 transition-colors group"
       >
        <Icon
         size={32}
         weight="light"
         className="text-[#C9A84C] mb-8 group-hover:-translate-y-1 transition-transform"
        />
        <h3 className="font-display text-xl sm:text-2xl mb-4 text-[#F5EDD6]">
         {tier.title}
        </h3>
        <p className="font-ui text-sm text-[#9A9485] leading-relaxed">
         {tier.desc}
        </p>
       </div>
      );
     })}
    </section>

    {/* CONCIERGE FORM */}
    <section
     id="concierge-form"
     className="max-w-4xl mx-auto bg-[#0E0E0E] border border-[#C9A84C]/20 p-6 sm:p-8 md:p-16"
    >
     <div className="text-center mb-12">
      <EnvelopeSimple
       size={32}
       className="text-[#C9A84C] mx-auto mb-6"
       weight="light"
      />
      <h2 className="font-display text-3xl sm:text-4xl mb-4 italic">
       Gifting Concierge
      </h2>
      <p className="font-ui text-[#9A9485] text-sm">
       Connect with our dedicated gifting team to curate your custom order. We
       typically respond within 24 hours.
      </p>
     </div>

     {isSuccess ? (
      <div className="text-center py-10 sm:py-12 border border-dashed border-[#C9A84C]/30">
       <span className="font-ui text-[11px] tracking-[0.4em] uppercase text-[#C9A84C] mb-4 block">
        Inquiry Received
       </span>
       <h3 className="font-display text-2xl sm:text-3xl text-[#F5EDD6]">
        Thank You.
       </h3>
       <p className="text-[#9A9485] mt-4">
        Our concierge team will be in touch shortly.
       </p>
      </div>
     ) : (
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
       <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <FloatingInput
         label="Full Name"
         name="name"
         value={formData.name}
         onChange={handleInputChange}
         required
        />
        <FloatingInput
         label="Company (Optional)"
         name="company"
         value={formData.company}
         onChange={handleInputChange}
        />
       </div>
       <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <FloatingInput
         label="Email Address"
         type="email"
         name="email"
         value={formData.email}
         onChange={handleInputChange}
         required
        />
        <FloatingInput
         label="Phone Number"
         type="tel"
         name="phone"
         value={formData.phone}
         onChange={handleInputChange}
         required
        />
       </div>
       <div className="grid md:grid-cols-2 gap-8">
        <FloatingInput
         label="Occasion (e.g., Wedding, Corporate)"
         name="occasion"
         value={formData.occasion}
         onChange={handleInputChange}
         required
        />
        <FloatingInput
         label="Estimated Quantity"
         name="quantity"
         value={formData.quantity}
         onChange={handleInputChange}
         required
        />
       </div>

       <div className="relative">
        <textarea
         id="message"
         name="message"
         value={formData.message}
         onChange={handleInputChange}
         required
         rows={4}
         placeholder=" "
         className="peer w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui pt-5 pb-2 text-[15px] focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-transparent resize-none"
        />
        <label
         htmlFor="message"
         className="absolute left-0 text-[#9A9485] font-ui text-[11px] uppercase tracking-[0.2em] transition-all duration-300 pointer-events-none
                             top-0 peer-placeholder-shown:top-5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:tracking-wider
                             peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-[0.2em] peer-focus:text-[#C9A84C]"
        >
         Tell us about your requirements
        </label>
       </div>

       <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] py-5 font-bold tracking-[0.2em] uppercase text-[12px] hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-all disabled:opacity-50 mt-8"
       >
        {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
       </button>
      </form>
     )}
    </section>
   </div>
  </main>
 );
}

// Reusable Minimalist Floating Input (Extracted for portability within this file)
function FloatingInput({
 label,
 name,
 type = "text",
 value,
 onChange,
 required = false,
}) {
 return (
  <div className="relative group">
   <input
    id={name}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    placeholder=" "
    className="peer w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui pt-5 pb-2 text-[15px] focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-transparent"
    suppressHydrationWarning
   />
   <label
    htmlFor={name}
    className="absolute left-0 text-[#9A9485] font-ui text-[11px] uppercase tracking-[0.2em] transition-all duration-300 pointer-events-none
                   top-0 peer-placeholder-shown:top-5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:tracking-wider
                   peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-[0.2em] peer-focus:text-[#C9A84C]"
   >
    {label} {required && "*"}
   </label>
  </div>
 );
}
