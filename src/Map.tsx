import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GeoJsonUploader from "./GeoJsonUploader";

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      console.log("Initializing map...");
      const map = L.map(mapRef.current).setView([-33.91, 18.42], 12);
      mapInstanceRef.current = map;
      setMap(map);

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
    <div className="container">
      <div className="left-panel">
        <GeoJsonUploader map={map} />
      </div>
      <div className="right-panel" ref={mapRef} />
    </div>
  );
};

export default Map;
