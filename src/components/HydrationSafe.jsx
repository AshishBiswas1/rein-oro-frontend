"use client";
import { useState, useEffect } from "react";

export default function HydrationSafe({ children }) {
 const [isMounted, setIsMounted] = useState(false);
 useEffect(() => setIsMounted(true), []);

 // Return null or a skeleton on the server (first render)
 // Only render the children after the client has fully loaded
 return isMounted ? <>{children}</> : null;
}
