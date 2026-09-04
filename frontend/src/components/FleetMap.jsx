import React from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const ZONES = [
  {
    name: "Benniganahalli",
    short: "BEN",
    position: [13.0007, 77.6448],
  },
  {
    name: "Indiranagar",
    short: "IND",
    position: [12.9784, 77.6408],
  },
  {
    name: "Mahatma Gandhi Road",
    short: "MG",
    position: [12.9756, 77.6067],
  },
  {
    name: "Nadaprabhu Kempegowda Station, Majestic",
    short: "MAJ",
    position: [12.9767, 77.5713],
  },
  {
    name: "Krishnarajapura",
    short: "KR",
    position: [13.0005, 77.6754],
  },
];

function MapBounds() {
  const map = useMap();

  React.useEffect(() => {
    const bounds = ZONES.map(
      (zone) => zone.position
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [map]);

  return null;
}

export default function FleetMap({
  zoneDistribution = {},
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#090c0d]">

      {/* MAP HEADER */}

      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">

        <div className="flex items-center gap-3">

          <div className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Bengaluru operating network
          </span>

        </div>

        <span className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
          5 active zones
        </span>

      </div>


      {/* REAL MAP */}

      <div className="h-[560px] w-full">

        <MapContainer
          center={[12.985, 77.62]}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBounds />

          {/* OPERATING ROUTE */}

          <Polyline
            positions={ZONES.map(
              (zone) => zone.position
            )}
            pathOptions={{
              color: "#64748b",
              weight: 2,
              opacity: 0.65,
              dashArray: "7 8",
            }}
          />

          {/* ZONES */}

          {ZONES.map((zone) => {

            const count =
              zoneDistribution[zone.name] ??
              0;

            return (

              <CircleMarker
                key={zone.name}
                center={zone.position}
                radius={11}
                pathOptions={{
                  color: "#111827",
                  weight: 3,
                  fillColor: "#e5e7eb",
                  fillOpacity: 0.9,
                }}
              >

                <Popup>

                  <div
                    style={{
                      minWidth: "180px",
                      fontFamily:
                        "Inter, system-ui, sans-serif",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "11px",
                        letterSpacing:
                          "0.12em",
                        textTransform:
                          "uppercase",
                        color: "#6b7280",
                        marginBottom:
                          "6px",
                      }}
                    >
                      FleetMind zone
                    </div>

                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        marginBottom:
                          "8px",
                      }}
                    >
                      {zone.name}
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#4b5563",
                      }}
                    >
                      {count} scooters currently
                      assigned
                    </div>

                  </div>

                </Popup>

              </CircleMarker>

            );
          })}

        </MapContainer>

      </div>

      {/* MAP FOOTER */}

      <div className="grid grid-cols-2 border-t border-white/10 md:grid-cols-5">

        {ZONES.map((zone) => (

          <div
            key={zone.name}
            className="border-r border-white/10 px-4 py-4 last:border-r-0"
          >

            <div className="text-[9px] uppercase tracking-[0.15em] text-gray-600">
              {zone.short}
            </div>

            <div className="mt-1 text-xs text-gray-400">
              {shortZone(zone.name)}
            </div>

            <div className="mt-2 font-mono text-sm text-gray-200">
              {zoneDistribution[zone.name] ?? 0}
              <span className="ml-1 text-[9px] text-gray-600">
                scooters
              </span>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

function shortZone(zone) {

  if (zone.includes("Nadaprabhu")) {
    return "Majestic";
  }

  if (zone === "Mahatma Gandhi Road") {
    return "MG Road";
  }

  if (zone === "Krishnarajapura") {
    return "KR Puram";
  }

  return zone;
}