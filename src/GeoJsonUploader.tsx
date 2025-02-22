import React, { useState } from "react";
import L from "leaflet";

interface GeoJsonUploaderProps {
  map: L.Map | null;
}

interface GeoJson {
  type: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[][];
    };
    properties: { [key: string]: unknown };
  }[];
}

const GeoJsonUploader: React.FC<GeoJsonUploaderProps> = ({ map }) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJson | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const geoJson = JSON.parse(text);
        setGeoJsonData(geoJson);
        if (map) {
          console.log("Adding GeoJSON to map:", geoJson);
          const geoJsonLayer = L.geoJSON(geoJson, {
            style: (feature) => ({
              color: feature?.properties?.color || "blue",
              weight: feature?.properties?.weight || 3,
            }),
          }).addTo(map);
          map.fitBounds(geoJsonLayer.getBounds());
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "left" }}>GeoJSON Uploader</h2>
      {geoJsonData && (
        <pre style={{ textAlign: "left" }}>
          {JSON.stringify(geoJsonData, null, 2)}
        </pre>
      )}
      <input type="file" accept=".geojson, .json" onChange={handleFileUpload} />
    </div>
  );
};

export default GeoJsonUploader;
