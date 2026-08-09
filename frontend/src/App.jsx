import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PreLoan from './pages/PreLoan';
import PostLoan from './pages/PostLoan';
import ModelInsights from './pages/ModelInsights';
import DataQuality from './pages/DataQuality';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pre-loan" element={<PreLoan />} />
            <Route path="/post-loan" element={<PostLoan />} />
            <Route path="/model-insights" element={<ModelInsights />} />
            <Route path="/data-quality" element={<DataQuality />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
