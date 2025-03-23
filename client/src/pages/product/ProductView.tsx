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
import useCart from "@/hooks/useCart";

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
  const { addToCart } = useCart();

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

    navigate(`/chat/${product.vendor}`);
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
          className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md rounded-full p-3"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </COMP.Button>

        <div className="md:flex min-h-screen">
          {/* Image Gallery Section */}
          <div className="md:w-1/2 lg:w-[55%] xl:w-[60%] md:sticky md:top-0 md:h-screen">
            <div className="relative h-[500px] md:h-full bg-gray-50 group">
              {/* Main Image with Zoom Effect */}
              <div className="relative h-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-1 px-3">
                    {product.category}
                  </Badge>
                  {product.stock <= 5 && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                      {product.stock === 0
                        ? "Out of Stock"
                        : `Only ${product.stock} left`}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="flex gap-3 justify-center">
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 lg:w-[45%] xl:w-[40%] p-6 md:p-8 lg:p-12 bg-white">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    {product.name}
                  </h1>
                  {isVendor && (
                    <COMP.Button
                      variant="outline"
                      size="sm"
                      className="rounded-full shadow-sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {isEditing ? "Cancel Edit" : "Edit Product"}
                    </COMP.Button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {renderRatingStars(product.rating || 0)}
                  <span className="text-sm text-gray-500">
                    {product.ratingCount} reviews • {product.purchaseCount} sold
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </div>
              {/* Action Buttons */}
              {!isEditing && (
                <div className="flex flex-col gap-3">
                  {!isVendor && user && (
                    <COMP.Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg rounded-xl shadow-lg transition-all"
                      onClick={async () => await addToCart(product._id)}
                      disabled={!product.stock}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {product.stock ? "Add to Cart" : "Notify When Available"}
                    </COMP.Button>
                  )}

                  <COMP.Button
                    variant="outline"
                    className="w-full py-6 text-lg rounded-xl border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    onClick={handleContactVendor}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Contact Vendor
                  </COMP.Button>
                </div>
              )}

              {/* Product Details */}
              {!isEditing ? (
                <div className="space-y-8">
                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-500">Category</label>
                        <p className="font-medium">{product.category}</p>
                      </div>
                      <div>
                        <label className="text-gray-500">SKU</label>
                        <p className="font-mono text-gray-700">{product._id}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-500">Availability</label>
                        <p className="font-medium">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Backorder available"}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-500">Shipping</label>
                        <p className="font-medium">Free worldwide shipping</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose max-w-none border-t pt-8">
                    <h3 className="text-xl font-bold mb-4">Product Details</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              ) : (
                /* Edit Form */
                <div className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Product Name
                      </label>
                      <COMP.Input
                        name="name"
                        value={updatedProduct.name || ""}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <COMP.Input
                        name="category"
                        value={updatedProduct.category || ""}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <COMP.Textarea
                      name="description"
                      value={updatedProduct.description || ""}
                      onChange={handleChange}
                      rows={5}
                      className="rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price ($)</label>
                      <COMP.Input
                        name="price"
                        type="number"
                        value={updatedProduct.price || ""}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stock</label>
                      <COMP.Input
                        name="stock"
                        type="number"
                        value={updatedProduct.stock || ""}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <COMP.Button
                      className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg py-5"
                      onClick={handleUpdate}
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </COMP.Button>
                    <COMP.Button
                      variant="outline"
                      className="flex-1 rounded-lg py-5"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="mr-2 h-4 w-4" /> Discard
                    </COMP.Button>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-4">
                      Be the first to review this product!
                    </p>
                    <COMP.Button variant="outline">Write a Review</COMP.Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-white transition-all cursor-pointer border border-transparent hover:border-blue-200"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-blue-600">
                              {review.username[0]}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{review.username}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderRatingStars(review.rating)}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
