import { Trash2, Plus, Minus } from "lucide-react";
import * as COMP from "@/components";
import useFetch from "@/hooks/useFetch";
import { Background } from "@/components/Background";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import useCart from "@/hooks/useCart";

export default function ViewCartPage() {
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
    console.log("WE ARE IN HERER");
    getCart();
    console.log("NO WE ARE MOVING OUT");
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
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
      }

      await triggerFetch(
        "/cart/",
        {
          method: "DELETE",
        },
        true,
      );
    } catch (err) {
      console.error("Order placement failed", err);
    }
  };


  return (
    <Background className="flex items-center justify-center">
      <COMP.Card className="w-full max-w-3xl border-0 shadow-2xl">
        <COMP.CardHeader>
          <COMP.CardTitle className="text-2xl font-bold text-center">
            Shopping Cart
          </COMP.CardTitle>
        </COMP.CardHeader>
        <COMP.CardContent>
          {cart && cart!.items.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart &&
                cart!.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-medium">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600">${item.product.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <COMP.Button
                        size="icon"
                        variant="outline"
                        onClick={() => decrementQuantity(item.product._id)}
                      >
                        <Minus size={16} />
                      </COMP.Button>
                      <span className="text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <COMP.Button
                        size="icon"
                        variant="outline"
                        onClick={() => incrementQuantity(item.product._id)}
                      >
                        <Plus size={16} />
                      </COMP.Button>
                    </div>
                    <COMP.Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeProduct(item.product._id)}
                    >
                      <Trash2 size={16} />
                    </COMP.Button>
                  </div>
                ))}

              {/* Total Price */}
              {cart && (
                <div className="text-xl font-bold text-center mt-4">
                  Total: ${cart!.totalCost}
                </div>
              )}

              {/* Display error if order placement fails */}
              {error && <p className="text-red-600 text-center">{error}</p>}

              {/* Buttons Section */}
              <div className="flex flex-col space-y-2">
                <COMP.Button
                  className="w-full bg-prim hover:bg-hover"
                  onClick={proceedToCheckout}
                  disabled={loading}
                >
                  {loading ? "Proceeding To..." : "Proceed To Checkout"}
                </COMP.Button>
                <COMP.Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={clearCart}
                >
                  Clear Cart
                </COMP.Button>
              </div>
            </div>
          )}
        </COMP.CardContent>
      </COMP.Card>
    </Background>
  );
}
