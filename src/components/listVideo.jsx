import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListVideo = ({ search }) => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Réponse API vidéos :", data); // <--- ici
        setVideos(data);
      })
      .catch(() => setVideos([]));
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes((search || "").toLowerCase())
  );

  if (filteredVideos.length === 0) {
    return <p className="text-gray-500">Aucune vidéo trouvée.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-auto">
      {filteredVideos.map((video) => (
        <div
          key={video.id}
          className="bg-base-300 p-4 rounded shadow flex flex-col items-center cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate(`/video/${video.id}`)}
        >
          <h3 className="font-semibold mb-2">{video.title}</h3>
          <img
            src={
              video.thumbnailUrl
                ? `http://localhost:5000${video.thumbnailUrl}`
                : "/default-thumbnail.png"
            }
            alt={video.title}
            className="w-64 h-36 object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default ListVideo;