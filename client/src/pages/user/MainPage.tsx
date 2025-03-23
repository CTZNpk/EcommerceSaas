import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  Star,
  ShoppingBag,
  Layers,
  Heart,
  Filter,
  ChevronDown,
  ArrowRight,
  Tag,
  Clock,
  X,
} from "lucide-react";
import * as COMP from "@/components";
import useFetch from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { IProduct } from "@/types/product";
import { Background } from "@/components/Background";
import useCart from "@/hooks/useCart";

export default function CustomerMainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, triggerFetch } = useFetch();
  const [items, setItems] = useState<IProduct[]>([]);
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const data =
        searchQuery == ""
          ? await triggerFetch(
              "/product/",
              {
                method: "GET",
              },
              true,
            )
          : await triggerFetch(
              `/product/search?query=${searchQuery}&top_k=2`,
              {
                method: "GET",
              },
              true,
            );
      setItems(data.products);
    };
    getProducts();
  }, [searchQuery]);

  const navigateToViewProductScreen = (id: string) => {
    navigate(`/product/${id}`);
  };

  const navigateToCartScreen = () => {
    navigate("/cart");
  };

  const handleAddToCart = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await addToCart(id);
  };

  const categories = [
    {
      id: "All",
      label: "All",
      image:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "Electronics",
      label: "Electronics",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "Clothing",
      label: "Clothing",
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "Home",
      label: "Home",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "Beauty",
      label: "Beauty",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <Background className="min-h-screen bg-gray-50">
      {/* Top Promo Banner */}
      {showPromo && (
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 text-white py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tag size={16} className="animate-pulse" />
              <p className="text-sm font-medium">
                Limited time offer: Free shipping on orders over $50!
              </p>
            </div>
            <button
              onClick={() => setShowPromo(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close promotion"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header with enhanced styling */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        {/* Top nav bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-700 flex items-center">
                <ShoppingBag className="mr-2 text-indigo-600" />
                Vendora
              </h1>
            </div>

            <div className="flex-1 max-w-xl mx-6">
              <div className="relative rounded-full bg-gray-100 flex items-center">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <COMP.Input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  className="pl-10 pr-4 py-2 rounded-full border-0 bg-gray-100 focus:ring-2 focus:ring-indigo-500 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-indigo-600 flex flex-col items-center">
                <Heart size={20} />
                <span className="text-xs mt-1">Wishlist</span>
              </button>

              <div className="relative" onClick={navigateToCartScreen}>
                <button className="text-gray-600 hover:text-indigo-600 flex flex-col items-center">
                  <ShoppingCart size={20} />
                  <span className="text-xs mt-1">Cart</span>
                </button>
                {cart?.items && cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                    {cart.items.length}
                  </span>
                )}
              </div>

              <div className="border-l pl-4 border-gray-200">
                <div className="flex items-center space-x-2">
                  <img
                    src="/api/placeholder/36/36"
                    alt="User avatar"
                    className="rounded-full w-8 h-8"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Account
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category navigation */}
        <nav className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex space-x-8 py-3 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`whitespace-nowrap text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                      category === cat.label
                        ? "bg-indigo-100 text-indigo-800"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                    onClick={() => setCategory(cat.label)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <button
                className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 py-3"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={16} className="mr-1" />
                Filters
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </nav>

        {/* Filter panel - conditionally rendered */}
        {isFilterOpen && (
          <div className="border-t border-gray-200 py-4 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <COMP.Input
                      type="number"
                      placeholder="Min"
                      className="w-full"
                    />
                    <span className="text-gray-500">-</span>
                    <COMP.Input
                      type="number"
                      placeholder="Max"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="">Any Rating</option>
                    <option value="4">4★ & Above</option>
                    <option value="3">3★ & Above</option>
                    <option value="2">2★ & Above</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="">All Items</option>
                    <option value="instock">In Stock</option>
                    <option value="lowstock">Low Stock</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <COMP.Button className="bg-indigo-600 hover:bg-indigo-700 w-full">
                    Apply Filters
                  </COMP.Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Banner */}
        <div className="p-5">
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative">
              {/* Background with gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-800/80 to-transparent z-10"></div>

              {/* Background image */}
              <div className="relative h-72 md:h-96 bg-indigo-900">
                {/* Abstract shapes */}
                <div className="absolute -right-24 -top-24 w-64 h-64 bg-purple-500 rounded-full opacity-30 blur-2xl"></div>
                <div className="absolute right-48 top-36 w-32 h-32 bg-blue-400 rounded-full opacity-40 blur-xl"></div>
                <div className="absolute right-1/4 bottom-0 w-40 h-40 bg-indigo-300 rounded-full opacity-30 blur-xl"></div>

                {/* Geometric pattern */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: `${(i + 1) * 20}%`,
                        height: `${(i + 1) * 20}%`,
                        top: "50%",
                        left: "80%",
                        borderRadius: "50%",
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Banner content */}
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-md mx-8 md:mx-16 pb-16">
                  <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full inline-flex items-center mb-4">
                    <div className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                      NEW
                    </div>
                    <span className="text-white text-sm">
                      Spring Collection 2025
                    </span>
                  </div>

                  <h2 className="text-white text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                    Elevate Your Style This Season
                  </h2>

                  <p className="text-indigo-100 mb-6 md:pr-12">
                    Discover our exclusive Spring Collection with up to 40% off
                    on selected items. Limited time offer.
                  </p>

                  <div className="flex space-x-4">
                    <COMP.Button className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-full font-medium">
                      Shop Now
                    </COMP.Button>

                    <COMP.Button className="bg-transparent border border-white/60 text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium">
                      View Lookbook
                    </COMP.Button>
                  </div>

                  {/* Timer - Added more spacing above */}
                  <div className="mt-8 flex items-center text-white/90">
                    <Clock size={16} className="mr-2" />
                    <span className="text-sm font-medium">
                      Offer ends in: 3 days 12:45:30
                    </span>
                  </div>
                </div>
              </div>

              {/* Product image (right side) */}
              <div className="absolute right-0 bottom-0 h-full w-1/2 hidden md:block">
                <div className="relative h-full flex items-end justify-end">
                  <div className="absolute bottom-0 right-8 w-64 h-64 bg-white/20 backdrop-blur-md rounded-full -mb-8 -mr-8"></div>
                  <img
                    src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=600&q=80"
                    alt="Featured product"
                    className="h-5/6 object-contain object-bottom relative z-10 mr-16"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Featured categories */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories
              .filter((cat) => cat.id !== "All")
              .map((cat) => (
                <div
                  key={cat.id}
                  className="relative rounded-lg overflow-hidden group cursor-pointer h-32 md:h-40"
                  onClick={() => setCategory(cat.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/20 z-10"></div>
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-white font-medium text-lg">
                        {cat.label}
                      </h3>
                      <div className="mt-2 text-white/80 text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Shop now</span>
                        <ArrowRight size={14} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>{" "}
        </div>
        {/* Loading and Error Handling */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            <p className="font-medium">Error loading products</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {/* Product Listing */}
        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {category === "All" ? "Popular Products" : category}
                <span className="text-gray-500 ml-2 text-sm font-normal">
                  ({items.length} products)
                </span>
              </h2>

              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <select className="rounded-md border-gray-300 text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 group relative"
                  onClick={() => navigateToViewProductScreen(product._id)}
                >
                  {/* Image Container with Gradient Overlay */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent z-10" />

                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.stock < 5 && (
                        <div className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                          ⚡ Only {product.stock} left!
                        </div>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-indigo-100 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add wishlist functionality
                      }}
                    >
                      <Heart
                        size={20}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                        fill="currentColor"
                        fillOpacity={0.2}
                      />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-3">
                    {/* Category Tag */}
                    <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                      {product.category}
                    </div>

                    {/* Product Name & Rating */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({product.ratingCount})
                        </span>
                      </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Layers size={16} className="mr-1" />
                        {product.stock} in stock
                      </div>
                    </div>

                    {/* Add to Cart Button with Hover Effect */}
                    <COMP.Button
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white 
                py-3 rounded-lg font-medium transform hover:scale-[1.02] transition-all duration-200 shadow-md"
                      onClick={(e) => handleAddToCart(e, product._id)}
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Add to Cart
                    </COMP.Button>
                  </div>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full font-semibold text-indigo-600 hover:bg-white transition-colors">
                      Quick View
                    </button>
                  </div>

                  {/* Hover Ribbon Effect */}
                  <div className="absolute top-1/2 -right-8 group-hover:right-4 transition-all duration-500">
                    <div className="bg-indigo-600 text-white px-4 py-1 transform -rotate-45 shadow-lg text-xs font-bold">
                      FREE SHIPPING
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {items.length === 0 && (
              <div className="text-center py-16">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-indigo-700 font-bold text-lg mb-4">
                Vendora
              </h3>
              <p className="text-gray-500 text-sm">
                Your one-stop shop for quality products at competitive prices.
              </p>

              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-indigo-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Deals & Promotions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Gift Cards
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">
                Customer Service
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Order Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">Stay Connected</h4>
              <p className="text-sm text-gray-600 mb-3">
                Subscribe to our newsletter for updates and exclusive offers.
              </p>
              <div className="flex">
                <COMP.Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-l-md w-full"
                />
                <COMP.Button className="bg-indigo-600 hover:bg-indigo-700 rounded-l-none">
                  Subscribe
                </COMP.Button>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-500">
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-2" />
                  <span>Order within 2h for same-day dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and additional footer links */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            © 2025 Vendora. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">
              Cookie Settings
            </a>
          </div>
        </div>
      </footer>
    </Background>
  );
}
