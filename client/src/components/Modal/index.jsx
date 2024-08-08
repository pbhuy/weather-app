import React, { useState } from 'react';
import './style.scss'; // Ensure to style the modal as needed

function Modal({ isOpen, onClose, onVerify }) {
  const [email, setEmail] = useState('');

  const handleRetry = () => {
    if (email) {
      onVerify(email);
    } else {
      alert('Please enter a valid email address.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Email Verification Required</h2>
        <p>Your email address is not verified. Please enter a verified email address to retry.</p>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleRetry}>Verify</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;
