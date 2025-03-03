import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productName: "",
    image: null,
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (_: React.ChangeEvent<HTMLInputElement>) => {
    console.log("HELLO IMAGE");
    // const file = e.target.files?.[0] || null;
    // setProduct((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product submitted:", product);
    navigate("/vendor-dashboard"); // Redirect after submission
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen
     bg-gradient-to-br from-white via-blue-100 to-blue-200"
    >
      <div className="max-w-2xl w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block font-semibold">Product Name</label>
            <Input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-semibold">Image</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold">Description</label>
            <Textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-semibold">Price ($)</label>
            <Input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block font-semibold">Stock</label>
            <Input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 text-white">
            Create Product
          </Button>
        </form>
      </div>
    </div>
  );
}
