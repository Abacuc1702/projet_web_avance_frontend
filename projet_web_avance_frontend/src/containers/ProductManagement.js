import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../assets/css/ProductManagement.css';
import { createItem, deleteItem, fetchData, updateItem } from '../services/crudService';
import { PRODUCT_CATEGORY_URL, PRODUCT_TYPE_URL } from '../utils/endpoints';

const ProductManagement = () => {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ id: null, intitule: '', type: 'type' });
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ typeIntitule: '', categoryIntitule: '' });

  useEffect(() => {
    fetchTypes();
    fetchCategories();
  }, []);

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
    const url = formData.type === 'type' ? PRODUCT_TYPE_URL : PRODUCT_CATEGORY_URL;
    const dataList = formData.type === 'type' ? types : categories;
    const setDataList = formData.type === 'type' ? setTypes : setCategories;

    try {
      if (isEditing) {
        await updateItem(url, formData.id, formData);
        setDataList(dataList.map(item => item.id === formData.id ? { ...item, intitule: formData.intitule } : item));
        setIsEditing(false);
      } else {
        
        const data = await createItem(url, { intitule: formData.intitule })
        setDataList([...dataList, data]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }

    setFormData({ id: null, intitule: '', type: formData.type });
  };

  const handleEdit = (item, type) => {
    setFormData({ id: item.id, intitule: item.intitule, type });
    setIsEditing(true);
  };

  const handleDelete = async (id, type) => {
    const url = type === 'type' ? PRODUCT_TYPE_URL : PRODUCT_CATEGORY_URL;
    const dataList = type === 'type' ? types : categories;
    const setDataList = type === 'type' ? setTypes : setCategories;

    try {
      await deleteItem(url, id);
      setDataList(dataList.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredTypes = types.filter(type => type.intitule.toLowerCase().includes(filters.typeIntitule.toLowerCase()));
  const filteredCategories = categories.filter(category => category.intitule.toLowerCase().includes(filters.categoryIntitule.toLowerCase()));

  return (
    <div className="product-management-container">
      <h2>Gestion des Types et Catégories de Produits</h2>

      <form className="product-form" onSubmit={handleFormSubmit}>
        <h3>{isEditing ? 'Modifier' : 'Ajouter'} un {formData.type === 'type' ? 'Type' : 'Catégorie'}</h3>
        <select name="type" value={formData.type} onChange={handleInputChange}>
          <option value="type">Type</option>
          <option value="category">Catégorie</option>
        </select>
        <input
          type="text"
          name="intitule"
          placeholder="Intitulé"
          value={formData.intitule}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</button>
      </form>

      <div className="filter-container">
        <h3>Filtres</h3>
        <div className="filter-group">
          <input
            type="text"
            name="typeIntitule"
            placeholder="Filtrer par Type"
            value={filters.typeIntitule}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="categoryIntitule"
            placeholder="Filtrer par Catégorie"
            value={filters.categoryIntitule}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="data-table-container">
        <h3>Liste des Types</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Intitulé</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTypes.map(type => (
              <tr key={type.id}>
                <td>{type.id}</td>
                <td>{type.intitule}</td>
                <td>
                  <button onClick={() => handleEdit(type, 'type')}>Modifier</button>
                  <button onClick={() => handleDelete(type.id, 'type')}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Liste des Catégories</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Intitulé</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.intitule}</td>
                <td>
                  <button onClick={() => handleEdit(category, 'category')}>Modifier</button>
                  <button onClick={() => handleDelete(category.id, 'category')}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
