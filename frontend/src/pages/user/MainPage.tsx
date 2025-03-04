import { useEffect, useState } from "react";
import { ShoppingCart, Search, Star, ShoppingBag, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  purchaseCount: number;
  stock: number;
  quantity: number;
}

export default function CustomerMainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, triggerFetch } = useFetch();
  const [items, setItems] = useState<Product[]>([]);
  const { cart, addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      const data = await triggerFetch("/product/", { method: "GET" }, true);
      setItems(data.products);
    };
    getProducts();
  }, []);

  const navigateToCartScreen = () => {
    navigate("/user/cart");
  };

  return (
    <div className="min-h-screen to-blue-300 p-4">
      {/* Navbar */}
      <nav className="bg-white shadow-lg p-4 flex items-center justify-between rounded-lg">
        <h1 className="text-2xl font-bold text-blue-600">E-Commerce</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-3 text-gray-500" size={10} />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <ShoppingCart
            size={24}
            className="cursor-pointer text-blue-600"
            onClick={navigateToCartScreen}
          />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {cart.length}
            </span>
          )}
        </div>
      </nav>

      {/* Loading and Error Handling */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Available Products
        </h2>
        {loading && (
          <p className="text-center text-blue-600">Loading products...</p>
        )}
        {error && <p className="text-center text-red-600">Error: {error}</p>}

        {/* Product Listing */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <Card
                key={product.id}
                className="shadow-xl border border-gray-200 rounded-lg"
              >
                <CardHeader>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </CardHeader>
                <CardContent className="space-y-2 text-center">
                  <CardTitle className="text-lg font-medium text-gray-800">
                    {product.name}
                  </CardTitle>
                  <p className="text-gray-600 text-lg font-semibold">
                    ${product.price}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Star className="text-yellow-500" size={16} />
                    <span>
                      {product.rating} ({product.ratingCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-gray-600 text-sm">
                    <div className="flex items-center space-x-1">
                      <ShoppingBag size={16} />
                      <span>{product.purchaseCount} sold</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Layers size={16} />
                      <span>{product.stock} left</span>
                    </div>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
