import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Register } from './pages/Register';
import { Scout } from './pages/Scout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/discover" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/scout" element={<Scout />} />
            </Routes>
        </Router>
    );
}

export default App;