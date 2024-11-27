import React from 'react';
import './404.css';

const Error404 = () => {
  return (
    <div className="error-container">
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <a className="back-link" href="/">Volver a la página de inicio</a>
    </div>
  );
};

export default Error404;
