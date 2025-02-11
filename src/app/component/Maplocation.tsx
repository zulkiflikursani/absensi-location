"use client";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css"; // Import CSS Leaflet
import L from "leaflet"; // Import Leaflet

const MapLocation = () => {
  interface Location {
    latitude: number;
    longitude: number;
  }

  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState("");
  const [map, setMap] = useState<L.Map | null>(null); // State untuk menyimpan instance map

  useEffect(() => {
    // Cek apakah Geolocation API tersedia
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    // Fungsi untuk mendapatkan lokasi
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      // Inisialisasi peta setelah lokasi didapatkan
      const newMap = L.map("map").setView(
        [location.latitude, location.longitude],
        13
      ); // Simpan ke variable newMap

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(newMap);

      L.marker([location.latitude, location.longitude])
        .addTo(newMap)
        .bindPopup("Your location.")
        .openPopup();

      setMap(newMap); // Set newMap ke state map agar instance map bisa diakses
    }

    // Clean-up function untuk menghapus peta saat komponen unmount
    return () => {
      if (map) {
        map.remove(); // Hapus instance map leaflet
      }
    };
  }, [location]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!location) {
    return <div>Loading location...</div>;
  }

  return <div id="map" style={{ height: "500px" }}></div>;
};

export default MapLocation;
