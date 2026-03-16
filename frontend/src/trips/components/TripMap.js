import React, { useRef, useEffect } from "react";

import "./TripMap.css";

const TripMap = (props) => {
  const mapRef = useRef(null);
  const { center, zoom, userData, Trips } = props;

  const colorlogo =
    "https://cdn.discordapp.com/attachments/1125893813727154317/1133105429543669820/colorlogo.png";
  useEffect(() => {
    const initializeMap = () => {
      // Check if the Google Maps API is available
      if (window.google && window.google.maps) {
        const mapOptions = {
          center: { lat: props.latitude, lng: props.longitude },
          zoom: 16,
        };

        // Create the map and assign it to the mapRef current
        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        new window.google.maps.Marker({
          position: { lat: props.latitude, lng: props.longitude },
          map: map,
          icon: colorlogo,
        });
      }
    };
    initializeMap();
  }, [center, zoom, userData, Trips]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px" }} // Provide appropriate width and height
    ></div>
  );
};

export default TripMap;
