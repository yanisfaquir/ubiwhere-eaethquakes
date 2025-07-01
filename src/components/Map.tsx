import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";
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

export default function Map() {
  const center: LatLngExpression = [38.4237, 27.1428];
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

        setEarthquakes(response.data);
        //Para saber que cores sao retornadas e depois ver oq perido de tempo que cada uma representa. 
        // console.log("Cores retornadas:", response.data.map((eq: Earthquake) => eq.color));

        // earthquakes.forEach((eq) => {
        //   const date = new Date(eq.timestamp).toISOString();
        //   console.log(`🟣 ${date} → ${eq.color}`);
        // });

      } catch (error) {
        console.error("Erro ao buscar sismos:", error);
      }
    };

    fetchEarthquakes();
  }, []);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "2rem auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        height: "600px",
      }}
    >
      {/* Leaflet Map */}
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
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
              color: "#000",
              weight: 2,
              fillColor: eq.color || "#ff0000",
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <strong>{eq.location}</strong>
              <br />
              {new Date(eq.timestamp).toLocaleString()}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legenda - Fixada ao canto superior direito */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
          fontSize: "0.875rem",
          width: "200px",
        }}
      >
        <strong style={{ display: "block", marginBottom: "0.5rem" }}>
          Sismos por categoria:
        </strong>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
          <span
            style={{
              display: "inline-block",
              width: "1rem",
              height: "1rem",
              borderRadius: "50%",
              marginRight: "0.5rem",
              backgroundColor: "#008000",
            }}
          />
          Últimas 24h
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
          <span
            style={{
              display: "inline-block",
              width: "1rem",
              height: "1rem",
              borderRadius: "50%",
              marginRight: "0.5rem",
              backgroundColor: "#FFFF00",
            }}
          />
          Entre 2 e 7 dias
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
          <span
            style={{
              display: "inline-block",
              width: "1rem",
              height: "1rem",
              borderRadius: "50%",
              marginRight: "0.5rem",
              backgroundColor: "#FFA500",
            }}
          />
          Entre 8 e 30 dias
        </div>
       
      </div>

      {/* Nenhum dado */}
      {earthquakes.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            background: "white",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            zIndex: 1000,
          }}
        >
          Nenhum sismo encontrado no período selecionado.
        </div>
      )}
    </div>
  );
}
