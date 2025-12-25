import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";

const UpdateProducts = () => {
    const { id } = useParams();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [preview, setPreview] = useState("");
    const [imageURL, setImageURL] = useState(""); // NEW
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    // ================= Fetch Product Details =================
    useEffect(() => {
        setLoading(true);
        setError("");

        axiosSecure.get(`/devices/${id}`)
            .then((res) => {
                setProduct(res.data);
                reset({
                    title: res.data.title || "",
                    shortDescription: res.data.shortDescription || "",
                    regularPrice: res.data.pricing?.regularPrice || 0,
                    discountPrice: res.data.pricing?.discountPrice || 0,
                });

                setPreview(res.data?.media?.featuredImage);
                setImageURL(res.data?.media?.featuredImage); // default image
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Failed to load product. Please check the product ID.");
                setLoading(false);
            });
    }, [id, axiosSecure, reset]);

    // ================= Image Upload to imageBD =================
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const tempPreview = URL.createObjectURL(file);
        setPreview(tempPreview);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const uploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST}`;

            const res = await fetch(uploadURL, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                setImageURL(data.data.url);
            } else {
                Swal.fire("Error", "Image upload failed", "error");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            Swal.fire("Error", "Failed to upload image", "error");
        }
    };

    // ================= Handle Update =================
    const onSubmit = async (data) => {
        try {
            const updateData = {
                ...product,
                title: data.title,
                shortDescription: data.shortDescription,
                pricing: {
                    ...product.pricing,
                    regularPrice: parseFloat(data.regularPrice),
                    discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
                },
                media: {
                    ...product.media,
                    featuredImage: imageURL || product.media.featuredImage
                }
            };

            delete updateData._id;

            const res = await axiosSecure.patch(`/devices/${id}`, updateData);

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Success!",
                    text: "Product updated successfully.",
                    icon: "success",
                    timer: 1500
                });
                navigate("/dashboard/ProductsTable");
            } else {
                Swal.fire({
                    title: "No Changes",
                    text: "No changes were made.",
                    icon: "info",
                });
            }
        } catch (err) {
            console.error("Update error:", err);
            Swal.fire({
                title: "Error!",
                text: "Failed to update product",
                icon: "error",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => navigate("/dashboard/all-products")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Update Product
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left Column */}
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block font-semibold mb-2 text-gray-700">Product Title *</label>
                        <input
                            {...register("title", {
                                required: "Title is required",
                                minLength: { value: 3, message: "Title must be at least 3 characters" }
                            })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="text"
                            placeholder="Enter product title"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block font-semibold mb-2 text-gray-700">Short Description</label>
                        <textarea
                            {...register("shortDescription", {
                                maxLength: { value: 500, message: "Description too long" }
                            })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            placeholder="Enter product description"
                        ></textarea>
                        {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Regular Price */}
                    <div>
                        <label className="block font-semibold mb-2 text-gray-700">Regular Price *</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <input
                                {...register("regularPrice", {
                                    required: "Price is required",
                                    min: { value: 0, message: "Price must be positive" }
                                })}
                                className="w-full border border-gray-300 p-3 pl-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                type="number"
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Discount Price */}
                    <div>
                        <label className="block font-semibold mb-2 text-gray-700">Discount Price (Optional)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <input
                                {...register("discountPrice", {
                                    min: { value: 0, message: "Price must be positive" },
                                })}
                                className="w-full border border-gray-300 p-3 pl-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                type="number"
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block font-semibold mb-2 text-gray-700">Product Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={handleImageChange}
                        />

                        {preview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Full Width Buttons */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Update Product
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/all-products")}
                        className="w-full mt-4 bg-gray-200 text-gray-800 p-4 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProducts;
