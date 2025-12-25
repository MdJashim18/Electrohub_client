import React, { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const UserDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = UseAxiosSecure();
  const [stats, setStats] = useState({ participated: 0, won: 0 });

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/contest-stats?email=${user.email}`)
        .then((res) => {
          setStats(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, axiosSecure]);

  if (!user) return <p>Please log in to see your dashboard.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      <div className="flex items-center gap-6 bg-base-100 p-6 rounded-2xl shadow-lg">
        <img
          src={user.photoURL || "/default-profile.png"}
          alt={user.displayName || "User"}
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.displayName || "User"}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>


      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-100 p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Joined Contests</h3>

          <p className="text-3xl font-bold">{stats.participated}</p>

        </div>

        <div className="bg-yellow-100 p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Won Contests</h3>
          <p className="text-3xl font-bold">{stats.won}</p>
        </div>
      </div> */}
    </div>
  );
};

export default UserDashboard;
