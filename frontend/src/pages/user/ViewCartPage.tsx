import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function ViewCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Smartphone",
      price: 699,
      imageUrl: "https://via.placeholder.com/150",
      quantity: 1,
    },
    {
      id: "2",
      name: "Laptop",
      price: 1299,
      imageUrl: "https://via.placeholder.com/150",
      quantity: 1,
    },
    {
      id: "3",
      name: "Wireless Headphones",
      price: 199,
      imageUrl: "https://via.placeholder.com/150",
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Card className="w-full max-w-3xl border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Shopping Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <div className="text-xl font-bold text-center mt-4">
                Total: ${totalPrice}
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Proceed to Checkout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
