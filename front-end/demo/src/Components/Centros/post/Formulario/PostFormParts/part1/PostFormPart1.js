import React, { useState, useEffect } from "react";
import './PostFormPart1.css';
import { FaExclamationCircle } from 'react-icons/fa';

const PostFormPart1 = ({ data, setData, formErrors }) => {

  const [localErrors, setLocalErrors] = useState({});

  // Actualiza los errores locales cada vez que cambien los errores del padre
  useEffect(() => {
      setLocalErrors(formErrors);
  }, [formErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
  };

  const options = [
    { value: null, label: 'Seleccione...'},
    { value: 'COMEDOR_COMUNITARIO', label: 'Comedor Comunitario' },
    { value: 'MERENDERO', label: 'Merendero' },
    { value: 'COPA_DE_LECHE', label: 'Copa de Leche' },
    { value: 'DISTRIBUIDORA_DE_ALIMENTOS', label: 'Distribuidora de Alimentos' },
    { value: 'CENTRO_DE_PRODUCCION_DE_VIANDAS', label: 'Centro de Produccion de Viandas' },
  ];

  return (
    <div className="formularioCASPOSTADMIN">
      <div className="formularioCASPOSTADMINWrapper">

        <p className='centro-details-separador'/>
        <h3 className="cpfp-h3">Informacion del centro</h3>
        <p className='centro-details-separador'/>

        <div className="centro-details-div">
          <label>Nombre del centro:</label>
          <input 
              type="text" 
              name="nombre" 
              value={data.nombre || ''} 
              onChange={handleChange} 
              placeholder="Nombre del Centro de Ayuda Social" 
              style={{ borderColor: localErrors ? (localErrors.nombre ? 'red' : '') : '' }}
          />
          {localErrors.nombre && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.nombre}</p>}
        </div>

        <div className="centro-details-div">
          <label>Descripción del centro:</label>
          <textarea
              className="centro-post-form-1-text-area"
              name="descripcion" 
              value={data.descripcion || ''} 
              onChange={handleChange} 
              placeholder="Descripcion del Centro de Ayuda Social"
              style={{ resize: "none", borderColor: localErrors ? (localErrors.descripcion ? 'red' : '') : '' }} // Evita el cambio de tamaño del textarea
          />
          {localErrors.descripcion && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.descripcion}</p>}
        </div>

        <div className="centro-details-div">
          <label>Tipos de comedor:</label>
          <select name="tipoComedor" value={data.tipoComedor} onChange={handleChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="option-style">
                {option.label}
              </option>
            ))}
          </select>
          {localErrors.tipoComedor && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.tipoComedor}</p>}
        </div>

        <p className='centro-details-separador'/>
        <h3 className="cpfp-h3">Informacion de contacto del centro</h3>
        <p className='centro-details-separador'/>

        <div className="centro-details-div">
          <label>Nombre del dueño:</label>
          <input 
              type="text" 
              name="nombreDueño" 
              value={data.nombreDueño || ''} 
              onChange={handleChange} 
              placeholder="Nombre del dueño del centro" 
              style={{ borderColor: localErrors ? (localErrors.nombreDueño ? 'red' : '') : '' }}
          />
          {localErrors.nombreDueño && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.nombreDueño}</p>}
        </div>

        <div className="centro-details-div">
          <label>Teléfono del dueño:</label>
          <input 
              type="text" 
              name="telefonoDueño" 
              value={data.telefonoDueño || ''} 
              onChange={handleChange} 
              placeholder="Telefono del dueño del centro" 
              style={{ borderColor: localErrors ? (localErrors.telefonoDueño? 'red' : '') : '' }}
          />
          {localErrors.telefonoDueño && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.telefonoDueño}</p>}
        </div>

        <div className="centro-details-div">
          <label>Mail del dueño:</label>
          <input 
              type="text" 
              name="mailDueño" 
              value={data.mailDueño || ''} 
              onChange={handleChange}
              placeholder="Mail del dueño del centro"
              style={{ borderColor: localErrors ? (localErrors.mailDueño ? 'red' : '') : '' }}
          />
          {localErrors.mailDueño && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.mailDueño}</p>}
        </div>

      </div>
    </div>
  );
};

export default PostFormPart1;
