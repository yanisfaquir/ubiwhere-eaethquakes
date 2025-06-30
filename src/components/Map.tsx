import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import api from "../services/api";
import { CircleMarker } from "react-leaflet";

interface Earthquake {
  id: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  place: string;
}

// Corrigir ícone padrão do Leaflet

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map() {
  // const center: LatLngExpression = [0, 0];
  const center: LatLngExpression = [38.4237, 27.1428]; // Esmirna, Turquia

  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const response = await api.get("/earthquakes?page=1&limit=50");
        setEarthquakes(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar sismos:", error);
      }
    };

    fetchEarthquakes();
  }, []);

  return (
    <MapContainer center={center} zoom={2} style={{ height: "600px", width: "1000px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
     {earthquakes.map((eq) => (
      <CircleMarker
  key={eq.id}
  center={[eq.latitude, eq.longitude] as LatLngExpression}
  radius={eq.magnitude * 2.5} // aumenta mais o raio
  pathOptions={{
    color: "#000", // borda preta para contraste
    weight: 2.5, // borda mais grossa
    fillColor:
      eq.magnitude >= 5
        ? "#ff0000" // vermelho forte
        : eq.magnitude >= 3
        ? "#ffa500" // laranja
        : "#00cc66", // verde
    fillOpacity: 0.8, // mais opaco
  }}
>
  <Popup>
    <strong>{eq.place}</strong><br />
    Magnitude: {eq.magnitude}
  </Popup>
</CircleMarker>

    ))}
    </MapContainer>
  );
}
