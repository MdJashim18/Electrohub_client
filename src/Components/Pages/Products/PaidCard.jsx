import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { FiEye, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

const PaidCard = () => {
    const axiosSecure = UseAxiosSecure();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ============================
    // FETCH ALL ORDERS
    // ============================
    const fetchOrders = async () => {
        try {
            const res = await axiosSecure.get("/orders");
            // Sort by date descending (recent first)
            const sortedOrders = res.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            setOrders(sortedOrders);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ============================
    // DELETE ORDER
    // ============================
    const handleDelete = async (orderId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/orders/${orderId}`);
                Swal.fire("Deleted!", "Order has been deleted.", "success");
                fetchOrders();
            } catch (err) {
                console.error(err);
                Swal.fire("Error!", "Failed to delete order.", "error");
            }
        }
    };

    // ============================
    // OPEN VIEW MODAL
    // ============================
    const handleView = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">All Orders</h1>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{order.email}</td>
                                <td>{order.mobile}</td>
                                <td>{new Date(order.date).toLocaleString()}</td>
                                <td className="flex gap-4">
                                    <button
                                        onClick={() => handleView(order)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="View"
                                    >
                                        <FiEye size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ============================
                VIEW ORDER MODAL
            ============================ */}
            {isModalOpen && selectedOrder && (
                <dialog open className="modal">
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg text-center mb-4">Order Details</h3>

                        <div className="space-y-3">
                            <p><strong>Email:</strong> {selectedOrder.email}</p>
                            <p><strong>Mobile:</strong> {selectedOrder.mobile}</p>
                            <p><strong>Address:</strong> {selectedOrder.address}</p>

                            <div className="p-3 border rounded">
                                <p className="font-semibold mb-1">Ordered Products:</p>
                                <ul className="list-disc pl-5">
                                    {selectedOrder.products.map((p, i) => (
                                        <li key={i}>{p}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-error"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default PaidCard;
