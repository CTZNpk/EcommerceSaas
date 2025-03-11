import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import * as COMP from "@/components";
import { IProduct } from "@/types/product";
import { Background } from "@/components/Background";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Edit,
  ShoppingCart,
  ArrowLeft,
  Save,
  X,
  Mail,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { AccountType } from "@/types/accountEnum";
import { useCartStore } from "@/store/cartStore";

interface IReview {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductView() {
  const { productId } = useParams<{ productId: string }>();
  const { triggerFetch, loading, error } = useFetch();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, _] = useState<IReview[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState<Partial<IProduct>>({});
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  const isVendor = user?.accountType === AccountType.VENDOR;
  // TODO: Implement owner check
  // const isOwner = isVendor && product?.vendorId === user?.id;

  useEffect(() => {
    const fetchProductData = async () => {
      const productData = await triggerFetch(
        `/product/${productId}`,
        { method: "GET" },
        true,
      );

      if (productData?.product) {
        const formattedProduct = {
          ...productData.product,
          id: productData.product._id || productData.product.id,
        };
        setProduct(formattedProduct);
        setUpdatedProduct(formattedProduct);
      }
    };
    fetchProductData();
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    // if (!isOwner) return;

    const data = await triggerFetch(
      `/vendor/update-product`,
      {
        method: "POST",
        body: JSON.stringify(updatedProduct),
      },
      true,
    );

    if (data?.product) {
      const updatedData = {
        ...data.product,
        id: data.product._id || data.product.id,
      };
      setProduct(updatedData);
      setUpdatedProduct(updatedData);
      setIsEditing(false);
    }
  };

  const handleContactVendor = () => {
    if (!product) return;
    // Implement contact vendor logic
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            className={`${
              index < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-700 font-medium">Loading product...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <Background className="flex flex-col items-center justify-center min-h-screen p-4">
        <COMP.Alert variant="destructive" className="max-w-md w-full">
          <p>{error}</p>
        </COMP.Alert>
        <COMP.Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </COMP.Button>
      </Background>
    );

  if (!product)
    return (
      <Background className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-medium mb-4">Product not found</h2>
        <COMP.Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </COMP.Button>
      </Background>
    );

  return (
    <Background className="p-0">
      <div className="w-full">
        <COMP.Button
          variant="ghost"
          className="absolute top-4 left-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </COMP.Button>

        <div className="md:flex md:h-screen">
          {/* Image Section */}
          <div className="md:w-1/2 md:fixed md:top-0 md:left-0 md:h-full">
            <div className="relative h-96 md:h-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-blue-500">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 md:ml-auto p-6 md:p-8 md:h-full md:overflow-y-auto">
            {isEditing ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name
                    </label>
                    <COMP.Input
                      name="name"
                      value={updatedProduct.name || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <COMP.Textarea
                      name="description"
                      value={updatedProduct.description || ""}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Price ($)
                      </label>
                      <COMP.Input
                        name="price"
                        type="number"
                        value={updatedProduct.price || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Stock
                      </label>
                      <COMP.Input
                        name="stock"
                        type="number"
                        value={updatedProduct.stock || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <COMP.Button className="flex-1" onClick={handleUpdate}>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </COMP.Button>
                    <COMP.Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </COMP.Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {/* Product Header */}
                <div className="flex justify-between items-start mb-8">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {product.name}
                  </h1>
                  <COMP.Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </COMP.Button>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                  {/* Price and Rating */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <span className="text-3xl font-bold text-blue-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      {product.stock <= 5 && (
                        <Badge className="ml-3 bg-red-500">
                          {product.stock === 0 ? "Out of Stock" : "Low Stock"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-end">
                      {renderRatingStars(product.rating || 0)}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-3">
                      Product Details
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-500">
                          Category:
                        </span>
                        <p>{product.category}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">
                          Available:
                        </span>
                        <p>{product.stock} units</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-500">Sold:</span>
                        <p>{product.purchaseCount || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">SKU:</span>
                        <p className="font-mono">{product.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 mt-8">
                    {!isVendor && user && (
                      <COMP.Button
                        className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                        onClick={() => addToCart(product)}
                        disabled={!product.stock}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {product.stock ? "Add to Cart" : "Out of Stock"}
                      </COMP.Button>
                    )}

                    <COMP.Button
                      variant="outline"
                      className="w-full py-6 text-lg"
                      onClick={handleContactVendor}
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Contact Vendor
                    </COMP.Button>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 border-t pt-8">
                  <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No reviews yet. Be the first to review this product!
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-6 last:border-0"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <span className="font-medium">
                                {review.username}
                              </span>
                              <span className="text-gray-500 text-sm ml-2">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {renderRatingStars(review.rating)}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Background>
  );
}
