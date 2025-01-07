import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Scout } from './pages/Scout';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/discover" replace />} />
                <Route path="/discover" element={<Dashboard />} />
                <Route path="/scout" element={<Scout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:username" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;