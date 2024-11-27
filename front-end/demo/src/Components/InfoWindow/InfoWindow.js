// InfoWindow.js
import React from "react";

const InfoWindow = ({ selectedPlace, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        maxWidth: "300px",
        overflow: "auto",
        color: "black",
      }}
    >
      <h4>Centro de Ayuda Social</h4>
      <p>
        <strong>Name:</strong> {selectedPlace.name}
      </p>
      <p>
        <strong>Address:</strong> {selectedPlace.address}
      </p>
      <p>
        <strong>Latitude:</strong> {selectedPlace.lat}
      </p>
      <p>
        <strong>Longitude:</strong> {selectedPlace.lng}
      </p>
      <p>
        <strong>Phone number:</strong> {selectedPlace.phone}
      </p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default InfoWindow;
