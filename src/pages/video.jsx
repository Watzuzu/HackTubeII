import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    fetch("https://hacktube.fr/api/videos")
      .then(res => res.json())
      .then(data => {
        const found = data.find(v => v.id === id);
        setVideo(found);
      });
  }, [id]);

  // Affichage/masquage auto des contrôles (inspiration Netflix)
  const showPlayerControls = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 2500);
  };

  // Lecture/pause
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    showPlayerControls();
  };

  // Mute/unmute
  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
    showPlayerControls();
  };

  // Volume
  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
      setIsMuted(videoRef.current.muted);
    }
    showPlayerControls();
  };

  // Progress bar
  const handleProgress = (e) => {
    const percent = (e.nativeEvent.offsetX / e.target.offsetWidth) * 100;
    if (videoRef.current) {
      videoRef.current.currentTime = (percent / 100) * duration;
      setProgress(percent);
    }
    showPlayerControls();
  };

  // Plein écran natif
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) containerRef.current.requestFullscreen();
      else if (containerRef.current.webkitRequestFullscreen) containerRef.current.webkitRequestFullscreen();
      else if (containerRef.current.mozRequestFullScreen) containerRef.current.mozRequestFullScreen();
      else if (containerRef.current.msRequestFullscreen) containerRef.current.msRequestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setFullscreen(false);
    }
    showPlayerControls();
  };

  // Suivi de l'état plein écran
  useEffect(() => {
    const onFull = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFull);
    document.addEventListener('webkitfullscreenchange', onFull);
    document.addEventListener('mozfullscreenchange', onFull);
    document.addEventListener('MSFullscreenChange', onFull);
    return () => {
      document.removeEventListener('fullscreenchange', onFull);
      document.removeEventListener('webkitfullscreenchange', onFull);
      document.removeEventListener('mozfullscreenchange', onFull);
      document.removeEventListener('MSFullscreenChange', onFull);
    };
  }, []);

  // Mise à jour de la barre de progression
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / duration) * 100);
  };

  // Formatage du temps
  const formatTime = (sec) => {
    if (!sec && sec !== 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!video) {
    return <div className="text-center mt-10 text-base-content">Vidéo introuvable.</div>;
  }

  return (
    <div
      id="video-container"
      ref={containerRef}
      className={`fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 animate-fade-in ${fullscreen ? 'p-0' : ''}`}
      tabIndex={0}
      onMouseMove={showPlayerControls}
      onClick={showPlayerControls}
      style={fullscreen ? {padding: 0} : {}}
    >
      {/* Bouton fermer */}
      <button
        className="absolute top-4 right-4 btn btn-error btn-sm z-20 shadow-lg animate-fade-in-up"
        onClick={() => navigate(-1)}
        aria-label="Fermer le lecteur"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      {/* Vidéo */}
      <div className={`relative w-full h-full flex items-center justify-center ${fullscreen ? 'max-w-none max-h-none w-screen h-screen' : 'max-w-4xl max-h-[90vh]'} aspect-video bg-black rounded-xl shadow-2xl overflow-hidden animate-fade-in-up`}>
        <video
          ref={videoRef}
          src={`https://hacktube.fr${video.url}`}
          controls={false}
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={e => { setDuration(e.target.duration); setVolume(e.target.volume); setIsMuted(e.target.muted); }}
          onClick={handlePlayPause}
          className={`w-full h-full object-contain bg-black rounded-xl select-none ${fullscreen ? 'rounded-none' : ''}`}
          style={fullscreen ? {background:'#000', borderRadius:0} : {background:'#000'}}
        />
        {/* Contrôles custom */}
        {showControls && (
          <div className="absolute bottom-0 left-0 w-full flex flex-col gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-10 animate-fade-in-up transition-all duration-300 z-10">
            {/* Barre de progression */}
            <div className="relative w-full h-2 mb-2 cursor-pointer group" onClick={handleProgress}>
              <div className="absolute top-0 left-0 w-full h-2 bg-base-100/20 rounded-full" />
              <div className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
            {/* Contrôles principaux */}
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2">
                <button onClick={handlePlayPause} className="btn btn-circle btn-sm bg-base-100/80 hover:bg-primary/80 text-primary shadow transition-all duration-200">
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                  )}
                </button>
                <button onClick={handleMute} className="btn btn-circle btn-sm bg-base-100/80 hover:bg-primary/80 text-primary shadow transition-all duration-200">
                  {isMuted || volume === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 9v6h4l5 5V4l-5 5H9z" /><line x1="23" y1="1" x2="1" y2="23" stroke="currentColor" strokeWidth="2"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 9v6h4l5 5V4l-5 5H9z" /></svg>
                  )}
                </button>
                {/* Contrôle du volume */}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolume}
                  className="range range-xs w-24 mx-2 accent-primary"
                  aria-label="Volume"
                />
                <span className="text-xs text-base-content/80 ml-2 select-none">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleFullscreen} className="btn btn-circle btn-sm bg-base-100/80 hover:bg-primary/80 text-primary shadow transition-all duration-200">
                  {fullscreen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Animation de pause (Netflix style) */}
        {!isPlaying && showControls && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <svg className="w-24 h-24 text-white/80 animate-fade-in-up" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          </div>
        )}
      </div>
      {/* Titre */}
      <h2 className="text-base-content text-2xl mt-4 font-semibold animate-fade-in-up text-center max-w-2xl truncate px-2">{video.title}</h2>
      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fade-in { from { opacity: 0;} to { opacity: 1;} }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
};

export default VideoPage;