import React from 'react';

const player = ({ video, onClickPlay }) => {
    return (
        <div className="video_player">
            <img src={video.image} alt={video.name} />
            <h2>{video.name}</h2>
            <p>{video.desc} </p>
            <button onClick={() => onClickPlay(video)}>Regarder</button>
        </div>
    );
};

export default player;