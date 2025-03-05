import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  cart: CartItem[];
  totalPrice: number;
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
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
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + 1, product.stock),
                  }
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

      incrementQuantity: (id) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
              : item,
          );
          return { cart: updatedCart, totalPrice: calculateTotal(updatedCart) };
        });
      },

      decrementQuantity: (id) => {
        set((state) => {
          const updatedCart = state.cart
            .map((item) =>
              item.id === id
                ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
                : item,
            )
            .filter((item) => item.quantity > 0);
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
