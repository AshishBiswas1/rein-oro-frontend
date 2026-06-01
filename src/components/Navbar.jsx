// frontend/src/components/Navbar.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MagnifyingGlass, User, ShoppingBag } from "phosphor-react";
import { useCartStore } from "../store/useCartStore";

export default function Navbar() {
 const [isScrolled, setIsScrolled] = useState(false);

 // Connect to the Zustand store we just created
 const cartCount = useCartStore((state) => state.getCartCount());
 const toggleDrawer = useCartStore((state) => state.toggleDrawer);

 useEffect(() => {
  const handleScroll = () => {
   setIsScrolled(window.scrollY > 80);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 return (
  <nav
   className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
    isScrolled
     ? "bg-rein-black/96 backdrop-blur-[20px] py-4 border-b border-rein-gold-primary/30 shadow-2xl"
     : "bg-transparent py-6 border-b border-transparent"
   }`}
  >
   <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
    {/* Left: Navigation Links */}
    <div className="hidden md:flex items-center space-x-8 font-ui text-[14px] font-medium tracking-[0.12em] uppercase text-rein-cream">
     {["Home", "Shop", "Our Story", "Contact"].map((item) => (
      <Link
       key={item}
       href={`/${item.toLowerCase().replace(" ", "-")}`}
       className="hover:text-rein-gold-primary transition-colors relative group py-2"
      >
       {item}
       <span className="absolute bottom-0 left-0 w-0 h-[0.6px] bg-rein-gold-primary transition-all duration-300 group-hover:w-full" />
      </Link>
     ))}
    </div>

    {/* Center: Brandmark */}
    <div className="absolute left-1/2 -translate-x-1/2 text-center select-none">
     <Link
      href="/"
      className="font-display text-[28px] md:text-[32px] font-bold tracking-[-0.02em] uppercase text-rein-cream flex flex-col items-center"
     >
      REIN ORO
     </Link>
    </div>

    {/* Right: Action Utilities */}
    <div className="flex items-center space-x-6 ml-auto">
     <button className="text-rein-cream hover:text-rein-gold-primary transition-colors duration-300">
      <MagnifyingGlass size={22} weight="light" />
     </button>
     <Link
      href="/account"
      className="text-rein-cream hover:text-rein-gold-primary transition-colors duration-300"
     >
      <User size={22} weight="light" />
     </Link>

     <button
      onClick={toggleDrawer}
      className="text-rein-cream hover:text-rein-gold-primary transition-colors duration-300 relative p-1 group"
     >
      <ShoppingBag size={24} weight="light" />
      {cartCount > 0 && (
       <span className="absolute -top-1 -right-1 bg-rein-gold-primary text-rein-black font-accent text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center group-active:scale-110 transition-transform">
        {cartCount}
       </span>
      )}
     </button>
    </div>
   </div>
  </nav>
 );
}
