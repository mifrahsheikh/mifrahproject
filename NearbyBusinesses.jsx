import React, { useEffect, useState } from "react";
import axios from "axios";
import MapView from "./MapView";
import logo from '../assets/logo (2).png'; 

const NearbyBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const response = await axios.get("http://127.0.0.1:8000/api/nearby/", {
            params: { lat, lng },
          });
          setBusinesses(response.data);
          setFiltered(response.data);
        } catch (error) {
          console.error("Error fetching nearby businesses:", error);
          setLocationError("Failed to fetch nearby businesses.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError("Location permission is required.");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const results = businesses.filter((business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(results);
  }, [searchTerm, businesses]);

  return (
    <div className="main-container">
    <div className="top-bar">
  <img src={logo} alt="Local Pulse Logo" className="search-logo" />

  <div className="search-container">
    <input
      type="text"
      className="search-input"
      placeholder="Search nearby places..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button className="search-button">Search</button>
  </div>
</div>

      {loading && <p>Loading nearby businesses...</p>}
      {locationError && <p className="error">{locationError}</p>}

      {!loading && filtered.length === 0 && !locationError && (
        <p>No businesses found nearby.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid-container">
          <div className="left-column">
            <div className="business-header">Business Name</div>
            <div className="business-list">
              {filtered.map((business) => (
                <div key={business.id} className="business-card">
                  <h3>{business.name}</h3>
                  <p>Category: {business.category}</p>
                  <p>Rating: {business.rating}</p>
                  <p>Distance: {business.distance} km</p>
                  <p>Contact: {business.contact}</p>
                  {business.eco_friendly && (
                    <span className="eco-label">Eco-Friendly</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="right-column">
            <MapView businesses={filtered} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyBusinesses;
