import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { Link, useParams } from "react-router";
import {
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiTruck,
  FiTag,
  FiCheck,
  FiClock,
  FiShield,
  FiChevronRight,
  FiShare2,
  FiArrowLeft
} from "react-icons/fi";
import { MdOutlineLocalOffer, MdInventory, MdPolicy } from "react-icons/md";
import { BsLightningCharge } from "react-icons/bs";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import SeeAllReviews from "./SeeAllReviews";

const ProductsDetails = () => {
  const axiosSecure = UseAxiosSecure();
  const { id } = useParams();
  const { user } = useAuth()

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product by ID
  useEffect(() => {
    axiosSecure
      .get(`/devices/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);
  console.log(product)
  // const ids = product._id
  console.log(id)
  const ids = id.toString()
  console.log(ids)

  const handleAddToCart = () => {
    if (!user) {
      return alert("Please login first!");
    }

    // Ensure the product has correct MongoDB _id
    const realId = product._id?.toString();
    console.log(realId)

    const cartItem = {
      userName: user.displayName,
      userEmail: user.email,
      productId: ids, // FIXED — real product _id will store
      productName: product.title,
      quantity: quantity,
      totalAmount: product.pricing?.discountPrice || product.pricing?.regularPrice,
      addedAt: new Date(),
    };

    axiosSecure
      .post("/cards", cartItem)
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire({
            title: "Added to Cart! Please Go Dashboard",
            icon: "success",
            timer: 1500,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          title: "Failed!",
          text: "Could not add to cart",
          icon: "error",
        });
      });
  };



  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 mx-auto"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );

  const images = [product.media?.featuredImage, ...(product.media?.images || [])];
  const discountPercentage = product.pricing?.regularPrice && product.pricing?.discountPrice
    ? Math.round(((product.pricing.regularPrice - product.pricing.discountPrice) / product.pricing.regularPrice) * 100)
    : 0;

  const features = product.specification?.features || [];

  return (
    <div className="w-[95%] mx-auto p-6 bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-blue-600 transition">Home</a>
          <FiChevronRight className="mx-2" />
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Image Gallery */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100 relative">
              {discountPercentage > 0 && (
                <div className="absolute top-6 left-6 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl">
                    <MdOutlineLocalOffer className="text-lg" /> {discountPercentage}% OFF
                  </div>
                </div>
              )}

              {/* Main Image */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-white p-8 shadow-inner">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-500"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <FiShare2 className="text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all duration-300 overflow-hidden ${selectedImage === i
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 md:p-12">
              {/* Brand & Title */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {product.brand}
                  </span>
                  <button className="text-gray-400 hover:text-red-500 transition">
                    <FiHeart className="text-2xl" />
                  </button>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`text-lg ${i < Math.floor(product.ratings?.averageRating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-bold text-gray-800">
                    {product.ratings?.averageRating?.toFixed(1) || '4.5'}
                  </span>
                </div>
                <span className="text-gray-500">
                  {product.ratings?.totalReviews || 0} reviews
                </span>
              </div>

              {/* Pricing Section */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.pricing?.discountPrice || product.pricing?.regularPrice}
                  </span>
                  {product.pricing?.discountPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ${product.pricing.regularPrice}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
                        Save ${product.pricing.regularPrice - product.pricing.discountPrice}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Key Features */}
              {features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BsLightningCharge className="text-blue-500" /> Key Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {features.slice(0, 4).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700">
                        <FiCheck className="text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & CTA */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <FiShoppingCart className="text-xl" />
                    Add to Cart
                  </button>
                  
                </div>
              </div>

              {/* Delivery Info */}
              <div className="border-t pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <FiTruck className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Fast Delivery</h4>
                    <p className="text-gray-600">
                      Inside city: <span className="font-bold">৳{product.shipping?.deliveryChargeInsideCity || 60}</span> •
                      Outside: <span className="font-bold">৳{product.shipping?.deliveryChargeOutsideCity || 120}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Usually delivered within 2-3 business days</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                    <FiShield className="text-green-500" />
                    <span className="text-sm font-medium">Warranty: {product.specification?.warranty || '1 Year'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                    <MdOutlineLocalOffer className="text-blue-500" />
                    <span className="text-sm font-medium">COD Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b flex items-center gap-3">
                <FiTag className="text-blue-500" /> Product Description
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {product.longDescription || product.shortDescription}
                </p>

                {/* Specifications Grid */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BsLightningCharge className="text-blue-500" /> Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-gray-800">General</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Brand</span>
                          <span className="font-medium">{product.brand}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Model</span>
                          <span className="font-medium">{product.specification?.general?.model || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Manufacturer</span>
                          <span className="font-medium">{product.specification?.manufacturer || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-gray-800">Features</h4>
                      <div className="space-y-2">
                        {features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link to={`/ProductsReviews/${product._id}`} className="btn btn-block mt-5">Add Review</Link>
            <SeeAllReviews></SeeAllReviews>
          </div>

          {/* Side Cards */}
          <div className="space-y-8">
            {/* Inventory Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MdInventory className="text-blue-500" /> Inventory
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.inventory?.stockQuantity > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {product.inventory?.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">SKU</span>
                  <span className="font-mono font-medium">{product.inventory?.sku || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-bold text-lg">{product.inventory?.stockQuantity || 0} units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Warehouse</span>
                  <span className="text-right">{product.inventory?.warehouseLocation || 'N/A'}</span>
                </div>
              </div>

              {/* Stock Progress */}
              {product.inventory?.stockQuantity > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stock Level</span>
                    <span>{Math.min(100, (product.inventory.stockQuantity / 100) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (product.inventory.stockQuantity / 100) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Policies Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MdPolicy className="text-blue-500" /> Policies
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiShield className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Warranty</h4>
                    <p className="text-sm text-gray-600">{product.specification?.warranty || '1 Year Manufacturer Warranty'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiClock className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Return Policy</h4>
                    <p className="text-sm text-gray-600">
                      {product.returnPolicy?.returnDays || 7} days return & exchange policy
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiTruck className="text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Shipping</h4>
                    <p className="text-sm text-gray-600">Free shipping on orders over $100</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4">Product Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg font-medium hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;