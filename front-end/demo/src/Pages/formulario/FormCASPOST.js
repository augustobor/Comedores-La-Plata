import React, { useState } from "react";

import './FormCASPOST.css';

const Form_CAS_POST = ({ onSubmit }) => {
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    telefono: "",
    calle: "",
    numero: "",
    entreCalle1: "",
    entreCalle2: "",
    fotos: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Llamada a la función de envío pasando los datos del formulario
    setFormData({
      nombre: "",
      descripcion: "",
      telefono: "",
      calle: "",
      numero: "",
      entreCalle1: "",
      entreCalle2: "",
      fotos: "",
    });
  };

  return (
    <div className="formularioCASPOSTADMIN">
      <div className="formularioCASPOSTADMINWrapper">
        <h2>Formulario Centro de Ayuda Social</h2>
        <form onSubmit={handleSubmit}>
          
          <div>
            <label>Nombre: </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Descripción: </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              style={{
                maxWidth: '100%',
                minWidth: '100%'
              }}
            />
          </div>

          <div>
            <label>Teléfono: </label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Calle: </label>
            <input
              type="text"
              name="calle"
              value={formData.calle}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Número: </label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Entre calle #1: </label>
            <input
              type="text"
              name="entreCalle1"
              value={formData.entreCalle1}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Entre calle #2: </label>
            <input
              type="text"
              name="entreCalle2"
              value={formData.entreCalle2}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Fotos (URL o texto):</label>
            <input
              type="text"
              name="fotos"
              value={formData.fotos}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Enviar</button>

        </form>
      </div>
    </div>
  );
};

export default Form_CAS_POST
