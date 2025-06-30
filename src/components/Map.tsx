import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import api from "../services/api";

interface Earthquake {
  id: string;
  color: string;
  location: string;
  timestamp: number;
  coordinates: {
    lat: number;
    long: number;
  };
}

// Corrigir ícone padrão (caso uses <Marker> mais tarde)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map() {
  const center: LatLngExpression = [38.4237, 27.1428]; // Esmirna, Turquia
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const start = threeMonthsAgo.toISOString().slice(0, 10);

        const response = await api.get("/earthquakes", {
          params: {
            offset: 0,
            limit: 100,
            start_date: start,
            end_date: today,
          },
        });

        console.log("Sismos carregados:", response.data);
        setEarthquakes(response.data);
      } catch (error) {
        console.error("Erro ao buscar sismos:", error);
      }
    };

    fetchEarthquakes();
  }, []);

  return (
<>
    <MapContainer 
      center={center} 
      zoom={5}   
      maxBounds={[
        [-85, -180], 
      [85, 180],   
      ]} 
      style={{ height: "600px", width: "100%" }}>
        
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
         noWrap={true}
      />
      {earthquakes.map((eq) => (
        <CircleMarker
          key={eq.id}
          center={[eq.coordinates.lat, eq.coordinates.long] as LatLngExpression}
          radius={6}
          pathOptions={{
            color: "#000", // borda preta
            weight: 2.5,
            fillColor: eq.color || "#ff0000",
            fillOpacity: 0.8,
          }}
        >
          <Popup>
            <strong>{eq.location}</strong><br />
            {new Date(eq.timestamp).toLocaleString()}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>


{/* Legenda flutuante */}
<div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-md p-3 shadow z-[1000] text-sm space-y-1">
  <p className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
    Últimas 24h
  </p>
  <p className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
    Entre 2 e 7 dias
  </p>
  <p className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
    Entre 8 e 30 dias
  </p>
  <p className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full border border-black bg-white inline-block" />
    Sentido
  </p>
</div>
</>

  );
  
}
