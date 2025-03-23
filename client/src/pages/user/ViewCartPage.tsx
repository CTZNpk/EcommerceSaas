import { Trash2, Plus, Minus } from "lucide-react";
import * as COMP from "@/components";
import useFetch from "@/hooks/useFetch";
import { Background } from "@/components/Background";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import useCart from "@/hooks/useCart";
import {
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ViewCartPage() {
  const navigate = useNavigate();
  const {
    cart,
    decrementQuantity,
    incrementQuantity,
    getCart,
    removeProduct,
    clearCart,
    error,
    loading,
  } = useCart();

  useEffect(() => {
    getCart();
  }, []);

  const { triggerFetch } = useFetch();

  const proceedToCheckout = async () => {
    try {
      const stripe = await loadStripe(
        "pk_test_51R1Oz7Rt564ooPGdwIVcStiPeUbckVgmIdSoGwpBo7yYXJuhA6FsJbLVaC9pTmJxdKwUO6sla84bxMHIWj0Q05xA004UFiaLKk",
      );

      const response = await triggerFetch(
        "/stripe/create-checkout-session",
        {
          method: "GET",
        },
        true,
      );

      const session = await response.session;
      const result = await stripe!.redirectToCheckout({
        sessionId: session,
      });
      await clearCart();

      if (result.error) {
        console.log(result.error);
      }
    } catch (err) {
      console.error("Order placement failed", err);
    }
  };

  const navigateToMainScreen = () => {
    navigate("/");
  };

  return (
    <Background className="flex items-center justify-center bg-gray-50 py-8">
      <COMP.Card className="w-full max-w-3xl border-0 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <COMP.CardTitle className="text-2xl font-bold text-white">
              Your Shopping Cart
            </COMP.CardTitle>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
              {cart && cart.items.length}{" "}
              {cart && cart.items.length === 1 ? "item" : "items"}
            </div>
          </div>
        </div>

        <COMP.CardContent className="p-6">
          {cart && cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
                <ShoppingCart size={96} />
              </div>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <COMP.Button
                className="mt-6 bg-indigo-600 hover:bg-indigo-700"
                onClick={navigateToMainScreen}
              >
                Continue Shopping
              </COMP.Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {cart &&
                  cart.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 ml-4">
                        <h3 className="text-lg font-medium">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <p className="text-indigo-600 font-bold">
                            ${item.product.price}
                          </p>
                          <p className="text-gray-500 text-sm ml-2">
                            × {item.quantity} = $
                            {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <COMP.Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                          onClick={() => decrementQuantity(item.product._id)}
                        >
                          <Minus size={14} />
                        </COMP.Button>

                        <COMP.Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                          onClick={() => incrementQuantity(item.product._id)}
                        >
                          <Plus size={14} />
                        </COMP.Button>

                        <COMP.Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeProduct(item.product._id)}
                        >
                          <Trash2 size={16} />
                        </COMP.Button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Order Summary */}
              {cart && (
                <div className="bg-gray-50 rounded-xl p-5 mt-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${cart.totalCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${(cart.totalCost * 0.07).toFixed(2)}</span>
                    </div>

                    <div className="border-t border-gray-200 my-2 pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-indigo-700">
                          ${(cart.totalCost * 1.07).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Display error if order placement fails */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                  <div className="flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    {error}
                  </div>
                </div>
              )}

              {/* Buttons Section */}
              <div className="flex flex-col space-y-3 mt-6">
                <COMP.Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-base font-medium rounded-xl"
                  onClick={proceedToCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <ShoppingBag size={18} className="mr-2" />
                      Proceed to Checkout
                    </div>
                  )}
                </COMP.Button>

                <COMP.Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-xl"
                  onClick={clearCart}
                >
                  Clear Cart
                </COMP.Button>

                <COMP.Button
                  variant="link"
                  className="text-indigo-600 hover:text-indigo-800"
                  onClick={navigateToMainScreen}
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Continue Shopping
                </COMP.Button>
              </div>
            </div>
          )}
        </COMP.CardContent>
      </COMP.Card>
    </Background>
  );
}
