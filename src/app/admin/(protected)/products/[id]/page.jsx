"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import {
 ArrowLeft,
 FloppyDisk,
 UploadSimple,
 Plus,
 Trash,
} from "phosphor-react";

export default function EditProductPage() {
 const router = useRouter();
 const { id } = useParams();

 const [isLoadingData, setIsLoadingData] = useState(true);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState("");

 // File Upload States
 const [imageFile, setImageFile] = useState(null);
 const [imagePreview, setImagePreview] = useState(null);
 const [existingImageUrl, setExistingImageUrl] = useState("");

 // Standard Form Fields (Removed global stock)
 const [formData, setFormData] = useState({
  name: "",
  slug: "",
  category: "Premium",
  shortDescription: "",
  description: "",
  isActive: true,
 });

 // Dynamic Arrays
 const [variants, setVariants] = useState([
  { weight: "100g", price: "", stock: "" },
 ]);
 const [ingredients, setIngredients] = useState([
  { component: "", sourcing: "" },
 ]);

 // 1. Fetch Existing Product Data on Load
 useEffect(() => {
  const fetchProduct = async () => {
   try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
     const data = docSnap.data();

     setFormData({
      name: data.name || "",
      slug: data.slug || "",
      category: data.category || "Premium",
      shortDescription: data.shortDescription || "",
      description: data.description || "",
      isActive: data.isActive !== undefined ? data.isActive : true,
     });

     if (data.images && data.images[0]) {
      setExistingImageUrl(data.images[0]);
      setImagePreview(data.images[0]);
     }

     // Populate Variants (Safely migrating older data without variant stock)
     if (data.variants && data.variants.length > 0) {
      const migratedVariants = data.variants.map((v) => ({
       ...v,
       stock: v.stock !== undefined ? v.stock : data.stock || 0, // Fallback to global stock if missing
      }));
      setVariants(migratedVariants);
     } else if (data.weight && data.price) {
      const legacyVariants = data.weight.map((w) => ({
       weight: w,
       price: data.price,
       stock: data.stock || 0,
      }));
      setVariants(legacyVariants);
     }

     // Populate Ingredients (Safely migrating old paragraph strings to the table format)
     if (Array.isArray(data.ingredients) && data.ingredients.length > 0) {
      setIngredients(data.ingredients);
     } else if (
      typeof data.ingredients === "string" &&
      data.ingredients.trim() !== ""
     ) {
      setIngredients([
       { component: "General Composition", sourcing: data.ingredients },
      ]);
     }
    } else {
     setError("Product not found in the vault.");
    }
   } catch (err) {
    console.error("Error fetching product:", err);
    setError("Failed to load product data.");
   } finally {
    setIsLoadingData(false);
   }
  };

  if (id) fetchProduct();
 }, [id]);

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
   ...prev,
   [name]: type === "checkbox" ? checked : value,
  }));
 };

 // Variant Builder Handlers
 const handleVariantChange = (index, field, value) => {
  const newVariants = [...variants];
  newVariants[index][field] = value;
  setVariants(newVariants);
 };

 const addVariantRow = () => {
  setVariants([...variants, { weight: "", price: "", stock: "" }]);
 };

 const removeVariantRow = (index) => {
  if (variants.length === 1) return;
  setVariants(variants.filter((_, i) => i !== index));
 };

 // Ingredient Builder Handlers
 const handleIngredientChange = (index, field, value) => {
  const newIngredients = [...ingredients];
  newIngredients[index][field] = value;
  setIngredients(newIngredients);
 };

 const addIngredientRow = () => {
  setIngredients([...ingredients, { component: "", sourcing: "" }]);
 };

 const removeIngredientRow = (index) => {
  if (ingredients.length === 1) return;
  setIngredients(ingredients.filter((_, i) => i !== index));
 };

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
   if (file.size > 5 * 1024 * 1024) {
    setError("Image size must be less than 5MB");
    return;
   }
   setImageFile(file);
   setImagePreview(URL.createObjectURL(file));
   setError("");
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError("");

  // Validate Variants
  const validVariants = variants.filter(
   (v) => v.weight.trim() !== "" && v.price !== "" && v.stock !== "",
  );
  if (validVariants.length === 0) {
   setError(
    "Please provide at least one complete variant (Weight, Price, and Stock).",
   );
   setIsSubmitting(false);
   return;
  }

  // Filter Ingredients (Remove completely empty rows)
  const validIngredients = ingredients.filter(
   (i) => i.component.trim() !== "" || i.sourcing.trim() !== "",
  );

  try {
   let finalImageUrl = existingImageUrl;

   if (imageFile) {
    const uploadData = new FormData();
    uploadData.append("file", imageFile);

    const uploadRes = await fetch("/api/upload", {
     method: "POST",
     body: uploadData,
    });

    if (!uploadRes.ok) {
     const errData = await uploadRes.json();
     throw new Error(
      errData.error || "Failed to upload new image to Cloudinary.",
     );
    }

    const responseData = await uploadRes.json();
    finalImageUrl = responseData.url;
   }

   const formattedVariants = validVariants.map((v) => ({
    weight: v.weight.trim(),
    price: Number(v.price),
    stock: Number(v.stock),
   }));

   // Aggregate total stock for legacy components
   const totalAggregateStock = formattedVariants.reduce(
    (sum, v) => sum + v.stock,
    0,
   );

   const updatedProduct = {
    name: formData.name,
    slug:
     formData.slug ||
     formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
    category: formData.category,
    images: [finalImageUrl],
    shortDescription: formData.shortDescription,
    description: formData.description,
    isActive: formData.isActive,
    updatedAt: serverTimestamp(),

    // Tabular updates
    variants: formattedVariants,
    ingredients: validIngredients,
    stock: totalAggregateStock,
   };

   await updateDoc(doc(db, "products", id), updatedProduct);

   router.push("/admin/products");
  } catch (err) {
   console.error("Failed to update product:", err);
   setError(
    err.message ||
     "Failed to update the product. Please check your connection.",
   );
   setIsSubmitting(false);
  }
 };

 if (isLoadingData) {
  return (
   <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse">
     Retrieving Vault Records...
    </div>
   </div>
  );
 }

 return (
  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
   {/* Header Controls */}
   <div className="flex items-center justify-between pb-6 border-b border-[#1C1A16]">
    <div className="flex items-center gap-4">
     <Link
      href="/admin/products"
      className="w-10 h-10 flex items-center justify-center bg-[#111111] border border-[#1C1A16] rounded-sm text-[#9A9485] hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all"
     >
      <ArrowLeft size={18} />
     </Link>
     <div>
      <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] mb-1 block font-medium">
       Inventory Allocation
      </span>
      <h1 className="text-2xl text-[#F5EDD6] font-display italic">
       Edit Blend
      </h1>
     </div>
    </div>

    <div className="flex items-center gap-3 bg-[#111111] border border-[#1C1A16] px-4 py-2 rounded-sm">
     <label
      htmlFor="isActive"
      className="text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] cursor-pointer"
     >
      Active in Store
     </label>
     <input
      type="checkbox"
      id="isActive"
      name="isActive"
      checked={formData.isActive}
      onChange={handleChange}
      className="w-4 h-4 accent-[#C9A84C] cursor-pointer"
     />
    </div>
   </div>

   {error && (
    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-ui uppercase tracking-widest rounded-sm">
     {error}
    </div>
   )}

   <form onSubmit={handleSubmit} className="space-y-8">
    <div className="bg-[#111111] border border-[#1C1A16] p-8 rounded-sm space-y-8">
     <div className="flex flex-col sm:flex-row gap-8 items-start">
      <div className="w-full sm:w-64 shrink-0">
       <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-4">
        Primary Cover Image
       </label>
       <div className="relative aspect-square w-full bg-[#0A0A0A] border-2 border-dashed border-[#1C1A16] rounded-sm hover:border-[#C9A84C]/50 transition-colors group overflow-hidden flex flex-col items-center justify-center cursor-pointer">
        {imagePreview ? (
         <Image
          src={imagePreview}
          alt="Preview"
          fill
          className="object-cover"
         />
        ) : (
         <div className="text-center p-4">
          <UploadSimple
           size={32}
           className="text-[#4A4640] mx-auto mb-2 group-hover:text-[#C9A84C] transition-colors"
          />
          <span className="text-[#9A9485] font-ui text-[10px] uppercase tracking-widest">
           Click to Upload
          </span>
         </div>
        )}
        <input
         type="file"
         accept="image/jpeg, image/png, image/webp"
         onChange={handleImageChange}
         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
       </div>
       <p className="text-[#9A9485] text-[10px] mt-2 font-ui truncate pr-2">
        {imageFile ? `New: ${imageFile.name}` : "Click to replace image"}
       </p>
      </div>

      <div className="flex-1 w-full space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
         <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
          Blend Name *
         </label>
         <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-display text-lg py-2 focus:outline-none focus:border-[#C9A84C] transition-colors"
          placeholder="e.g. Royal Kashmiri Saffron"
         />
        </div>
        <div>
         <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
          URL Slug (Optional)
         </label>
         <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-2 focus:outline-none focus:border-[#C9A84C] transition-colors"
          placeholder="Auto-generates if blank"
         />
        </div>
       </div>

       <div className="grid grid-cols-1 gap-8">
        <div>
         <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
          Category *
         </label>
         <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-2 focus:outline-none focus:border-[#C9A84C] transition-colors"
          placeholder="e.g. Sweet, Savory, Plain"
         />
        </div>
       </div>
      </div>
     </div>

     {/* Dynamic Variant Builder */}
     <div className="border-t border-[#1C1A16] pt-8 space-y-6">
      <div>
       <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
        Product Variants (Weight, Price & Stock) *
       </label>
       <p className="text-[10px] text-[#4A4640] font-ui uppercase tracking-widest mb-6">
        Allocate inventory and pricing per tier.
       </p>
      </div>

      <div className="space-y-4">
       {variants.map((variant, index) => (
        <div
         key={index}
         className="flex flex-col sm:flex-row items-center gap-4 bg-[#0A0A0A] p-4 border border-[#1C1A16] rounded-sm group"
        >
         <div className="flex-1 w-full">
          <label className="block text-[#4A4640] font-ui text-[9px] uppercase tracking-[0.2em] mb-1">
           Weight
          </label>
          <input
           type="text"
           value={variant.weight}
           onChange={(e) =>
            handleVariantChange(index, "weight", e.target.value)
           }
           required
           className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-1 focus:outline-none focus:border-[#C9A84C] transition-colors"
           placeholder="e.g. 100g"
          />
         </div>
         <div className="flex-1 w-full">
          <label className="block text-[#4A4640] font-ui text-[9px] uppercase tracking-[0.2em] mb-1">
           Price (INR)
          </label>
          <div className="relative">
           <span className="absolute left-0 top-1 text-[#9A9485] text-sm">
            ₹
           </span>
           <input
            type="number"
            min="0"
            step="1"
            value={variant.price}
            onChange={(e) =>
             handleVariantChange(index, "price", e.target.value)
            }
            required
            className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-1 pl-4 focus:outline-none focus:border-[#C9A84C] transition-colors"
            placeholder="0.00"
           />
          </div>
         </div>
         <div className="flex-1 w-full">
          <label className="block text-[#4A4640] font-ui text-[9px] uppercase tracking-[0.2em] mb-1">
           Stock Units
          </label>
          <input
           type="number"
           min="0"
           step="1"
           value={variant.stock}
           onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
           required
           className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-1 focus:outline-none focus:border-[#C9A84C] transition-colors"
           placeholder="e.g. 50"
          />
         </div>
         <button
          type="button"
          onClick={() => removeVariantRow(index)}
          disabled={variants.length === 1}
          className="mt-4 sm:mt-0 p-2 text-[#4A4640] hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#4A4640]"
         >
          <Trash size={18} />
         </button>
        </div>
       ))}
      </div>

      <button
       type="button"
       onClick={addVariantRow}
       className="text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
      >
       <Plus size={14} /> Add Another Variant
      </button>
     </div>

     {/* Dynamic Ingredients Builder */}
     <div className="border-t border-[#1C1A16] pt-8 space-y-6">
      <div>
       <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
        Composition & Sourcing
       </label>
       <p className="text-[10px] text-[#4A4640] font-ui uppercase tracking-widest mb-6">
        Build the tabular ingredients list for the product page.
       </p>
      </div>

      <div className="space-y-4">
       {ingredients.map((ingredient, index) => (
        <div
         key={index}
         className="flex flex-col sm:flex-row items-start gap-4 bg-[#0A0A0A] p-4 border border-[#1C1A16] rounded-sm group"
        >
         <div className="flex-1 w-full">
          <label className="block text-[#4A4640] font-ui text-[9px] uppercase tracking-[0.2em] mb-1">
           Component
          </label>
          <input
           type="text"
           value={ingredient.component}
           onChange={(e) =>
            handleIngredientChange(index, "component", e.target.value)
           }
           className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-1 focus:outline-none focus:border-[#C9A84C] transition-colors"
           placeholder="e.g. Saffron Threads"
          />
         </div>
         <div className="flex-[2] w-full">
          <label className="block text-[#4A4640] font-ui text-[9px] uppercase tracking-[0.2em] mb-1">
           Sourcing / Details
          </label>
          <textarea
           rows="1"
           value={ingredient.sourcing}
           onChange={(e) =>
            handleIngredientChange(index, "sourcing", e.target.value)
           }
           className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-1 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
           placeholder="e.g. Hand-harvested from Pampore."
          />
         </div>
         <button
          type="button"
          onClick={() => removeIngredientRow(index)}
          disabled={ingredients.length === 1}
          className="mt-4 sm:mt-0 p-2 text-[#4A4640] hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#4A4640]"
         >
          <Trash size={18} />
         </button>
        </div>
       ))}
      </div>

      <button
       type="button"
       onClick={addIngredientRow}
       className="text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
      >
       <Plus size={14} /> Add Ingredient Row
      </button>
     </div>

     {/* Descriptions */}
     <div className="border-t border-[#1C1A16] pt-8 space-y-8">
      <div>
       <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
        Short Description (For Cards) *
       </label>
       <input
        type="text"
        name="shortDescription"
        value={formData.shortDescription}
        onChange={handleChange}
        required
        className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-2 focus:outline-none focus:border-[#C9A84C] transition-colors"
        placeholder="A sweet, floral delicacy fit for royalty."
       />
      </div>

      <div>
       <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
        Full Luxury Description
       </label>
       <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        className="w-full bg-[#0A0A0A] border border-[#1C1A16] text-[#F5EDD6] font-ui p-4 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors resize-none rounded-sm"
        placeholder="Describe the origin, aroma, and tasting notes..."
       />
      </div>
     </div>
    </div>

    <div className="flex justify-end gap-4">
     <Link
      href="/admin/products"
      className="px-8 py-4 bg-[#111111] text-[#9A9485] font-ui text-[11px] uppercase tracking-[0.2em] font-semibold border border-[#1C1A16] hover:text-[#F5EDD6] transition-colors rounded-sm"
     >
      Cancel
     </Link>
     <button
      type="submit"
      disabled={isSubmitting}
      className="px-8 py-4 bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] font-ui text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all rounded-sm disabled:opacity-50"
     >
      <FloppyDisk size={16} weight="bold" />
      {isSubmitting ? "Updating Vault..." : "Update Product"}
     </button>
    </div>
   </form>
  </div>
 );
}
