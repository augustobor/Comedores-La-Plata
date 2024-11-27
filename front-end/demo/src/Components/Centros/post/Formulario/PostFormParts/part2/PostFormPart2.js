import React, { useState, useEffect, useCallback } from "react";
import './PostFormPart2.css';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const PostFormPart2 = ({ data, setData, formErrors }) => {
  const [localErrors, setLocalErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    setLocalErrors(formErrors);
  }, [formErrors]);

  // Convierte archivos a Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Procesa las imágenes que ya vienen del backend
  const processBackendImages = useCallback(() => {
    if (!data.imagenes) return;

    const previews = data.imagenes.map((img) =>
      `data:image/jpeg;base64,${img.datos}`
    );
    setImagePreviews(previews);
  }, [data.imagenes]);

  // Llama a processBackendImages cada vez que cambien las imágenes del backend
  useEffect(() => {
    processBackendImages();
  }, [processBackendImages]);

  // Maneja la carga de archivos desde el frontend
  const handleFileChange = async (e) => {
    try {
      const files = Array.from(e.target.files);
      const maxImages = 5;
      const newErrorsForm2 = {};
  
      // Limita la cantidad de imágenes para no exceder las 5
      const imagesToAdd = files.slice(0, maxImages - (data.imagenes?.length || 0));
  
      const newImages = await Promise.all(
        imagesToAdd.map(async (file) => {
          if (file.size > 1048576) {  // Verifica si la imagen excede 1MB
            newErrorsForm2["imagenes"] = "Una o mas de las imagenes seleccionadas superaron el limite de 1 MB y no han sido seleccionadas.";
            setLocalErrors(newErrorsForm2);
            return null;  // No se agrega la imagen si excede el tamaño
          }
  
          // Convierte la imagen a base64 si es válida
          return {
            id: Date.now(),
            datos: (await fileToBase64(file)).split(',')[1],  // Solo la parte base64 sin el prefijo data:image...
          };
        })
      );
  
      // Filtra las imágenes nulas (las que excedieron el tamaño)
      const validImages = newImages.filter(image => image !== null);
  
      // Actualiza el estado con las imágenes válidas
      setData((prevData) => ({
        ...prevData,
        imagenes: [...(prevData.imagenes ?? []), ...validImages],
      }));
  
      // Actualiza las vistas previas de las imágenes
      const newPreviews = validImages.map((img) => `data:image/jpeg;base64,${img.datos}`);
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  
    } catch (error) {
      console.error("Error al procesar imágenes:", error);
      // Aquí puedes mostrar un mensaje de error más amigable si lo deseas
      setLocalErrors({ "imagenes": "Hubo un problema al procesar las imágenes." });
    }
  };
  

  // Elimina una imagen tanto del estado como de las previews
  const removeImage = (indexToRemove) => {
    const newImagePreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
  
    // Verifica si data.imagenes está definido antes de llamar a filter
    const newFotos = data.imagenes ? data.imagenes.filter((_, index) => index !== indexToRemove) : [];
  
    setImagePreviews(newImagePreviews);
    setData((prevData) => ({
      ...prevData,
      imagenes: newFotos,
    }));
  };
  

  return (
    <div className="formularioCASPOSTADMIN">
      <div className="formularioCASPOSTADMINWrapper">

        <p className='centro-details-separador'/>
        <h3 className="cpfp-h3">Fotos</h3>
        <p className="centro-details-separador" />

        <div className="upload-container">

          <label htmlFor="fileUpload" className="uploadButton">
            Subir imagen/es | <span className="imageCount">{(data.imagenes?.length || 0)}/5</span>
          </label>
          {localErrors.imagenes ? (
            <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.imagenes}</p>
          ) : (
            <p className="centro-details-info-1"><FaInfoCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>Subir al menos una imagen.</p>
          )}
          <input
            type="file"
            id="fileUpload"
            name="imagenes"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        
        <div className="imagePreviewContainer">
          {imagePreviews.map((src, index) => (
            <div key={index} className="imagePreviewWrapper">
              <img src={src} alt={`Preview ${index + 1}`} className="imagePreview" />
              <span className="remove_btn" onClick={() => removeImage(index)}>X</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostFormPart2;
