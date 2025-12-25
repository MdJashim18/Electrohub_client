import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { Link, useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

const ProductsReviews = () => {
    const { id } = useParams();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate()

    const [product, setProduct] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    // Fetch product to show product name
    useEffect(() => {
        axiosSecure.get(`/devices/${id}`).then((res) => {
            setProduct(res.data);
            reset({
                productName: res.data?.title
            });
        });
    }, [id, axiosSecure, reset]);

    // Handle Submit
    const onSubmit = async (data) => {
        const newReview = {
            userEmail: data.userEmail,
            rating: Number(data.rating),
            comment: data.comment,
            date: new Date(),
        };

        const updatedReviews = [...(product?.ratings?.reviews || []), newReview];

        const updateBody = {
            ratings: {
                ...product.ratings,
                totalReviews: updatedReviews.length,
                averageRating:
                    updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
                    updatedReviews.length,
                reviews: updatedReviews,
            },
        };

        const res = await axiosSecure.patch(`/devices/${id}`, updateBody);

        if (res.data.modifiedCount > 0) {
            Swal.fire("Success!", "Review added successfully!", "success");

            // Update state after adding review
            setProduct((prev) => ({
                ...prev,
                ratings: updateBody.ratings,
            }));

            reset({
                productName: product.title,
                userEmail: "",
                rating: "",
                comment: "",
            });
            navigate(`/ProductsDetails/${id}`);
        }
       
    };

    if (!product) {
        return <p className="mt-10 text-center">Loading product...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">
                Add Review for {product.title}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Product Name */}
                <div>
                    <label className="font-semibold">Product Name</label>
                    <input
                        {...register("productName")}
                        className="w-full border p-3 rounded-lg bg-gray-100"
                        readOnly
                    />
                </div>

                {/* User Email */}
                <div>
                    <label className="font-semibold">User Email</label>
                    <input
                        {...register("userEmail", { required: "Email is required" })}
                        className="w-full border p-3 rounded-lg"
                        type="email"
                    />
                    {errors.userEmail && (
                        <p className="text-red-500">{errors.userEmail.message}</p>
                    )}
                </div>

                {/* Ratings */}
                <div>
                    <label className="font-semibold">Ratings</label>
                    <select
                        {...register("rating", { required: "Rating is required" })}
                        className="w-full border p-3 rounded-lg"
                    >
                        <option value="">Select rating</option>
                        <option value="1">⭐ 1</option>
                        <option value="2">⭐ 2</option>
                        <option value="3">⭐ 3</option>
                        <option value="4">⭐ 4</option>
                        <option value="5">⭐ 5</option>
                    </select>
                </div>

                {/* Comments */}
                <div>
                    <label className="font-semibold">Comments</label>
                    <textarea
                        {...register("comment", { required: true })}
                        className="w-full border p-3 rounded-lg"
                        rows={4}
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-outline btn-success p-3 rounded-lg w-full"
                >
                    Add Review
                </button>
            </form>


            <div className="flex justify-center w-full mt-5">
                <Link to='/' className="btn btn-block">Back To Home</Link>
            </div>
        </div>
    );
};

export default ProductsReviews;
