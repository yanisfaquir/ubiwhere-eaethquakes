import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";
import api from "../services/api";
import styles from "../styles/Map.module.css"; 

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
        console.log("Earthquakes", response.data); 

        const filtered = response.data.filter((eq: Earthquake) => {
          const locationMatch = searchLocation
            ? eq.location.toLowerCase().includes(searchLocation.toLowerCase())
            : true;
          // console.log("Filter", locationMatch); 
          return locationMatch;
        
        });

        setEarthquakes(filtered);
      } catch (error) {
        console.error("Erro ao buscar sismos:", error);
      }
    };

    fetchEarthquakes();
  }, [searchLocation]);

  return (
    <div className={styles.container}>
      {/* Painel lateral de detalhes */}
      {selectedEarthquake && (
        <div className={styles.detailsPanel}>
          <h3>Detalhes do Sismo</h3>
          <p><strong>Local:</strong> {selectedEarthquake.location}</p>
          <p><strong>Data:</strong> {new Date(selectedEarthquake.timestamp).toLocaleString()}</p>
          <p><strong>Latitude:</strong> {selectedEarthquake.coordinates.lat}</p>
          <p><strong>Longitude:</strong> {selectedEarthquake.coordinates.long}</p>
          <button onClick={() => setSelectedEarthquake(null)} style={{ marginTop: "1rem" }}>
            Fechar
          </button>
        </div>
      )}

      <div className={styles.mapWrapper}>
        {/* Barra de filtros */}
        <div className={styles.filterBar}>
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Localização"
            className={styles.filterInput}
          />
        </div>

        {/* Leaflet Map */}
        <div className={styles.mapContainer}>
          <MapContainer
            center={center}
            zoom={2}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
            maxBounds={[[-85, -180], [85, 180]]}
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

          {/* Legenda */}
          <div className={styles.legend}>
            <strong>Sismos por categoria:</strong>
            <div className={styles.legendItem}>
              <span className={styles.colorDot} style={{ backgroundColor: "#008000" }} />
              Últimas 24h
            </div>
            <div className={styles.legendItem}>
              <span className={styles.colorDot} style={{ backgroundColor: "#FFFF00" }} />
              Entre 2 e 7 dias
            </div>
            <div className={styles.legendItem}>
              <span className={styles.colorDot} style={{ backgroundColor: "#FFA500" }} />
              Entre 8 e 30 dias
            </div>
          </div>

          {/* Sem dados */}
          {earthquakes.length === 0 && (
            <div className={styles.noData}>
              Nenhum sismo encontrado no período selecionado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
