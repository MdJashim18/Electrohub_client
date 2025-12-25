import React from "react";

const PaymentCancel = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-red-600">Payment Cancelled</h1>
      <p className="mt-4 text-lg">Your payment was cancelled.</p>

      <a href="/dashboard/MyCards">
        <button className="btn mt-6 bg-blue-600 text-white">
          Back to My Cards
        </button>
      </a>
    </div>
  );
};

export default PaymentCancel;
