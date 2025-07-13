import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    fetch("https://hacktube.fr/api/videos", {
      
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find(v => v.id === id);
        setVideo(found);
      });
  }, [id]);

  if (!video) {
    return <div className="text-center mt-10">Vidéo introuvable.</div>;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <button
        className="absolute top-4 right-4 btn btn-error"
        onClick={() => navigate(-1)}
      >
        Fermer
      </button>
      <video
        src={`https://hacktube.fr${video.url}`}
        controls
        autoPlay
        controlsList="nodownload"
        disablePictureInPicture
        className="w-full h-full max-w-4xl max-h-[90vh] rounded shadow-lg"
        style={{ background: "#000" }}
      />
      <h2 className="text-white text-2xl mt-4">{video.title}</h2>
    </div>
  );
};

export default VideoPage;