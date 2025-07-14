import React, { useEffect, useState, useRef } from "react";

const Account = () => {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState("/default-profile.png");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch("https://hacktube.fr/api/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          if (data.user.profilePic) setProfilePic(data.user.profilePic);
        } else {
          setMsg("Vous n'êtes pas connecté.");
        }
      } catch {
        setMsg("Erreur lors de la récupération du compte.");
      }
      setLoading(false);
    };
    fetchAccount();
  }, []);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await fetch("https://hacktube.fr/api/profile-pic", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProfilePic(data.url);
        setUser((prev) => (prev ? { ...prev, profilePic: data.url } : prev));
        setMsg("Photo de profil mise à jour !");
      } else {
        setMsg(data.message || "Erreur lors de l'upload.");
      }
    } catch {
      setMsg("Erreur lors de l'upload.");
    }
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 animate-fade-in">
        <p className="text-lg text-primary animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 animate-fade-in">
        <h1 className="text-2xl font-bold mb-4 text-primary">Mon compte</h1>
        <p className="text-red-500 text-center">{msg}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 px-2 animate-fade-in">
      <div className="w-full max-w-sm bg-base-200 rounded-2xl shadow-xl p-6 flex flex-col items-center relative overflow-hidden animate-fade-in">
        {/* Animation de fond */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-full h-full bg-gradient-to-tr from-base-100/60 via-base-300/40 to-primary/10 animate-gradient-move"></div>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-primary text-center z-10 animate-fade-in">
          Mon compte
        </h1>
        <div className="relative mb-4 z-10">
          <img
            src={
              profilePic.startsWith("/uploads/")
                ? `https://hacktube.fr${profilePic}`
                : profilePic
            }
            alt="Photo de profil"
            className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-lg transition-all duration-300 animate-fade-in"
          />
          <button
            className="absolute bottom-0 right-0 btn btn-xs btn-primary rounded-full shadow-md animate-fade-in"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            style={{ fontSize: "0.75rem" }}
            title="Changer la photo"
          >
            📷
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleProfilePicChange}
            disabled={uploading}
          />
        </div>
        {user.isAdmin && (
          <div className="mb-2 z-10">
            <span className="badge badge-success animate-fade-in">
              Administrateur
            </span>
          </div>
        )}
        <div className="mb-2 flex items-center gap-2 z-10">
          <span className="font-semibold">Adresse mail :</span> {user.email}
          {user.confirmed ? (
            <span
              title="Compte vérifié"
              className="inline-flex items-center text-green-600 animate-fade-in"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="9" r="8" stroke="green" />
                <polyline
                  points="5 9 8 12 13 7"
                  stroke="green"
                  fill="none"
                />
              </svg>
            </span>
          ) : (
            <span
              title="Compte non vérifié"
              className="inline-flex items-center text-red-500 animate-fade-in"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="9" r="8" stroke="red" />
                <line x1="6" y1="6" x2="12" y2="12" stroke="red" />
                <line x1="12" y1="6" x2="6" y2="12" stroke="red" />
              </svg>
            </span>
          )}
        </div>
        <div className="mb-2 z-10">
          <span className="font-semibold">Mot de passe :</span>{" "}
          <span className="tracking-widest">********</span>
        </div>
        <button
          className="btn btn-error mt-4 w-full rounded-lg shadow-md animate-fade-in"
          onClick={async () => {
            await fetch("https://hacktube.fr/api/logout", {
              method: "POST",
              credentials: "include",
            });
            window.location.href = "/login";
          }}
        >
          Se déconnecter
        </button>
        {msg && (
          <div className="mt-4 text-center text-sm text-primary z-10 animate-fade-in">
            {msg}
          </div>
        )}
      </div>
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
      `}</style>
    </div>
  );
};

export default Account;