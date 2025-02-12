import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Map } from "leaflet";

interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface MyMapProps {
  defaultLatitude: number;
  defaultLongitude: number;
}
// -5.40067046122867, 119.4505217021217
// -3.543032606259001, 118.9721758643772
const PATENT_LOCATION: Location = {
  latitude: -3.543032606259001,
  longitude: 118.9721758643772,
};

const VALIDATION_RADIUS_METERS = 1000;
const VALIDATION_RADIUS_KM = VALIDATION_RADIUS_METERS / 1000;

const calculateDistance = (
  location1: Location,
  location2: Location
): number => {
  const R = 6371;
  const lat1 = ((location1.latitude ?? 0) * Math.PI) / 180;
  const lon1 = ((location1.longitude ?? 0) * Math.PI) / 180;
  const lat2 = ((location2.latitude ?? 0) * Math.PI) / 180;
  const lon2 = ((location2.longitude ?? 0) * Math.PI) / 180;

  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;

  const a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

const patentIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const PatentMarker: React.FC = () => {
  return (
    <Marker
      position={[PATENT_LOCATION.latitude ?? 0, PATENT_LOCATION.longitude ?? 0]}
      icon={patentIcon}
    >
      <Popup>Lokasi Kampus</Popup>
    </Marker>
  );
};

const MyMap: React.FC<MyMapProps> = ({ defaultLatitude, defaultLongitude }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [location, setLocation] = useState<Location>({
    latitude: defaultLatitude,
    longitude: defaultLongitude,
  });
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [jarak, setJarak] = useState<number | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          console.log("Lokasi Geolocation:", newLocation); // <--
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation tidak didukung.");
    }
  }, []);

  useEffect(() => {
    console.log("Nilai location di dalam useEffect:", location); // Periksa nilai location saat diperbarui

    if (mapRef.current && location.latitude && location.longitude) {
      mapRef.current.setView([location.latitude, location.longitude], 13);
      setMapLoaded(true);
    }
  }, [location]);

  const validateLocation = () => {
    const distance = calculateDistance(
      { latitude: location.latitude ?? 0, longitude: location.longitude ?? 0 },
      PATENT_LOCATION
    );
    setJarak(distance);
    console.log("Jarak dari Lokasi Paten:", distance, "km");
    setIsValid(distance <= VALIDATION_RADIUS_KM);

    // Zoom ke lokasi saat validasi
    setTimeout(() => {
      if (mapRef.current && location.latitude && location.longitude) {
        mapRef.current.flyTo([location.latitude, location.longitude], 16);
      } else {
        console.log(
          "mapRef.current masih null localtion atau lokasi tidak valid.",
          location
        );
      }
    }, 2000); // Tunda 500ms (sesuaikan sesuai kebutuhan)
  };

  const customIcon = new L.Icon({
    iconUrl: "/marker-icon.png",
    iconSize: [25, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div>
      {/* {location && <p>State Lokasi: {JSON.stringify(location)}</p>}{" "} */}
      {/* <-- Tambahkan ini */}
      {location.latitude !== null && location.longitude !== null ? (
        <MapContainer
          center={[location.latitude, location.longitude] as [number, number]}
          zoom={12}
          style={{ height: "400px", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[location.latitude, location.longitude]}
            icon={customIcon}
          >
            <Popup>Anda di sini!</Popup>
          </Marker>
          <PatentMarker />
        </MapContainer>
      ) : (
        <p>Memuat peta...</p>
      )}
      <button
        className="p-2 rounded-full bg-blue-500 disabled:bg-gray-500 "
        onClick={validateLocation}
        disabled={!mapLoaded}
      >
        Validasi Lokasi
      </button>
      <p>Jarak dari Lokasi Paten: {jarak} km</p>
      {isValid === true && (
        <p>
          Anda berada dalam jarak {VALIDATION_RADIUS_METERS} meter dari lokasi!
        </p>
      )}
      {isValid === false && (
        <p>
          Anda berada di luar jarak {VALIDATION_RADIUS_METERS} meter dari
          lokasi!
        </p>
      )}
      {isValid === null && <p>Tekan tombol validasi untuk memeriksa lokasi.</p>}
    </div>
  );
};

export default MyMap;
