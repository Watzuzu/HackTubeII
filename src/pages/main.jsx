import React from "react";
import ListVideo from "../components/listVideo";

const Main = ({ search }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Main Page</h1>
      <p className="text-gray-600 mb-6">
        This is the main page where you can see your imported videos.
      </p>
      <ListVideo search={search} />
    </div>
  );
};

export default Main;
