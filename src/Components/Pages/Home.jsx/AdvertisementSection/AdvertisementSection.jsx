import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaBolt } from "react-icons/fa";

const AdvertisementSection = () => {
  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      
      {/* Background Glow Effect */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-blue-600 opacity-20 blur-[150px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Discover the <span className="text-blue-400">Future</span> of Electronics
          </h1>

          <p className="text-gray-300 mt-4 text-lg md:text-xl">
            Experience premium gadgets at unbeatable prices.  
            Elevate your lifestyle with the latest innovations.
          </p>

          <div className="flex items-center gap-3 mt-6">
            <FaBolt className="text-yellow-400 text-3xl animate-pulse" />
            <span className="text-lg text-gray-300 font-semibold">
              Up to <span className="text-blue-400 font-bold">50% OFF</span> on Featured Products!
            </span>
          </div>

          <Link
            to="/AllProducts"
            className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            Shop Now
          </Link>
        </motion.div>

        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="relative">
            <img
              src="https://i.ibb.co/rb1Hv4Q/gadget-png.png"
              alt="Featured Product"
              className="w-full max-w-sm drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />

            {/* Floating Discount Tag */}
            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded-full shadow-lg font-bold text-sm animate-bounce">
              50% OFF
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvertisementSection;
