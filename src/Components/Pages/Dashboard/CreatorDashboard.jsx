import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaPlusCircle, FaListAlt, FaUser, FaDesktop, FaChartBar, FaTrophy, FaCheckCircle, FaClock } from "react-icons/fa";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const CreatorDashboard = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();

    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatorUser, setCreatorUser] = useState([]);
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        if (!user?.email) return;

        const fetchData = async () => {
            try {
                const res = await axiosSecure.get(`/users`);
                const currentUser = res.data.filter(u=>u.email===user.email)

                // console.log(currentUser)
                setCreatorUser(currentUser);

                const deviceRes = await axiosSecure.get('/devices');
                const currentProduct = deviceRes.data.filter(d => d.creator?.creatorEmail === user.email)
                console.log(currentProduct)
                // console.log(deviceRes.data)
                setDevices(currentProduct);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosSecure, user]);
    // console.log(creatorUser)
    console.log(devices)

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const total = devices.length;
    const pending = contests.filter(c => c.status === "pending").length;
    const approved = contests.filter(c => c.status === "approved").length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
            
            {/* HEADER SECTION */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Creator Dashboard
                    </span>
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Welcome back, {creatorUser?.name?.split(' ')[0] || "Creator"}!
                </p>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* LEFT COLUMN - PROFILE */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative">
                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                <div className="relative">
                                    <img
                                        src={creatorUser?.photoURL || user?.photoURL || "https://via.placeholder.com/100"}
                                        alt="profile"
                                        className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
                                    />
                                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Profile Info */}
                        <div className="pt-16 pb-6 px-6 text-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {creatorUser?.name || user?.displayName || "Unknown User"}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">{creatorUser?.email || user?.email}</p>
                            
                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{total}</div>
                                    <div className="text-xs text-gray-500">Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{approved}</div>
                                    <div className="text-xs text-gray-500">Approved</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-amber-600">{pending}</div>
                                    <div className="text-xs text-gray-500">Pending</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Devices Section */}
                        <div className="border-t border-gray-100 px-6 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <FaDesktop className="text-indigo-600" />
                                    Active Devices
                                </h3>
                                <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
                                    {devices.length} active
                                </span>
                            </div>
                            <div className="space-y-2">
                                {devices.length > 0 ? (
                                    devices.map((d, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <FaDesktop className="text-indigo-600 text-sm" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-800">{d.deviceName}</div>
                                                <div className="text-xs text-gray-500">{d.browser}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm text-center py-2">No devices found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - STATS & ACTIONS */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Products</p>
                                    <p className="text-3xl font-bold mt-1">{total}</p>
                                </div>
                                <FaTrophy className="text-2xl opacity-90" />
                            </div>
                            <div className="mt-3 text-xs opacity-90">
                                All your creative challenges
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Pending</p>
                                    <p className="text-3xl font-bold mt-1">{pending}</p>
                                </div>
                                <FaClock className="text-2xl opacity-90" />
                            </div>
                            <div className="mt-3 text-xs opacity-90">
                                Awaiting approval
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Approved</p>
                                    <p className="text-3xl font-bold mt-1">{approved}</p>
                                </div>
                                <FaCheckCircle className="text-2xl opacity-90" />
                            </div>
                            <div className="mt-3 text-xs opacity-90">
                                Ready for participants
                            </div>
                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <FaPlusCircle className="text-2xl text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Create New Products</h3>
                                    <p className="text-gray-600 text-sm">Launch your next challenge</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Create engaging contests with custom tasks, prize money, and deadlines.
                            </p>
                            <Link to="/dashboard/CreateContest">
                                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-md transition-all hover:scale-[1.02]">
                                    Start Creating
                                </button>
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <FaListAlt className="text-2xl text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Manage Products</h3>
                                    <p className="text-gray-600 text-sm">Oversee all your creations</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Edit, track, and analyze performance of your existing contests.
                            </p>
                            <Link to="/dashboard/ShowContestTable">
                                <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-lg hover:shadow-md transition-all hover:scale-[1.02]">
                                    View Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* RECENT ACTIVITY PLACEHOLDER */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FaChartBar className="text-indigo-600" />
                            Quick Stats
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4">
                                <div className="text-2xl font-bold text-gray-900">0</div>
                                <div className="text-sm text-gray-500">Active</div>
                            </div>
                            <div className="text-center p-4">
                                <div className="text-2xl font-bold text-gray-900">0</div>
                                <div className="text-sm text-gray-500">Participants</div>
                            </div>
                            <div className="text-center p-4">
                                <div className="text-2xl font-bold text-gray-900">$0</div>
                                <div className="text-sm text-gray-500">Prize Pool</div>
                            </div>
                            <div className="text-center p-4">
                                <div className="text-2xl font-bold text-gray-900">0%</div>
                                <div className="text-sm text-gray-500">Approval Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Getting Started</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="text-indigo-600 font-bold text-lg mb-2">1. Create</div>
                        <p className="text-gray-600 text-sm">Design your Products with clear instructions and attractive prizes.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="text-indigo-600 font-bold text-lg mb-2">2. Submit</div>
                        <p className="text-gray-600 text-sm">Submit for approval and wait for admin review.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="text-indigo-600 font-bold text-lg mb-2">3. Engage</div>
                        <p className="text-gray-600 text-sm">Once approved, watch participants join your challenge.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard;