import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoUploader from "../components/VideoUploader";

const Import = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch("https://hacktube.fr/api/me", {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success && data.user && data.user.isAdmin) {
                    setIsAdmin(true);
                } else {
                    navigate("/account");
                }
            } catch {
                navigate("/account");
            }
            setLoading(false);
        };
        checkAdmin();
    }, [navigate]);

    const handleUploadSuccess = () => {
        setSuccess(true);
        setError("");
    };

    const handleUploadError = (errorMessage) => {
        setError(errorMessage);
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess(false);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        try {
            const res = await fetch("https://hacktube.fr/api/videos", {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                handleUploadSuccess();
            } else {
                handleUploadError(data.message || "Une erreur est survenue.");
            }
        } catch (err) {
            handleUploadError("Erreur réseau : " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 animate-fade-in">
            <p className="text-lg text-primary animate-pulse">Chargement...</p>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 px-2 animate-fade-in">
            <div className="w-full max-w-md bg-base-200 rounded-2xl shadow-xl p-6 flex flex-col items-center relative overflow-hidden animate-fade-in">
                {/* Animation de fond */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="w-full h-full bg-gradient-to-tr from-base-100/60 via-base-300/40 to-primary/10 animate-gradient-move"></div>
                </div>
                <h1 className="text-2xl font-bold mb-6 text-primary text-center z-10 animate-fade-in">Importer une vidéo</h1>
                <p className="text-base text-gray-600 mb-6 text-center z-10 animate-fade-in">Sélectionnez un fichier vidéo et donnez-lui un titre.</p>
                <div className="w-full flex flex-col gap-4 z-10 animate-fade-in">
                    <VideoUploader onFileChange={obj => setFile(obj?.file)} onTitleChange={setTitle} />
                </div>
                {success && (
                    <div className="alert alert-success mt-4 w-full animate-fade-in">
                        Vidéo importée avec succès !
                    </div>
                )}
                {error && (
                    <div className="alert alert-error mt-4 w-full animate-fade-in">
                        {error}
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
}

export default Import;
