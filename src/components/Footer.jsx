"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
 return (
  <footer className="bg-rein-black border-t border-rein-gold-primary/20 pt-16">
   {/* Newsletter Bar */}
   <div className="max-w-7xl mx-auto px-6 pb-16 border-b border-rein-gold-dim/10">
    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
     <div>
      <h3 className="font-display text-3xl text-rein-cream mb-2">
       Join the Inner Circle
      </h3>
      <p className="font-ui text-rein-gray-light text-sm">
       Exclusive offers, early access to flavors, and brand stories.
      </p>
     </div>
     <div className="w-full md:w-auto flex">
      <input
       type="email"
       placeholder="Your email address"
       suppressHydrationWarning
       className="bg-transparent border border-rein-gold-dim/30 text-rein-cream font-ui px-6 py-3 w-full md:w-80 focus:outline-none focus:border-rein-gold-primary transition-colors"
      />
      <button
       className="bg-rein-gold-primary text-rein-black font-ui font-semibold uppercase tracking-wider px-8 hover:bg-rein-gold-light transition-colors"
       suppressHydrationWarning
      >
       Subscribe
      </button>
     </div>
    </div>
   </div>

   {/* 4-Column Footer */}
   <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
    <div className="flex flex-col space-y-4">
     <Link href="/" className="inline-block mb-2" suppressHydrationWarning>
      <Image
       src="/images/logo.PNG"
       alt="Rein Oro Logo"
       width={140}
       height={45}
       style={{ width: "140px", height: "auto" }} // <-- This handles the sizing completely
       className="object-contain opacity-90 hover:opacity-100 transition-opacity" // <-- Removed w-[140px] and h-auto
      />
     </Link>
     <p className="font-ui text-rein-gray-light text-sm">
      Premium Dry Fruits & Makhana.
      <br />
      Crafted for the Discerning.
     </p>
    </div>

    <div>
     <h4 className="font-ui font-semibold text-rein-gold-primary uppercase tracking-widest text-xs mb-6">
      Shop
     </h4>
     <ul className="space-y-3 font-ui text-sm text-rein-gray-light">
      <li>
       <Link
        href="/products"
        className="hover:text-rein-gold-primary transition-colors"
        suppressHydrationWarning
       >
        All Products
       </Link>
      </li>
      <li>
       <Link
        href="/products?filter=bestsellers"
        className="hover:text-rein-gold-primary transition-colors"
        suppressHydrationWarning
       >
        Bestsellers
       </Link>
      </li>
      <li>
       <Link
        href="/products?filter=gifts"
        className="hover:text-rein-gold-primary transition-colors"
        suppressHydrationWarning
       >
        Gift Hampers
       </Link>
      </li>
     </ul>
    </div>

    <div>
     <h4 className="font-ui font-semibold text-rein-gold-primary uppercase tracking-widest text-xs mb-6">
      Company
     </h4>
     <ul className="space-y-3 font-ui text-sm text-rein-gray-light">
      <li>
       <Link
        href="/about"
        className="hover:text-rein-gold-primary transition-colors"
        suppressHydrationWarning
       >
        Our Story
       </Link>
      </li>
      <li>
       <Link
        href="/contact"
        className="hover:text-rein-gold-primary transition-colors"
        suppressHydrationWarning
       >
        Contact
       </Link>
      </li>
      <li>
       <Link
        href="/bulk"
        className="hover:text-rein-gold-primary transition-colors"
        suppressHydrationWarning
       >
        Bulk Orders
       </Link>
      </li>
     </ul>
    </div>

    <div>
     <h4 className="font-ui font-semibold text-rein-gold-primary uppercase tracking-widest text-xs mb-6">
      Support
     </h4>
     <ul className="space-y-3 font-ui text-sm text-rein-gray-light">
      {/* <-- SINGLE CONSOLIDATED POLICY LINK --> */}
      <li>
       <Link
        href="/policies/shipping"
        className="hover:text-rein-gold-primary transition-colors"
        suppressHydrationWarning
       >
        Legal & Policies
       </Link>
      </li>
      <li>
       <Link
        href="/account/orders"
        className="hover:text-rein-gold-primary transition-colors"
        suppressHydrationWarning
       >
        Track Order
       </Link>
      </li>
      {/* Added FAQ to keep the column balanced */}
      <li>
       <Link
        href="/faq"
        className="hover:text-rein-gold-primary transition-colors"
        suppressHydrationWarning
       >
        FAQ
       </Link>
      </li>
     </ul>
    </div>
   </div>

   {/* Bottom Bar */}
   <div className="bg-[#050505] py-6 border-t border-rein-gold-dim/10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs font-ui text-rein-gray-mid">
     <p>© {new Date().getFullYear()} Rein Oro. All rights reserved.</p>
     <div className="flex space-x-4 mt-4 md:mt-0">
      <span>Secure Checkout</span>
      <span>Razorpay</span>
      <span>UPI</span>
     </div>
    </div>
   </div>
  </footer>
 );
}
