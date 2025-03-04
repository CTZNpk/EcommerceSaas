import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  totalPrice: number;
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, _) => ({
      cart: [],
      totalPrice: 0,

      addToCart: (product) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id,
          );
          let updatedCart;

          if (existingItem) {
            updatedCart = state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          } else {
            updatedCart = [...state.cart, { ...product, quantity: 1 }];
          }

          return { cart: updatedCart, totalPrice: calculateTotal(updatedCart) };
        });
      },

      removeFromCart: (id) => {
        set((state) => {
          const updatedCart = state.cart.filter((item) => item.id !== id);
          return { cart: updatedCart, totalPrice: calculateTotal(updatedCart) };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          );
          return { cart: updatedCart, totalPrice: calculateTotal(updatedCart) };
        });
      },

      clearCart: () => set({ cart: [], totalPrice: 0 }),
    }),
    { name: "cart-storage" },
  ),
);

const calculateTotal = (cart: CartItem[]) =>
  cart.reduce((total, item) => total + item.price * item.quantity, 0);
