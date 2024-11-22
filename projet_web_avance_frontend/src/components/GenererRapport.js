// src/components/GenerateReportPopup.js
import React, { useState } from 'react';
import './../assets/css/GenererRapport.css';

const GenerateReportPopup = ({ isOpen, onClose, onSubmit }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ startDate, endDate });
    onClose(); // Close the popup after submission
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Générer un Nouveau Rapport</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="start-date">Date de Début</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">Date de Fin</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Générer</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateReportPopup;
