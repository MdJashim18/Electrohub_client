import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { Link } from 'react-router';
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from 'sweetalert2';

const AllProductsAdmin = () => {
    const axiosSecure = UseAxiosSecure();
    const [products, setProducts] = useState([]);

    // Load All Products
    useEffect(() => {
        axiosSecure.get('/devices')
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => console.error(err));
    }, [axiosSecure]);

    // Delete Product
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This product will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/devices/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            Swal.fire("Deleted!", "Product deleted successfully!", "success");
                            setProducts(products.filter(p => p._id !== id));
                        }
                    });
            }
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Products</h1>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product,index) => (
                            <tr key={product._id}>
                                <td>{index+1} </td>
                                <td>
                                    <img
                                        src={product?.media?.featuredImage}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                </td>

                                <td className="font-semibold">{product.title}</td>

                                {/* <td>{product.createdAt}</td> */}

                                <td className="flex items-center gap-3">
                                    {/* View */}
                                    <Link to={`/ProductsDetails/${product._id}`}>
                                        <FiEye className="text-blue-500 text-xl cursor-pointer" />
                                    </Link>

                                    {/* Edit */}
                                    <Link to={`/dashboard/UpdateProducts/${product._id}`}>
                                        <FiEdit className="text-green-500 text-xl cursor-pointer" />
                                    </Link>

                                    {/* Delete */}
                                    <FiTrash2
                                        onClick={() => handleDelete(product._id)}
                                        className="text-red-500 text-xl cursor-pointer"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default AllProductsAdmin;
