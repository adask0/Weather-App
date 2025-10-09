import React, { useState } from "react";
import Select, { components } from "react-select";
import { useWeather } from "../context/WeatherContext";
import "./header.css";
import Icon from "../assets/images/logo.svg";
import Units from "../assets/images/icon-units.svg";

const unitsOptions = [
  {
    value: 1,
    label: "Celsius",
    icon: Units,
    isDisabled: false,
    className: "option",
  },
  {
    value: 2,
    label: "Kelvin",
    icon: Units,
    isDisabled: false,
    className: "option",
  },
  {
    value: 3,
    label: "Fahrenheit",
    icon: Units,
    isDisabled: false,
    className: "option",
  },
];

const Option = (props) => {
  return (
    <components.Option {...props}>
      <img
        src={props.data.icon}
        alt="units icon"
        style={{
          width: "16px",
          height: "16px",
          marginRight: "8px",
          opacity: 0.8,
        }}
      />
      {props.data.label}
    </components.Option>
  );
};

export default function Header() {
  const [selectedOption, setSelectedOption] = useState(unitsOptions[0]);
  const { setTemperature, units, setUnits } = useWeather();

  const handleChange = (value) => {
    setSelectedOption(value);
    setTemperature(value.label);
    setUnits(value.label.toLowerCase());
  };

  const SingleValue = ({ children, ...props }) => (
    <components.SingleValue {...props}>
      <img
        src={props.data.icon}
        alt="units icon"
        style={{
          width: "16px",
          height: "16px",
          marginRight: "8px",
          opacity: 0.8,
        }}
      />
      {children}
    </components.SingleValue>
  );

  return (
    <header className="header">
      <img src={Icon} alt="Weather App Logo" />
      <Select
        value={selectedOption}
        options={unitsOptions}
        className="units"
        classNamePrefix="react-select"
        onChange={handleChange}
        isSearchable={false}
        components={{ Option, SingleValue }}
      />
    </header>
  );
}
