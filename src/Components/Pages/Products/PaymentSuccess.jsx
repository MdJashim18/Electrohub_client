import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import { useForm } from "react-hook-form";

const PaymentSuccess = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();
    const { register, handleSubmit, reset } = useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allCards, setAllCards] = useState([]);

    // ============================
    // UPDATE PAID STATUS
    // ============================
    useEffect(() => {
        const updatePaidStatus = async () => {
            const productIds = JSON.parse(localStorage.getItem("paymentProductIds") || "[]");
            const userEmail = localStorage.getItem("paymentUserEmail");

            if (!productIds.length || !userEmail) return;

            try {
                await axiosSecure.patch("/update-paid-status", { productIds, userEmail });
                Swal.fire("Success!", "Payment status updated.", "success");
            } catch (err) {
                console.error(err);
                Swal.fire("Error!", "Failed to update payment status.", "error");
            }
        };

        updatePaidStatus();
    }, [axiosSecure]);

    // ============================
    // GET ALL PRODUCTS & CARDS
    // ============================
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await axiosSecure.get("/devices"); // All products
                setAllProducts(res.data);

                const ids = JSON.parse(localStorage.getItem("paymentProductIds") || "[]");

                const cardsRes = await axiosSecure.get("/cards"); // All cards
                const matchedCards = cardsRes.data.filter((card) =>
                    ids.includes(card._id)
                );

                setFilteredProducts(matchedCards);
            } catch (error) {
                console.error(error);
            }
        };

        loadProducts();
    }, [axiosSecure]);
    console.log(filteredProducts)

    // ============================
    // FILTER ORDERED PRODUCTS
    // ============================
    useEffect(() => {
        if (allProducts.length && filteredProducts.length) {
            const orderedCards = allProducts.filter(p =>
                filteredProducts.some(fp => fp.productId === p._id)
            );
            setAllCards(orderedCards);
        }
    }, [allProducts, filteredProducts]);

    console.log("Filtered Cards: ", filteredProducts);
    console.log("Ordered Products: ", allCards);

    // ============================
    // OPEN MODAL
    // ============================
    const handleOpenModal = () => {
        setIsModalOpen(true);
        reset({
            email: user?.email || "",
        });
    };

    // ============================
    // SUBMIT ORDER → POST /orders
    // ============================
    const onSubmit = async (data) => {
        try {
            const orderData = {
                email: data.email,
                mobile: data.mobile,
                address: data.address,
                products: allCards.map((p) => p.title || p.name),
                date: new Date(),
            };

            const res = await axiosSecure.post("/orders", orderData);

            if (res.data.insertedId) {
                Swal.fire("Success!", "Order submitted successfully!", "success");
                localStorage.removeItem("paymentProductIds");
                localStorage.removeItem("paymentUserEmail");
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Order submission failed!", "error");
        }
    };

    return (
        <div className="text-center mt-20">
            <h1 className="text-4xl font-bold text-green-600">Please Press Confirm button to complete!</h1>
            {/* <p className="mt-4 text-lg">Your payment has been confirmed.</p> */}

            {/* Confirm Button */}
            <div className="flex justify-center gap-10 my-10">
                <button
                    onClick={handleOpenModal}
                    className="btn btn-primary mt-6"
                >
                    Confirmed
                </button>

                <a href="/dashboard/MyCards">
                    <button className="btn mt-6 bg-blue-600 text-white">
                        Back to My Cards
                    </button>
                </a>
            </div>

            {/* =============================
                MODAL FORM START
            ============================= */}
            {isModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg text-center mb-4">
                            Confirm Order Details
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                            {/* Email */}
                            <input
                                type="email"
                                {...register("email")}
                                className="input input-bordered w-full"
                                readOnly
                            />

                            {/* Mobile Number */}
                            <input
                                type="text"
                                placeholder="Mobile Number"
                                {...register("mobile", { required: true })}
                                className="input input-bordered w-full"
                            />

                            {/* Address */}
                            <textarea
                                placeholder="Address"
                                {...register("address", { required: true })}
                                className="textarea textarea-bordered w-full"
                            ></textarea>

                            {/* Ordered Products */}
                            <div className="p-3 border rounded">
                                <p className="font-semibold mb-1">Ordered Products:</p>
                                <ul className="list-disc pl-5 text-left">
                                    {allCards.map((p) => (
                                        <li key={p._id}>{p.title || p.name}</li>
                                    ))}
                                </ul>
                            </div>

                            <button type="submit" className="btn btn-success w-full">
                                Submit Order
                            </button>
                        </form>

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

export default PaymentSuccess;
