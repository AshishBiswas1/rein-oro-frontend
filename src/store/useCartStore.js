// frontend/src/store/useCartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
 persist(
  (set, get) => ({
   cart: [],
   isDrawerOpen: false,

   openDrawer: () => set({ isDrawerOpen: true }),
   closeDrawer: () => set({ isDrawerOpen: false }),
   toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

   // Adds item and automatically opens the drawer
   addItem: (item) =>
    set((state) => {
     const itemKey = `${item.id}-${item.selectedWeight}`;
     const existingItemIndex = state.cart.findIndex(
      (i) => `${i.id}-${i.selectedWeight}` === itemKey,
     );

     if (existingItemIndex > -1) {
      const updatedCart = [...state.cart];
      updatedCart[existingItemIndex].quantity += item.quantity || 1;
      return { cart: updatedCart, isDrawerOpen: true };
     }

     return {
      cart: [...state.cart, { ...item, quantity: item.quantity || 1 }],
      isDrawerOpen: true,
     };
    }),

   // Removes a specific item variant
   removeItem: (id, weight) =>
    set((state) => ({
     cart: state.cart.filter(
      (item) => !(item.id === id && item.selectedWeight === weight),
     ),
    })),

   // Increases or decreases quantity
   updateQuantity: (id, weight, delta) =>
    set((state) => {
     const updatedCart = state.cart.map((item) => {
      if (item.id === id && item.selectedWeight === weight) {
       const nextQty = item.quantity + delta;
       return { ...item, quantity: nextQty < 1 ? 1 : nextQty };
      }
      return item;
     });
     return { cart: updatedCart };
    }),

   // Empties the cart after checkout
   clearCart: () => set({ cart: [] }),

   // Calculates the total price of all items
   getCartSubtotal: () => {
    return get().cart.reduce(
     (acc, item) => acc + item.price * item.quantity,
     0,
    );
   },

   // Counts total number of items for the Navbar bubble
   getCartCount: () => {
    return get().cart.reduce((acc, item) => acc + item.quantity, 0);
   },
  }),
  {
   name: "rein-oro-cart-storage", // Persists cart data in localStorage
  },
 ),
);
