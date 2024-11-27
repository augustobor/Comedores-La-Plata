// GMap.js
import React, { useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import PoiMarkers from "../../PoiMarkers/PoiMarkers";
import InfoWindow from "../../InfoWindow/InfoWindow";

const GMap = ({ positions }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleMarkerClick = (poi) => {
    setSelectedPlace({
      name: poi.label,
      address: poi.address,
      lat: poi.lat,
      lng: poi.lng,
      phone: poi.phone,
    });
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map
          defaultZoom={14}
          defaultCenter={{ lat: -34.9205082, lng: -57.95317029999999 }}
          mapId={"5385f6ffccae5200"}
          options={{
            clickableIcons: false,
            disableDoubleClickZoom: true,
            gestureHandling: "greedy",
            keyboardShortcuts: false,
            streetViewControl: false,
            zoomControl: false,
          }}
        >
          <PoiMarkers pois={positions} onMarkerClick={handleMarkerClick} />
        </Map>
        {selectedPlace && (
          <InfoWindow
            selectedPlace={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </div>
    </APIProvider>
  );
};

export default GMap;
