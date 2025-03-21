import { Trash2, Plus, Minus } from "lucide-react";
import * as COMP from "@/components";
import { useCartStore } from "@/store/cartStore";
import useFetch from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { Background } from "@/components/Background";

export default function ViewCartPage() {
  const {
    cart,
    totalPrice,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useCartStore();

  const { loading, error, triggerFetch } = useFetch();
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      console.log(cart);
      //TODO NAVIGATE TO SHOW ORDER IS PLACED
      await triggerFetch(
        "/order/create",
        {
          method: "POST",
          body: JSON.stringify({
            products: cart,
            paymentStatus: "cash_on_delivery",
          }),
        },
        true,
      );

      clearCart();
      console.log(cart);
      navigate("/user/main");
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
          {cart.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-medium">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <COMP.Button
                      size="icon"
                      variant="outline"
                      onClick={() => decrementQuantity(item.product.id)}
                    >
                      <Minus size={16} />
                    </COMP.Button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <COMP.Button
                      size="icon"
                      variant="outline"
                      onClick={() => incrementQuantity(item.product.id)}
                    >
                      <Plus size={16} />
                    </COMP.Button>
                  </div>
                  <COMP.Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 size={16} />
                  </COMP.Button>
                </div>
              ))}

              {/* Total Price */}
              <div className="text-xl font-bold text-center mt-4">
                Total: ${totalPrice}
              </div>

              {/* Display error if order placement fails */}
              {error && <p className="text-red-600 text-center">{error}</p>}

              {/* Buttons Section */}
              <div className="flex flex-col space-y-2">
                <COMP.Button
                  className="w-full bg-prim hover:bg-hover"
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order"}
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
