import React from "react";
import MapWrapper from "../components/MapWrapper";

function LocationPage() {
  return (
    <div>
      <h1>ABSENSI ONLINE</h1>
      <MapWrapper defaultLatitude={-6.2} defaultLongitude={106.816666} />
      {/* Jakarta */}
    </div>
  );
}

export default LocationPage;
