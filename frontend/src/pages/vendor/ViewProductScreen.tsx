import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import * as COMP from "@/components";
import { IProduct } from "@/types/product";
import { Background } from "@/components/Background";

export default function VendorProductView() {
  const { productId } = useParams<{ productId: string }>();
  const { triggerFetch, loading, error } = useFetch();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState<Partial<IProduct>>({});

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await triggerFetch(
        `/product/${productId}`,
        {
          method: "GET",
        },
        true,
      );

      if (data && data.product) {
        setProduct({ ...data.product, id: data.product._id }); // Convert _id to id
        setUpdatedProduct({ ...data.product, id: data.product._id });
      }
    };

    fetchProduct();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    console.log(updatedProduct);
    const data = await triggerFetch(
      `/vendor/update-product`,
      {
        method: "POST",
        body: JSON.stringify(updatedProduct),
      },
      true,
    );

    if (data && data.product) {
      setProduct({ ...data.product, id: data.product._id }); // Ensure correct id mapping
      setIsEditing(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center">Product not found.</p>;

  return (
    <Background>
      <COMP.Card className="max-w-2xl w-full p-6 bg-white shadow-md rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-md"
        />

        {isEditing ? (
          <>
            <COMP.Input
              name="name"
              value={updatedProduct.name || ""}
              onChange={handleChange}
              className="mt-4"
            />
            <COMP.Textarea
              name="description"
              value={updatedProduct.description || ""}
              onChange={handleChange}
              className="mt-2"
            />
            <COMP.Input
              name="price"
              type="number"
              value={updatedProduct.price || ""}
              onChange={handleChange}
              className="mt-2"
            />
            <COMP.Input
              name="stock"
              type="number"
              value={updatedProduct.stock || ""}
              onChange={handleChange}
              className="mt-2"
            />
            <COMP.Button
              className="w-full mt-4 bg-green-600 text-white"
              onClick={handleUpdate}
            >
              Save Changes
            </COMP.Button>
            <COMP.Button
              className="w-full mt-2 bg-gray-600 text-white"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </COMP.Button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="text-lg font-semibold mt-2">${product.price}</p>
            <p className="mt-1 text-gray-500">Category: {product.category}</p>
            <p className="mt-1 text-gray-500">Stock: {product.stock}</p>
            <p className="mt-1 text-gray-500">
              Rating: {product.rating} ({product.ratingCount} reviews)
            </p>
            <p className="mt-1 text-gray-500">
              Purchased: {product.purchaseCount} times
            </p>
            <COMP.Button
              className="w-full mt-4 bg-blue-600 text-white"
              onClick={() => setIsEditing(true)}
            >
              Edit Product
            </COMP.Button>
          </>
        )}
      </COMP.Card>
    </Background>
  );
}
