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
  Mail,
  Heart,
  Share,
  Truck,
  MessageSquare,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { AccountType } from "@/types/accountEnum";
import useCart from "@/hooks/useCart";

interface IReview {
  id: string;
  userId: string;
  username: string;
  rating: number;
  review: string;
  createdAt: string;
}

export default function ProductView() {
  const { productId } = useParams<{ productId: string }>();
  const { triggerFetch, loading, error } = useFetch();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const isVendor = user?.accountType === AccountType.VENDOR;

  const fetchReviews = async () => {
    const reviewData = await triggerFetch(
      `/reviews/${productId}`,
      { method: "GET" },
      true,
    );

    setReviews(reviewData);
  };

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
      }
    };

    fetchProductData();
    fetchReviews();
  }, []);

  const handleContactVendor = () => {
    if (!product) return;

    navigate(`/chat/${product.vendor}`);
  };

  const handleSubmitReview = async () => {
    await triggerFetch(
      `/reviews/`,
      {
        method: "POST",
        body: JSON.stringify({
          productId,
          rating: newReview.rating,
          review: newReview.comment,
        }),
      },
      true,
    );
    await fetchReviews();
    setIsReviewModalOpen(false);
  };

  const renderRatingStars = (rating: number, clickable?: boolean) => {
    const handleClick = (index: number) => {
      if (clickable) {
        setNewReview({ ...newReview, rating: index });
      }
    };
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={`pr-1 ${
              clickable
                ? "hover:scale-110 transition-transform cursor-pointer"
                : "cursor-default"
            }`}
            onClick={() => handleClick(index + 1)}
            disabled={!clickable}
          >
            <Star
              size={16}
              className={`${
                index < (clickable ? newReview.rating : rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } ${clickable ? "hover:text-yellow-500" : ""}`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {(clickable ? newReview.rating : rating).toFixed(1)}
        </span>
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
    <Background className="bg-gray-100 min-h-screen">
      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <COMP.Button
            variant="ghost"
            className="flex items-center text-gray-700 hover:text-black"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </COMP.Button>

          <div className="flex items-center space-x-2">
            {isVendor && (
              <COMP.Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? "Cancel" : "Edit"}
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

      <div className="mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          Home / {product.category} / {product.name}
        </div>

        {/* Product Brief */}
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Carousel */}
            <div className="h-[400px] lg:h-[500px] relative group bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
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
                      className={`h-2 rounded-full ${
                        i === 1 ? "w-8 bg-indigo-700" : "w-2 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8">
              <div className="space-y-4">
                {/* Product Title and Rating */}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    {renderRatingStars(product.rating || 0)}
                    <span className="text-sm text-gray-600">
                      {reviews.length} reviews
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-4xl font-bold text-indigo-700">
                  ${Number(product.price).toFixed(2)}
                </div>

                {/* Description */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        product.stock > 0 ? "bg-green-500" : "bg-red-500"
                      } mr-2`}
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

                {/* Action Buttons */}
                {!isEditing && !isVendor && user && (
                  <div className="flex flex-col gap-3 pt-4">
                    <COMP.Button
                      className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 text-lg rounded-xl shadow-lg transition-all"
                      onClick={async () => await addToCart(product._id)}
                      disabled={!product.stock}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {product.stock ? "Add to Cart" : "Notify Me"}
                    </COMP.Button>

                    <div className="flex gap-3">
                      <COMP.Button
                        variant="outline"
                        className="flex-1 py-2 rounded-xl border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                        onClick={handleContactVendor}
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        Contact
                      </COMP.Button>

                      <COMP.Button
                        variant="outline"
                        className="flex-1 py-2 rounded-xl border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                      >
                        <Heart className="mr-2 h-5 w-5" />
                        Wishlist
                      </COMP.Button>
                    </div>
                    <div className="container mx-auto px-4 py-8">
                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold">
                            Customer Reviews
                          </h2>
                          {user && !isVendor && (
                            <COMP.Button
                              onClick={() => setIsReviewModalOpen(true)}
                              className="bg-indigo-700 hover:bg-indigo-800 text-white"
                            >
                              <MessageSquare className="mr-2 h-5 w-5" />
                              Leave a Review
                            </COMP.Button>
                          )}
                        </div>

                        {reviews.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">No reviews yet</p>
                            {user && !isVendor && (
                              <COMP.Button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="bg-indigo-700 hover:bg-indigo-800 text-white"
                              >
                                Be the First to Review
                              </COMP.Button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {reviews.map((review) => (
                              <div
                                key={review.id}
                                className="border-b pb-4 last:border-b-0"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <div className="font-medium text-gray-900">
                                    {review.username}
                                  </div>
                                  {renderRatingStars(review.rating)}
                                </div>
                                <p className="text-gray-700">
                                  {review.review}
                                </p>
                                <div className="text-sm text-gray-500 mt-2">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Modal */}
                    {isReviewModalOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                          <h2 className="text-2xl font-bold mb-4">
                            Leave a Review
                          </h2>
                          <div className="mb-4">
                            <label className="block mb-2">Rating</label>
                            {renderRatingStars(newReview.rating, true)}
                          </div>
                          <div className="mb-4">
                            <label className="block mb-2">Comment</label>
                            <textarea
                              className="w-full border rounded-md p-2"
                              rows={4}
                              value={newReview.comment}
                              onChange={(e) =>
                                setNewReview({
                                  ...newReview,
                                  comment: e.target.value,
                                })
                              }
                              placeholder="Share your experience with this product"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <COMP.Button
                              variant="outline"
                              onClick={() => setIsReviewModalOpen(false)}
                            >
                              Cancel
                            </COMP.Button>
                            <COMP.Button
                              onClick={handleSubmitReview}
                              disabled={
                                newReview.rating === 0 ||
                                !newReview.comment.trim()
                              }
                              className="bg-indigo-700 hover:bg-indigo-800 text-white"
                            >
                              Submit Review
                            </COMP.Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="overflow-hidden">
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
                      src={`https://source.unsplash.com/400x300/?product&sig=${i}`}
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
    </Background>
  );
}
