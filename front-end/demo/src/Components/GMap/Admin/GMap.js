import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import MapHandler from "./MapHandler/MapHandler";

const GMap = ({ center }) => {

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: "100%", width: "100%" }}>
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: -34.9205082, lng: -57.95317029999999 }}
          mapId={"5385f6ffccae5200"}
          options={{
            clickableIcons: false,
            disableDoubleClickZoom: true,
            gestureHandling: "greedy",
            keyboardShortcuts: false,
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <MapHandler center={center} /> {/* Usa MapHandler aquí */}
        </Map>
      </div>
    </APIProvider>
  );
};

export default GMap;
