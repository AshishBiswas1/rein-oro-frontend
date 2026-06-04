"use client";
import { useState } from "react";
import { login, signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AccountPage() {
 const [isLogin, setIsLogin] = useState(true);
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
  email: "",
  password: "",
  name: "",
 });
 const router = useRouter();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
   if (isLogin) {
    await login(formData.email, formData.password);
   } else {
    await signUp(formData.email, formData.password, formData.name);
   }
   router.push("/account/profile");
  } catch (err) {
   alert(err.message);
   setLoading(false);
  }
 };

 const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 return (
  <main className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row">
   {/* Left Side: Brand Imagery */}
   <div className="hidden md:flex w-1/2 relative items-center justify-center border-r border-[#1C1A16] bg-[#0E0E0E]">
    <div className="absolute inset-0 bg-[url('/images/story-1.png')] bg-cover bg-center opacity-20 grayscale" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]" />

    <div className="relative z-10 max-w-md text-center p-12">
     <Link href="/" className="font-display text-4xl text-[#C9A84C] mb-6 block">
      Rein Oro
     </Link>
     <p className="text-[#9A9485] font-ui leading-relaxed">
      Create an account to track your orders, save your delivery preferences,
      and gain exclusive access to our limited-harvest releases.
     </p>
    </div>
   </div>

   {/* Right Side: The Form */}
   <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24">
    <div className="w-full max-w-md">
     <Link
      href="/"
      className="md:hidden font-display text-3xl text-[#C9A84C] mb-12 block text-center"
     >
      Rein Oro
     </Link>

     <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[11px] mb-4 block font-medium">
      {isLogin ? "Client Portal" : "Join The Registry"}
     </span>
     <h1 className="font-display text-[40px] text-[#F5EDD6] mb-10 leading-tight">
      {isLogin ? "Welcome Back." : "Create Account."}
     </h1>

     <form onSubmit={handleSubmit} className="space-y-8">
      {!isLogin && (
       <FloatingInput
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
       />
      )}
      <FloatingInput
       label="Email Address"
       name="email"
       type="email"
       value={formData.email}
       onChange={handleInputChange}
       required
      />
      <FloatingInput
       label="Password"
       name="password"
       type="password"
       value={formData.password}
       onChange={handleInputChange}
       required
      />

      <button
       disabled={loading}
       className="w-full bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] py-5 font-bold tracking-[0.2em] uppercase text-[12px] hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-all mt-4 disabled:opacity-50"
      >
       {loading ? "Authenticating..." : isLogin ? "Sign In" : "Register"}
      </button>
     </form>

     <div className="mt-12 pt-8 border-t border-[#1C1A16] flex flex-col items-center">
      <p className="text-[#9A9485] text-sm font-ui mb-4">
       {isLogin ? "Don't have an account?" : "Already a member?"}
      </p>
      <button
       type="button"
       onClick={() => setIsLogin(!isLogin)}
       className="text-[#F5EDD6] text-[11px] uppercase tracking-[0.2em] border-b border-[#4A4640] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all pb-1"
      >
       {isLogin ? "Create an account" : "Sign in instead"}
      </button>
     </div>
    </div>
   </div>
  </main>
 );
}

function FloatingInput({
 label,
 name,
 type = "text",
 value,
 onChange,
 required = false,
}) {
 return (
  <div className="relative group">
   <input
    id={name}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    placeholder=" "
    className="peer w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui pt-5 pb-2 text-[15px] focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-transparent"
   />
   <label
    htmlFor={name}
    className="absolute left-0 text-[#9A9485] font-ui text-[11px] uppercase tracking-[0.2em] transition-all duration-300 pointer-events-none top-0 peer-placeholder-shown:top-5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:tracking-wider peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-[0.2em] peer-focus:text-[#C9A84C]"
   >
    {label}
   </label>
  </div>
 );
}
