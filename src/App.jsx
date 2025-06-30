import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/main';
import Header from './components/header';

import './App.css';

function App() {
    return (
        <Router>
            <>
                <Header />
                <Routes>
                    <Route path="/" element={<Main />} />
                </Routes>
            </>
        </Router>
    );
}

export default App;
