import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaPlus } from 'react-icons/fa';
import { getProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Loader } from '../components/Loader';
import './ProductsPage.css';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'unavailable'
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let disponible;
      
      if (filter === 'available') {
        disponible = true;
      } else if (filter === 'unavailable') {
        disponible = false;
      }
      
      const data = await getProducts(disponible);
      setProducts(data);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [filter]);
  
  return (
    <div>
      <div className="products-header">
        <h1>Productos</h1>
        <div className="filter-options">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button 
            className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            Disponibles
          </button>
          <button 
            className={`filter-btn ${filter === 'unavailable' ? 'active' : ''}`}
            onClick={() => setFilter('unavailable')}
          >
            No disponibles
          </button>
        </div>
      </div>
      
      {loading ? (
        <Loader />
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onUpdate={fetchProducts} 
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <FaBoxOpen className="no-products-icon" />
          <p className="no-products-message">No hay productos para mostrar</p>
          <Link to="/products/new" className="btn btn-primary">
            <FaPlus className="icon-margin-right" /> Añadir producto
          </Link>
        </div>
      )}
    </div>
  );
};