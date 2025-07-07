import React, { useState, useRef } from 'react';

const VideoUploader = ({ onFileChange, onTitleChange }) => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const timeoutRef = useRef(null);

  const simulateProgress = () => {
    let value = 0;
    setProgress(0);
    setLoading(true);

    const simulate = () => {
      value += Math.random() * 20;
      if (value >= 100) {
        value = 100;
        setProgress(value);
        setLoading(false);
        clearTimeout(timeoutRef.current);
        return;
      }
      setProgress(value);
      timeoutRef.current = setTimeout(simulate, 150);
    };

    simulate();
  };

  // Fonction pour upload vers le backend
  const uploadToBackend = async () => {
    if (!file || !title) {
      alert("Veuillez sélectionner une vidéo et entrer un titre.");
      return;
    }
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    try {
      setLoading(true);
      const res = await fetch("http://192.168.1.112:5000/api/videos", {
        method: "POST",
        body: formData,
      });
      setLoading(false);
      if (!res.ok) throw new Error("Erreur lors de l'upload");
      const data = await res.json();
      alert("Vidéo uploadée sur le serveur !");
      setVideoSrc(null);
      setFile(null);
      setTitle("");
      if (onFileChange) onFileChange(data); // callback pour rafraîchir la liste côté parent
    } catch (err) {
      setLoading(false);
      alert("Erreur backend : " + err.message);
    }
  };

  const handleVideoUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      simulateProgress();
      const videoURL = URL.createObjectURL(selectedFile);
      setTimeout(() => {
        setVideoSrc(videoURL);
        if (onFileChange) onFileChange({ file: selectedFile, url: videoURL });
      }, 1500);
    } else {
      alert("Veuillez sélectionner un fichier vidéo.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-base-300 shadow-lg rounded-2xl border border-base-200">
      <h2 className="text-2xl font-semibold text-base-content mb-4 text-center">Importer une vidéo</h2>
      <div className="flex flex-col items-center gap-4">
        <label className="">
          <input
            type="text"
            placeholder="Nom du film"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (onTitleChange) onTitleChange(e.target.value);
            }}
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="btn btn-primary mt-4">
          Choisir une vidéo
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-500">Formats supportés : MP4, AVI, MKV, etc.</p>

        {loading && (
          <div className="w-full mt-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-center text-gray-500 mt-1">{Math.floor(progress)}%</p>
          </div>
        )}

        {videoSrc && !loading && (
          <div className="w-full mt-4">
            <video className="w-full rounded-lg shadow" controls>
              <source src={videoSrc} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        )}

        <button
          className="btn btn-success mt-4"
          onClick={uploadToBackend}
          disabled={loading || !file || !title}
        >
          {loading ? "Envoi..." : "Uploader sur le serveur"}
        </button>
      </div>
    </div>
  );
};

export default VideoUploader;
