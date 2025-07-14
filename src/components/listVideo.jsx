import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListVideo = ({ search }) => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://hacktube.fr/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch(() => setVideos([]));
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes((search || "").toLowerCase())
  );

  if (filteredVideos.length === 0) {
    return (
      <p className="text-gray-500 text-center py-10 animate-fade-in">
        Aucune vidéo trouvée.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 w-full px-1 sm:px-0 animate-fade-in">
      {filteredVideos.map((video) => (
        <div
          key={video.id}
          className="video-card bg-base-200 rounded-2xl shadow-lg flex flex-col items-center cursor-pointer hover:scale-[1.03] hover:shadow-xl transition-all duration-300 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary/60"
          onClick={() => navigate(`/video/${video.id}`)}
          tabIndex={0}
          aria-label={`Voir la vidéo ${video.title}`}
          role="button"
        >
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full h-40 xs:h-44 sm:h-48 md:h-56 flex items-center justify-center rounded-xl overflow-hidden bg-base-300">
              <img
                src={
                  video.thumbnailUrl
                    ? `https://hacktube.fr${video.thumbnailUrl}`
                    : "/default-thumbnail.png"
                }
                alt={video.title}
                className="w-full h-full object-cover rounded-xl transition-all duration-300 group-hover:opacity-80"
              />
              <div className="absolute bottom-2 right-2 bg-base-100/80 px-2 py-1 rounded text-xs text-primary shadow animate-fade-in">
                {video.duration || ""}
              </div>
            </div>
            <h3 className="font-semibold text-base text-center mt-3 mb-1 text-primary truncate w-full px-2 animate-fade-in">
              {video.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListVideo;