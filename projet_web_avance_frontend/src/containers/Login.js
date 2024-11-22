import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import './../assets/css/Login.css';
import { login } from './../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Initialisez useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Veuillez saisir votre nom d\'utilisateur';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const data = await login(formData.username, formData.password);
        // console.log('Login successful:', data);
        
        // Enregistrez le token dans le localStorage
        localStorage.setItem('token', data.token);
        
        // Redirigez l'utilisateur vers le tableau de bord
        navigate('/user-space');
      } catch (error) {
        console.error('Login failed:', error);
        setErrors({ ...errors, general: 'Informations incorrectes' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && <p className="error-text">{errors.general}</p>}
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              placeholder="Entrez votre nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error-input' : ''}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error-input' : ''}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion en cours...' : 'Connexion'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
