import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvent } from "react-leaflet";
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
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);

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

        const filtered = response.data.filter((eq: Earthquake) => {
          const locationMatch = searchLocation
            ? eq.location.toLowerCase().includes(searchLocation.toLowerCase())
            : true;
          return locationMatch;
        });

        setEarthquakes(filtered);
        console.log(response.data)
      } catch (error) {
        console.error("Erro ao buscar sismos:", error);
      }
    };

    fetchEarthquakes();
  }, [searchLocation]);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "2rem auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        height: "700px",
        display: "flex"
      }}
    >
      {/* Painel lateral de detalhes */}
      {selectedEarthquake && (
        <div
          style={{
            width: "300px",
            padding: "1rem",
            background: "#f9f9f9",
            borderRight: "1px solid #ccc",
            overflowY: "auto"
          }}
        >
          <h3>Detalhes do Sismo</h3>
          <p><strong>Local:</strong> {selectedEarthquake.location}</p>
          <p><strong>Data:</strong> {new Date(selectedEarthquake.timestamp).toLocaleString()}</p>
          <p><strong>Latitude:</strong> {selectedEarthquake.coordinates.lat}</p>
          <p><strong>Longitude:</strong> {selectedEarthquake.coordinates.long}</p>
          <button onClick={() => setSelectedEarthquake(null)} style={{ marginTop: "1rem" }}>Fechar</button>
        </div>
      )}

      <div style={{ flex: 1, position: "relative" }}>
        {/* Barra de filtros */}
        <div
          style={{
            background: "white",
            padding: "1rem",
            borderBottom: "1px solid #ccc",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Localização"
            style={{ padding: "0.5rem", flex: 1 }}
          />
        </div>

        {/* Leaflet Map */}
        <div style={{ height: "calc(100% - 80px)", position: "relative" }}>
          <MapContainer
            center={center}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            maxBounds={[[ -85, -180 ], [ 85, 180 ]]}
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
                eventHandlers={{
                  click: () => setSelectedEarthquake(eq),
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
      </div>
    </div>
  );
}
