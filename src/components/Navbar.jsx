"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // <-- Added Image import
import { MagnifyingGlass, User, ShoppingBag } from "phosphor-react";
import { useCartStore } from "../store/useCartStore";
import { auth } from "@/lib/firebase"; // <-- Added Firebase auth import

export default function Navbar() {
 const [isScrolled, setIsScrolled] = useState(false);
 const [isMounted, setIsMounted] = useState(false);
 const [user, setUser] = useState(null); // <-- State to track logged-in user

 const cartCount = useCartStore((state) => state.getCartCount());
 const toggleDrawer = useCartStore((state) => state.toggleDrawer);

 useEffect(() => {
  setIsMounted(true);

  const handleScroll = () => setIsScrolled(window.scrollY > 40);
  window.addEventListener("scroll", handleScroll);

  // <-- Listen for authentication status -->
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
   setUser(currentUser);
  });

  return () => {
   window.removeEventListener("scroll", handleScroll);
   unsubscribe(); // Cleanup listener on unmount
  };
 }, []);

 const navItems = [
  { name: "Home", path: "" },
  { name: "Products", path: "products" },
  { name: "Our Story", path: "our-story" },
  { name: "Contact", path: "contact" },
 ];

 return (
  <nav
   className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
    isScrolled
     ? "bg-[#0A0A0A]/90 backdrop-blur-md py-4 border-[#C9A84C]/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
     : "bg-transparent py-6 border-transparent"
   }`}
   suppressHydrationWarning
  >
   <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
    {/* Modern Left-aligned navigation links */}
    <div className="hidden md:flex gap-8 text-[#9A9485] uppercase tracking-[0.25em] text-[11px] font-medium">
     {navItems.map((item) => (
      <Link
       key={item.name}
       href={`/${item.path}`}
       className="relative py-1 text-[#9A9485] hover:text-[#F5EDD6] transition-colors duration-300 group"
       suppressHydrationWarning
      >
       {item.name}
       <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] transition-all duration-300 group-hover:w-full" />
      </Link>
     ))}
    </div>

    {/* Centered Luxury Identity Image */}
    <Link
     href="/"
     className="relative inline-block w-[140px] hover:opacity-80 transition-opacity duration-300"
     suppressHydrationWarning
    >
     <Image
      src="/images/logo.PNG"
      alt="Rein Oro Logo"
      width={140}
      height={45}
      style={{ width: "100%", height: "auto" }} // Scale perfectly to fill the defined parent bounds
      className="object-contain opacity-90 hover:opacity-100 transition-opacity"
     />
    </Link>

    {/* Right-aligned Utility Actions cluster */}
    <div className="flex items-center gap-6 text-[#9A9485]">
     <button
      className="hover:text-[#C9A84C] transition-colors duration-300 p-1"
      suppressHydrationWarning
     >
      <MagnifyingGlass size={20} weight="light" />
     </button>

     {/* Smart Connected Account Link (Routes to Profile if logged in) */}
     <Link
      href={user ? "/account/profile" : "/account"}
      className="hover:text-[#C9A84C] text-[#9A9485] transition-colors duration-300 p-1 flex items-center justify-center"
      aria-label="Customer Account"
      suppressHydrationWarning
     >
      <User size={20} weight="light" />
     </Link>

     <button
      onClick={toggleDrawer}
      className="relative hover:text-[#F5EDD6] text-[#9A9485] transition-colors duration-300 p-1 flex items-center justify-center"
      suppressHydrationWarning
     >
      <ShoppingBag size={22} weight="light" />

      {/* Elegant Safe Notification Bubble */}
      {isMounted && cartCount > 0 && (
       <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] text-[9px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(201,168,76,0.4)]">
        {cartCount}
       </span>
      )}
     </button>
    </div>
   </div>
  </nav>
 );
}
