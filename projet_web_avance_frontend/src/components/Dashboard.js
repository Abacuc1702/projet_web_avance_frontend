import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import "./../assets/css/Dashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { fetchData } from "../services/crudService";
import { PRODUCT_URL, REAPPROVISIONNEMENT_URL, COMMANDE_URL } from "../utils/endpoints";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

let produits = []; // Définition globale

const Dashboard = () => {
  const [stockData, setStockData] = useState({ labels: [], datasets: [] });
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] });
  const [popularProductsData, setPopularProductsData] = useState({
    labels: [],
    datasets: [],
  });
  const [replenishments, setReplenishments] = useState([]);

  useEffect(() => {
    // Fetching data from the API
    fetchData(PRODUCT_URL).then((data) => {
      produits = data || []; // Initialisation de la variable globale
      const labels = produits.map((p) => p.nom || "Inconnu");
      const stockValues = produits.map((p) => p.quantite || 0);

      setStockData({
        labels: labels,
        datasets: [
          {
            label: "Quantité en Stock",
            data: stockValues,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      });
    });

    fetchData(REAPPROVISIONNEMENT_URL).then((response) => {
      setReplenishments(response);
    });

    fetchData(COMMANDE_URL).then((data) => {
      console.log('Données de commandes:', data); // Debugging
      const commandesParMois = Array(12).fill(0);
    
      data.forEach((commande) => {
        const commandeDate = new Date(commande.date_commande);
        commandesParMois[commandeDate.getMonth()] += 1;
      });
    
      setSalesData({
        labels: [
          "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ],
        datasets: [
          {
            label: "Commandes Mensuelles",
            data: commandesParMois,
            backgroundColor: "rgba(75,192,192,0.6)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      });

      // Produits les plus commandés
      const produitsCount = {};
      data.forEach((commande) => {
        commande["produits commandes"].forEach((produit) => {
          console.log(produit["produit"]);
          if (produitsCount[produit["produit"].nom]) {
            produitsCount[produit["produit"].nom] += produit.quantite;
          } else {
            produitsCount[produit["produit"].nom] = produit.quantite;
          }
        });
      });
      console.log(produitsCount);
      const produitsTries = Object.entries(produitsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Les 5 produits les plus commandés

      setPopularProductsData({
        labels: produitsTries.map(([nom]) => nom),
        datasets: [
          {
            data: produitsTries.map(([, quantite]) => quantite),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF5733",
              "#C70039",
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF5733",
              "#C70039",
            ],
          },
        ],
      });
    });

    // Similar API calls can be made for salesData and popularProductsData
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Tableau de Bord</h2>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Stock Total</h3>
          <Bar data={stockData} />
        </div>

        <div className="card">
          <h3>Commandes Mensuelles</h3>
          <Line data={salesData} />
        </div>

        <div className="card">
          <h3>Produits les Plus Commandés</h3>
          <Pie data={popularProductsData} />
        </div>

        <div className="card">
          <h3>Réapprovisionnements Récents</h3>
          <ul className="replenishments-list">
            {replenishments.length > 0 ? (
              replenishments
                .slice()
                .reverse()
                .map((replenishment, index) => (
                  <li key={index}>
                    {produits.find(
                      (product) => product.id === replenishment.produit_id
                    )?.nom + " " || "Produit inconnu"}
                    {replenishment.quantite} unités
                    {" " + replenishment.date_reapprovisionnement}
                  </li>
                ))
            ) : (
              <p>Chargement des données...</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
