import { VendorLayout } from "@/components/VendorLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function VendorProducts() {
  const navigate = useNavigate();
  const [loading, _] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: "Product A", price: "$50", stock: 10 },
    { id: 2, name: "Product B", price: "$30", stock: 5 },
  ]);

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <VendorLayout>
      <div className="space-y-6 p-8 pt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">My Products</h2>
          <Button
            onClick={() => navigate("/vendor/products/new")}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5" />
            Create Product
          </Button>
        </div>

        {/* Product List */}
        <div className="border rounded-lg p-4 bg-white shadow">
          {loading && products.length === 0 ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Price: {product.price} | Stock: {product.stock}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/vendor/products/${product.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </VendorLayout>
  );
}
