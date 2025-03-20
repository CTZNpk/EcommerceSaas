import { ICartItem } from "@/types/cartItem";
import useFetch from "./useFetch";
import { useState } from "react";

export interface ICart extends Document {
  items: ICartItem[];
  totalCost: number;
}

const useCart = () => {
  const { triggerFetch, loading, error } = useFetch();
  const [cart, setCart] = useState<ICart>();

  const getCart = async () => {
    const response = (
      await triggerFetch(
        "/cart/",
        {
          method: "GET",
        },
        true,
      )
    ).cart as ICart;
    setCart(response);
    return response;
  };

  const clearCart = async () => {
    const response = (
      await triggerFetch(
        "/cart/delete ",
        {
          method: "DELETE",
        },
        true,
      )
    ).data as ICart;
    setCart(response);
    return response;
  };

  const incrementQuantity = async (productId: string) => {
    const product = cart?.items.find(
      (product) => product.product._id == productId,
    );
    const response = (
      await triggerFetch(
        "/cart/update-quantity",
        {
          method: "POST",
          body: JSON.stringify({
            productId: productId,
            quantity: product?.quantity! + 1,
          }),
        },
        true,
      )
    ).cart as ICart;
    setCart(response);
    return response;
  };

  const decrementQuantity = async (productId: string) => {
    const product = cart?.items.find(
      (product) => product.product._id == productId,
    );
    const response = (
      await triggerFetch(
        "/cart/update-quantity",
        {
          method: "POST",
          body: JSON.stringify({
            productId: productId,
            quantity: product?.quantity! - 1,
          }),
        },
        true,
      )
    ).cart as ICart;
    setCart(response);
    return response;
  };

  const removeProduct = async (productId: string) => {
    const response = (
      await triggerFetch(
        "/cart/update-quantity",
        {
          method: "POST",
          body: JSON.stringify({
            productId: productId,
          }),
        },
        true,
      )
    ).data as ICart;
    setCart(response);
    return response;
  };

  const addToCart = async (productId: string) => {
    const response = (
      await triggerFetch(
        "/cart/add",
        {
          method: "POST",
          body: JSON.stringify({
            productId: productId,
            quantity: 1,
          }),
        },
        true,
      )
    ).data as ICart;
    setCart(response);
    return response;
  };

  return {
    cart,
    incrementQuantity,
    decrementQuantity,
    removeProduct,
    clearCart,
    addToCart,
    getCart,
    loading,
    error,
  };
};

export default useCart;
