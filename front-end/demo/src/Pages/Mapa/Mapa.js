import React from 'react';
import './Mapa.css';
import { useLocalState } from '../../Utils/useLocalStorage';
import { isTokenValid } from '../../Utils/isTokenValid';
import Loading_1 from '../../Components/Loadings/Loading_1/Loading_1';

import MapaDeCentro from '../../Components/MapaDeCentros/MapaDeCentros';
import { useState, useEffect } from 'react';

const Mapa = () => {
  // Centro de La Plata
  const center = { lat: -34.9205082, lng: -57.95317029999999 };

  const [jwt, setJwt] = useLocalState("", "jwt"); // Obtén el token desde el local storage
  const [tokenIsValid, setTokenIsValid] = useState(false); // Estado para almacenar la validación del token
  const [isLoading, setIsLoading] = useState(true);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const validateToken = async () => {
      if (jwt) {
        const isValid = await isTokenValid(jwt, () => setJwt(""));
        setTokenIsValid(isValid); // Actualiza el estado con la validación
      } else {
        setTokenIsValid(false); // Si no hay JWT, el token es inválido
      }
      setIsLoading(false);
    };

    validateToken(); // Llama a la función para validar el token
  }, [jwt]); // Solo se ejecuta cuando el JWT cambia

  if (isLoading) {
    // Mostrar la animación de carga mientras se valida el token
    return (
      <div className="loading-container">
        <Loading_1 />
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className='mdc-container'>

      <div className='mdc-top'>

        <div className='search-container'>
          {/* <div className='search-left'>
            <input
              type='text'
              placeholder='Buscar ubicación...'
              className='searchbox'
            />
            <button onClick={ () => console.log("buscar...")} className='search-btn'>Buscar</button>

         </div> */}

        {tokenIsValid &&
          (
            <a href="/AgregarCentro" className='add-center-btn'>Agregar Centro</a>
          )
        }

      </div>

      </div>

      <div className='mapa-container'>
        <MapaDeCentro center={center} />
      </div>
    </div>
  );
};

export default Mapa;
