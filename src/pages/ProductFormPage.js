import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft, FaUpload } from 'react-icons/fa';
import { getProduct, createProduct, updateProduct } from '../services/api';
import { Loader } from '../components/Loader';

// Esquema de validación con Yup
const ProductSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  precio: Yup.number()
    .required('El precio es obligatorio')
    .positive('El precio debe ser positivo'),
  color: Yup.string(),
  talla: Yup.string(),
  disponible: Yup.boolean().required('La disponibilidad es obligatoria'),
});

export const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const isEditing = !!id;
  
  // Valores iniciales del formulario
  const initialValues = {
    nombre: '',
    precio: '',
    color: '',
    talla: '',
    caracteristicas: {},
    disponible: true,
    foto: null,
  };
  
  // Cargar producto si estamos en modo edición
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const data = await getProduct(id);
          
          // Establecer valores del formulario
          setProduct({
            ...data,
            caracteristicas: typeof data.caracteristicas === 'string' 
              ? JSON.parse(data.caracteristicas) 
              : data.caracteristicas,
          });
          
          // Establecer vista previa de la imagen
          if (data.foto) {
            setImagePreview(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/uploads/${data.foto}`);
          }
        } catch (error) {
          toast.error('Error al cargar el producto');
          console.error(error);
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditing, navigate]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      
      // Convertir objeto características a JSON string si es necesario
      const formData = {
        ...values,
        caracteristicas: typeof values.caracteristicas === 'string'
          ? JSON.parse(values.caracteristicas)
          : values.caracteristicas,
      };
      
      if (isEditing) {
        await updateProduct(id, formData);
        toast.success('Producto actualizado correctamente');
      } else {
        await createProduct(formData);
        toast.success('Producto creado correctamente');
      }
      
      navigate('/');
    } catch (error) {
      toast.error(`Error al ${isEditing ? 'actualizar' : 'crear'} el producto`);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue('foto', file);
      
      // Crear vista previa de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Mostrar carga mientras se obtiene el producto para edición
  if (isEditing && loading) {
    return <Loader />;
  }
  
  // Usar valores del producto si estamos editando
  const formValues = isEditing && product ? {
    nombre: product.nombre || '',
    precio: product.precio || '',
    color: product.color || '',
    talla: product.talla || '',
    caracteristicas: typeof product.caracteristicas === 'string'
      ? JSON.parse(product.caracteristicas)
      : product.caracteristicas || {},
    disponible: product.disponible !== undefined ? product.disponible : true,
  } : initialValues;
  
  return (
    <div className="form-container">
      <h1 className="form-title">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>
      
      <Formik
        initialValues={formValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <Field 
                id="nombre" 
                name="nombre" 
                type="text" 
                className="form-control" 
                placeholder="Nombre del producto" 
              />
              <ErrorMessage name="nombre" component="div" className="form-error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="precio" className="form-label">Precio</label>
              <Field 
                id="precio" 
                name="precio" 
                type="number" 
                step="0.01" 
                min="0" 
                className="form-control" 
                placeholder="0.00" 
              />
              <ErrorMessage name="precio" component="div" className="form-error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="color" className="form-label">Color</label>
              <Field 
                id="color" 
                name="color" 
                type="text" 
                className="form-control" 
                placeholder="Color del producto" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="talla" className="form-label">Talla</label>
              <Field 
                id="talla" 
                name="talla" 
                type="text" 
                className="form-control" 
                placeholder="Talla del producto" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="caracteristicas" className="form-label">Características (JSON)</label>
              <Field 
                id="caracteristicas" 
                name="caracteristicas" 
                as="textarea" 
                className="form-control" 
                placeholder='{"material": "algodón", "estilo": "casual"}' 
                rows="4"
                value={
                  typeof values.caracteristicas === 'object'
                    ? JSON.stringify(values.caracteristicas, null, 2)
                    : values.caracteristicas
                }
                onChange={(e) => {
                  try {
                    // Solo almacenar como string - se convertirá al enviar
                    setFieldValue('caracteristicas', e.target.value);
                  } catch (error) {
                    console.error('Error parsing JSON:', error);
                  }
                }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="disponible" className="form-label">Disponibilidad</label>
              <Field 
                id="disponible" 
                name="disponible" 
                as="select" 
                className="form-control"
              >
                <option value={true}>Disponible</option>
                <option value={false}>No disponible</option>
              </Field>
              <ErrorMessage name="disponible" component="div" className="form-error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="foto" className="form-label">Imagen del producto</label>
              <div className="file-input-container">
                <input
                  id="foto"
                  name="foto"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFileChange(event, setFieldValue)}
                  className="form-control"
                />
              </div>
              
              {imagePreview && (
                <div className="image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      marginTop: '10px',
                      borderRadius: '4px' 
                    }} 
                  />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn" 
                onClick={() => navigate('/')} 
                disabled={isSubmitting}
              >
                <FaArrowLeft className="icon-margin-right" /> Cancelar
              </button>
              
              <button 
                type="submit" 
                className="btn btn-success" 
                disabled={isSubmitting}
              >
                <FaSave className="icon-margin-right" /> 
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};