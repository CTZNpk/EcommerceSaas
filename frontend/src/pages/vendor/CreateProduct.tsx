import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useFetch from "@/hooks/useFetch";
import { useState } from "react";

const productSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  image: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be at least $1"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function CreateProduct() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { error, loading, triggerFetch } = useFetch();

  const onSubmit = async (data: ProductFormValues) => {
    console.log("WE ARE HERE");
    try {
      console.log("WE ENTERED HERE");
      const formData = new FormData();

      if (imageFile) formData.append("image", imageFile);

      const imageData = await triggerFetch(
        "/vendor/upload-product-pic",
        {
          method: "POST",
          body: formData,
        },
        true,
        false,
      );

      const url = imageData.imageUrl;
      console.log("WE ENTERED HERE");
      data.image = url;


      await triggerFetch(
        "/vendor/add-product",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        },
        true,
      );

      navigate("/vendor-dashboard");
    } catch (e) {
      console.error("Error submitting form:", e);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-blue-100 to-blue-200">
      <div className="max-w-2xl w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-semibold">Product Name</label>
            <Input type="text" {...register("productName")} />
            {errors.productName && (
              <p className="text-red-500 text-sm">
                {errors.productName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Image</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div>
            <label className="block font-semibold">Description</label>
            <Textarea {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Price ($)</label>
            <Input type="number" {...register("price")} />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Category</label>
            <select
              {...register("category")}
              className="border p-2 rounded w-full"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Stock</label>
            <Input type="number" {...register("stock")} />
            {errors.stock && (
              <p className="text-red-500 text-sm">{errors.stock.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}
