import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      console.log("Initializing map...");
      const map = L.map(mapRef.current).setView([-33.91, 18.42], 12);
      mapInstanceRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      console.log("Map initialized:", map);
    } else {
      console.log(
        "mapRef.current is null or mapInstanceRef.current is already initialized"
      );
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        console.log("Map instance removed");
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height: "100%", width: "100%", border: "2px solid red" }}
    />
  );
};

export default Map;
