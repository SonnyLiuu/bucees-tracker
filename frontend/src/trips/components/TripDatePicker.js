import { useMemo, useState } from "react";
import "./TripDatePicker.css";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TripDatePicker({ value, onChange }) {
  const today = new Date();
  const currentYear = today.getFullYear();

  const yearOptions = [
    currentYear - 3,
    currentYear - 2,
    currentYear - 1,
    currentYear,
  ];

  const parsedValue = useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }, [value]);

  const [selectedYear, setSelectedYear] = useState(
    parsedValue ? parsedValue.getFullYear() : currentYear
  );
  const [selectedMonth, setSelectedMonth] = useState(
    parsedValue ? parsedValue.getMonth() : today.getMonth()
  );
  const [selectedDay, setSelectedDay] = useState(
    parsedValue ? parsedValue.getDate() : null
  );

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay();

  const calendarCells = useMemo(() => {
    const cells = [];

    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(day);
    }

    return cells;
  }, [firstDayIndex, daysInMonth]);

  const handleYearClick = (year) => {
    setSelectedYear(year);
    setSelectedDay(null);
    onChange("");
  };

  const handleMonthClick = (monthIndex) => {
    setSelectedMonth(monthIndex);
    setSelectedDay(null);
    onChange("");
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);

    const formatted = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    onChange(formatted);
  };

  return (
    <div className="trip-date-picker">
      <div className="picker-section">
        <div className="picker-label">Year</div>
        <div className="bubble-row">
          {yearOptions.map((year) => (
            <button
              key={year}
              type="button"
              className={`bubble-btn ${
                selectedYear === year ? "selected" : ""
              }`}
              onClick={() => handleYearClick(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="picker-section">
        <div className="picker-label">Month</div>
        <div className="month-grid">
          {monthNames.map((month, index) => (
            <button
              key={month}
              type="button"
              className={`bubble-btn month-btn ${
                selectedMonth === index ? "selected" : ""
              }`}
              onClick={() => handleMonthClick(index)}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      <div className="picker-section">
        <div className="picker-label">
          Day — {monthNames[selectedMonth]} {selectedYear}
        </div>

        <div className="weekday-row">
          {weekDays.map((day) => (
            <div key={day} className="weekday-cell">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarCells.map((day, index) =>
            day === null ? (
              <div key={`empty-${index}`} className="calendar-cell empty" />
            ) : (
              <button
                key={day}
                type="button"
                className={`calendar-cell day-btn ${
                  selectedDay === day ? "selected" : ""
                }`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </button>
            )
          )}
        </div>
      </div>
      <div className="selected-date-text">Selected: {value || "None"}</div>
    </div>
  );
}
