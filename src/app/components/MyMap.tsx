import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Map } from "leaflet";
import Clock from "./Clock";
import { getSession } from "next-auth/react";
import moment from "moment-timezone";
interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface MyMapProps {
  defaultLatitude: number;
  defaultLongitude: number;
}
// const PATENT_LOCATION: Location = {
//   latitude: -5.452085673426214,
//   longitude: 119.44737910612291,
// }; //lolasi donat kampar

const PATENT_LOCATION: Location = {
  latitude: -5.404946417532999,
  longitude: 119.44838713662129,
}; //lokasi PDAM
// const PATENT_LOCATION: Location = {
//   latitude: -3.5283975106524754,
//   longitude: 118.98642921477968,
// }; //lokasi unsulbar

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
  const [statusAbsesn, setStatusAbsesn] = useState<string | null>(null);
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

  const validateMasuk = async () => {
    const session = await getSession();
    const distance = calculateDistance(
      { latitude: location.latitude ?? 0, longitude: location.longitude ?? 0 },
      PATENT_LOCATION
    );
    setJarak(distance);
    console.log("Jarak dari Lokasi Paten:", distance, "km");
    setIsValid(distance <= VALIDATION_RADIUS_KM);
    if (distance <= VALIDATION_RADIUS_KM) {
      try {
        const now = new Date();
        const witaTime = moment(now).tz("Asia/Makassar"); // Konversi ke WITA
        const formattedWita = witaTime.format("YYYY-MM-DD HH:mm:ssZ"); // Format

        console.log(formattedWita);
        const createMasuk = await fetch("/api/masuk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: session?.user.data.id,
            waktu: formattedWita,
          }),
        });
        if (createMasuk.ok) {
          console.log("Berhasil masuk");
          setStatusAbsesn("Berhasi Melakukan Absen Terima Kasih");
        } else if (createMasuk.status === 409) {
          // Status code 409 (Conflict)
          const errorData = await createMasuk.json(); // Ambil response body (pesan error)
          console.warn("Sudah absen:", errorData.error);
          setStatusAbsesn("Anda sudah melakukan absen untuk hari ini."); // Pesan yang lebih user-friendly
        } else {
          // Status code lainnya (selain 2xx dan 409)
          const errorData = await createMasuk.json();
          console.error("Error saat masuk:", createMasuk.status, errorData);
          setStatusAbsesn(
            "Terjadi kesalahan saat melakukan absen: " + createMasuk.status
          );
          // Atau, tampilkan pesan error yang lebih spesifik berdasarkan errorData
        }
      } catch (error) {
        console.error("Error saat masuk:", error);
      }
    } else {
      console.log("Lokasi tidak valid");
    }
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
    }, 500); // Tunda 500ms (sesuaikan sesuai kebutuhan)
  };
  const validateKeluar = async () => {
    const session = await getSession();
    const distance = calculateDistance(
      { latitude: location.latitude ?? 0, longitude: location.longitude ?? 0 },
      PATENT_LOCATION
    );
    setJarak(distance);
    console.log("Jarak dari Lokasi Paten:", distance, "km");
    setIsValid(distance <= VALIDATION_RADIUS_KM);
    if (distance <= VALIDATION_RADIUS_KM) {
      try {
        const now = new Date();
        const witaTime = moment(now).tz("Asia/Makassar"); // Konversi ke WITA
        const formattedWita = witaTime.format("YYYY-MM-DD HH:mm:ssZ"); // Format

        console.log(formattedWita);
        const createMasuk = await fetch("/api/keluar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: session?.user.data.id,
            waktu: formattedWita,
          }),
        });
        if (createMasuk.ok) {
          console.log("Berhasil keluar");
          setStatusAbsesn("Berhasi Melakukan Absen Keluar Terima Kasih");
        } else if (createMasuk.status === 409) {
          // Status code 409 (Conflict)
          const errorData = await createMasuk.json(); // Ambil response body (pesan error)
          console.warn("Sudah absen:", errorData.error);
          setStatusAbsesn("Anda sudah melakukan absen keluar untuk hari ini."); // Pesan yang lebih user-friendly
        } else {
          // Status code lainnya (selain 2xx dan 409)
          const errorData = await createMasuk.json();
          console.error("Error saat masuk:", createMasuk.status, errorData);
          setStatusAbsesn(
            "Terjadi kesalahan saat melakukan absen: " + createMasuk.status
          );
          // Atau, tampilkan pesan error yang lebih spesifik berdasarkan errorData
        }
      } catch (error) {
        console.error("Error saat keluar:", error);
      }
    } else {
      console.log("Lokasi tidak valid");
    }
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
    }, 500); // Tunda 500ms (sesuaikan sesuai kebutuhan)
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
      <div>
        <div className="w-full flex flex-col justify-center">
          <Clock />
          {isValid === false && (
            <div className=" flex justify-center bg-red-600 p-2 m-2 rounded font-bold">
              Anda berada di luar jangkauan absensi. Silahkan mendekat ke area
              Absensi!
            </div>
          )}
          {statusAbsesn !== null && statusAbsesn !== "" && (
            <div className=" flex justify-center bg-green-600 p-2 m-2 rounded font-bold">
              {statusAbsesn}
            </div>
          )}
        </div>
        <div className="w-full p-5 flex justify-around">
          <button
            className="p-10 rounded-xl bg-blue-500 text-white font-bold h-40 disabled:bg-gray-500 "
            onClick={validateMasuk}
            disabled={!mapLoaded}
          >
            MASUK
          </button>
          <button
            className="p-10 rounded-xl bg-orange-600 text-white font-bold h-40 disabled:bg-gray-500"
            onClick={validateKeluar}
            disabled={!mapLoaded}
          >
            KELUAR
          </button>
        </div>
        <p>Jarak dari Lokasi Absen: {jarak} km</p>
        {isValid === true && (
          <p>
            Anda berada dalam jarak {VALIDATION_RADIUS_METERS} meter dari
            lokasi!
          </p>
        )}
        {isValid === false && (
          <p>
            Anda berada di luar jarak {VALIDATION_RADIUS_METERS} meter dari
            lokasi!
          </p>
        )}
        {isValid === null && <p>Tekan tombol Masuk untuk memeriksa lokasi.</p>}
      </div>
    </div>
  );
};

export default MyMap;
