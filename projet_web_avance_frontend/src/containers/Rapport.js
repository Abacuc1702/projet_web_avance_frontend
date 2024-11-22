// src/components/Rapport.js
import React, { useState, useEffect } from "react";
import GenerateReportPopup from "../components/GenererRapport";
import "./../assets/css/Rapport.css";
import { API_URL } from "../utils/endpoints";
import { createItem, fetchData } from "../services/crudService";

const Rapport = () => {
  const [rapports, setRapports] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // Récupérer la liste des rapports depuis le backend
    const fetchRapports = async () => {
      try {
        const data = await fetchData(API_URL + "/rapports/list"); // Assurez-vous que cette URL correspond à votre API Django
        console.log(data);
        setRapports(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des rapports:", error);
      }
    };

    fetchRapports();
  }, []);

  const handleGenerateReport = async (reportData) => {
    // Ajouter un nouveau rapport à la liste une fois qu'il est généré
    if (createItem(API_URL + "/rapports/", reportData)) {
      const fetchRapports = async () => {
        try {
          const data = await fetchData(API_URL + "/rapports/list"); // Assurez-vous que cette URL correspond à votre API Django
          console.log(data);
          setRapports(data);
        } catch (error) {
          console.error("Erreur lors de la récupération des rapports:", error);
        }
      };
  
      fetchRapports();
    }
  };

  return (
    <div className="rapport-container">
      <div className="rapport-header">
        <h2>Liste des Rapports</h2>
        <button
          className="generate-button"
          onClick={() => setIsPopupOpen(true)}
        >
          Générer un Nouveau Rapport
        </button>
      </div>
      <ul className="rapport-list">
        {rapports.map((rapport, index) => (
          <li key={index} className="rapport-item">
            <a href={rapport.url} className="rapport-link" download>
              {rapport.filename}
            </a>
          </li>
        ))}
      </ul>

      <GenerateReportPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleGenerateReport}
      />
    </div>
  );
};

export default Rapport;
