import './../assets/css/Base.css';
import React, { useState } from 'react';
import Sidebar from './../components/Sidebar';
import Header from '../components/Header';
import Dashboard from './../components/Dashboard';
import Utilisateurs from './Utilisateurs';
import Orders from './Orders';
import Stock from './Stock';
import Reapprovisionnement from './Reapprovisionnemnt';
import ProductManagement from './ProductManagement';
import Rapport from './Rapport';

const Base = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Utilisateurs':
        return <Utilisateurs />;
      case 'Stock':
        return <Stock />;
      case 'Reapprovisionnement':
        return <Reapprovisionnement />;
      case 'Categories':
        return <ProductManagement />;
      case 'Orders':
        return <Orders />;
      case 'Reports':
        return <Rapport />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <Header />
      <div className="app-container">
        <Sidebar setActiveSection={setActiveSection} />
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Base;
