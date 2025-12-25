import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import axios from "axios";

const AddProducts = () => {
    const axiosSecure = UseAxiosSecure();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            // -------- IMAGE UPLOAD ----------
            const featuredImgFile = data.featuredImage[0];
            const galleryImgFiles = data.galleryImages;

            const formData = new FormData();
            formData.append("image", featuredImgFile);

            const imgBBurl = `https://api.imgbb.com/1/upload?key=${
                import.meta.env.VITE_IMAGE_HOST
            }`;

            const featuredUpload = await axios.post(imgBBurl, formData);
            const featuredImageURL = featuredUpload.data.data.url;

            // Gallery images
            const galleryURLs = [];
            for (let file of galleryImgFiles) {
                const fd = new FormData();
                fd.append("image", file);
                const gRes = await axios.post(imgBBurl, fd);
                galleryURLs.push(gRes.data.data.url);
            }

            // ---------- PRODUCT OBJECT ----------
            const ProductData = {
                title: data.title,
                slug: data.slug,
                shortDescription: data.shortDescription,
                longDescription: data.longDescription,

                media: {
                    featuredImage: featuredImageURL,
                    images: galleryURLs,
                    videoUrl: data.videoUrl,
                },

                category: {
                    main: data.categoryMain,
                    sub: data.categorySub,
                    child: data.categoryChild,
                },

                tags: data.tags.split(","),

                brand: data.brand,

                pricing: {
                    regularPrice: Number(data.regularPrice),
                    discountPrice: Number(data.discountPrice),
                    discountPercentage:
                        Number(data.regularPrice) && Number(data.discountPrice)
                            ? Math.round(
                                  ((data.regularPrice - data.discountPrice) /
                                      data.regularPrice) *
                                      100
                              )
                            : 0,
                    flashSalePrice: data.flashSalePrice
                        ? Number(data.flashSalePrice)
                        : null,
                    bulkPrice: {
                        minQty: Number(data.bulkQty),
                        pricePerUnit: Number(data.bulkPrice),
                    },
                },

                variants: [
                    {
                        variantId: data.variantId,
                        color: data.color,
                        size: data.size,
                        material: data.material,
                        weight: data.variantWeight,
                        price: Number(data.variantPrice),
                        stock: Number(data.variantStock),
                    },
                ],

                inventory: {
                    sku: data.sku,
                    barcode: data.barcode,
                    stockQuantity: Number(data.stockQuantity),
                    stockStatus:
                        Number(data.stockQuantity) > 0
                            ? "In Stock"
                            : "Out Of Stock",
                    lowStockAlert: Number(data.lowStockAlert),
                    warehouseLocation: data.warehouseLocation,
                },

                shipping: {
                    weight: data.shipWeight,
                    dimensions: {
                        length: data.shipLength,
                        width: data.shipWidth,
                        height: data.shipHeight,
                    },
                    shippingClass: data.shippingClass,
                    deliveryChargeInsideCity: Number(
                        data.deliveryChargeInsideCity
                    ),
                    deliveryChargeOutsideCity: Number(
                        data.deliveryChargeOutsideCity
                    ),
                    freeShipping: data.freeShipping === "yes",
                    cashOnDelivery: data.cod === "yes",
                },

                ratings: {
                    averageRating: 0,
                    totalReviews: 0,
                    reviews: [],
                },

                analytics: {
                    views: 0,
                    soldCount: 0,
                    addToCartCount: 0,
                    wishlistCount: 0,
                },

                specification: {
                    general: {
                        model: data.model,
                    },
                    warranty: data.warranty,
                    manufacturer: data.manufacturer,
                },

                offers: {
                    buyOneGetOne: data.bogo === "yes",
                    bundleOffer: null,
                    quantityDiscount: [],
                    emiAvailable: data.emiAvailable === "yes",
                    flashSaleEndTime: data.flashSaleEndTime || null,
                },

                returnPolicy: {
                    isReturnable: data.returnable === "yes",
                    returnDays: Number(data.returnDays),
                    replacementOnly: data.replacementOnly === "yes",
                },

                seller: [
                    {
                        sellerId: data.sellerId,
                        name: data.sellerName,
                        rating: Number(data.sellerRating),
                        totalProducts: Number(data.sellerTotalProducts),
                    },
                ],

                creator: {
                    creatorName: data.creatorName,
                    creatorEmail: data.creatorEmail,
                },

                status: "Published",
                createdAt: new Date(),
            };

            // --------- POST TO BACKEND -------------
            const res = await axiosSecure.post("/devices", ProductData);

            if (res.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Product Added Successfully!",
                    timer: 1500,
                    showConfirmButton: false,
                });

                reset();
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Failed to add product",
                text: error.message,
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">
                Add New Product (Advanced)
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* BASIC INFO */}
                <div className="col-span-2">
                    <label>Product Title</label>
                    <input
                        {...register("title", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Slug</label>
                    <input
                        {...register("slug", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Brand</label>
                    <input
                        {...register("brand", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* DESCRIPTIONS */}
                <div className="col-span-2">
                    <label>Short Description</label>
                    <textarea
                        {...register("shortDescription")}
                        className="textarea textarea-bordered w-full"
                    />
                </div>

                <div className="col-span-2">
                    <label>Long Description</label>
                    <textarea
                        {...register("longDescription")}
                        className="textarea textarea-bordered w-full"
                        rows="4"
                    />
                </div>

                {/* MEDIA */}
                <div>
                    <label>Featured Image</label>
                    <input
                        type="file"
                        {...register("featuredImage", { required: true })}
                        className="file-input file-input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Gallery Images</label>
                    <input
                        type="file"
                        multiple
                        {...register("galleryImages")}
                        className="file-input file-input-bordered w-full"
                    />
                </div>

                <div className="col-span-2">
                    <label>Video URL</label>
                    <input
                        {...register("videoUrl")}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* CATEGORY */}
                <div>
                    <label>Main Category</label>
                    <input
                        {...register("categoryMain")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Sub Category</label>
                    <input
                        {...register("categorySub")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Child Category</label>
                    <input
                        {...register("categoryChild")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="col-span-2">
                    <label>Tags (comma separated)</label>
                    <input
                        {...register("tags")}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* PRICING */}
                <div>
                    <label>Regular Price</label>
                    <input
                        type="number"
                        {...register("regularPrice")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Discount Price</label>
                    <input
                        type="number"
                        {...register("discountPrice")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Flash Sale Price</label>
                    <input
                        type="number"
                        {...register("flashSalePrice")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Bulk Qty</label>
                    <input
                        type="number"
                        {...register("bulkQty")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Bulk Price</label>
                    <input
                        type="number"
                        {...register("bulkPrice")}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* VARIANTS */}
                <div className="col-span-2 font-semibold">Variant Info</div>

                <div>
                    <label>Variant ID</label>
                    <input
                        {...register("variantId")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Color</label>
                    <input
                        {...register("color")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Size</label>
                    <input
                        {...register("size")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Material</label>
                    <input
                        {...register("material")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Variant Weight</label>
                    <input
                        {...register("variantWeight")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Variant Price</label>
                    <input
                        type="number"
                        {...register("variantPrice")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Variant Stock</label>
                    <input
                        type="number"
                        {...register("variantStock")}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* INVENTORY */}
                <div className="col-span-2 font-semibold mt-4">
                    Inventory Info
                </div>

                <div>
                    <label>SKU</label>
                    <input
                        {...register("sku")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Barcode</label>
                    <input
                        {...register("barcode")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Stock Quantity</label>
                    <input
                        type="number"
                        {...register("stockQuantity")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Low Stock Alert</label>
                    <input
                        type="number"
                        {...register("lowStockAlert")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="col-span-2">
                    <label>Warehouse Location</label>
                    <input
                        {...register("warehouseLocation")}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* SHIPPING */}
                <div className="col-span-2 font-semibold mt-4">
                    Shipping Info
                </div>

                <div>
                    <label>Weight</label>
                    <input
                        {...register("shipWeight")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Length</label>
                    <input
                        {...register("shipLength")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Width</label>
                    <input
                        {...register("shipWidth")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Height</label>
                    <input
                        {...register("shipHeight")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Shipping Class</label>
                    <input
                        {...register("shippingClass")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Delivery Charge Inside City</label>
                    <input
                        type="number"
                        {...register("deliveryChargeInsideCity")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Delivery Charge Outside City</label>
                    <input
                        type="number"
                        {...register("deliveryChargeOutsideCity")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Free Shipping</label>
                    <select {...register("freeShipping")} className="select">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div>
                    <label>Cash on Delivery</label>
                    <select {...register("cod")} className="select">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                {/* RETURN POLICY */}
                <div className="col-span-2 font-semibold mt-4">
                    Return & Warranty
                </div>

                <div>
                    <label>Returnable</label>
                    <select {...register("returnable")} className="select">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div>
                    <label>Return Days</label>
                    <input
                        type="number"
                        {...register("returnDays")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Replacement Only</label>
                    <select {...register("replacementOnly")} className="select">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                {/* SPECIFICATION */}
                <div className="col-span-2">
                    <label>Model</label>
                    <input
                        {...register("model")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="col-span-2">
                    <label>Warranty</label>
                    <input
                        {...register("warranty")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="col-span-2">
                    <label>Manufacturer</label>
                    <input
                        {...register("manufacturer")}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* OFFERS */}
                <div className="col-span-2 font-semibold mt-4">Offers</div>

                <div>
                    <label>Buy One Get One</label>
                    <select {...register("bogo")} className="select">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>

                <div>
                    <label>EMI Available</label>
                    <select {...register("emiAvailable")} className="select">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>

                <div>
                    <label>Flash Sale End Time</label>
                    <input
                        type="datetime-local"
                        {...register("flashSaleEndTime")}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* SELLER */}
                <div className="col-span-2 font-semibold mt-4">Seller Info</div>

                <div>
                    <label>Seller ID</label>
                    <input
                        {...register("sellerId")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Seller Name</label>
                    <input
                        {...register("sellerName")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Seller Rating</label>
                    <input
                        type="number"
                        {...register("sellerRating")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Total Products</label>
                    <input
                        type="number"
                        {...register("sellerTotalProducts")}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* CREATOR */}
                <div className="col-span-2 font-semibold mt-4">
                    Creator (Admin)
                </div>

                <div>
                    <label>Creator Name</label>
                    <input
                        {...register("creatorName")}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label>Creator Email</label>
                    <input
                        {...register("creatorEmail")}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="col-span-2 mt-4">
                    <button className="btn btn-primary w-full">
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProducts;
