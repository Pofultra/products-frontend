import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { updateProductAvailability, deleteProduct } from '../services/api';
import './ProductCard.css';

export const ProductCard = ({ product, onUpdate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleEdit = () => {
    navigate(`/products/edit/${product.id}`);
  };
  
  const handleToggleAvailability = async () => {
    try {
      setLoading(true);
      await updateProductAvailability(product.id, !product.disponible);
      toast.success(`Producto ${product.disponible ? 'desactivado' : 'activado'} correctamente`);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Error al cambiar disponibilidad');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        setLoading(true);
        await deleteProduct(product.id);
        toast.success('Producto eliminado correctamente');
        if (onUpdate) onUpdate();
      } catch (error) {
        toast.error('Error al eliminar el producto');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const imageUrl = product.foto
    ? `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/uploads/${product.foto}`
    : 'https://via.placeholder.com/300x200?text=Sin+Imagen';
  
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={imageUrl} alt={product.nombre} className="product-image" />
        <div className={`product-availability-badge ${product.disponible ? 'badge-available' : 'badge-unavailable'}`}>
          {product.disponible ? 'Disponible' : 'No disponible'}
        </div>
      </div>
      <div className="product-content">
        <h3 className="product-title">{product.nombre}</h3>
        <div className="product-meta">
          {product.color && <span>{product.color}</span>}
          {product.color && product.talla && <span> | </span>}
          {product.talla && <span>Talla: {product.talla}</span>}
        </div>
        <div className="product-price">${Number(product.precio).toFixed(2)}</div>
        
        <div className="product-actions">
          <button 
            className="toggle-button" 
            onClick={handleToggleAvailability} 
            disabled={loading}
          >
            {product.disponible ? (
              <>
                <FaToggleOn className="toggle-icon toggle-available" />
                Disponible
              </>
            ) : (
              <>
                <FaToggleOff className="toggle-icon toggle-unavailable" />
                No disponible
              </>
            )}
          </button>
          
          <div className="action-buttons">
            <button className="btn btn-primary btn-sm" onClick={handleEdit} disabled={loading}>
              <FaEdit />
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={loading}>
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};