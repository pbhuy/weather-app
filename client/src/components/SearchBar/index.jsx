import { useState } from 'react';
import './style.scss';

function SearchBar({ onSearch, onUseCurrentLocation, onSubscribe, onUnsubscribe }) {
  const [term, setTerm] = useState('');
  const [email, setEmail] = useState('');

  const handleSearch = () => {
    onSearch(term);
  };
  const handleCurrentLocation = () => {
    onUseCurrentLocation();
  };
  const handleSubscribe = () => {
    if (email) {
      onSubscribe(email);
      setEmail('');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  const handleUnsubscribe = () => {
    if (email) {
      onUnsubscribe(email);
      setEmail('');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <div className="weather-input">
      <h3>Enter a City Name</h3>
      <input
        type="text"
        placeholder="E.g., New York, London, Tokyo"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button className="search-btn" onClick={handleSearch}>
        Search
      </button>
      <div className="separator"></div>
      <button className="location-btn" onClick={handleCurrentLocation}>
        Use Current Location
      </button>
      <div className="separator"></div>
      <h3>Subscribe for Notifications</h3>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="button-container">
        <button className="subscribe-btn" onClick={handleSubscribe}>
          Subscribe
        </button>
        <button className="unsubscribe-btn" onClick={handleUnsubscribe}>
          Unsubscribe
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
