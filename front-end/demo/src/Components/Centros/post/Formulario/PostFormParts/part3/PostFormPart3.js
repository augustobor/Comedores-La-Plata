import React, { useState, useRef, useCallback, useEffect } from "react";
import './PostFormPart3.css';
import GMap from '../../../../../../Components/GMap/Admin/GMap'
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import { FaExclamationCircle } from "react-icons/fa";

// Define the libraries array outside the component to avoid re-creating it on every render
const libraries = ["places"];

const PostFormPart3 = ({ data, setData, formErrors, editing, center, setCenter, currentDir }) => {
  
  const [localErrors, setLocalErrors] = useState({});

  // Actualiza los errores locales cada vez que cambien los errores del padre
  useEffect(() => {
      setLocalErrors(formErrors);
  }, [formErrors]);

  const inputRef = useRef(null);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Load the Google Maps API script only once
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries, // use the libraries constant
  });

  const handleOnPlaceChange = useCallback(() => {
    if (inputRef.current) {
      const places = inputRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();

        setCenter([{ lat: newLat, lng: newLng }]);
  
        // Actualiza la data con la dirección formateada
        setData((prevData) => ({
          ...prevData,
          latitud: newLat,
          longitud: newLng,
          formattedAddress: place.formatted_address,
        }));
      }
    }
  }, [setData]);

  // Efecto para centrar el mapa si editing es true
  // useEffect(() => {
  //   if (editing && data.latitud && data.longitud) {
  //     const latitudNum = parseFloat(data.latitud); // Convierte a número
  //     const longitudNum = parseFloat(data.longitud); // Convierte a número
  //     setCenter([{ lat: latitudNum, lng: longitudNum }]);
  //   }
  // }, [editing, data.latitud, data.longitud]);
  

  return (
    <div className="formularioCASPOSTADMIN">
      <div className="formularioCASPOSTADMINWrapper">
        
        <p className='centro-details-separador'/>
        <h3 className="cpfp-h3">Ubicacion</h3>
        <p className='centro-details-separador'/>

        <div className="formularioCASPOSTADMIN-div">


          {editing && (
            <>
              <label>Dirección actual: </label>
              <input
                type="text"
                name="direccion"
                value={currentDir || ''} // Asegúrate de que data.formatted_address esté disponible
                readOnly // Hace que el input sea inmodificable
                style={{ borderColor: 'lightgray' }} // Estilo opcional para indicar que no es editable
              />
              <p className='centro-details-separador'/>
            </>
          )}
          
          {editing ? (<label>Direccion nueva:</label>) : (<label>Direccion:</label>)}
          {isLoaded && (
            <StandaloneSearchBox
              onLoad={(ref) => (inputRef.current = ref)}
              onPlacesChanged={handleOnPlaceChange}
            >
              <input
                type="text"
                // name="direccion"
                // value={data.direccion || ''}
                // onChange={handleChange}
                placeholder="Ingrese calle y numero"
                style={{ borderColor: localErrors ? (localErrors.formattedAddress ? 'red' : '') : '' }}
              />
            </StandaloneSearchBox>
          )}
        </div>

        {localErrors.formattedAddress && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>Seleccione una direccion por favor.</p>}

        <div className="GMapContainer">
          <GMap center={center} />
        </div>

        {data.formattedAddress && !editing &&
          <div>
            <p className='centro-details-separador'/>
            <label>Direccion seleccionada:</label>
            <p className="centro-form-dir-seleccionada">{data.formattedAddress}</p>
          </div>
        }

        {/* <div>
          {lat && long ? (
            <p className="mensajeCoordenadasPositivo">Coordenadas obtenidas</p>
          ) : (
            <p className="mensajeCoordenadasNegativo">Ingrese una direccion para obtener la ubicacion</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default PostFormPart3;
