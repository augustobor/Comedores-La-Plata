import React, { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import PoiMarkers from "../../../PoiMarkers/PoiMarkers";

const MapHandler = ({ center }) => {
  const map = useMap(); // Obtiene la referencia al objeto del mapa

  useEffect(() => {
    if (map && center.length > 0) {
      const [newCenter] = center; // Obtiene la nueva ubicación
      map.panTo(newCenter); // Desplaza el mapa a la nueva ubicación
    }
  }, [center, map]); // Dependencias: se ejecuta cada vez que cambie `center` o `map`

  return center.length > 0 ? <PoiMarkers pois={center} /> : null;
};

export default MapHandler;
