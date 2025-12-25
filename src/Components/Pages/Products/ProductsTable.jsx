import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";

const ProductsTable = () => {
    const axiosSecure = UseAxiosSecure();
    const [products, setProducts] = useState([]);

    // Fetch all products
    useEffect(() => {
        axiosSecure.get("/devices").then((res) => {
            setProducts(res.data);
        });
    }, [axiosSecure]);

    // Delete product
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This product will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/devices/${id}`);

                if (res.data.deletedCount > 0) {
                    Swal.fire("Deleted!", "Product has been deleted.", "success");

                    // Remove from UI
                    setProducts((prev) => prev.filter((item) => item._id !== id));
                }
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-6">All Products</h1>

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="table w-full">
                    {/* Table Head */}
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td>{index + 1}</td>

                                {/* Image */}
                                <td>
                                    <img
                                        src={product?.media?.featuredImage}
                                        alt="img"
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                </td>

                                {/* Title */}
                                <td className="font-medium">{product.title}</td>

                                {/* Price */}
                                <td className="font-semibold text-gray-700">
                                    ${product?.pricing?.discountPrice || product?.pricing?.regularPrice}
                                </td>

                                {/* Actions */}
                                <td className="flex items-center justify-center gap-4 text-lg">
                                    {/* View */}
                                    <Link
                                        to={`/ProductsDetails/${product._id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FiEye />
                                    </Link>

                                    {/* Update */}
                                    <Link
                                        to={`/dashboard/UpdateProducts/${product._id}`}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        <FiEdit />
                                    </Link>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FiTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* No Data */}
                {products.length === 0 && (
                    <p className="text-center py-10 text-gray-500">No products found.</p>
                )}
            </div>
        </div>
    );
};

export default ProductsTable;
