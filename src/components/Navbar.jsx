"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // <-- Added Image import
import { usePathname } from "next/navigation";
import { MagnifyingGlass, User, ShoppingBag, List, X } from "phosphor-react";
import { useCartStore } from "../store/useCartStore";
import { auth } from "@/lib/firebase"; // <-- Added Firebase auth import

export default function Navbar() {
 const [isScrolled, setIsScrolled] = useState(false);
 const [isMounted, setIsMounted] = useState(false);
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [user, setUser] = useState(null); // <-- State to track logged-in user
 const pathname = usePathname();

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

 useEffect(() => {
  setIsMenuOpen(false);
 }, [pathname]);

 useEffect(() => {
  document.body.style.overflow = isMenuOpen ? "hidden" : "";

  return () => {
   document.body.style.overflow = "";
  };
 }, [isMenuOpen]);

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
     ? "bg-rein-black/90 backdrop-blur-md py-4 border-rein-gold-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
     : "bg-transparent py-6 border-transparent"
   }`}
   suppressHydrationWarning
  >
   <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
    <button
     type="button"
     className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-rein-cream border border-rein-gold-primary/20 bg-rein-black/70 backdrop-blur-sm hover:border-rein-gold-primary/50 transition-colors duration-300"
     onClick={() => setIsMenuOpen((open) => !open)}
     aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
     aria-expanded={isMenuOpen}
     aria-controls="mobile-navigation"
    >
     {isMenuOpen ? (
      <X size={22} weight="light" />
     ) : (
      <List size={22} weight="light" />
     )}
    </button>

    {/* Modern Left-aligned navigation links */}
    <div className="hidden md:flex gap-8 text-rein-gray-light uppercase tracking-[0.25em] text-[11px] font-medium">
     {navItems.map((item) => (
      <Link
       key={item.name}
       href={`/${item.path}`}
       className="relative py-1 text-rein-gray-light hover:text-rein-cream transition-colors duration-300 group"
       suppressHydrationWarning
      >
       {item.name}
       <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-rein-gold-primary to-rein-gold-light transition-all duration-300 group-hover:w-full" />
      </Link>
     ))}
    </div>

    {/* Centered Luxury Identity Image */}
    <Link
     href="/"
     className="relative inline-block w-[90px] sm:w-[110px] md:w-[140px] hover:opacity-80 transition-opacity duration-300"
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
    <div className="flex items-center gap-6 text-rein-gray-light">
     <button
      className="hover:text-rein-gold-primary transition-colors duration-300 p-1"
      suppressHydrationWarning
     >
      <MagnifyingGlass size={20} weight="light" />
     </button>

     {/* Smart Connected Account Link (Routes to Profile if logged in) */}
     <Link
      href={user ? "/account/profile" : "/account"}
      className="hover:text-rein-gold-primary text-rein-gray-light transition-colors duration-300 p-1 flex items-center justify-center"
      aria-label="Customer Account"
      suppressHydrationWarning
     >
      <User size={20} weight="light" />
     </Link>

     <button
      onClick={toggleDrawer}
      className="relative hover:text-rein-cream text-rein-gray-light transition-colors duration-300 p-1 flex items-center justify-center"
      suppressHydrationWarning
     >
      <ShoppingBag size={22} weight="light" />

      {/* Elegant Safe Notification Bubble */}
      {isMounted && cartCount > 0 && (
       <span className="absolute -top-1 -right-1 bg-gradient-to-br from-rein-gold-primary to-rein-gold-light text-rein-black text-[9px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(201,168,76,0.4)]">
        {cartCount}
       </span>
      )}
     </button>
    </div>
   </div>

   <div
    className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
     isMenuOpen
      ? "opacity-100 pointer-events-auto"
      : "opacity-0 pointer-events-none"
    }`}
   >
    <button
     type="button"
     className="absolute inset-0 bg-black/60"
     aria-label="Close navigation menu"
     onClick={() => setIsMenuOpen(false)}
    />

    <div
     id="mobile-navigation"
     className={`absolute left-0 top-0 h-full w-[82vw] max-w-[320px] bg-rein-black border-r border-rein-gold-primary/15 shadow-[12px_0_40px_rgba(0,0,0,0.45)] px-6 pt-6 pb-8 transition-transform duration-300 ease-out ${
      isMenuOpen ? "translate-x-0" : "-translate-x-full"
     }`}
    >
     <div className="flex items-center justify-between mb-8">
      <span className="text-rein-cream uppercase tracking-[0.3em] text-[11px] font-medium">
       Menu
      </span>
      <button
       type="button"
       onClick={() => setIsMenuOpen(false)}
       className="text-rein-gray-light hover:text-rein-cream transition-colors duration-300"
       aria-label="Close navigation menu"
      >
       <X size={22} weight="light" />
      </button>
     </div>

     <div className="flex flex-col gap-5 text-rein-gray-light uppercase tracking-[0.24em] text-[11px] font-medium">
      {navItems.map((item) => (
       <Link
        key={item.name}
        href={`/${item.path}`}
        className="py-2 text-rein-gray-light hover:text-rein-cream transition-colors duration-300 border-b border-rein-gold-primary/10"
        onClick={() => setIsMenuOpen(false)}
        suppressHydrationWarning
       >
        {item.name}
       </Link>
      ))}
     </div>
    </div>
   </div>
  </nav>
 );
}
