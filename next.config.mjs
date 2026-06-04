/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
  remotePatterns: [
   {
    protocol: "https",
    hostname: "res.cloudinary.com",
    pathname: "/dx4ek0dxp/**",
   },
  ],
 },
};

export default nextConfig;
