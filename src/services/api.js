import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Obtener todos los productos, opcionalmente filtrados por disponibilidad
export const getProducts = async (disponible) => {
  try {
    const params = {};
    if (disponible !== undefined) {
      params.disponible = disponible;
    }
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Obtener un producto específico por ID
export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    // Para enviar archivos, usamos FormData
    const formData = new FormData();
    
    // Agregar campos de texto
    Object.keys(productData).forEach(key => {
      if (key === 'caracteristicas' && typeof productData[key] === 'object') {
        formData.append(key, JSON.stringify(productData[key]));
      } else if (key === 'foto' && productData[key] instanceof File) {
        formData.append(key, productData[key]);
      } else if (key !== 'foto') {
        formData.append(key, productData[key]);
      }
    });
    
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Actualizar un producto existente
export const updateProduct = async (id, productData) => {
  try {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key === 'caracteristicas' && typeof productData[key] === 'object') {
        formData.append(key, JSON.stringify(productData[key]));
      } else if (key === 'foto' && productData[key] instanceof File) {
        formData.append(key, productData[key]);
      } else if (key !== 'foto' || productData[key] === null) {
        formData.append(key, productData[key]);
      }
    });
    
    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// Actualizar solo la disponibilidad de un producto
export const updateProductAvailability = async (id, disponible) => {
  try {
    const response = await api.patch(`/products/${id}/availability`, { disponible });
    return response.data;
  } catch (error) {
    console.error(`Error updating product availability ${id}:`, error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};