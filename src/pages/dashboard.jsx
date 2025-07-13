import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate();

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

      } catch {
        navigate("/account");
      }
      setLoading(false);
    };
    fetchDashboard();
  }, [navigate]);

  if (loading) return <div className="flex justify-center items-center min-h-screen text-xl">Chargement...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-primary">Dashboard Administrateur</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Comptes existants */}
        <section className="bg-base-200 rounded-2xl shadow-lg p-10 min-h-[550px] flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-secondary">Comptes existants</h2>
          <ul className="flex-1 overflow-y-auto text-base">
            {users.length === 0 && <li className="text-gray-400">Aucun utilisateur</li>}
            {users.map((u, i) => (
              <li key={i} className="mb-4 flex items-center gap-3">
                <span className="font-mono">{u.email}</span>
                {u.isAdmin && <span className="badge badge-success">Admin</span>}
                {!u.isAdmin && (
                  <button
                    className="btn btn-xs btn-error ml-2 px-2 flex items-center justify-center"
                    title="Supprimer le compte"
                    onClick={async () => {
                      if (window.confirm(`Voulez-vous vraiment supprimer le compte ${u.email} ? Cette action est irréversible.`)) {
                        if (window.confirm("Confirmez la suppression définitive de ce compte.")) {
                          const res = await fetch(`https://hacktube.fr/api/admin/user/${encodeURIComponent(u.email)}`, {
                            method: "DELETE",
                            credentials: "include"
                          });
                          const data = await res.json();
                          if (data.success) {
                            setUsers(users.filter(user => user.email !== u.email));
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
                )}
              </li>
            ))}
          </ul>
        </section>
        {/* Logs de connexion */}
        <section className="bg-base-200 rounded-2xl shadow-lg p-10 min-h-[550px] flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-secondary">Logs de connexion</h2>
          <ul className="flex-1 overflow-y-auto max-h-[400px] text-base">
            {logs.length === 0 && <li className="text-gray-400">Aucun log</li>}
            {logs.map((log, i) => (
              <li key={i} className="mb-2 text-xs font-mono text-gray-600">
                <span className="font-bold">{log.email}</span>
                <span className="ml-2">{new Date(log.date).toLocaleString()}</span>
                <span className="ml-2 text-gray-400">{log.ip}</span>
              </li>
            ))}
          </ul>
        </section>
        {/* Derniers uploads */}
        <section className="bg-base-200 rounded-2xl shadow-lg p-10 min-h-[550px] flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-secondary">Derniers uploads</h2>
          <ul className="flex-1 overflow-y-auto max-h-[400px] text-base">
            {uploads.length === 0 && <li className="text-gray-400">Aucun upload</li>}
            {uploads.map((up, i) => (
              <li key={i} className="mb-4 flex items-center gap-3">
                <span className="font-semibold">{up.title}</span>
                <a
                  href={up.url.startsWith("/uploads/") ? `https://hacktube.fr${up.url}` : up.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary text-xs"
                >
                  Voir
                </a>
                <button
                  className="btn btn-xs btn-error ml-2 px-2 flex items-center justify-center"
                  title="Supprimer"
                  onClick={async () => {
                    // Confirmation double pour éviter le miss clic
                    if (window.confirm("Voulez-vous vraiment supprimer cette vidéo ? Cette action est irréversible.")) {
                      if (window.confirm("Confirmez la suppression définitive de cette vidéo.")) {
                        const res = await fetch(`https://hacktube.fr/api/admin/video/${up.id}`, {
                          method: "DELETE",
                          credentials: "include"
                        });
                        const data = await res.json();
                        if (data.success) {
                          setUploads(uploads.filter(v => v.id !== up.id));
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
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;