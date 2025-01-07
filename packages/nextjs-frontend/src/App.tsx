import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Discovery from './pages/Discovery';

function App() {
    return (
        <WalletProvider>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/discover" element={<Discovery />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </WalletProvider>
    );
}

export default App;