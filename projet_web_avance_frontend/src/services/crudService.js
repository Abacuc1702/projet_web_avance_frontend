import axios from 'axios';

// Fonction utilitaire pour récupérer le token d'authentification
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("Token d'authentification manquant");
  }
  return token;
};

// Fonction générique pour récupérer les données (GET)
export const fetchData = async (endpoint) => {
  try {
    const token = getAuthToken();
    const headers = {
      Authorization: `Token ${token}`,
    };
    const response = await axios.get(`${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données (${endpoint}):`, error);
    throw error;
  }
};

// Fonction générique pour créer un nouvel élément (POST)
export const createItem = async (endpoint, data) => {
  try {
    const token = getAuthToken();
    const headers = {
      Authorization: `Token ${token}`,
    };
    const response = await axios.post(`${endpoint}`, data, { headers });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la création de l'élément (${endpoint}):`, error);
    throw error;
  }
};

// Fonction générique pour mettre à jour un élément existant (PUT)
export const updateItem = async (endpoint, id, data) => {
  try {
    const token = getAuthToken();
    const headers = {
      Authorization: `Token ${token}`,
    };
    const response = await axios.patch(`${endpoint}${id}/`, data, { headers });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'élément (${endpoint}):`, error);
    throw error;
  }
};

// Fonction générique pour supprimer un élément (DELETE)
export const deleteItem = async (endpoint, id) => {
  try {
    const token = getAuthToken();
    const headers = {
      Authorization: `Token ${token}`,
    };
    await axios.delete(`${endpoint}${id}/`, { headers });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'élément (${endpoint}):`, error);
    throw error;
  }
};
