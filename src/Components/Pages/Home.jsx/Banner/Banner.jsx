
import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import bannerImg1 from '../../../../assets/b1.jpg'
import bannerImg2 from '../../../../assets/b2.jpg'
import bannerImg3 from '../../../../assets/b3.jpg'
import { useNavigate } from "react-router";

const Banner = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) {
            return;
        }

        navigate(`/contest?type=${search}`);
    };

    return (
        <div className="relative">
            <Carousel
                autoPlay
                infiniteLoop
                interval={4000}
                showThumbs={false}
                showStatus={false}
            >
                {[bannerImg1, bannerImg2, bannerImg3].map((img, i) => (
                    <div key={i} className="h-[70vh] md:h-[85vh]">
                        <img
                            src={img}
                            className="object-cover h-full w-full"
                            alt="banner"
                        />

                        
                        {/* <div className="absolute inset-0 bg-gradient-to-r  from-black/70 to-black/30 flex items-center">
                            <div className="max-w-6xl mx-auto px-4 text-white w-full">
                                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                    Discover & Join <br />
                                    Creative Contests
                                </h1>
                                <p className="max-w-xl text-gray-200 mb-6 mx-auto">
                                    Participate in design, development & innovation contests.
                                    Showcase your skills and win exciting prizes.
                                </p>

                                
                                <form
                                    onSubmit={handleSearch}
                                    className="flex flex-col sm:flex-row gap-3  max-w-xl mx-auto"
                                >
                                    <input
                                        type="text"
                                        placeholder="Search by contest type (Design, Coding...)"
                                        className="input input-bordered w-full text-black"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button className="btn btn-primary px-8">
                                        Search
                                    </button>
                                </form>
                            </div>
                        </div> */}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Banner;
