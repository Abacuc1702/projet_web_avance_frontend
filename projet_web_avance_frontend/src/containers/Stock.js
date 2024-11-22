import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../assets/css/Stock.css';
import { fetchData, createItem, updateItem, deleteItem } from '../services/crudService';
import { PRODUCT_URL, PRODUCT_TYPE_URL, PRODUCT_CATEGORY_URL } from '../utils/endpoints';
import { FaExclamationTriangle } from 'react-icons/fa'; // Import de l'icône d'alerte

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    quantite: '',
    cout_unitaire: '',
    description: '',
    type_produit_id: '',
    categorie_produit_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchTypes();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await fetchData(PRODUCT_URL);
      setProducts(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  };

  const fetchTypes = async () => {
    try {
      const data = await fetchData(PRODUCT_TYPE_URL);
      setTypes(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des types:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await fetchData(PRODUCT_CATEGORY_URL);
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateItem(`${PRODUCT_URL}/${formData.id}/`, formData);
        setProducts(products.map(product => product.id === formData.id ? { ...product, ...formData } : product));
        setIsEditing(false);
      } else {
        const newProduct = await createItem(PRODUCT_URL, formData);
        setProducts([...products, newProduct]);
      }
      setFormData({
        id: null,
        nom: '',
        quantite: '',
        cout_unitaire: '',
        description: '',
        type_produit_id: '',
        categorie_produit_id: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      nom: product.nom,
      quantite: product.quantite,
      cout_unitaire: product.cout_unitaire,
      description: product.description,
      type_produit_id: product.type_produit.id,
      categorie_produit_id: product.categorie_produit.id
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(PRODUCT_URL, id);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredProducts = products.filter(product =>
    (filters.type ? product.type_produit.id === parseInt(filters.type) : true) &&
    (filters.category ? product.categorie_produit.id === parseInt(filters.category) : true)
  );

  return (
    <div className="stock-management-container">
      <h2>Gestion du stock</h2>

      <form className="product-form" onSubmit={handleFormSubmit}>
        <h3>{isEditing ? 'Modifier' : 'Ajouter'} un produit</h3>
        <input
          type="text"
          name="nom"
          placeholder="Nom du produit"
          value={formData.nom}
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
        <input
          type="number"
          name="cout_unitaire"
          placeholder="Prix unitaire"
          value={formData.cout_unitaire}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description du produit"
          value={formData.description}
          onChange={handleInputChange}
        />
        <select
          name="type_produit_id"
          value={formData.type_produit_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Sélectionnez le type de produit</option>
          {types.map(type => (
            <option key={type.id} value={type.id}>{type.intitule}</option>
          ))}
        </select>
        <select
          name="categorie_produit_id"
          value={formData.categorie_produit_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Sélectionnez la catégorie de produit</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.intitule}</option>
          ))}
        </select>
        <button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</button>
      </form>

      <div className="filter-container">
        <h3>Filtres</h3>
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">Filtrer par type</option>
          {types.map(type => (
            <option key={type.id} value={type.id}>{type.intitule}</option>
          ))}
        </select>
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">Filtrer par catégorie</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.intitule}</option>
          ))}
        </select>
      </div>

      <div className="product-table-container">
        <h3>Liste des produits</h3>
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Quantité</th>
              <th>Prix Unitaire</th>
              <th>Description</th>
              <th>Type</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.nom}</td>
                <td>
                  {product.quantite}
                  {product.quantite <= 5 && <FaExclamationTriangle className="alert-icon" />}
                </td>
                <td>{product.cout_unitaire}</td>
                <td>{product.description}</td>
                <td>{product.type_produit.intitule}</td>
                <td>{product.categorie_produit.intitule}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Modifier</button>
                  <button onClick={() => handleDelete(product.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
