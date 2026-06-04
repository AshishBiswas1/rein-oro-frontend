import Link from "next/link";

export default function ReturnPolicy() {
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
        className="text-rein-gray-light hover:text-rein-cream transition-colors pl-7"
       >
        Shipping Policy
       </Link>
       <Link
        href="/policies/returns"
        className="text-rein-gold-primary font-semibold flex items-center gap-3"
       >
        <span className="w-4 h-[1px] bg-rein-gold-primary"></span>
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
      Returns <span className="text-rein-gold-primary">&</span> Refunds
     </h1>
     <p className="font-ui text-rein-gray-light text-sm leading-relaxed mb-12 max-w-2xl">
      Due to the premium, consumable nature of our signature blends, we maintain
      a strict hygiene and quality protocol. Please review our policy carefully.
     </p>

     <div className="space-y-12 font-ui text-[14px] leading-relaxed text-rein-cream/80">
      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        1. General Returns
       </h2>
       <p className="mb-4">
        As Rein Oro deals in premium edible goods,{" "}
        <strong className="text-rein-cream font-medium">
         we do not accept returns or exchanges
        </strong>{" "}
        once an order has been successfully delivered. This ensures the
        integrity and freshness of our products for all clients.
       </p>
      </section>

      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        2. Damaged or Tampered Vaults
       </h2>
       <p className="mb-4">
        If your package arrives damaged, tampered with, or if you receive an
        incorrect item, you must notify us within{" "}
        <strong className="text-rein-cream font-medium">
         48 hours of delivery
        </strong>
        .
       </p>
       <p className="text-rein-gray-light">
        Please email{" "}
        <a
         href="mailto:support@reinoro.com"
         className="text-rein-gold-primary hover:underline"
        >
         support@reinoro.com
        </a>{" "}
        with your Order Number and clear photographic evidence of the unboxing.
        Our team will review the claim and issue a replacement or refund within
        3 business days.
       </p>
      </section>

      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        3. Refund Processing
       </h2>
       <p className="mb-4">
        Approved refunds are processed exclusively to the original payment
        method. Please allow 5 to 7 business days for the credited amount to
        reflect in your bank account or credit card statement, depending on your
        financial institution.
       </p>
      </section>

      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        4. Cancellations
       </h2>
       <p>
        Orders can only be cancelled before they are dispatched. Once an order
        is handed over to our logistics partner, cancellation requests cannot be
        entertained.
       </p>
      </section>
     </div>
    </div>
   </div>
  </main>
 );
}
