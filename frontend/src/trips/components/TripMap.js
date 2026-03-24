import React, { useRef, useEffect } from "react";

import "./TripMap.css";

const TripMap = ({ latitude, longitude }) => {
  const mapRef = useRef(null);

  const colorlogo =
    "https://cdn.discordapp.com/attachments/1125893813727154317/1133105429543669820/colorlogo.png";

  useEffect(() => {
    if (!window.google?.maps || !mapRef.current) {
      return;
    }

    const mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 16,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      icon: colorlogo,
    });
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px" }} // Provide appropriate width and height
    ></div>
  );
};

export default TripMap;
