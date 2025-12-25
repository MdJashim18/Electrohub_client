import axios from 'axios';
import React from 'react';



const axiosSecure = axios.create({
  baseURL: 'https://electro-hub-api-server.vercel.app'
});


const UseAxiosSecure = () => {
    return axiosSecure
};

export default UseAxiosSecure;