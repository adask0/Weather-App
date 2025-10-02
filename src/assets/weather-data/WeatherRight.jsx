import React from "react";
import Select, { components } from "react-select";
import "./weatherright.css";

const daysOptions = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

const Option = (props) => {
  return <components.Option {...props}>{props.data.label}</components.Option>;
};

export default function WeatherRight() {
  const d = new Date();
  let day = d.getDay();

  const [selectedOption, setSelectedOption] = React.useState(
    daysOptions[day === 0 ? 6 : day - 1]
  );

  const handleChange = (value) => {
    setSelectedOption(value);
  };

  const SingleValue = ({ children, ...props }) => (
    <components.SingleValue {...props}>{children}</components.SingleValue>
  );

  return (
    <div className="weather-right">
      <div className="weather-right-header">
        <h4>Hourly forecast</h4>
        <Select
          placeholder="Select Day"
          options={daysOptions}
          value={selectedOption}
          onChange={handleChange}
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: "#2f2f49",
              border: "none",
              borderRadius: "10px",
              padding: "0.5rem",
              minHeight: "auto",
              cursor: "pointer",
              boxShadow: state.isFocused ? "0 0 0 2px #4f46e5" : "none",
              "&:hover": {
                backgroundColor: "#2d2d4a",
              },
            }),
            singleValue: (base) => ({
              ...base,
              display: "flex",
              alignItems: "center",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "500",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#2f2f49",
              border: "1px solid #3a3a5c",
              borderRadius: "10px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }),
            menuList: (base) => ({
              ...base,
              padding: "0.5rem 0",
            }),
            option: (base, state) => ({
              ...base,
              display: "flex",
              alignItems: "center",
              backgroundColor: state.isSelected
                ? "#4f46e5"
                : state.isFocused
                ? "#2d2d4a"
                : "transparent",
              color: "#ffffff",
              padding: "0.75rem 1rem",
              cursor: "pointer",
              fontSize: "14px",
              "&:hover": {
                backgroundColor: state.isSelected ? "#4f46e5" : "#2d2d4a",
              },
            }),
            indicatorSeparator: () => ({
              display: "none",
            }),
            dropdownIndicator: (base, state) => ({
              ...base,
              color: "#ffffff",
              transform: state.selectProps.menuIsOpen
                ? "rotate(180deg)"
                : "rotate(0deg)",
              transition: "transform 0.2s ease",
              "&:hover": {
                color: "#e5e7eb",
              },
            }),
          }}
          components={{ Option, SingleValue }}
        />
      </div>
    </div>
  );
}
