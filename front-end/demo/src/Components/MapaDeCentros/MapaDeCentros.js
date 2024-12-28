import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map
} from '@vis.gl/react-google-maps';
import './MapaDeCentros.css';
import { useLocalState } from '../../Utils/useLocalStorage';
import { isTokenValid } from '../../Utils/isTokenValid';
import Modal from '../../Components/modals/modal'
import PoiMarkers from './poiMarkers/poiMarkers';

const api_url = process.env.REACT_APP_API_URL || 'http://localhost';

const MapaDeCentro = () => {

  const [jwt, setJwt] = useLocalState("", "jwt"); // Obtén el token desde el local storage
  const [tokenIsValid, setTokenIsValid] = useState(false); // Estado para almacenar la validación del token
  const [openingAnimation, setOpeningAnimation] = useState(true); // Estado para almacenar la validación del token
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  // In-memory cache for fetched center data
  const [fetchedCenterCache, setFetchedCenterCache] = useState({});

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const validateToken = async () => {
      if (jwt) {
        const isValid = await isTokenValid(jwt, () => setJwt(""));
        setTokenIsValid(isValid);
      } else {
        setTokenIsValid(false);
      }
    };

    validateToken();
  }, [jwt]);

  const [locations, setLocations] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  // const [filteredLocations, setFilteredLocations] = useState([]);
  // const [filteredTypes, setFilteredTypes] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  //---------------------------------------------------------------------------------------

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${api_url}/centro/idsLatLngAndTipo`);
        if (!response.ok) throw new Error('Error al obtener las ubicaciones');
        
        const data = await response.json();
        const formattedData = Object.entries(data).map(([id, coords]) => ({
          id: id,
          location: { lat: parseFloat(coords.lat), lng: parseFloat(coords.lng) },
          tipo: coords.tipo
        }));
        setLocations(formattedData);
        setSavedLocations(formattedData);
      } catch (error) {
        console.error('Error en el fetch:', error.message);
      }
    };
  
    fetchLocations();
  }, []);

  //---------------------------------------------------------------------------------------
  const tiposComedorMap = {
    COMEDOR_COMUNITARIO: "Comedor Comunitario",
    MERENDERO: "Merendero",
    COPA_DE_LECHE: "Copa de Leche",
    DISTRIBUIDORA_DE_ALIMENTOS: "Distribuidora de Alimentos",
    CENTRO_DE_PRODUCCION_DE_VIANDAS: "Centro de Producción de Viandas"
  };

  const handleMarkerClick = async (poi) => {
    
    const fetchCenterById = async (poiId) => {

      if (fetchedCenterCache[poiId]) {
        // Busca el centro en el estado local
        const cachedCenter = fetchedCenterCache[poiId];

        if (cachedCenter) {
          setOpeningAnimation(false);
          setTimeout(() => {
            setSelectedPlace(cachedCenter);
            cambiarImagen(0);
            setOpeningAnimation(true);
          }, 300);
          return;
        }
      }

      try {
        const response = await fetch(`/centro/${poiId}`);
        if (response.status === 404) {
          console.error(`El centro con ID ${poiId} no existe`);
          setSelectedPlace(null); // Clear selection if not found
          return;
        }
        if (!response.ok) {
          throw new Error('Error al obtener el centro');
        }

        const data = await response.json();

        // Convert images to URLs (assuming JPEG format)
        const imagenes = data.imagenes.map((imagen) => (
          `data:image/jpeg;base64,${imagen.datos}`
        ));

        // Update UI state directly
	      // Actualiza el estado con los datos del centro recién obtenido
        setFetchedCenterCache((prevCache) => ({
          ...prevCache,
          [poiId]: {
            id: data.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            tipoComedor: tiposComedorMap[data.tipo_comedor] || data.tipo_comedor,
            formattedAddress: data.formatted_address,
            imagenes,
            nombreDueño: data.nombre_dueño,
            telefonoDueño: data.telefono_dueño,
            mailDueño: data.mail_dueño,
            coords: { lat: parseFloat(data.latitud), lng: parseFloat(data.longitud) },
            creadoPor: data.usuario.username,
            fechaCreacion: formatFecha(data.fecha_creacion),
            editadoPor: data.usuario_ultima_edicion?.username || "",
            fechaEdicion: formatFecha(data.fecha_ultima_edicion),
          },
        }));

        setOpeningAnimation(false);
        setTimeout(() => {
          setSelectedPlace({
            id: data.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            tipoComedor: tiposComedorMap[data.tipo_comedor] || data.tipo_comedor,
            formattedAddress: data.formatted_address,
            imagenes,
            nombreDueño: data.nombre_dueño,
            telefonoDueño: data.telefono_dueño,
            mailDueño: data.mail_dueño,
            coords: { lat: parseFloat(data.latitud), lng: parseFloat(data.longitud) },
            creadoPor: data.usuario.username,
            fechaCreacion: formatFecha(data.fecha_creacion),
            editadoPor: data.usuario_ultima_edicion?.username || "",
            fechaEdicion: formatFecha(data.fecha_ultima_edicion),
          });
          cambiarImagen(0);
          setOpeningAnimation(true);
        }, 300);

      } catch (error) {
        console.error('Error en el fetch:', error.message);
        setLocations(prevLocations => {
          const updatedLocation = prevLocations.filter(location => location.id !== poiId);
          return updatedLocation;
        });
      }
    };

    const formatFecha = (fecha) => {
      if (!fecha) return "";
      const date = new Date(fecha);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    };

    

    setModalEliminarOpen(false);
    fetchCenterById(poi.id);
  };

  //---------------------------------------------------------------------------------------

  const EliminarCentroModal = async (centroId) => {

    try {
      const response = await fetch(`/centro/${centroId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el centro');
      }
  
      cerrarEliminarCentroModal();
      closeCentroDetails();
      setSelectedPlace(null);

      // Actualizar el caché y ubicaciones
      setFetchedCenterCache(prevCache => {
        const updatedCache = { ...prevCache };
        delete updatedCache[centroId];
        return updatedCache;
      });

      setLocations(prevLocations => {
        // Importante que sea '!=' y no '!==' (!)
        const updatedLocation = prevLocations.filter(location => location.id != centroId);
        return updatedLocation;
      });

    } catch (error) {
      console.error('Error al eliminar el centro:', error.message);
    }
  };

  const EditarCentroModal = (id) => {
    window.location.href = `/EditarCentro/${id}`;
  };

  const [imagenActual, setImagenActual] = useState(0);

  const cambiarImagen = (nuevoIndice) => {
    setImagenActual(nuevoIndice);
  };

  const closeCentroDetails = () => {
    setOpeningAnimation(false); // Trigger modal closing animation
  };

  const abrirModalEliminar = () => {
    setModalEliminarOpen(true); // Trigger modal closing animation
  };

  const cerrarEliminarCentroModal = () => {
    setModalEliminarOpen(false); // Trigger modal closing animation
  };

  const [filteredTypes, setFilteredTypes] = useState([]);
  
  function handleFilter(selectedType) {
    
    setFilteredTypes((prev) => {
      // Si el tipo ya está en filteredTypes, lo eliminamos
      if (prev.includes(selectedType)) {
        return prev.filter(type => type !== selectedType); // Elimina el tipo seleccionado
      }
  
      // Si no está, lo agregamos al array
      return [...prev, selectedType];
    });
  }
  

  // function handleFilter(selectedType) {
  //   // Crea un nuevo conjunto (Set) con todos los tipos actuales y el nuevo seleccionado
  //   const newTypesSet = new Set(filteredTypes);
    
  //   // Si el tipo ya existe, lo elimina; de lo contrario, lo agrega
  //   if (newTypesSet.has(selectedType)) {
  //     console.log("Eliminando filtro: ", selectedType);
  //     newTypesSet.delete(selectedType);
  //   } else {
  //     console.log("Agregando filtro: ", selectedType);
  //     newTypesSet.add(selectedType);
  //   }

  //   console.log("Filtered Types: ", newTypesSet);
  //   // Convierte el conjunto de nuevo en un arreglo y actualiza el estado
  //   setFilteredTypes([...newTypesSet]);

  //   if(newTypesSet.size === 0) {
  //     console.log(savedLocations);
  //     setLocations(savedLocations);
  //     return;
  //   }
  //   if(newTypesSet.size === 5) {
  //     setLocations(savedLocations);
  //     setFilteredTypes([]);
  //     return;
  //   }

  //   const filteredLocations = savedLocations.filter(savedLocation => {
  //     console.log("saved location tipo: ", savedLocation.tipo);
  //     console.log("Deberia incluirlo? ", newTypesSet.size === 0 ? true : [...newTypesSet].includes(savedLocation.tipo))
  //     if (newTypesSet.size === 0) {
  //         return true;
  //     }
  //     return [...newTypesSet].includes(savedLocation.tipo);
  //   });

  //   // Actualiza el estado con las ubicaciones filtradas
  //   setLocations(filteredLocations);
  // }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '100%', width: '100%' }}>
        <Map
          defaultZoom={14}
          defaultCenter={{ lat: -34.9205082, lng: -57.95317029999999 }}
          mapId={'5385f6ffccae5200'}
          options={{
            clickableIcons: false,
            fullscreenControl: false,
            disableDoubleClickZoom: true,
            gestureHandling: 'greedy',
            keyboardShortcuts: false,
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false,
          }}
        >
          <Modal
              question={"¿Estas seguro que quieres eliminar este centro?"}
              onCancel={cerrarEliminarCentroModal}
              onAccept={() => EliminarCentroModal(selectedPlace.id)}
              isOpen={modalEliminarOpen}
              infoArray={[
                selectedPlace && selectedPlace.nombre ? selectedPlace.nombre : "Nombre no disponible", 
                selectedPlace && selectedPlace.formattedAddress ? selectedPlace.formattedAddress : "Dirección no disponible", 
                selectedPlace && selectedPlace.tipoComedor ? selectedPlace.tipoComedor : "Tipo de comedor no disponible"
              ]}
              img={selectedPlace && selectedPlace.imagenes && selectedPlace.imagenes.length > 0 ? selectedPlace.imagenes[0] : ""}
          />
          <PoiMarkers
            pois={locations}
            onMarkerClick={handleMarkerClick}
            filteredTypes={filteredTypes}
          />
          {selectedPlace && (
            <div className={`centro-details ${openingAnimation === true ? '' : 'centro-details-exit'}`}>

              <div className='centro-details-header'>
                <h3 className='centro-details-nombre'>
                  <strong>{selectedPlace.nombre}</strong>
                </h3>
                <button
                  className="close-detalis-btn"
                  onClick={closeCentroDetails}
                >
                  X
                </button>
              </div>

              {tokenIsValid && (
                <div className='centro-details-admin-btns-wrapper'>
                  <p className='centro-details-separador'/>
                  <div className='centro-details-admin-btns'>
                    <button onClick={() => EditarCentroModal(selectedPlace.id)} className='centro-details-admin-btn centro-details-admin-btn-editar'>Editar Centro</button>
                    <button onClick={abrirModalEliminar} className='centro-details-admin-btn centro-details-admin-btn-eliminar'>Eliminar Centro</button>
                  </div>
                  <p className='centro-details-separador'/>
                </div>
              )}
              <div className='centro-details-content'>
                {selectedPlace.imagenes && selectedPlace.imagenes.length > 0 && (
                  <div className="centro-carrusel">
                  
                  {selectedPlace.imagenes.length > 1 && (
                    <button
                    className="carrusel-boton izquierda" 
                    onClick={() => cambiarImagen(imagenActual - 1)}
                    disabled={imagenActual === 0}
                  >
                    &#10094;
                  </button>
                  )}
            
                  <img
                    src={selectedPlace.imagenes[imagenActual]}
                    alt={`Imagen ${imagenActual + 1} del centro`}
                    className="centro-imagen"
                  />
            
                  {selectedPlace.imagenes.length > 1 && (
                    <button
                      className="carrusel-boton derecha" 
                      onClick={() => cambiarImagen(imagenActual + 1)}
                      disabled={imagenActual === selectedPlace.imagenes.length - 1}
                    >
                      &#10095;
                    </button>
                  )}
                </div>
                )}
                
                <p className='centro-details-direccion'>
                  {selectedPlace.formattedAddress}
                </p>

                <p className='centro-details-separador'/>

                <p className='centro-details-tipo-comedor'>
                  {selectedPlace.tipoComedor}
                </p>

                <p className='centro-details-separador'/>

                <p className='centro-details-descripcion'>
                  {selectedPlace.descripcion}
                </p>

                <p className='centro-details-separador'/>

                {tokenIsValid && (
                  <div className='centro-details-admin'>
                    <h3>Informacion para administradores:</h3>
                    <p className='centro-details-separador'/>
                    <h4>Dueño del centro:</h4>
                    <div className='centro-details-dueño'>
                      <p>
                        <strong>Nombre:</strong> {selectedPlace.nombreDueño}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {selectedPlace.telefonoDueño}
                      </p>
                      <p>
                        <strong>Mail:</strong> {selectedPlace.mailDueño}
                      </p>
                    </div>

                    <p className='centro-details-separador'/>

                    <h4>Registro:</h4>
                    <div className='centro-details-dueño'>
                      <p>
                        <strong>Creado por:</strong> {selectedPlace.creadoPor} - {selectedPlace.fechaCreacion}
                      </p>
                      {selectedPlace.editadoPor && selectedPlace.fechaEdicion && (
                        <p>
                          <strong>Editado por:</strong> {selectedPlace.editadoPor} - {selectedPlace.fechaEdicion}
                        </p>
                      )}

                    </div>

                    <p className='centro-details-separador'/>

                  </div>

                )}
              </div>

            </div>
          )}

          <div className="colores-info">
            {Object.entries(tiposComedorMap).map(([key, value]) => (
              <div
                key={key}
                className="colores-info-item"
                onClick={() => handleFilter(key)}
              >
                <p className={
                  `color-circle
                  ${filteredTypes.includes(key) ?
                    `color-filtered-type-${key.toLowerCase()}` :
                    `color-${key.toLowerCase()}`
                  }`
                }/>
                <p className="colores-info-nombre">{value}</p>
              </div>
            ))}
          </div>

        </Map>
      </div>
    </APIProvider>
  );
};

export default MapaDeCentro;
