import React from "react";
import Player from '../components/player';

const Main = () => {

    const videos = [
        {
            id: 1,
            name: 'Produit 4',
            desc: '19.99',
            image: 'url_to_image_1'
        },
        {
            id: 2,
            name: 'Produit 2',
            desc: '29.99',
            image: 'url_to_image_2'
        },
        {
            id: 3,
            name: 'Produit 3',
            desc: '39.99',
            image: 'url_to_image_3'
        }
    ];

    return (
        <div className="bg-neutral container mx-auto p-4 pt-[50px] min-h-screen">
            {/* Contenu principal ici */}
            <h2 className="text-xl font-semibold">Bienvenue sur HackTubeII !</h2>
            <div className="video_player">
                {videos.map(video => (
                    <Player 
                        key={video.id} 
                        video={video}
                    />
                ))}
            </div>
        </div>
    );
};

export default Main;
