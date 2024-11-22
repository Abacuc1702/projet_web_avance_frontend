import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../assets/css/Reapprovisionnement.css';
import {createItem, deleteItem, fetchData, updateItem} from '../services/crudService';
import { PRODUCT_URL, REAPPROVISIONNEMENT_URL } from '../utils/endpoints';
const Reapprovisionnement = () => {
  const [replenishments, setReplenishments] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    produit_id: '',
    date_reapprovisionnement: '',
    fournisseur: '',
    prix_unitaire: '',
    quantite: '',
    prix_total: ''
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchReplenishments();
    fetchProducts();
  }, []);

  const fetchReplenishments = async () => {
    try {
      const data = await fetchData(REAPPROVISIONNEMENT_URL);
      setReplenishments(data);
    } catch (error) {
      console.error('Error fetching reapprovisionnements:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await fetchData(PRODUCT_URL);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateItem(REAPPROVISIONNEMENT_URL, formData.id, formData);
      } else {
        await createItem(REAPPROVISIONNEMENT_URL, formData);
      }
      fetchReplenishments();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (replenishment) => {
    setFormData({
      id: replenishment.id,
      produit_id: replenishment.produit_id,
      date_reapprovisionnement: replenishment.date_reapprovisionnement,
      fournisseur: replenishment.fournisseur,
      prix_unitaire: replenishment.prix_unitaire,
      quantite: replenishment.quantite,
      prix_total: replenishment.prix_total
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(REAPPROVISIONNEMENT_URL, id);
      fetchReplenishments();
    } catch (error) {
      console.error('Error deleting reapprovisionnement:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      produit_id: '',
      date_reapprovisionnement: '',
      fournisseur: '',
      prix_unitaire: '',
      quantite: '',
      prix_total: ''
    });
    setEditMode(false);
  };

  return (
    <div className="replenishment-management-container">
      <h2>Gestion des réapprovisionnements</h2>

      <form className="replenishment-form" onSubmit={handleFormSubmit}>
        <h3>{editMode ? 'Modifier un réapprovisionnement' : 'Ajouter un nouveau réapprovisionnement'}</h3>
        <select
          name="produit_id"
          value={formData.produit_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Sélectionner un produit</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.nom}</option>
          ))}
        </select>
        <input
          type="date"
          name="date_reapprovisionnement"
          placeholder="Date"
          value={formData.date_reapprovisionnement}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="fournisseur"
          placeholder="Nom du fournisseur"
          value={formData.fournisseur}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="prix_unitaire"
          placeholder="Prix unitaire"
          value={formData.prix_unitaire}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="quantite"
          placeholder="Quantité"
          value={formData.quantite}
          onChange={handleInputChange}
          required
        />
        {/* <input
          type="number"
          name="prix_total"
          placeholder="Prix total"
          value={formData.prix_total}
          onChange={handleInputChange}
          required
        /> */}
        <button type="submit">{editMode ? 'Modifier' : 'Ajouter'}</button>
        {editMode && <button type="button" onClick={resetForm}>Annuler</button>}
      </form>

      <div className="replenishment-table-container">
        <h3>Liste des réapprovisionnements</h3>
        <table className="replenishment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produit</th>
              <th>Date</th>
              <th>Fournisseur</th>
              <th>Prix Unitaire</th>
              <th>Quantité</th>
              <th>Prix Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {replenishments.map(replenishment => (
              <tr key={replenishment.id}>
                <td>{replenishment.id}</td>
                <td>{products.find(product => product.id === replenishment.produit_id)?.nom || 'Produit inconnu'}</td>
                <td>{replenishment.date_reapprovisionnement}</td>
                <td>{replenishment.fournisseur}</td>
                <td>{replenishment.prix_unitaire}</td>
                <td>{replenishment.quantite}</td>
                <td>{replenishment.prix_total}</td>
                <td>
                  <button onClick={() => handleEdit(replenishment)}>Modifier</button>
                  <button onClick={() => handleDelete(replenishment.id)}>Supprimer</button>
                </td>
              </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reapprovisionnement;
