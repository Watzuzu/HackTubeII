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
                const res = await fetch("http://192.168.1.112:5000/api/me", {
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
