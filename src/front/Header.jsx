import React, { useState } from "react";
import Select, { components } from "react-select";
import "./header.css";
import Icon from "../assets/images/logo.svg";
import Units from "../assets/images/icon-units.svg";

const unitsOptions = [
  {
    value: 1,
    label: "Units",
    icon: Units,
    isDisabled: true,
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
    label: "Celsius",
    icon: Units,
    isDisabled: false,
    className: "option",
  },
  {
    value: 4,
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

  const handleChange = (value) => {
    setSelectedOption(value);
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
        onChange={handleChange}
        isSearchable={false}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: "#25253f",
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
            backgroundColor: "#25253f",
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
    </header>
  );
}
