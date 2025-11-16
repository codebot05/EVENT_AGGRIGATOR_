// searchbar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState({
    location: '',
    eventType: '',
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);  // Passing the search query to the parent component
  };

  return (
    <form onSubmit={handleSearchSubmit} className="search-bar">
      <input
        type="text"
        name="location"
        placeholder="Search by Location"
        value={searchQuery.location}
        onChange={handleSearchChange}
      />
      <select
        name="eventType"
        value={searchQuery.eventType}
        onChange={handleSearchChange}
      >
        <option value="">Select Event Type</option>
        <option value="Hackathon">Hackathon</option>
        <option value="Workshop">Workshop</option>
        <option value="Conference">Conference</option>
        <option value="Cultural">Cultural</option>
        <option value="Seminar">Seminar</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
