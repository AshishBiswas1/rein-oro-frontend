import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// 1. Configure Cloudinary securely
cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
 try {
  // 2. Extract the file from the incoming request
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
   return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  // 3. Convert the file into a readable Node.js Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 4. Stream the buffer directly to Cloudinary
  const result = await new Promise((resolve, reject) => {
   const uploadStream = cloudinary.uploader.upload_stream(
    {
     folder: "rein-oro-vault", // Creates a clean folder in your Cloudinary dashboard
     // Cloudinary automatically determines format and optimizes delivery
    },
    (error, result) => {
     if (error) reject(error);
     else resolve(result);
    },
   );

   // Execute the stream
   uploadStream.end(buffer);
  });

  // 5. Return the secure HTTPS URL to the frontend
  return NextResponse.json({ url: result.secure_url });
 } catch (error) {
  console.error("Cloudinary upload error:", error);
  return NextResponse.json(
   { error: "Failed to upload asset to secure vault." },
   { status: 500 },
  );
 }
}
