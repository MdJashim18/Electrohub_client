import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { FiEye } from "react-icons/fi";
import Swal from "sweetalert2";

const SeeAllReviews = () => {
  const axiosSecure = UseAxiosSecure();
  const [products, setProducts] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    axiosSecure.get("/devices").then((res) => {
      setProducts(res.data);

      const allReviews = [];

      // Collect all reviews from all products
      res.data.forEach((product) => {
        product.ratings?.reviews?.forEach((review) => {
          allReviews.push({
            productName: product.title,
            reviewerEmail: review.userEmail,
            date: new Date(review.date).toLocaleDateString(),
            comment: review.comment,
          });
        });
      });

      setReviewsList(allReviews);
    });
  }, [axiosSecure]);

  // 🔥 View only the clicked review
  const handleView = (review) => {
    Swal.fire({
      html: `
        <p><strong>Product:</strong> ${review.productName}</p>
        <p><strong>Email:</strong> ${review.reviewerEmail}</p>
        <p><strong>Date:</strong> ${review.date}</p>
        <p><strong>Comment:</strong> ${review.comment}</p>
      `,
      width: 600,
      showCloseButton: true,
      confirmButtonText: "Close",
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">All Reviews</h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th>#</th>
              <th>Product Name</th>
              <th>Reviewer Email</th>
              <th>Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {reviewsList.map((review, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td>{index + 1}</td>
                <td>{review.productName}</td>
                <td>{review.reviewerEmail}</td>
                <td>{review.date}</td>

                <td className="text-center">
                  <button
                    onClick={() => handleView(review)}
                    className="text-blue-600 hover:text-blue-800 text-lg"
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reviewsList.length === 0 && (
          <p className="text-center py-10 text-gray-500">No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default SeeAllReviews;
