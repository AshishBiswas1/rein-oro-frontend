export default function TrustBar() {
 return (
  <div className="w-full bg-[#1C1A16] py-4 overflow-hidden border-y border-[#8A6F32]/20">
   <div className="flex whitespace-nowrap animate-marquee">
    {[...Array(3)].map((_, i) => (
     <div
      key={i}
      className="flex items-center gap-12 px-6 font-ui text-[13px] tracking-[0.2em] uppercase text-[#9A9485]"
     >
      <span>✦ 100% Natural</span>
      <span>✦ No Preservatives</span>
      <span>✦ Cold-Pressed Oils</span>
      <span>✦ Premium Grade A Makhana</span>
     </div>
    ))}
   </div>
  </div>
 );
}
