import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

const MyMap = () => {
//   const position = [58.2432,13.1992]; // Center coordinates for the map
const position = [14.599512,120.984222]; // Center coordinates for the map

  return (
    <MapContainer
      center={position}
      zoom={5}
      style={{ height: "100%", width: "100%" }} // Inherit full height and width of parent div
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

    </MapContainer>
  );
};

export default MyMap;