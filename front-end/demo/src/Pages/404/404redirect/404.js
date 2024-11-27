import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Asegúrate de importar desde 'react-router-dom'

const Error404Redirect = () => {

  const navigate = useNavigate();  // Hook para la redirección

  // Redirigir a /404PageNotFound después de 3 segundos
  useEffect(() => {
    navigate('/404PageNotFound');
  }, [navigate]);

  return (<></>);
};

export default Error404Redirect;
