import React, { useState } from "react";
import L from "leaflet";

interface GeoJsonUploaderProps {
  map: L.Map | null;
}

const GeoJsonUploader: React.FC<GeoJsonUploaderProps> = ({ map }) => {
  const [geoJsonData, setGeoJsonData] = useState<
    GeoJSON.GeoJsonObject | GeoJSON.GeoJsonObject[] | null
  >(null);

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

  const handleSaveFile = () => {
    if (geoJsonData) {
      const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "geojson.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleRerenderMap = () => {
    if (map && geoJsonData) {
      map.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
        }
      });
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: (feature) => ({
          color: feature?.properties?.color || "blue",
          weight: feature?.properties?.weight || 3,
        }),
      }).addTo(map);
      map.fitBounds(geoJsonLayer.getBounds());
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "left" }}>GeoJSON Uploader</h2>
      {geoJsonData && (
        <pre className="geojson-textbox">
          {JSON.stringify(geoJsonData, null, 2)}
        </pre>
      )}

      <div className="button-container">
        <input
          id="file-upload"
          type="file"
          accept=".geojson, .json"
          onChange={handleFileUpload}
          className="custom-file-upload"
        />
        <button className="custom-button" onClick={handleSaveFile}>
          Save File
        </button>
        <button className="custom-button" onClick={handleRerenderMap}>
          Rerender Map
        </button>
      </div>
    </div>
  );
};

export default GeoJsonUploader;
