import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Navbar } from './components/Navbar';
import { ProductsPage } from './pages/ProductsPage';
import { ProductFormPage } from './pages/ProductFormPage';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/edit/:id" element={<ProductFormPage />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;