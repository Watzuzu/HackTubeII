import React, { useState, useRef } from 'react';

const VideoUploader = ({ onFileChange, onTitleChange }) => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const timeoutRef = useRef(null);

  // Animation d'apparition
  const fadeIn = "animate-fade-in";

  // Simulation de la barre de progression (pour la preview locale)
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

  // Correction : toujours utiliser useRef(null) pour chaque vidéo
  // Correction : ne jamais utiliser createRef dans un render, car cela casse la persistance
  // Correction : onSubmit doit toujours recevoir l'event
  // Correction : uploadToBackend ne doit jamais être async si utilisé comme handler direct de onSubmit
  // Correction : retire le mot-clé async sur uploadToBackend
  const uploadToBackend = (e) => {
    if (e) e.preventDefault(); // ← Ajout pour stopper tout submit par défaut
    console.log("Tentative d'upload");
    setError("");
    setSuccess("");
    if (!file || !title) {
      setError("Veuillez sélectionner une vidéo et entrer un titre.");
      return;
    }
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    setLoading(true);
    setProgress(0);
    const xhr = new window.XMLHttpRequest();
    xhr.open("POST", "https://hacktube.fr/api/videos", true);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        setProgress(percent);
      }
    };
    xhr.onload = () => {
      setLoading(false);
      setProgress(100);
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        setSuccess("Vidéo uploadée sur le serveur !");
        setVideoSrc(null);
        setFile(null);
        setTitle("");
        if (onFileChange) onFileChange(data);
      } else {
        setError("Erreur lors de l'upload : " + xhr.statusText);
      }
    };
    xhr.onerror = () => {
      setLoading(false);
      setError("Erreur réseau lors de l'upload.");
    };
    xhr.send(formData);
  };

  const handleVideoUpload = (event) => {
    setError("");
    setSuccess("");
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      simulateProgress();
      const videoURL = URL.createObjectURL(selectedFile);
      setTimeout(() => {
        setVideoSrc(videoURL);
        if (onFileChange) onFileChange({ file: selectedFile, url: videoURL });
      }, 1200);
    } else {
      setError("Veuillez sélectionner un fichier vidéo.");
    }
  };

  return (
    <div className={`relative max-w-md w-full mx-auto mt-10 px-4 py-8 rounded-3xl shadow-2xl border border-base-200 bg-base-200/80 dark:bg-base-300/80 backdrop-blur-md ${fadeIn} transition-all duration-500`}
      tabIndex={0}
      aria-label="Uploader une vidéo"
    >
      {/* Animation de fond */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="w-full h-full animate-gradient-move bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-2xl opacity-60" />
      </div>
      <h2 className="text-2xl font-bold text-base-content mb-6 text-center tracking-tight select-none animate-fade-in-up">Importer une vidéo</h2>
      <form
        className="flex flex-col gap-5 items-center w-full"
        onSubmit={uploadToBackend} // ← Correction : passe l'event à uploadToBackend
        autoComplete="off"
      >
        <label className="w-full">
          <input
            type="text"
            placeholder="Titre du film"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (onTitleChange) onTitleChange(e.target.value);
            }}
            className="input input-bordered w-full bg-base-100/80 text-base-content placeholder:text-base-content/60 rounded-xl focus:ring-2 focus:ring-primary/60 transition-all"
            aria-label="Titre du film"
            disabled={loading}
            required
          />
        </label>
        <label className="relative w-full flex flex-col items-center cursor-pointer group">
          <div className="flex items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-primary/40 bg-base-100/60 group-hover:border-primary/80 transition-all duration-200 animate-fade-in-up">
            <svg className="w-10 h-10 text-primary/70 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
            <span className="ml-3 text-base-content/70 text-sm">Glissez ou cliquez pour choisir une vidéo</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Choisir une vidéo"
              disabled={loading}
              tabIndex={0}
            />
          </div>
        </label>
        <div className="w-full flex flex-col items-center gap-2 animate-fade-in-up">
          <span className="text-xs text-base-content/50">Formats supportés : MP4, AVI, MKV, etc.</span>
          {error && <div className="w-full text-center text-error bg-error/10 rounded-lg py-2 px-3 animate-bounce-in shadow-sm">{error}</div>}
          {success && <div className="w-full text-center text-success bg-success/10 rounded-lg py-2 px-3 animate-fade-in shadow-sm">{success}</div>}
        </div>
        {/* Affichage de la barre de progression pendant l'upload */}
        {(loading || progress > 0) && (
          <div className="w-full mt-2 animate-fade-in-up">
            <div className="w-full bg-base-100/60 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary via-secondary to-accent h-full animate-progress-move transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-base-content/60 mt-1">{Math.floor(progress)}%</p>
          </div>
        )}
        {videoSrc && !loading && (
          <div className="w-full mt-4 animate-fade-in-up">
            <video className="w-full rounded-xl shadow-lg border border-base-300/60" controls tabIndex={0}>
              <source src={videoSrc} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary w-full mt-2 rounded-xl shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary/60 disabled:opacity-60 disabled:cursor-not-allowed animate-fade-in-up"
          disabled={loading || !file || !title}
          aria-disabled={loading || !file || !title}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-primary rounded-full"></span>
              Envoi...
            </span>
          ) : (
            <span>Uploader sur le serveur</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default VideoUploader;
