"use client";

export default function TrustBar() {
 const trustItems = [
  "100% Natural",
  "No Preservatives",
  "Cold-Pressed Oils",
  "Premium Grade A Makhana",
  "Lab Certified",
  "Free Shipping on ₹599+",
  "10,000+ Happy Customers",
  "Pan India Delivery",
 ];

 return (
  <div className="w-full bg-rein-surface py-3 border-y border-rein-gold-dim/20 overflow-hidden flex items-center">
   <div className="whitespace-nowrap animate-[marquee_25s_linear_infinite] flex items-center">
    {/* Double array to create seamless infinite loop */}
    {[...trustItems, ...trustItems].map((item, index) => (
     <div key={index} className="flex items-center mx-6">
      <span className="text-rein-gold-primary text-xs mr-6">✦</span>
      <span className="font-ui font-medium text-[13px] tracking-[0.2em] uppercase text-rein-gray-light">
       {item}
      </span>
     </div>
    ))}
   </div>
  </div>
 );
}
