// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Library from './Library';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Library />} />
        </Routes>
    );
};

export default App;