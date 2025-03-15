import * as COMP from "@/components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import productResolver, { ProductFormValues } from "@/types/zod/productSchema";
import useFetch from "@/hooks/useFetch";
import { useState } from "react";
import { Background } from "@/components/Background";

export default function CreateProduct() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: productResolver,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { error, loading, triggerFetch } = useFetch();

  const onSubmit = async (data: ProductFormValues) => {
    try {
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

      navigate("/vendor/dashboard");
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
    <Background className="flex items-center justify-center">
      <div className="max-w-2xl w-xl mx-auto bg-white p-6 rounded-lg shadow ">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 ">Create New Product</h2>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-semibold">Product Name</label>
            <COMP.Input type="text" {...register("productName")} />
            {errors.productName && (
              <p className="text-red-500 text-sm">
                {errors.productName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Image</label>
            <COMP.Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <label className="block font-semibold">Description</label>
            <COMP.Textarea {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Price ($)</label>
            <COMP.Input type="number" {...register("price")} />
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
            <COMP.Input type="number" {...register("stock")} />
            {errors.stock && (
              <p className="text-red-500 text-sm">{errors.stock.message}</p>
            )}
          </div>

          <COMP.Button
            type="submit"
            className="w-full bg-prim hover:bg-hover text-white"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </COMP.Button>
        </form>
      </div>
    </Background>
  );
}
