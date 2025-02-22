import React, { useState, useEffect } from "react";
import L from "leaflet";

interface GeoJsonUploaderProps {
  map: L.Map | null;
}

const GeoJsonUploader: React.FC<GeoJsonUploaderProps> = ({ map }) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.GeoJsonObject | null>(
    null
  );
  const [geoJsonText, setGeoJsonText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (geoJsonData) {
      setGeoJsonText(JSON.stringify(geoJsonData, null, 2));
    } else {
      setGeoJsonText("");
    }
  }, [geoJsonData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const parsed = JSON.parse(text);
        setGeoJsonData(parsed);

        if (map) {
          map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON) {
              map.removeLayer(layer);
            }
          });
          const layer = L.geoJSON(parsed).addTo(map);
          map.fitBounds(layer.getBounds());
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGeoJsonTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = e.target.value;
    setGeoJsonText(newText);
    if (!newText) {
      setError("");
      setGeoJsonData(null);
      return;
    }

    try {
      const parsed = JSON.parse(newText);
      setGeoJsonData(parsed);
      setError("");
    } catch {
      setError("Invalid JSON");
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
      const layer = L.geoJSON(geoJsonData).addTo(map);
      map.fitBounds(layer.getBounds());
    }
  };

  return (
    <div>
      <h2 className="heading">GeoCrafter</h2>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="help">Upload file to view or edit GeoJson</div>
      )}
      <textarea
        className="geojson-textbox"
        value={geoJsonText}
        onChange={handleGeoJsonTextChange}
        spellCheck={false}
      />
      <div className="button-container">
        <input
          id="file-upload"
          type="file"
          accept=".geojson, .json"
          onChange={handleFileUpload}
          className="custom-file-upload"
        />
        <button
          className="custom-button"
          onClick={handleSaveFile}
          disabled={!geoJsonData || !!error}
        >
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
