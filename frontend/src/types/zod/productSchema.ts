import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const productSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  image: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be at least $1"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
const productResolver = zodResolver(productSchema);
export default productResolver;
