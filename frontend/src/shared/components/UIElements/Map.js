import React, { useEffect, useMemo, useRef } from "react";

import { storeCatalog } from "../../data/storeCatalog";
import "./Map.css";

const colorLogo = "https://i.imghippo.com/files/kiSr21726623849.png";
const grayLogo = "https://i.imghippo.com/files/1gZVW1726623825.png";

const Map = ({
  latitude,
  longitude,
  zoom,
  Trips,
  multipleMarkers,
  className,
  style,
}) => {
  const mapRef = useRef(null);

  const visitedLocations = useMemo(
    () => new Set((Trips || []).map((trip) => trip.location)),
    [Trips]
  );

  useEffect(() => {
    if (!window.google?.maps || !mapRef.current) {
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom,
    });

    if (multipleMarkers) {
      for (const store of storeCatalog) {
        const isVisited = visitedLocations.has(store.name);

        new window.google.maps.Marker({
          position: { lat: store.lat, lng: store.lng },
          map,
          title: store.name,
          icon: {
            url: isVisited ? colorLogo : grayLogo,
            scaledSize: new window.google.maps.Size(30, 30),
          },
        });
      }

      return;
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return;
    }

    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      icon: {
        url: colorLogo,
        scaledSize: new window.google.maps.Size(30, 30),
      },
    });
  }, [latitude, longitude, multipleMarkers, visitedLocations, zoom]);

  return (
    <div
      ref={mapRef}
      className={[multipleMarkers ? "map" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    />
  );
};

export default Map;
