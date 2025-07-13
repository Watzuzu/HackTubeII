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
        setUser((prev) => (prev ? { ...prev, profilePic: data.url } : prev)); // <-- Ajouté
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
      <div className="flex flex-col items-center justify-center p-4">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Account Page</h1>
        <p className="text-red-500">{msg}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Mon compte</h1>
      <div className="bg-base-200 p-6 rounded shadow-md w-full max-w-sm flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={
              profilePic.startsWith("/uploads/")
                ? `https://hacktube.fr${profilePic}`
                : profilePic
            }
            alt="Photo de profil"
            className="w-24 h-24 rounded-full object-cover border-2 border-primary"
          />
          <button
            className="absolute bottom-0 right-0 btn btn-xs btn-primary"
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
          <div className="mb-2">
            <span className="badge badge-success">Administrateur</span>
          </div>
        )}
        <div className="mb-2">
          <span className="font-semibold">Adresse mail :</span> {user.email}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Mot de passe :</span> ********
        </div>
        <button
          className="btn btn-error mt-4"
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
          <div className="mt-4 text-center text-sm text-primary">{msg}</div>
        )}
      </div>
    </div>
  );
};

export default Account;