import axios from "axios";
import { USER_CREATE_URL, USER_LIST_URL, USER_URL } from "../utils/endpoints";

export const users_list = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const headers = {
      Authorization: `Token ${token}`,
    };

    const response = await axios.get(USER_LIST_URL, { headers });

    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des utilisateurs:",
      error
    );
    throw error;
  }
};

export const user_update = async (id, data) => {
  const USER_UPDATE_URL = USER_URL + id + "/update/";
  console.log(USER_UPDATE_URL);
  try {
    const token = localStorage.getItem("token");

    console.log(token);

    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const headers = {
      Authorization: `Token ${token}`,
    };

    const response = await axios.patch(USER_UPDATE_URL, data, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la modification de l'utilisateur",
      error,
    );
    throw error;
  }
};

export const user_delete = async (id) => {
  const USER_DELETE_URL = USER_URL + id + "/delete/";

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const headers = {
      Authorization: `Token ${token}`,
    };

    const response = await axios.delete(USER_DELETE_URL, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'utilisateur",
      error
    );
    throw error;
  }
};

export const user_create = async (data) => {
    try {
      const token = localStorage.getItem("token");
     console.log("Token: " + token);
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }
  
      const headers = {
        Authorization: `Token ${token}`,
      };
  
      const response = await axios.post(USER_CREATE_URL, data, { headers });
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'utilisateur",
        error,

      );
      throw error;
    }
;}
