import { create } from "zustand";

export const useCartStore = create((set, get) => ({
 cart: [],
 isDrawerOpen: false,

 // UI Actions
 toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

 // Core Cart Operations
 addToCart: (product) =>
  set((state) => {
   const dynamicQuantity = product.quantity || 1;

   // Match line item uniquely using both ID and variant weight selection
   const existingItem = state.cart.find(
    (item) =>
     (item._id === product._id || item.id === product.id) &&
     item.selectedWeight === product.selectedWeight,
   );

   if (existingItem) {
    return {
     cart: state.cart.map((item) =>
      (item._id === product._id || item.id === product.id) &&
      item.selectedWeight === product.selectedWeight
       ? { ...item, quantity: item.quantity + dynamicQuantity }
       : item,
     ),
    };
   }
   return { cart: [...state.cart, { ...product, quantity: dynamicQuantity }] };
  }),

 // Purges the entire target variant line item from the active cart array
 removeItem: (id, selectedWeight) =>
  set((state) => ({
   cart: state.cart.filter(
    (item) =>
     !(
      (item._id === id || item.id === id) &&
      item.selectedWeight === selectedWeight
     ),
   ),
  })),

 // Modifies quantities up or down, filtering out item entirely if drops to 0
 updateQuantity: (id, selectedWeight, delta) =>
  set((state) => {
   const updatedCart = state.cart.map((item) => {
    if (
     (item._id === id || item.id === id) &&
     item.selectedWeight === selectedWeight
    ) {
     return { ...item, quantity: item.quantity + delta };
    }
    return item;
   });

   // Clean up fallback check: If an item drops below 1 quantity, automatically drop it from the array list
   const filteredCart = updatedCart.filter((item) => item.quantity >= 1);

   return { cart: filteredCart };
  }),

 // Instantly flushes the cart array after a successful checkout
 clearCart: () => set({ cart: [] }),

 // Structural Value Math Reducers
 getCartCount: () => {
  return get().cart.reduce((total, item) => total + item.quantity, 0);
 },

 getCartSubtotal: () => {
  return get().cart.reduce(
   (total, item) => total + item.price * item.quantity,
   0,
  );
 },
}));
