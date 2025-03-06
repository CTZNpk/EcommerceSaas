import { ICartItem } from "@/types/cartItem";
import { IProduct } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cart: ICartItem[];
  totalPrice: number;
  addToCart: (product: IProduct) => void;
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
            (item) => item.product.id === product.id,
          );
          let updatedCart;

          if (existingItem) {
            updatedCart = state.cart.map((item) =>
              item.product.id === product.id
                ? {
                    product,
                    quantity: Math.min(item.quantity + 1, product.stock),
                  }
                : item,
            );
          } else {
            updatedCart = [...state.cart, { product, quantity: 1 }];
          }

          return { cart: updatedCart, totalPrice: calculateTotal(updatedCart) };
        });
      },

      removeFromCart: (id) => {
        set((state) => {
          const updatedCart = state.cart.filter(
            (item) => item.product.id !== id,
          );
          return { cart: updatedCart, totalPrice: calculateTotal(updatedCart) };
        });
      },

      incrementQuantity: (id) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.product.id === id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + 1, item.product.stock),
                }
              : item,
          );
          return { cart: updatedCart, totalPrice: calculateTotal(updatedCart) };
        });
      },

      decrementQuantity: (id) => {
        set((state) => {
          const updatedCart = state.cart
            .map((item) =>
              item.product.id === id
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

const calculateTotal = (cart: ICartItem[]) =>
  cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
