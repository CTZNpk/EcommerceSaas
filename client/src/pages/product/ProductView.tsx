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
  Heart,
  Share,
  PenTool,
  MessageSquare,
  Truck,
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
    <Background className="bg-gray-100">
      <div className="w-full max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <COMP.Button
              variant="ghost"
              className="flex items-center text-gray-700 hover:text-black"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </COMP.Button>

            <div className="flex items-center space-x-4">
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
              <COMP.Button variant="ghost" className="rounded-full p-2">
                <Heart className="h-5 w-5" />
              </COMP.Button>
              <COMP.Button variant="ghost" className="rounded-full p-2">
                <Share className="h-5 w-5" />
              </COMP.Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600 mb-8">
            Home / {product.category} / {product.name}
          </div>

          {/* Product Brief */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Product Header - Mobile View */}
              <div className="p-6 lg:hidden">
                <div className="space-y-3">
                  <Badge className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm py-1 px-3">
                    {product.category}
                  </Badge>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    {renderRatingStars(product.rating || 0)}
                    <span className="text-sm text-gray-600">
                      {product.ratingCount} reviews
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-indigo-700">
                    ${Number(product.price).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Image Carousel */}
              <div className="col-span-6 h-[400px] lg:h-[500px] relative group bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Badges - Desktop */}
                <div className="absolute top-4 left-4 hidden lg:flex flex-col gap-2">
                  <Badge className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm py-1 px-3">
                    {product.category}
                  </Badge>
                  {product.stock <= 5 && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1 bg-red-600 text-white"
                    >
                      <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                      {product.stock === 0
                        ? "Out of Stock"
                        : `Only ${product.stock} left`}
                    </Badge>
                  )}
                </div>

                {/* Image Navigation */}
                <div className="absolute bottom-4 left-0 right-0 px-4">
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3].map((i) => (
                      <button
                        key={i}
                        className={`h-2 rounded-full ${i === 1 ? "w-8 bg-indigo-700" : "w-2 bg-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="col-span-6 p-8 hidden lg:block">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      {renderRatingStars(product.rating || 0)}
                      <span className="text-sm text-gray-600">
                        {product.ratingCount} reviews • {product.purchaseCount}{" "}
                        sold
                      </span>
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-indigo-700">
                    ${Number(product.price).toFixed(2)}
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <div
                        className={`h-3 w-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"} mr-2`}
                      ></div>
                      <span className="text-sm font-medium">
                        {product.stock > 0
                          ? `In Stock (${product.stock})`
                          : "Out of Stock"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium">Free Shipping</span>
                    </div>
                  </div>

                  {!isEditing && !isVendor && user && (
                    <div className="flex flex-col gap-3 pt-4">
                      <COMP.Button
                        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-6 text-lg rounded-xl shadow-lg transition-all"
                        onClick={async () => await addToCart(product._id)}
                        disabled={!product.stock}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {product.stock
                          ? "Add to Cart"
                          : "Notify When Available"}
                      </COMP.Button>

                      <div className="flex gap-3">
                        <COMP.Button
                          variant="outline"
                          className="flex-1 py-3 rounded-xl border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                          onClick={handleContactVendor}
                        >
                          <Mail className="mr-2 h-5 w-5" />
                          Contact Vendor
                        </COMP.Button>

                        <COMP.Button
                          variant="outline"
                          className="flex-1 py-3 rounded-xl border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                        >
                          <Heart className="mr-2 h-5 w-5" />
                          Add to Wishlist
                        </COMP.Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="lg:hidden sticky bottom-0 bg-white p-4 border-t shadow-lg z-40">
            {!isEditing && !isVendor && user && (
              <div className="flex gap-3">
                <COMP.Button
                  className="flex-1 bg-indigo-700 hover:bg-indigo-800 text-white py-3 text-base rounded-xl shadow-lg transition-all"
                  onClick={async () => await addToCart(product._id)}
                  disabled={!product.stock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock ? "Add to Cart" : "Notify Me"}
                </COMP.Button>

                <COMP.Button
                  variant="outline"
                  className="py-3 rounded-xl border-gray-300"
                  onClick={handleContactVendor}
                >
                  <Mail className="h-5 w-5" />
                </COMP.Button>
              </div>
            )}
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <div className="flex">
                {["Details", "Specifications", "Reviews", "Shipping"].map(
                  (tab, index) => (
                    <button
                      key={tab}
                      className={`px-6 py-4 text-sm font-medium ${
                        index === 0
                          ? "text-indigo-700 border-b-2 border-indigo-700"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>
            </div>

            {!isEditing ? (
              <div className="p-6">
                {/* Product Details */}
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold mb-4">Product Details</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">
                        Specifications
                      </h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">Category</div>
                          <div className="font-medium">{product.category}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">SKU</div>
                          <div className="font-mono text-gray-700">
                            {product._id}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">Warranty</div>
                          <div className="font-medium">1 Year</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4">Shipping</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">Availability</div>
                          <div className="font-medium">
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Backorder available"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">Delivery</div>
                          <div className="font-medium">2-5 business days</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">Returns</div>
                          <div className="font-medium">
                            30-day return policy
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Form */
              <div className="p-6">
                <div className="space-y-6">
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
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <COMP.Button variant="outline" className="rounded-lg">
                  <PenTool className="mr-2 h-4 w-4" />
                  Write a Review
                </COMP.Button>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <MessageSquare size={64} />
                </div>
                <p className="text-gray-600 mb-6">
                  Be the first to review this product!
                </p>
                <COMP.Button variant="outline">Write a Review</COMP.Button>
              </div>
            ) : (
              <div className="p-6">
                {/* Review Summary */}
                <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-700">
                      {product.rating?.toFixed(1) || "0.0"}
                    </div>
                    <div className="flex mt-1">
                      {renderRatingStars(product.rating || 0)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {product.ratingCount} reviews
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <div className="text-sm text-gray-600 w-6">
                            {star}
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-white transition-all cursor-pointer border border-transparent hover:border-indigo-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-indigo-700">
                            {review.username[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{review.username}</h4>
                          <p className="text-sm text-gray-600">
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
              </div>
            )}
          </div>

          {/* Related Products */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">You May Also Like</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="h-40 bg-gray-50">
                      <img
                        src={`https://images.unsplash.com/photo-155${i}009158-9ebf69173e03?w=400&h=300&auto=format&fit=crop&q=60`}
                        alt={`Related product ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                        Related Product {i}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">Category</p>
                      <div className="font-bold text-indigo-700">$99.99</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
