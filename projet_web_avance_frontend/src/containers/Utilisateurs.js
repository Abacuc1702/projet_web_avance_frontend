import React, { useState, useEffect } from 'react';
import './../assets/css/Utilisateurs.css';
import { user_create, user_delete, user_update, users_list } from '../services/usersService';

const Utilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(''); // État pour le filtre
  const [filteredUsers, setFilteredUsers] = useState([]); // État pour stocker les utilisateurs filtrés
  const [formData, setFormData] = useState({ id: null, username: '', first_name: '', last_name: '', email: '', password:'', phone_number:'', user_type: 'client' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await users_list();
        setUsers(data);
        setFilteredUsers(data); // Initialiser les utilisateurs filtrés avec tous les utilisateurs
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };

    fetchUsers();
  }, []);

  // Appliquer le filtre lorsque le texte du filtre change
  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(filter.toLowerCase()) ||
        user.username.toLowerCase().includes(filter.toLowerCase()) ||
        user.user_type.toLowerCase().includes(filter.toLowerCase()) ||
        user.phone_number.includes(filter)
      )
    );
  }, [filter, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try{
    if (isEditing) {
      const data = await user_update(formData.id, formData);
      setUsers(users.map(user => user.id === formData.id ? formData : user));
      setIsEditing(false);
    } else {
      const data = await user_create(formData);
      setUsers([...users, { ...data, id: data.id }]);
    }

    setFormData({ id: null, name: '', email: '', role: 'User' });
          
  }catch(e){
    alert("Une erreur s'est produite");
  }
  };

  const handleEditUser = (user) => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleDeleteUser = async (id) => {
    try{
      const data = await user_delete(id)
      setUsers(users.filter(user => user.id !== id));
    }catch(error){
      alert("Une erreur s'est produite")
    }
    
  };

  return (
    <div className="user-management-container">
      <h2>Gestion des utilisateurs</h2>

      {/* Champ de filtrage */}
      <input
        type="text"
        placeholder="Filtrer les utilisateurs..."
        value={filter}
        onChange={handleFilterChange}
        className="filter-input"
      />

      <form className="user-form" onSubmit={handleFormSubmit}>
        <h3>{isEditing ? 'Modifier l’utilisateur' : 'Ajouter un nouvel utilisateur'}</h3>
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="Prenoms"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Nom"
          value={formData.last_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Numéro de téléphone"
          value={formData.phone_number}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleInputChange}
        />
        <select name="user_type" value={formData.role} onChange={handleInputChange}>
          <option value="Client">Client</option>
          <option value="Gerant">Gérant</option>
        </select>
        <button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</button>
      </form>

      <div className="user-table-container">
        <h3>Liste des utilisateurs</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Username</th>
              <th>Rôle</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.username}</td>
                <td>{user.user_type}</td>
                <td>{user.phone_number}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>Modifier</button>
                  <button onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Utilisateurs;
