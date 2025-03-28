import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaPlus } from 'react-icons/fa';
import './Navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <FaBoxOpen className="navbar-icon" />
          <span>Gestión de Productos</span>
        </Link>
        <div className="navbar-menu">
          <Link to="/products/new" className="btn btn-success">
            <FaPlus className="icon-margin-right" /> Nuevo Producto
          </Link>
        </div>
      </div>
    </nav>
  );
};