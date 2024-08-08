import { useState } from 'react';
import './assets/styles/app.scss';
import axios from './configs/axios';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherForecast from './components/WeatherForecast';
import Modal from './components/Modal';

function App() {
  const [searchTerm, setSearchTerm] = useState('London');
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCoordinates(null);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSearchTerm('');
          setCoordinates({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubscribe = async (email) => {
    try {
      const response = await axios.post('/weather/subscribe', { email });
      if (response.data.success) {
        alert(response.data.message);
        setError(null); // Clear any previous errors
      } else {
        if (response.data.error) {
          setIsModalOpen(true); // Open the modal if email is not verified
        } else {
          setError('Failed to subscribe. Please try again.');
        }
      }
    } catch (err) {
      const mes = err.response.data.message;
      if (mes === 'Email address is not verified' || mes === 'Email address not found') setIsModalOpen(true);
      else if (mes === 'Email is already subscribed to weather forecasts') alert(mes);
      setError('Failed to subscribe. Please try again.');
    }
  };
  const handleUnsubscribe = async (email) => {
    try {
      const response = await axios.post('/weather/unsubscribe', { email });
      if (response.data.success) {
        alert(response.data.message);
        setError(null); // Clear any previous errors
      } else {
        if (response.data.error) {
          setIsModalOpen(true); // Open the modal if email is not verified
        } else {
          setError('Failed to subscribe. Please try again.');
        }
      }
    } catch (err) {
      const mes = err.response.data.message;
      if (mes === 'Email address is not verified' || mes === 'Email address not found') setIsModalOpen(true);
      else if (mes === 'Email is not currently subscribed to weather forecasts') alert(mes);
      setError('Failed to subscribe. Please try again.');
    }
  };

  const handleRetryVerification = async (email) => {
    try {
      const response = await axios.post('/auth/send-verification-email', { email });

      if (response.data.success) {
        setIsModalOpen(false); // Close the modal on successful retry
        setError(null); // Clear any previous errors
        alert('Verification email sent. Please check your inbox.');
      } else {
        setError('Failed to send verification email. Please try again.');
      }
    } catch (err) {
      console.error('Retry verification error:', err);
      setError('An error occurred while verifying the email. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <SearchBar
          onSearch={handleSearch}
          onUseCurrentLocation={handleUseCurrentLocation}
          onSubscribe={handleSubscribe}
          onUnsubscribe={handleUnsubscribe}
        />
        <WeatherForecast searchTerm={searchTerm} coordinates={coordinates} />
        {/* Include the Modal component */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVerify={handleRetryVerification} />
      </div>
    </>
  );
}

export default App;
