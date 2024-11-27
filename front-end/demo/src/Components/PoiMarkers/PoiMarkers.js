// PoiMarkers.js
import React, { useEffect, useRef, useState } from "react";
import { AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const PoiMarkers = ({ pois, onMarkerClick }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {pois.map((poi, index) => (
        <AdvancedMarker
          key={index}
          position={poi}
          // onClick={() => onMarkerClick(poi)}
          ref={(marker) => setMarkerRef(marker, poi.label)}
        >
          <Pin
            background={'#FF9900'}
            borderColor={'#000'}
            glyphColor={'#000'}
            scale={1}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default PoiMarkers;
