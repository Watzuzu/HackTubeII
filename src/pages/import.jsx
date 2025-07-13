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
                    navigate("/account"); // Redirige si non admin
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

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="flex flex-col items-center justify-center ">
            <h1 className="text-2xl font-bold mb-4">Import Video Page</h1>
            <p className="text-gray-600">This is the import page where you can import your video.</p>
            <VideoUploader onFileChange={obj => setFile(obj?.file)} onTitleChange={setTitle} />
            {success && (
                <div className="alert alert-success mt-4">
                    Vidéo importée avec succès !
                </div>
            )}
            {error && (
                <div className="alert alert-error mt-4">
                    {error}
                </div>
            )}
        </div>
    );
}

export default Import;
