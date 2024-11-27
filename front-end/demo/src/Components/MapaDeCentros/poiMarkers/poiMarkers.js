import React, { useEffect, useState, useRef } from 'react';
import { AdvancedMarker, useMap, Pin } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const PoiMarkers = ({ pois
                      , onMarkerClick
                      , filteredTypes
                    }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  // Mapa de colores según el tipo de marcador
  const colorMap = {
    MERENDERO: '#A52A2A',                // Bordo
    COMEDOR_COMUNITARIO: '#006400',      // Verde oscuro
    COPA_DE_LECHE: '#3357FF',            // Azul vibrante
    DISTRIBUIDORA_DE_ALIMENTOS: '#800080', // Púrpura intenso
    CENTRO_DE_PRODUCCION_DE_VIANDAS: '#FF9900', // Naranja cálido
    default: '#FBBC04'                   // Color de fondo predeterminado
  };

  // Mapa de colores más claros
const filteredColorMap = {
  MERENDERO: '#D27D7D', // Bordo claro
  COMEDOR_COMUNITARIO: '#66B266', // Verde claro
  COPA_DE_LECHE: '#6A8FFF', // Azul más claro
  DISTRIBUIDORA_DE_ALIMENTOS: '#D280D0', // Púrpura más claro
  CENTRO_DE_PRODUCCION_DE_VIANDAS: '#FFD18E', // Naranja más claro
  default: '#F9D146' // Amarillo claro
};
  

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    if (Object.values(markers).length === 0) return; // Evitar ejecutar si no hay marcadores

    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return; // No hacer nada si el marcador ya existe
    if (!marker && !markers[key]) return; // No hacer nada si el marcador no existe
  
    setMarkers((prev) => {
      const newMarkers = { ...prev };
      if (marker) {
        newMarkers[key] = marker;
      } else {
        delete newMarkers[key];
      }
      return newMarkers;
    });
    
  };

  return (
    <>
      {pois.map((poi) => {
        // Selecciona el color basado en el tipo de `poi`
        const normalBackgroundColor = colorMap[poi.tipo] || colorMap.default;
        const filteredBackgroundColor = filteredColorMap[poi.tipo] || colorMap.default;

        return (
          <AdvancedMarker
            key={poi.id}
            position={poi.location}
            ref={(marker) => setMarkerRef(marker, poi.id)}
            onClick={() => onMarkerClick(poi)}
            clickable={true}
          >
            <Pin
              background={filteredTypes.includes(poi.tipo) ? filteredBackgroundColor : normalBackgroundColor}
              // background={normalBackgroundColor}
              glyphColor={'#000'}
              borderColor={'#000'} 
            />
            {/* <Pin background={ filteredIds.includes(String(poi.id)) ? "#ffffff" : backgroundColor} glyphColor={'#000'} borderColor={filteredIds.includes(String(poi.id)) ? "#FFD700" : '#000'} /> */}
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export default PoiMarkers;