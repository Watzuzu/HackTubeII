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
                const res = await fetch("https://hacktube.fr/api/me", {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success && data.user) {
                    setIsLogged(true);
                    setIsAdmin(!!data.user.isAdmin);
                    if (data.user.profilePic) {
                        setProfilePic(
                            data.user.profilePic.startsWith("/uploads/")
                                ? `https://hacktube.fr${data.user.profilePic}`
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
        <header className="sticky top-0 z-50 w-full bg-base-100/80 backdrop-blur border-b border-base-300 shadow-sm animate-fade-in">
            <nav className="flex items-center justify-between px-2 sm:px-6 py-2 gap-2">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="w-10 sm:w-16 transition-transform duration-300 hover:scale-105" />
                    <span className="hidden sm:inline text-xl font-bold text-primary tracking-tight">HackTube</span>
                </Link>
                {/* Barre de recherche */}
                <div className="flex-1 flex justify-center mx-2">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="input input-bordered w-full max-w-xs rounded-full bg-base-200 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                {/* Actions à droite */}
                <div className="flex items-center gap-2">
                    {/* Thème */}
                    <button
                        className="btn btn-ghost btn-circle transition-all duration-200"
                        aria-label="Changer le thème"
                        onClick={handleThemeToggle}
                    >
                        {isDark ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 animate-fade-in"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 animate-fade-in"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        )}
                    </button>
                    {/* Profil / menu */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full border border-base-300">
                                <img
                                    alt="Photo de profil"
                                    src={profilePic}
                                    className="bg-gray-300 object-cover w-full h-full"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-xl z-10 mt-3 w-52 p-2 shadow animate-fade-in">
                            {isLogged && (
                                <li>
                                    <Link to="/account" className="justify-between">
                                        Profil
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link to="/settings" className="justify-between">
                                    Paramètres
                                    <span className="badge bg-base-300">Bientôt</span>
                                </Link>
                            </li>
                            {!isLogged && (
                                <li>
                                    <Link to="/login" className="justify-between">
                                        Connexion
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
                </div>
            </nav>
            <style>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(-10px);}
                  to { opacity: 1; transform: translateY(0);}
                }
                .animate-fade-in { animation: fade-in 0.5s cubic-bezier(.4,0,.2,1) both; }
                @keyframes gradient-move {
                  0% { background-position: 0% 50%; }
                  100% { background-position: 100% 50%; }
                }
                .animate-gradient-move {
                  background-size: 200% 200%;
                  animation: gradient-move 8s linear infinite alternate;
                }
            `}</style>
        </header>
    );
};

export default Header;
