import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const MyCards = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = useAuth();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's cart items
  useEffect(() => {
    if (!user?.email) return;

    const fetchCards = async () => {
      try {
        const res = await axiosSecure.get(`/cards?email=${user.email}`);
        setCards(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCards();
  }, [user]);

  // DELETE CARD ITEM (only unpaid)
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This item will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/cards/${id}`);
          if (res.data.deletedCount > 0) {
            setCards(cards.filter((item) => item._id !== id));
            Swal.fire("Deleted!", "Item removed from cart.", "success");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Delete failed!", err.message, "error");
        }
      }
    });
  };

  // PAY NOW → Stripe
  const handlePayment = async () => {
    if (!user || cards.length === 0) return;

    const unpaidCards = cards.filter((c) => c.status !== "paid");
    const totalAmount = unpaidCards.reduce(
      (total, c) => total + Number(c.totalAmount || 0),
      0
    );

    if (totalAmount <= 0) {
      Swal.fire("No unpaid items in your cart!");
      return;
    }

    try {
      const paymentInfo = {
        cost: totalAmount,
        items: unpaidCards.map((c) => ({
          _id: c._id,
          productId: c.productId,
          productName: c.productName,
          quantity: c.quantity,
          totalAmount: c.totalAmount,
        })),
        userId: user._id,
        userName: user.displayName || user.name,
        userEmail: user.email,
      };

      // Save unpaid product IDs & user email to localStorage
      const unpaidProductIds = unpaidCards.map(c => c._id);
      localStorage.setItem("paymentProductIds", JSON.stringify(unpaidProductIds));
      localStorage.setItem("paymentUserEmail", user.email);

      const res = await axiosSecure.post("/create-checkout-session", paymentInfo);

      if (res.data?.url) {
        window.location.href = res.data.url; // redirect to Stripe checkout
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Payment failed!", error.message, "error");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading...</p>;
  }

  const unpaidCards = cards.filter((c) => c.status !== "paid");
  const totalAmount = unpaidCards.reduce(
    (total, c) => total + Number(c.totalAmount || 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">My Cart Items</h2>

      {cards.length === 0 ? (
        <p className="text-gray-600">No items found in your cart.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="table w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-100">
                  <td>{index + 1}</td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>${item.totalAmount}</td>
                  <td>
                    <span
                      className={
                        item.status === "paid"
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {item.status || "unpaid"}
                    </span>
                  </td>
                  <td>{new Date(item.addedAt).toLocaleDateString()}</td>
                  <td>
                    {item.status !== "paid" && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {unpaidCards.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-2xl font-bold">
            Total Amount: <span className="text-green-600">${totalAmount}</span>
          </h2>

          <button
            onClick={handlePayment}
            className="btn bg-green-600 text-white text-lg hover:bg-green-700"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCards;
