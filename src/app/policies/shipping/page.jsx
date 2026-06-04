import Link from "next/link";

export default function ShippingPolicy() {
 return (
  <main className="min-h-screen bg-rein-black text-rein-cream pt-32 pb-24 px-6">
   <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
    {/* Sticky Luxury Sidebar */}
    <aside className="lg:col-span-3">
     <div className="sticky top-32">
      <h3 className="font-display text-2xl text-rein-cream mb-8 italic">
       Legal & Policies
      </h3>
      <nav className="flex flex-col space-y-6 font-ui text-[12px] uppercase tracking-[0.2em]">
       <Link
        href="/policies/shipping"
        className="text-rein-gold-primary font-semibold flex items-center gap-3"
       >
        <span className="w-4 h-[1px] bg-rein-gold-primary"></span>
        Shipping Policy
       </Link>
       <Link
        href="/policies/returns"
        className="text-rein-gray-light hover:text-rein-cream transition-colors pl-7"
       >
        Return Policy
       </Link>
       <Link
        href="/policies/privacy"
        className="text-rein-gray-light hover:text-rein-cream transition-colors pl-7"
       >
        Privacy Policy
       </Link>
      </nav>
     </div>
    </aside>

    {/* Policy Content */}
    <div className="lg:col-span-9 animate-in fade-in slide-in-from-bottom-4 duration-700">
     <h1 className="font-display text-4xl md:text-5xl mb-6 italic">
      Shipping <span className="text-rein-gold-primary">&</span> Dispatch
     </h1>
     <p className="font-ui text-rein-gray-light text-sm leading-relaxed mb-12 max-w-2xl">
      At Rein Oro, we treat every order as a premium vault dispatch. Our
      logistics partners are carefully selected to ensure your signature blends
      arrive in immaculate condition.
     </p>

     <div className="space-y-12 font-ui text-[14px] leading-relaxed text-rein-cream/80">
      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        1. Dispatch Timeline
       </h2>
       <p className="mb-4">
        All orders are freshly prepared and dispatched within{" "}
        <strong className="text-rein-cream font-medium">24 to 48 hours</strong>{" "}
        of order confirmation, excluding Sundays and public holidays. Once your
        vault is sealed and dispatched, you will receive an email with your
        secure tracking credentials.
       </p>
      </section>

      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        2. Delivery Estimates
       </h2>
       <ul className="list-disc pl-5 space-y-2 text-rein-gray-light">
        <li>
         <strong className="text-rein-cream font-medium">
          Metropolitan Cities:
         </strong>{" "}
         2 to 4 business days.
        </li>
        <li>
         <strong className="text-rein-cream font-medium">Rest of India:</strong>{" "}
         4 to 7 business days.
        </li>
        <li>
         <strong className="text-rein-cream font-medium">Remote Areas:</strong>{" "}
         7 to 10 business days.
        </li>
       </ul>
      </section>

      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        3. Vault Shipping Fees
       </h2>
       <p className="mb-4">
        We offer{" "}
        <strong className="text-rein-cream font-medium">
         Complimentary Vault Shipping
        </strong>{" "}
        on all domestic orders exceeding ₹1,500. For orders below this
        threshold, a flat-rate shipping fee of ₹99 is applied at checkout to
        ensure premium handling.
       </p>
      </section>

      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        4. International Shipping
       </h2>
       <p>
        Currently, Rein Oro exclusively serves the Indian subcontinent through
        our standard checkout. For international bespoke orders, please contact
        our Gifting Concierge directly.
       </p>
      </section>
     </div>
    </div>
   </div>
  </main>
 );
}
