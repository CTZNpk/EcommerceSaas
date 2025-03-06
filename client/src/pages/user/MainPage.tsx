import { useEffect, useState } from "react";
import { ShoppingCart, Search, Star, ShoppingBag, Layers } from "lucide-react";
import * as COMP from "@/components";
import useFetch from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { IProduct } from "@/types/product";
import { Background } from "@/components/Background";

export default function CustomerMainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, triggerFetch } = useFetch();
  const [items, setItems] = useState<IProduct[]>([]);
  const { cart, addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      const data = await triggerFetch(
        "/product/",
        {
          method: "GET",
        },
        true,
      );
      setItems(data.products);
    };
    getProducts();
  }, []);

  const navigateToCartScreen = () => {
    navigate("/user/cart");
  };

  return (
    <Background>
      {/* Navbar */}
      <nav className="bg-white shadow-lg p-4 flex items-center justify-between px-10 ">
        <h1 className="text-2xl font-bold ">Vendora</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-3 text-gray-500" size={10} />
          <COMP.Input
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
            className="cursor-pointer text-prim"
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
        {loading && (
          <p className="text-center text-blue-600">Loading products...</p>
        )}
        {error && <p className="text-center text-red-600">Error: {error}</p>}

        {/* Product Listing */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <COMP.Card
                key={product.id}
                className="shadow-xl border border-gray-200 rounded-lg"
              >
                <COMP.CardHeader>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </COMP.CardHeader>
                <COMP.CardContent className="space-y-2 text-center">
                  <COMP.CardTitle className="text-lg font-medium text-gray-800">
                    {product.name}
                  </COMP.CardTitle>
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
                  <COMP.Button
                    className="bg-prim hover:bg-hover w-full"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </COMP.Button>
                </COMP.CardContent>
              </COMP.Card>
            ))}
          </div>
        )}
      </div>
    </Background>
  );
}
