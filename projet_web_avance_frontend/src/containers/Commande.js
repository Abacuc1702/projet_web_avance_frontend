import React, { useState } from "react";
import PropTypes from "prop-types";
import '../assets/css/Commande.css';

// Composant PopupCommande
const Commande = ({ isOpen, onClose, commande }) => {
  console.log(commande);
  const [statut, setStatut] = useState(commande.statut);

  const handleStatutChange = (event) => {
    setStatut(event.target.value);
  };

  const handleSubmit = () => {
    // Logique pour mettre à jour le statut de la commande
    console.log(`Nouveau statut: ${statut}`);
    // Fermer le popup après soumission
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Détails de la commande</h2>
        <div className="client-info">
          <h3>Informations sur le client</h3>
          <p>
            <strong>Nom:</strong> {commande.client.nom}
          </p>
          <p>
            <strong>Email:</strong> {commande.client.email}
          </p>
          <p>
            <strong>Téléphone:</strong> {commande.client.telephone}
          </p>
        </div>
        <div className="commande-info">
          <h3>Détails de la commande</h3>
          <p>
            <strong>ID:</strong> {commande.id}
          </p>
          <p>
            <strong>Date:</strong> {commande.date}
          </p>
        </div>
        <div className="produits-info">
          <h3>Produits commandés</h3>
          <ul>
            {commande["produits commandes"].map((produit) => (
              <li key={produit.id}>
                {produit.nom} - {produit.quantite} x {produit.prix} €
              </li>
            ))}
          </ul>
        </div>
        <div className="statut-change">
          <h3>Changer le statut</h3>
          <select value={statut} onChange={handleStatutChange}>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Complété">Complété</option>
            <option value="Annulé">Annulé</option>
          </select>
          <button onClick={handleSubmit}>Mettre à jour</button>
        </div>
      </div>
    </div>
  );
};

Commande.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commande: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    client: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      telephone: PropTypes.string.isRequired,
    }).isRequired,
    produits: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        nom: PropTypes.string.isRequired,
        quantite: PropTypes.number.isRequired,
        prix: PropTypes.number.isRequired,
      })
    ).isRequired,
    statut: PropTypes.string.isRequired,
  }).isRequired,
};

export default Commande;
