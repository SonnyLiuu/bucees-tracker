import React, { useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import TripMap from "../../trips/components/TripMap";

import "./TripItem.css";

const formatTripDate = (value) => {
  if (!value) {
    return "Unknown date";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
};

const TripItem = (props) => {
  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  let itemsBought = [
    "Gas",
    " Brisket",
    " Dessert",
    " Home Goods",
    " Outdoor",
    " Jerky",
    " Cold Grab n' Go",
    " Hot Grab n' Go",
    " 3rd-Party",
  ];
  let itemsBool = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  if (props.didGas === true) itemsBool[0] = true;
  if (props.didBrisket === true) itemsBool[1] = true;
  if (props.didDessert === true) itemsBool[2] = true;
  if (props.didHomeGood === true) itemsBool[3] = true;
  if (props.didOutdoor === true) itemsBool[4] = true;
  if (props.didJerky === true) itemsBool[5] = true;
  if (props.didColdGrab === true) itemsBool[6] = true;
  if (props.didHotGrab === true) itemsBool[7] = true;
  if (props.did3rdParty === true) itemsBool[8] = true;

  let itemsFound = [];
  for (let i = 0; i < itemsBool.length; i++) {
    if (itemsBool[i] === true) {
      itemsFound.push(itemsBought[i]);
    }
  }

  if (props.latitude && props.longitude) {
    // these are valid and numbers
    // let latitude = props.latitude;
    // let longitude = props.longitude;
    // const coordinates = trip_hook(props);
    return (
      <React.Fragment>
        <Modal
          show={showMap}
          onCancel={closeMapHandler}
          header={props.location}
          contentClass="trip-item__modal-content"
          footerClass="trip-item__modal-actions"
          footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
        >
          <div className="map-container" show={showMap}>
            <TripMap latitude={props.latitude} longitude={props.longitude} />
          </div>
        </Modal>

        <li className="trip-item">
          <Card className="trip-item__content">
            <div className="trip-item__info">
              <h2>
                {formatTripDate(props.date)}: {props.location}
              </h2>
              <h3>Total: ${props.total}</h3>
              <h4>Items Purchased: {itemsFound.toString()}</h4>
            </div>
            <div className="trip-item__actions">
              <Button inverse onClick={openMapHandler}>
                VIEW ON MAP
              </Button>
            </div>
          </Card>
        </li>
      </React.Fragment>
    );
  }
  // <div className="map-overview-container" show={showMap}>
  //   {Trips && (
  //     <Map userData={userData} Trips={Trips}  latitude={30.84438031395508} longitude={-90.15067911159346} zoom={5}multipleMarkers={true}/>
  //     )}
  // </div>
};

export default TripItem;
