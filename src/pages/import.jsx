import React, { useState } from "react";
import VideoUploader from "../components/VideoUploader";

const Import = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleImport = () => {
        setSuccess(false);
        setError("");
        if (!file || !title) {
            setError("Veuillez sélectionner une vidéo et entrer un titre.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            // Créer une miniature
            const videoElement = document.createElement('video');
            videoElement.src = e.target.result;
            videoElement.currentTime = 1;
            videoElement.onloadeddata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const thumbnail = canvas.toDataURL('image/png');
                // Sauvegarder la vidéo avec la miniature
                const videos = JSON.parse(localStorage.getItem("videos") || "[]");
                const id = Date.now();
                videos.push({
                    id,
                    title,
                    url: e.target.result,
                    thumbnail,
                });
                localStorage.setItem("videos", JSON.stringify(videos));
                setSuccess(true);
            };
        };
        reader.readAsDataURL(file);
    };

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
