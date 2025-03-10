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

// Define the review interface
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
  //TODO
  // const isOwner = isVendor && product?.vendorId === user?.id;

  useEffect(() => {
    const fetchProductData = async () => {
      // Fetch product details
      const productData = await triggerFetch(
        `/product/${productId}`,
        {
          method: "GET",
        },
        true,
      );

      if (productData && productData.product) {
        const formattedProduct = {
          ...productData.product,
          id: productData.product._id || productData.product.id,
        };
        setProduct(formattedProduct);
        setUpdatedProduct(formattedProduct);

        // Fetch reviews for this product
        // const reviewsData = await triggerFetch(
        //   `/product/${productId}/reviews`,
        //   {
        //     method: "GET",
        //   },
        //   true,
        // );
        //
        // if (reviewsData && reviewsData.reviews) {
        //   setReviews(reviewsData.reviews);
        // }
      }
    };
    fetchProductData();
  }, []);

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

    if (data && data.product) {
      const updatedData = {
        ...data.product,
        id: data.product._id || data.product.id,
      };
      setProduct(updatedData);
      setUpdatedProduct(updatedData);
      setIsEditing(false);
    }
  };

  const handleContactVendor = async () => {
    if (!product) return;

    // Navigate to contact page or open contact modal
    // navigate(
    //   `/contact-vendor/${product.vendorId}?productName=${encodeURIComponent(product.name)}`,
    // );
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
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <Background className="flex flex-col items-center justify-center min-h-screen">
        <COMP.Alert variant="destructive" className="max-w-md">
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
      <Background className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-medium mb-4">Product not found</h2>
        <COMP.Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </COMP.Button>
      </Background>
    );

  return (
    <Background className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <COMP.Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </COMP.Button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Left Column - Image */}
            <div className="md:w-1/2">
              <div className="relative h-80 md:h-full">
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

            {/* Right Column - Product Details */}
            <div className="md:w-1/2 p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <COMP.Input
                      name="name"
                      value={updatedProduct.name || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <COMP.Textarea
                      name="description"
                      value={updatedProduct.description || ""}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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

                  <div className="flex space-x-3 pt-4">
                    <COMP.Button className="flex-1" onClick={handleUpdate}>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
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
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    {
                      <COMP.Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </COMP.Button>
                    }
                  </div>

                  <div className="mt-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.stock <= 5 && (
                      <Badge className="ml-3 bg-red-500">
                        {product.stock === 0 ? "Out of Stock" : "Low Stock"}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-1">
                    {renderRatingStars(product.rating || 0)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.ratingCount} reviews)
                    </span>
                  </div>

                  <div className="mt-6 text-gray-700">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
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
                    <div>
                      <span className="font-medium text-gray-500">Sold:</span>
                      <p>{product.purchaseCount || 0} times</p>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    {!isVendor && user && (
                      <COMP.Button
                        className="flex-1 bg-prim hover:bg-hover"
                        onClick={() => addToCart(product)}
                        disabled={!product.stock}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.stock ? "Add to Cart" : "Out of Stock"}
                      </COMP.Button>
                    )}

                    <COMP.Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleContactVendor}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Vendor
                    </COMP.Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">
              No reviews yet for this product.
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{review.username}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {renderRatingStars(review.rating)}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {user && !isVendor && (
            <div className="mt-6">
              <COMP.Button variant="outline" className="w-full">
                Write a Review
              </COMP.Button>
            </div>
          )}
        </div>
      </div>
    </Background>
  );
}
