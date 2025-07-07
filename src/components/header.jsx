import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Hack.png';
import AccountDefault from '../assets/account.png';

const Header = ({ onSearch }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : false;
    });
    const [search, setSearch] = useState("");
    const [profilePic, setProfilePic] = useState(AccountDefault);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    // Récupère la photo de profil de l'utilisateur connecté
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://192.168.1.112:5000/api/me", {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success && data.user) {
                    setIsLogged(true);
                    setIsAdmin(!!data.user.isAdmin);
                    if (data.user.profilePic) {
                        setProfilePic(
                            data.user.profilePic.startsWith("/uploads/")
                                ? `http://192.168.1.112:5000${data.user.profilePic}`
                                : data.user.profilePic
                        );
                    } else {
                        setProfilePic(AccountDefault);
                    }
                } else {
                    setIsLogged(false);
                    setIsAdmin(false);
                    setProfilePic(AccountDefault);
                }
            } catch {
                setIsLogged(false);
                setIsAdmin(false);
                setProfilePic(AccountDefault);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const handleThemeToggle = () => {
        setIsDark((prev) => !prev);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    return (
        <header>
            <div className="navbar bg-base-300 shadow-sm">
                <div className="flex-1">
                    <Link to="/">
                        <img src={logo} alt="Logo" className='w-28'/>
                    </Link>
                </div>
                <div className="flex gap-2 ">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-24 md:w-auto"
                        value={search}
                        onChange={handleSearch}
                    />
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Photo de profil"
                                    src={profilePic}
                                    className='bg-gray-300'
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {isLogged && (
                                <li>
                                    <Link to="/account" className="justify-between">
                                        Profile
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link to="/settings" className="justify-between">
                                    Settings
                                    <span className="badge bg-base-300">Soon</span>
                                </Link>
                            </li>
                            {!isLogged && (
                                <li>
                                    <Link to="/login" className="justify-between">
                                        Login
                                    </Link>
                                </li>
                            )}
                            {isAdmin && (
                                <li>
                                    <Link to="/import" className="justify-between">
                                        Import
                                        <span className="badge badge-success">ADMIN</span>
                                    </Link>
                                </li>
                            )}
                            {isAdmin && (
                                <li>
                                    <Link to="/dashboard" className="justify-between">
                                    Dashboard
                                    <span className="badge badge-success">ADMIN</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    <label className="flex cursor-pointer gap-2 items-center">
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
                            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                        </svg>
                        <input
                            type="checkbox"
                            className="toggle theme-controller"
                            checked={isDark}
                            onChange={handleThemeToggle}
                        />
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
                </div>
            </div>
        </header>
    );
};

export default Header;
