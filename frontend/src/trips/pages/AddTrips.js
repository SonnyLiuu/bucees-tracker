import React, { useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import { useAddTrips } from "../hooks/useAddTrip";
import { useAuthContext } from "../../shared/hooks/useAuthContext";

import TripDatePicker from "../components/TripDatePicker";
import "./AddTrips.css";

const AddTrips = () => {
  const { user } = useAuthContext();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [Trip, setTrip] = useState({
    email: user.userData.email,
    location: "#1 Lake Jackson, TX (899 Oyster Creek)",
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
    await addTrips(Trip);
  };

  const handleChange = (e) => {
    if (e.target.id === "products") {
      setTrip((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    } else {
      setTrip((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleDateChange = (date) => {
    setTrip((prev) => ({ ...prev, date }));
  };

  return (
    <React.Fragment>
      <form className="add-trip-form" onSubmit={tripSubmitHandler}>
        <div className="add-trip-grid">
          <div className="add-trip-grid__left">
            <div className="add-trip-location">
              <label htmlFor="location">Choose a Location: </label>
              <select
                className="add-trip-location__select"
                name="location"
                onChange={handleChange}
                value={Trip.location}
                required
              >
                <option value="#1 Lake Jackson, TX (899 Oyster Creek)">
                  #1 Lake Jackson, TX (899 Oyster Creek)
                </option>
                <option value="#2 Lake Jackson, TX (101 N Hwy 2004)">
                  #2 Lake Jackson, TX (101 N Hwy 2004)
                </option>
                <option value="#3 Brazoria, TX">#3 Brazoria, TX</option>
                <option value="#7 Freeport, TX (4231 E Hwy 332)">
                  #7 Freeport, TX (4231 E Hwy 332)
                </option>
                <option value="#8 Freeport, TX (1002 N Brazosport)">
                  #8 Freeport, TX (1002 N Brazosport)
                </option>
                <option value="#12 Port Lavaca, TX">#12 Port Lavaca, TX</option>
                <option value="#13 Angleton, TX (2299 E Mulberry)">
                  #13 Angleton, TX (2299 E Mulberry)
                </option>
                <option value="#14 Alvin, TX">#14 Alvin, TX</option>
                <option value="#16 Giddings, TX">#16 Giddings, TX</option>
                <option value="#17 Luling, TX">#17 Luling, TX</option>
                <option value="#18 Waller, TX">#18 Waller, TX</option>
                <option value="#19 Pearland, TX (2541 S Main)">
                  #19 Pearland, TX (2541 S Main)
                </option>
                <option value="#20 Pearland, TX (11151 Shadow Creek)">
                  #20 Pearland, TX (11151 Shadow Creek)
                </option>
                <option value="#21 Angleton, TX (931 Loop 274)">
                  #21 Angleton, TX (931 Loop 274)
                </option>
                <option value="#22 New Braunfels, TX">
                  #22 New Braunfels, TX
                </option>
                <option value="#23 League City, TX">#23 League City, TX</option>
                <option value="#24 Eagle Lake, TX">#24 Eagle Lake, TX</option>
                <option value="#25 Angleton, TX (2304 W Mulberry)">
                  #25 Angleton, TX (2304 W Mulberry)
                </option>
                <option value="#26 Madisonville, TX">
                  #26 Madisonville, TX
                </option>
                <option value="#28 Bastrop, TX">#28 Bastrop, TX</option>
                <option value="#29 Lake Jackson, TX (598 Hwy 332)">
                  #29 Lake Jackson, TX (598 Hwy 332)
                </option>
                <option value="#30 Wharton, TX">#30 Wharton, TX</option>
                <option value="#31 Richmond, TX">#31 Richmond, TX</option>
                <option value="#32 Cypress, TX">#32 Cypress, TX</option>
                <option value="#33 Texas City, TX">#33 Texas City, TX</option>
                <option value="#34 Baytown, TX">#34 Baytown, TX</option>
                <option value="#35 Temple, TX">#35 Temple, TX</option>
                <option value="#36 Terrell, TX">#36 Terrell, TX</option>
                <option value="#37 Fort Worth, TX">#37 Fort Worth, TX</option>
                <option value="#38 Royse City, TX">#38 Royse City, TX</option>
                <option value="#39 Denton, TX">#39 Denton, TX</option>
                <option value="#40 Katy, TX">#40 Katy, TX</option>
                <option value="#42 Loxley, AL">#42 Loxley, AL</option>
                <option value="#43 Leeds, AL">#43 Leeds, AL</option>
                <option value="#44 Melissa, TX">#44 Melissa, TX</option>
                <option value="#45 Sevierville, TN">#45 Sevierville, TN</option>
                <option value="#46 Saint Augustine, FL">
                  #46 Saint Augustine, FL
                </option>
                <option value="#47 Daytona Beach, FL">
                  #47 Daytona Beach, FL
                </option>
                <option value="#48 Ennis, TX">#48 Ennis, TX</option>
                <option value="#50 Crossville, TN">#50 Crossville, TN</option>
                <option value="#51 Warner Robins, GA">
                  #51 Warner Robins, GA
                </option>
                <option value="#52 Calhoun, GA">#52 Calhoun, GA</option>
                <option value="#53 Florence, SC">#53 Florence, SC</option>
                <option value="#55 Richmond, KY">#55 Richmond, KY</option>
                <option value="#57 Athens, AL">#57 Athens, AL</option>
                <option value="#58 Auburn, AL">#58 Auburn, AL</option>
              </select>
            </div>

            <div className="add-trip-date">
              <label htmlFor="date">Enter Date:</label>

              <TripDatePicker
                value={Trip.date}
                onChange={(date) =>
                  setTrip((prev) => ({
                    ...prev,
                    date: date,
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
                value={Trip.total}
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
