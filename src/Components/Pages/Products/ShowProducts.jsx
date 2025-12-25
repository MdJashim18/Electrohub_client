import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { Link } from "react-router";
import { FaStar } from "react-icons/fa";

const ShowProducts = () => {
    const axiosSecure = UseAxiosSecure();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axiosSecure.get("/devices").then((res) => {
            setProducts(res.data);
        });
    }, [axiosSecure]);

    // ⭐ Rating Stars (Dynamic)
    const getRatingStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar
                key={i}
                className={`text-yellow-400 ${i < rating ? "" : "opacity-30"}`}
            />
        ));
    };
    

    return (
        <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Our Products
            </h2>

            {/* Grid Layout */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {products.slice(0, 10).map((product) => {
                    const category =
                        product?.category?.child ||
                        product?.category?.sub ||
                        product?.category?.main ||
                        "Electronics";

                    const rating = product?.ratings?.averageRating || 4.5;
                    const reviews = product?.ratings?.totalReviews || 0;

                    const regular = product?.pricing?.regularPrice;
                    const discount = product?.pricing?.discountPrice;

                    // Calculate discount percentage
                    const discountPercent =
                        regular && discount
                            ? Math.round(((regular - discount) / regular) * 100)
                            : product?.pricing?.discountPercentage || 0;

                    return (
                        <div
                            key={product._id}
                            className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                <img
                                    src={
                                        product?.media?.featuredImage ||
                                        "/api/placeholder/400/300"
                                    }
                                    alt={product?.name}
                                    className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
                                />

                                {/* Discount Badge */}
                                {discountPercent > 0 && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 text-sm font-bold rounded-lg shadow-lg">
                                        -{discountPercent}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Product Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                {/* Category */}
                                <div className="mb-2">
                                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                                        {category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-3 hover:text-blue-600 transition-colors">
                                    {product?.name}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center">
                                        {getRatingStars(Math.round(rating))}
                                        <span className="ml-2 text-sm font-medium text-gray-700">
                                            {rating.toFixed(1)}
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-sm ml-3">
                                        ({reviews} reviews)
                                    </span>
                                </div>

                                {/* Pricing Section */}
                                <div className="mt-auto">
                                    

                                    {/* Buttons */}
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/ProductsDetails/${product._id}`}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-1 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                        >
                                            Details
                                        </Link>

                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShowProducts;