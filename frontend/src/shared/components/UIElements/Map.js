import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef(null);
  const { latitude, longitude, zoom, Trips } = props;
  let multipleMarkers = props.multipleMarkers;

  useEffect(() => {
    const colorlogo = "https://i.imghippo.com/files/kiSr21726623849.png";
    const graylogo = "https://i.imghippo.com/files/1gZVW1726623825.png";

    let coords = [
      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //#1
      {
        name: "#1 Lake Jackson, TX (899 Oyster Creek)",
        lat: 29.04064,
        lng: -95.413231,
      },

      //#2
      {
        name: "#2 Lake Jackson, TX (101 N Hwy 2004)",
        lat: 29.063684,
        lng: -95.427458,
      },

      //#3
      {
        name: "#3 Brazoria, TX",
        lat: 29.054991,
        lng: -95.571808,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //#7
      {
        name: "#7 Freeport, TX (4231 E Hwy 332)",
        lat: 28.981319,
        lng: -95.336922,
      },

      //#8
      {
        name: "#8 Freeport, TX (1002 N Brazosport)",
        lat: 28.969481,
        lng: -95.370064,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //#12
      {
        name: "#12 Port Lavaca, TX",
        lat: 28.610184503035022,
        lng: -96.64905834373896,
      },

      //#13
      {
        name: "#13 Angleton, TX (2299 E Mulberry)",
        lat: 29.18483831856236,
        lng: -95.40882146694477,
      },

      //#14
      {
        name: "#14 Alvin, TX",
        lat: 29.42999,
        lng: -95.22636,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //#16
      {
        name: "#16 Giddings, TX",
        lat: 30.179893493296618,
        lng: -96.91380487438587,
      },

      //#17
      {
        name: "#17 Luling, TX",
        lat: 29.65125477349913,
        lng: -97.59250536090968,
      },

      //#18
      {
        name: "#18 Waller, TX",
        lat: 30.072109207623306,
        lng: -95.93175941857044,
      },
      //#19
      {
        name: "#19 Pearland, TX (2541 S Main)",
        lat: 29.560391603389707,
        lng: -95.28521302291408,
      },

      //#20
      {
        name: "#20 Pearland, TX (11151 Shadow Creek)",
        lat: 29.580705970167475,
        lng: -95.39180884291916,
      },

      //#21
      {
        name: "#21 Angleton, TX (931 Loop 274)",
        lat: 29.17310929015999,
        lng: -95.43370808790512,
      },

      //#22
      {
        name: "#22 New Braunfels, TX",
        lat: 29.72665,
        lng: -98.07872,
      },

      //#23
      {
        name: "#23 League City, TX",
        lat: 29.49856,
        lng: -95.056419,
      },

      //#24
      {
        name: "#24 Eagle Lake, TX",
        lat: 29.590167635825694,
        lng: -96.33213037500609,
      },

      //#25
      {
        name: "#25 Angleton, TX (2304 W Mulberry)",
        lat: 29.163737,
        lng: -95.45506,
      },

      //#26
      {
        name: "#26 Madisonville, TX",
        lat: 30.965689869754364,
        lng: -95.87995463203582,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //#28
      {
        name: "#28 Bastrop, TX",
        lat: 30.1071985192125,
        lng: -97.30589278033362,
      },

      //#29
      {
        name: "#29 Lake Jackson, TX (598 Hwy 332)",
        lat: 29.021351,
        lng: -95.436287,
      },

      //#30
      {
        name: "#30 Wharton, TX",
        lat: 29.325783915785962,
        lng: -96.12370377626388,
      },

      //#31
      {
        name: "#31 Richmond, TX",
        lat: 29.55239,
        lng: -95.69696,
      },

      //#32
      {
        name: "#32 Cypress, TX",
        lat: 29.98089,
        lng: -95.71822,
      },

      //#33
      {
        name: "#33 Texas City, TX",
        lat: 29.4289,
        lng: -95.06302,
      },

      //#34
      {
        name: "#34 Baytown, TX",
        lat: 29.800733,
        lng: -94.999937,
      },

      //#35
      {
        name: "#35 Temple, TX",
        lat: 31.136109,
        lng: -97.328584,
      },

      //#36
      {
        name: "#36 Terrell, TX",
        lat: 32.7166952284362,
        lng: -96.32113240314676,
      },

      //#37
      {
        name: "#37 Fort Worth, TX",
        lat: 33.024257,
        lng: -97.27835,
      },

      //#38
      {
        name: "#38 Royse City, TX",
        lat: 32.97919384768757,
        lng: -96.29530965787751,
      },

      //#39
      {
        name: "#39 Denton, TX",
        lat: 33.17933964700234,
        lng: -97.10253240039718,
      },

      //#40
      {
        name: "#40 Katy, TX",
        lat: 29.778698938223005,
        lng: -95.84754292948973,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //#42
      {
        name: "#42 Loxley, AL",
        lat: 30.634259243574256,
        lng: -87.67662407076841,
      },

      //#43
      {
        name: "#43 Leeds, AL",
        lat: 33.54455516266362,
        lng: -86.58623370092964,
      },

      //#44
      {
        name: "#44 Melissa, TX",
        lat: 33.27152890789773,
        lng: -96.59195577414206,
      },

      //#45
      {
        name: "#45 Sevierville, TN",
        lat: 35.98170520475965,
        lng: -83.60512220159048,
      },

      //#46
      {
        name: "#46 Saint Augustine, FL",
        lat: 29.98373,
        lng: -81.46405,
      },

      //#47
      {
        name: "#47 Daytona Beach, FL",
        lat: 29.2236,
        lng: -81.100906,
      },

      //#48
      {
        name: "#48 Ennis, TX",
        lat: 32.32337,
        lng: -96.60617,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //#50
      {
        name: "#50 Crossville, TN",
        lat: 35.98035,
        lng: -85.016,
      },

      //#51
      {
        name: "#51 Warner Robins, GA",
        lat: 32.58491032751326,
        lng: -83.74038703003782,
      },

      //#52
      {
        name: "#52 Calhoun, GA",
        lat: 34.44068395343019,
        lng: -84.91700573035921,
      },

      //#53
      {
        name: "#53 Florence, SC",
        lat: 34.27190548040222,
        lng: -79.70265251714343,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //#55
      {
        name: "#55 Richmond, KY",
        lat: 37.673291,
        lng: -84.308841,
      },

      //UNUSED ID
      {
        name: "none",
        lat: 0,
        lng: 0,
      },

      //#57
      {
        name: "#57 Athens, AL",
        lat: 34.728548793213726,
        lng: -86.93212953009538,
      },

      //#58
      {
        name: "#58 Auburn, AL",
        lat: 32.552081060982694,
        lng: -85.52664872978087,
      },
    ];
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: zoom,
    });

    if (multipleMarkers === true) {
      if (props.Trips) {
        for (let i = 1; i <= 58; i++) {
          if (
            i === 4 ||
            i === 5 ||
            i === 6 ||
            i === 9 ||
            i === 10 ||
            i === 11 ||
            i === 15 ||
            i === 27 ||
            i === 41 ||
            i === 49 ||
            i === 54 ||
            i === 56
          )
            continue;
          let visitedFlag = false;
          for (let j = 0; j < props.Trips.length; j++) {
            if (props.Trips[j].location === coords[i].name) {
              visitedFlag = true;
              break;
            }
          }
          if (visitedFlag === true)
            new window.google.maps.Marker({
              position: { lat: coords[i].lat, lng: coords[i].lng },
              map: map,
              icon: {
                url: colorlogo,
                scaledSize: new window.google.maps.Size(30, 30),
              },
            });
          else
            new window.google.maps.Marker({
              position: { lat: coords[i].lat, lng: coords[i].lng },
              map: map,
              icon: {
                url: graylogo,
                scaledSize: new window.google.maps.Size(30, 30),
              },
            });
        }
      } else {
        // const map = new window.google.maps.Map(mapRef.current, {center: {lat: latitude, lng: longitude}, zoom: zoom});
        for (let i = 1; i <= 58; i++) {
          if (
            i === 4 ||
            i === 5 ||
            i === 6 ||
            i === 9 ||
            i === 10 ||
            i === 11 ||
            i === 15 ||
            i === 27 ||
            i === 41 ||
            i === 49 ||
            i === 54 ||
            i === 56
          )
            continue;
          new window.google.maps.Marker({
            position: { lat: coords[i].lat, lng: coords[i].lng },
            map: map,
            icon: {
              url: graylogo,
              scaledSize: new window.google.maps.Size(30, 30),
            },
          });
        }
      }
    } else {
      if (latitude) {
        console.log("From Map.js: " + latitude + " and " + longitude);

        const newMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: zoom,
        });

        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: newMap,
          icon: {
            url: colorlogo,
            scaledSize: new window.google.maps.Size(30, 30),
          },
        });
      }
    }
  }, [Trips, longitude]);

  let ret;
  if (multipleMarkers) {
    ret = (
      <div
        ref={mapRef}
        className={`map ${props.className}`}
        style={props.style}
        items="multipleMarkers"
      ></div>
    );
  } else {
    ret = <div ref={mapRef}></div>;
  }
  return ret;
};

export default Map;
