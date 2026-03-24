import React, { useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import { storeCatalog } from "../../shared/data/storeCatalog";
import { useAddTrips } from "../hooks/useAddTrip";

import TripDatePicker from "../components/TripDatePicker";
import "./AddTrips.css";

const AddTrips = () => {
  const [trip, setTrip] = useState({
    storeNumber: storeCatalog[0].storeNumber,
    date: "",
    total: "",
    didGas: false,
    didBrisket: false,
    didDessert: false,
    didHomeGood: false,
    didOutdoor: false,
    didJerky: false,
    didColdGrab: false,
    didHotGrab: false,
    did3rdParty: false,
  });

  const { addTrips, error, msg } = useAddTrips();

  const tripSubmitHandler = async (e) => {
    e.preventDefault();
    await addTrips(trip);
  };

  const handleChange = (e) => {
    if (e.target.id === "products") {
      setTrip((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    } else {
      setTrip((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  return (
    <React.Fragment>
      <form className="add-trip-form" onSubmit={tripSubmitHandler}>
        <div className="add-trip-grid">
          <div className="add-trip-grid__left">
            <div className="add-trip-location">
              <label htmlFor="storeNumber">Choose a Location: </label>
              <select
                className="add-trip-location__select"
                id="storeNumber"
                name="storeNumber"
                onChange={handleChange}
                value={trip.storeNumber}
                required
              >
                {storeCatalog.map((store) => (
                  <option key={store.storeNumber} value={store.storeNumber}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-trip-date">
              <label htmlFor="date">Enter Date:</label>

              <TripDatePicker
                value={trip.date}
                onChange={(date) =>
                  setTrip((prev) => ({
                    ...prev,
                    date,
                  }))
                }
              />
            </div>

            <div className="add-trip-total">
              <label htmlFor="total">Enter Total: </label>
              <input
                className="add-trip-total__input"
                type="number"
                placeholder="Total"
                name="total"
                onChange={handleChange}
                value={trip.total}
                required
              />
            </div>
          </div>

          <div className="add-trip-grid__right">
            <div className="add-trip-checkbox">
              <label htmlFor="Gas"> Gas </label>
              <input
                className="add-trip-checkbox__input"
                type="checkbox"
                id="products"
                name="didGas"
                onChange={handleChange}
              />
            </div>

            <div className="add-trip-checkbox">
              <label htmlFor="Brisket"> Brisket </label>
              <input
                className="add-trip-checkbox__input"
                type="checkbox"
                id="products"
                name="didBrisket"
                onChange={handleChange}
              />
            </div>

            <div className="add-trip-checkbox">
              <label htmlFor="Dessert"> Dessert </label>
              <input
                className="add-trip-checkbox__input"
                type="checkbox"
                id="products"
                name="didDessert"
                onChange={handleChange}
              />
            </div>

            <div className="add-trip-checkbox">
              <label htmlFor="HomeGood"> Home Goods </label>
              <input
                className="add-trip-checkbox__input"
                type="checkbox"
                id="products"
                name="didHomeGood"
                onChange={handleChange}
              />
            </div>

            <div className="add-trip-checkbox">
              <label htmlFor="Outdoor"> Outdoor </label>
              <input
                className="add-trip-checkbox__input"
                type="checkbox"
                id="products"
                name="didOutdoor"
                onChange={handleChange}
              />
            </div>

            <div className="add-trip-checkbox">
              <label htmlFor="Jerky"> Jerky </label>
              <input
                className="add-trip-checkbox__input"
                type="checkbox"
                id="products"
                name="didJerky"
                onChange={handleChange}
              />
            </div>

            <div className="add-trip-checkbox">
              <label htmlFor="ColdGrab"> Cold Grab n' Go </label>
              <input
                className="add-trip-checkbox__input"
                type="checkbox"
                id="products"
                name="didColdGrab"
                onChange={handleChange}
              />
            </div>

            <div className="add-trip-checkbox">
              <label htmlFor="HotGrab"> Hot Grab n' Go </label>
              <input
                className="add-trip-checkbox__input"
                type="checkbox"
                id="products"
                name="didHotGrab"
                onChange={handleChange}
              />
            </div>

            <div className="add-trip-checkbox">
              <label htmlFor="Third"> 3rd-Party </label>
              <input
                className="add-trip-checkbox__input"
                type="checkbox"
                id="products"
                name="did3rdParty"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="add-trip-submit">
          <Button className="add-trip-submit__button" type="submit">
            ADD TRIP
          </Button>
        </div>
      </form>

      {error && (
        <div className="add-trip-message add-trip-message--error">{error}</div>
      )}
      {msg && (
        <div className="add-trip-message add-trip-message--success">{msg}</div>
      )}
    </React.Fragment>
  );
};

export default AddTrips;
