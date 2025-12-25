import React from 'react';
import logo from '../../assets/logo.jpg'
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to="/">
            <div className='flex items-end gap-2'>
                <img className="w-50" src={logo} alt="" />
            </div>
        </Link>
    );
};

export default Logo;