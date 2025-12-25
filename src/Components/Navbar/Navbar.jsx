import React, { useContext } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../../Provider/AuthProvider';
import Logo from '../Logo/Logo';
import Swal from 'sweetalert2';



const Navbar = () => {
    const { user, LogOut } = useContext(AuthContext);

    const links = (
        <>
            <li><NavLink to='/'>Home</NavLink></li>
            <li><NavLink to='/allFoods'>All Products</NavLink></li>
            <li><NavLink to='/allReviews'>All Reviews</NavLink></li>
        </>
    );

    const handleLogOut = () => {
        LogOut().then(() => {
            Swal.fire("Wow Sign-out successful!");
        }).catch((error) => {
            console.log(error.message)
        });
    }

    return (
        <div className="navbar bg-base-100 shadow-sm w-[95%]  mx-auto">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1000] mt-3 w-52 p-2 shadow">
                        {/* {links} */}
                    </ul>
                </div>
                <Logo></Logo>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {/* {links} */}
                </ul>
            </div>

            <div className="navbar-end pr-5">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Profile"
                                    src={user.photoURL || "https://via.placeholder.com/100"}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                        >
                            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                            <li><button onClick={handleLogOut}>Logout</button></li>
                        </ul>
                    </div>

                ) : (
                    <NavLink to="/login" className="btn">
                        Login
                    </NavLink>
                )}
            </div>
        </div>
    );
};

export default Navbar;