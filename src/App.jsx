import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Main from './pages/main';
import Import from './pages/import';
import VideoPage from './pages/video';

import './App.css';

function App() {
  const [search, setSearch] = useState("");

  return (
    <Router>
      <>
        <Header onSearch={setSearch} />
        <Routes>
          <Route path="/" element={<Main search={search} />} />
          <Route path="/import" element={<Import />} />
          <Route path="/video/:id" element={<VideoPage />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
