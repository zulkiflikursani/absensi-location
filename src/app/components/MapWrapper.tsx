"use client";

import dynamic from "next/dynamic";
import React from "react";

interface MapWrapperProps {
  defaultLatitude: number;
  defaultLongitude: number;
}

const MapComponent = dynamic(() => import("./MyMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const MapWrapper: React.FC<MapWrapperProps> = ({
  defaultLatitude,
  defaultLongitude,
}) => {
  return (
    <MapComponent
      defaultLatitude={defaultLatitude}
      defaultLongitude={defaultLongitude}
    />
  );
};

export default MapWrapper;
