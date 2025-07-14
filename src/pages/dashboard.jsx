import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate();
  const intervalRef = useRef();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const resMe = await fetch("https://hacktube.fr/api/me", {
          credentials: "include",
        });
        const dataMe = await resMe.json();
        if (!dataMe.success || !dataMe.user.isAdmin) {
          navigate("/account");
          return;
        }
        setIsAdmin(true);

        const resUsers = await fetch("https://hacktube.fr/api/admin/users", {
          credentials: "include",
        });
        setUsers(await resUsers.json());

        const resLogs = await fetch("https://hacktube.fr/api/admin/logs", {
          credentials: "include",
        });
        setLogs(await resLogs.json());

        const resUploads = await fetch("https://hacktube.fr/api/admin/uploads", {
          credentials: "include",
        });
        setUploads(await resUploads.json());

        intervalRef.current = setInterval(async () => {
          const resUsers = await fetch("https://hacktube.fr/api/admin/users", {
            credentials: "include",
          });
          setUsers(await resUsers.json());
        }, 5000);
      } catch {
        navigate("/account");
      }
      setLoading(false);
    };
    fetchDashboard();

    // Déconnexion uniquement si fermeture onglet ou navigateur (pas F5)
    const handlePageHide = (e) => {
      if (performance.getEntriesByType("navigation")[0]?.type === "reload" || e.persisted) return;
      navigator.sendBeacon && navigator.sendBeacon("https://hacktube.fr/api/logout");
    };
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl animate-pulse text-primary">
        Chargement...
      </div>
    );

  return (
    <div className="p-2 sm:p-4 md:p-10 max-w-7xl mx-auto transition-colors duration-300">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-6 sm:mb-10 text-center text-primary drop-shadow-lg animate-fade-in">
        Dashboard Administrateur
      </h1>
      <div className="flex flex-col items-center mb-6 sm:mb-10">
        <section className="bg-base-200 rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-6 md:p-12 min-h-[400px] sm:min-h-[550px] w-full max-w-full sm:max-w-2xl flex flex-col relative overflow-hidden transition-all duration-300">
          {/* Animation de fond */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="w-full h-full bg-gradient-to-tr from-base-100/60 via-base-300/40 to-primary/10 animate-gradient-move"></div>
          </div>
          <div className="flex items-center mb-4 sm:mb-8 z-10 relative">
            {/* Compteur animé à gauche */}
            <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-base-100 border border-green-200 text-green-700 text-sm sm:text-base font-semibold mr-2 sm:mr-4 shadow transition-all duration-300 animate-fade-in">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="7" stroke="green" />
                <circle cx="8" cy="8" r="3" fill="green" className="animate-pulse" />
              </svg>
              <span className="animate-bounce">{users.filter(u => u.online).length}</span>
            </span>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-secondary text-center flex-1 tracking-tight animate-fade-in">
              Comptes existants
            </h2>
          </div>
          <ul className="flex-1 overflow-y-auto text-sm sm:text-base z-10 relative">
            {users.length === 0 && (
              <li className="text-gray-400 text-center py-10 animate-fade-in">Aucun utilisateur</li>
            )}
            {users.map((u, i) => (
              <li
                key={i}
                className="mb-2 sm:mb-4 flex flex-col sm:flex-row items-center bg-base-100/60 rounded-xl px-2 sm:px-3 py-2 shadow-sm hover:scale-[1.01] transition-transform duration-200 group"
              >
                {/* Photo de profil à gauche */}
                <div
                  className={`w-10 h-10 rounded-full border-4 flex-shrink-0 transition-all duration-300 ${
                    u.online ? "border-green-500 animate-pulse" : "border-gray-400"
                  } mb-2 sm:mb-0`}
                  style={{
                    background: "#fff",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={u.profilePic || "/default-profile.png"}
                    alt="Profil"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {/* Email centré */}
                <div className="flex-1 flex justify-center w-full sm:w-auto">
                  <span className="font-mono w-40 sm:w-48 truncate text-center text-sm sm:text-base group-hover:text-primary transition-colors duration-200">
                    {u.email}
                  </span>
                </div>
                {/* Actions à droite */}
                <div className="flex items-center gap-2 sm:gap-3 justify-end min-w-[180px] sm:min-w-[220px] mt-2 sm:mt-0">
                  <button
                    className={`badge w-20 flex justify-center cursor-pointer transition-all duration-200 ${
                      u.isAdmin
                        ? "badge-success animate-fade-in"
                        : "badge-neutral opacity-70 hover:opacity-100"
                    }`}
                    title={u.isAdmin ? "Retirer le statut admin" : "Promouvoir en admin"}
                    onClick={async () => {
                      if (u.isAdmin) {
                        if (window.confirm(`Voulez-vous vraiment retirer le statut admin à ${u.email} ?`)) {
                          if (window.confirm("Confirmez la rétrogradation de cet administrateur.")) {
                            const res = await fetch(`https://hacktube.fr/api/admin/demote/${encodeURIComponent(u.email)}`, {
                              method: "POST",
                              credentials: "include",
                            });
                            const data = await res.json();
                            if (data.success) {
                              const resUsers = await fetch("https://hacktube.fr/api/admin/users", {
                                credentials: "include",
                              });
                              const usersData = await resUsers.json();
                              setUsers(usersData);
                            } else {
                              alert(data.message || "Erreur lors de la rétrogradation.");
                            }
                          }
                        }
                      } else {
                        if (window.confirm(`Voulez-vous vraiment rendre ${u.email} administrateur ?`)) {
                          if (window.confirm("Confirmez la promotion en administrateur.")) {
                            const res = await fetch(`https://hacktube.fr/api/admin/promote/${encodeURIComponent(u.email)}`, {
                              method: "POST",
                              credentials: "include",
                            });
                            const data = await res.json();
                            if (data.success) {
                              const resUsers = await fetch("https://hacktube.fr/api/admin/users", {
                                credentials: "include",
                              });
                              const usersData = await resUsers.json();
                              setUsers(usersData);
                            } else {
                              alert(data.message || "Erreur lors de la promotion.");
                            }
                          }
                        }
                      }
                    }}
                  >
                    Admin
                  </button>
                  {u.confirmed ? (
                    <span title="Compte vérifié" className="inline-flex items-center text-green-600 animate-fade-in">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="9" r="8" stroke="green" />
                        <polyline points="5 9 8 12 13 7" stroke="green" fill="none" />
                      </svg>
                    </span>
                  ) : (
                    <span title="Compte non vérifié" className="inline-flex items-center text-red-500 animate-fade-in">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="9" r="8" stroke="red" />
                        <line x1="6" y1="6" x2="12" y2="12" stroke="red" />
                        <line x1="12" y1="6" x2="6" y2="12" stroke="red" />
                      </svg>
                    </span>
                  )}
                  <button
                    className="btn btn-xs flex items-center justify-center bg-transparent border-none text-gray-500 hover:text-red-600 rounded-full transition-all duration-150"
                    title="Supprimer le compte"
                    style={{ width: 32, height: 32, padding: 0 }}
                    onClick={async () => {
                      if (window.confirm(`Voulez-vous vraiment supprimer le compte ${u.email} ? Cette action est irréversible.`)) {
                        if (window.confirm("Confirmez la suppression définitive de ce compte.")) {
                          const res = await fetch(`https://hacktube.fr/api/admin/user/${encodeURIComponent(u.email)}`, {
                            method: "DELETE",
                            credentials: "include",
                          });
                          const data = await res.json();
                          if (data.success) {
                            setUsers(users.filter((user) => user.email !== u.email));
                          } else {
                            alert(data.message || "Erreur lors de la suppression.");
                          }
                        }
                      }
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="8" width="10" height="9" rx="2" />
                      <path d="M9 3h4M4 6h14M8 10v5M11 10v5M14 10v5" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {/* Deux sections en dessous, côte à côte sur desktop, empilées sur mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-10">
        {/* Logs de connexion */}
        <section className="bg-base-200 rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-6 min-h-[250px] sm:min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="w-full h-full bg-gradient-to-tr from-base-100/60 via-base-300/40 to-primary/10 animate-gradient-move"></div>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-secondary text-center animate-fade-in">Logs de connexion</h2>
          <ul className="flex-1 overflow-y-auto max-h-[200px] sm:max-h-[400px] text-xs sm:text-base z-10 relative">
            {logs.length === 0 && <li className="text-gray-400 text-center py-6 sm:py-10 animate-fade-in">Aucun log</li>}
            {[...logs].reverse().map((log, i) => (
              <li key={i} className="mb-1 sm:mb-2 text-xs font-mono text-gray-600 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 animate-fade-in">
                <span className="font-bold">{log.email}</span>
                <span className="sm:ml-2">{new Date(log.date).toLocaleString()}</span>
                <span className="sm:ml-2 text-gray-400">{log.ip}</span>
              </li>
            ))}
          </ul>
        </section>
        {/* Derniers uploads */}
        <section className="bg-base-200 rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-6 min-h-[250px] sm:min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="w-full h-full bg-gradient-to-tr from-base-100/60 via-base-300/40 to-primary/10 animate-gradient-move"></div>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-secondary text-center animate-fade-in">Derniers uploads</h2>
          <ul className="flex-1 overflow-y-auto max-h-[200px] sm:max-h-[400px] text-xs sm:text-base z-10 relative">
            {uploads.length === 0 && <li className="text-gray-400 text-center py-6 sm:py-10 animate-fade-in">Aucun upload</li>}
            {uploads.map((up, i) => (
              <li key={i} className="mb-2 sm:mb-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-base-100/60 rounded-xl px-2 sm:px-3 py-2 shadow-sm hover:scale-[1.01] transition-transform duration-200 group animate-fade-in">
                <span className="font-semibold truncate">{up.title}</span>
                <div className="flex gap-1 sm:gap-2 ml-auto">
                  <a
                    href={up.url.startsWith("/uploads/") ? `https://hacktube.fr${up.url}` : up.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary text-xs"
                    style={{ minWidth: 40, textAlign: "center" }}
                  >
                    Voir
                  </a>
                  <button
                    className="btn btn-xs btn-error px-2 flex items-center justify-center transition-all duration-150"
                    title="Supprimer"
                    onClick={async () => {
                      if (window.confirm("Voulez-vous vraiment supprimer cette vidéo ? Cette action est irréversible.")) {
                        if (window.confirm("Confirmez la suppression définitive de cette vidéo.")) {
                          const res = await fetch(`https://hacktube.fr/api/admin/video/${up.id}`, {
                            method: "DELETE",
                            credentials: "include",
                          });
                          const data = await res.json();
                          if (data.success) {
                            setUploads(uploads.filter((v) => v.id !== up.id));
                          } else {
                            alert(data.message || "Erreur lors de la suppression.");
                          }
                        }
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                      <line x1="4" y1="4" x2="12" y2="12" />
                      <line x1="12" y1="4" x2="4" y2="12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {/* Animations CSS personnalisées */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s linear infinite alternate;
        }
        .animate-bounce {
          animation: bounce 1.2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-6px);}
        }
      `}</style>
    </div>
  );
};

export default Dashboard;