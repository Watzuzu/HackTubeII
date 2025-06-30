import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Hack.png';

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg px-8 flex items-center justify-between fixed top-0 left-0 w-full h-[50px] z-50">
            <div className="text-xl font-extrabold text-white tracking-wide drop-shadow-lg">
                <span className="inline-block align-middle mr-2">
                    <Link to="/">
                        <img src={logo} alt="Logo" className='w-28'/>
                    </Link>
                </span>
            </div>
            <nav>
                <ul className="flex space-x-6">
                    <li><a href="#" className="text-white hover:text-yellow-300 font-medium transition-colors">Accueil</a></li>
                    <li><a href="#" className="text-white hover:text-yellow-300 font-medium transition-colors">À propos</a></li>
                    <li><a href="#" className="text-white hover:text-yellow-300 font-medium transition-colors">Contact</a></li>
                    <label className="flex cursor-pointer gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <path
                        d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                    <input type="checkbox" value="synthwave" className="toggle theme-controller" />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    </label>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
