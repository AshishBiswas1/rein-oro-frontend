"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";

export default function LayoutWrapper({ children }) {
 const pathname = usePathname();

 const isAdminPage = pathname.startsWith("/admin");

 return (
  <>
   {!isAdminPage && <Navbar />}

   <main className="relative z-10">{children}</main>

   <CartDrawer />
  </>
 );
}
