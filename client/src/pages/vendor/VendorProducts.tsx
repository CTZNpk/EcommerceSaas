import * as COMP from "@/components";
import { PlusCircle, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";

export default function VendorProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const { loading, triggerFetch } = useFetch();

  async function handleDelete(productId: string) {
    await triggerFetch(
      `/vendor/delete-product/${productId}`,
      {
        method: "DELETE",
      },
      true,
    );
  }

  useEffect(() => {
    const getMyProducts = async () => {
      const result = await triggerFetch(
        "/vendor/get-all-products",
        {
          method: "GET",
        },
        true,
      );
      setProducts(result.products);
    };
    getMyProducts();
  }, []);

  return (
    <COMP.VendorLayout>
      <div className="space-y-6 p-8 pt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">My Products</h2>
          <COMP.Button
            onClick={() => navigate("/vendor/products/new")}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5" />
            Create Product
          </COMP.Button>
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
                  key={product._id}
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
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
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
    </COMP.VendorLayout>
  );
}
