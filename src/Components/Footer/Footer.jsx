import React from "react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal bg-base-300 text-base-content p-10 w-[95%] mx-auto">
            <nav>
                <h6 className="footer-title">Services</h6>
                <a className="link link-hover">Branding</a>
                <a className="link link-hover">Design</a>
                <a className="link link-hover">Marketing</a>
                <a className="link link-hover">Advertisement</a>
            </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
                <a className="link link-hover">Jobs</a>
                <a className="link link-hover">Press kit</a>
            </nav>
            <nav>
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4">
                   
                    <a href="https://www.linkedin.com/in/mohammad-jashim-uddin-692167365/" target="blank">
                        <FaLinkedin className="w-6 h-6 fill-current" />
                    </a>
                    
                    <a href="https://github.com/MdJashim18" target="blank">
                        <FaGithub className="w-6 h-6 fill-current" />
                    </a>
                    
                    <a href="https://www.facebook.com/share/1BEhor8qZ6/" target="blank">
                        <FaFacebook className="w-6 h-6 fill-current" />
                    </a>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;
