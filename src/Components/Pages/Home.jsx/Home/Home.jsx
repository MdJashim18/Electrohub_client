import React from 'react';
import Banner from '../Banner/Banner';
import ShowProducts from '../../Products/ShowProducts';
import Footer from '../../../Footer/Footer';
import { Link } from 'react-router';
import AdvertisementSection from '../AdvertisementSection/AdvertisementSection';




const Home = () => {
    return (
        <div className='w-[95%]  mx-auto'>
            <Banner></Banner>
            <ShowProducts></ShowProducts>
            <div className='flex justify-center my-5'>
                <Link to='/AllProducts' className='btn btn-success'>Show All</Link>
            </div>
            <AdvertisementSection></AdvertisementSection>
        </div>
    );
};

export default Home;
