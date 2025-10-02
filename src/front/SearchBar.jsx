import React from "react";
import "./searchbar.css";

export default function SearchBar() {
  return (
    <div className="search-bar-container">
      <h1>How's the sky looking today?</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a place..."
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>
    </div>
  );
}
