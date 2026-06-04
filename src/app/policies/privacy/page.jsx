import Link from "next/link";

export default function PrivacyPolicy() {
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
        className="text-rein-gray-light hover:text-rein-cream transition-colors pl-7"
       >
        Return Policy
       </Link>
       <Link
        href="/policies/privacy"
        className="text-rein-gold-primary font-semibold flex items-center gap-3"
       >
        <span className="w-4 h-[1px] bg-rein-gold-primary"></span>
        Privacy Policy
       </Link>
      </nav>
     </div>
    </aside>

    {/* Policy Content */}
    <div className="lg:col-span-9 animate-in fade-in slide-in-from-bottom-4 duration-700">
     <h1 className="font-display text-4xl md:text-5xl mb-6 italic">
      Privacy <span className="text-rein-gold-primary">&</span> Data Security
     </h1>
     <p className="font-ui text-rein-gray-light text-sm leading-relaxed mb-12 max-w-2xl">
      Your privacy is as closely guarded as our signature recipes. This policy
      outlines how Rein Oro protects and handles your personal information.
     </p>

     <div className="space-y-12 font-ui text-[14px] leading-relaxed text-rein-cream/80">
      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        1. Information We Collect
       </h2>
       <p className="mb-4">
        When you visit our site or make a purchase, we collect necessary
        information to fulfill your order and enhance your experience. This
        includes:
       </p>
       <ul className="list-disc pl-5 space-y-2 text-rein-gray-light">
        <li>Contact Information (Name, Email, Phone Number)</li>
        <li>Delivery Details (Shipping and Billing Addresses)</li>
        <li>Account Credentials (If you create a Rein Oro Client Profile)</li>
       </ul>
      </section>

      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        2. Secure Payment Processing
       </h2>
       <p className="mb-4">
        <strong className="text-rein-cream font-medium">
         We do not store your credit card or payment data.
        </strong>{" "}
        All transactions are securely processed through our encrypted payment
        gateway partner (Razorpay), which adheres to the highest PCI-DSS
        compliance standards.
       </p>
      </section>

      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        3. How We Use Your Data
       </h2>
       <p className="mb-4">Your data is exclusively used to:</p>
       <ul className="list-disc pl-5 space-y-2 text-rein-gray-light mb-4">
        <li>Process and deliver your orders securely.</li>
        <li>Communicate vital updates regarding your purchase.</li>
        <li>Provide tailored customer support and concierge services.</li>
       </ul>
       <p>
        <strong className="text-rein-cream font-medium">
         Rein Oro will never sell, rent, or trade your personal information to
         third parties.
        </strong>
       </p>
      </section>

      <section>
       <h2 className="text-rein-cream text-lg font-display italic mb-4">
        4. Cookies & Analytics
       </h2>
       <p>
        We use strictly necessary cookies to ensure the website functions
        properly (such as retaining items in your cart) and anonymous analytical
        cookies to help us improve the overall browsing experience.
       </p>
      </section>
     </div>
    </div>
   </div>
  </main>
 );
}
