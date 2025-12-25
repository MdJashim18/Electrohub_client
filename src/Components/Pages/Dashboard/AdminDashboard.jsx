import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const AdminDashboard = () => {
    const axiosSecure = UseAxiosSecure();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosSecure.get("/users");
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [axiosSecure]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const confirm = await Swal.fire({
                title: "Change user role?",
                text: `Set role to ${newRole}`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
            });

            if (!confirm.isConfirmed) return;

            setUpdatingId(userId);

            await axiosSecure.patch(`/users/${userId}`, {
                role: newRole,
            });

            setUsers(prev =>
                prev.map(u =>
                    u._id === userId ? { ...u, role: newRole } : u
                )
            );

            Swal.fire("Role updated", "", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Failed to update role", "", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading users...</p>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600">
                    Manage users & roles
                </p>
            </div>

            <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length ? (
                            users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name || user.displayName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                user.role === "admin"
                                                    ? "badge-error"
                                                    : user.role === "creator"
                                                    ? "badge-warning"
                                                    : "badge-info"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={user.role}
                                            disabled={updatingId === user._id}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    user._id,
                                                    e.target.value
                                                )
                                            }
                                            className="select select-bordered select-sm w-full max-w-xs"
                                        >
                                            <option value="user">User</option>
                                            <option value="creator">Creator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
