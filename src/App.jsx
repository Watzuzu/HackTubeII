import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Main from './pages/main';
import Import from './pages/import';
import VideoPage from './pages/video';
import Account from './pages/account';
import Login from './pages/login';
import Settings from './pages/settings';
import Dashboard from './pages/dashboard';
import ConfirmEmail from './pages/ConfirmEmail';

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
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/confirm" element={<ConfirmEmail />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
