import React, { useState, useEffect } from "react";
import axios from "axios"; // Import d'axios pour les appels API
import Select, { createFilter } from "react-select"; // Import de react-select pour la sélection de produits
import "./../assets/css/Orders.css";
import Commande from "./Commande"; // Import du composant PopupCommande
import { createItem, fetchData } from "../services/crudService";
import { USER_LIST_URL, PRODUCT_URL, USER_CREATE_URL, COMMANDE_URL } from "../utils/endpoints";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]); // Pour stocker la liste des clients
  const [products, setProducts] = useState([]); // Pour stocker la liste des produits
  const [selectedClient, setSelectedClient] = useState(null); // Pour gérer le client sélectionné
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    products: [{ produit_id: "", quantite: 1, cout_unitaire: 0, cout_total: 0 , nom:''}],
    status: "pending",
    date: "",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchClients(); // Récupérer les clients lors du chargement du composant
    fetchProducts(); // Récupérer la liste des produits
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await fetchData(COMMANDE_URL); // Remplacez par l'URL correcte
      setOrders(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes", error);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await fetchData(USER_LIST_URL); // Remplacez par l'URL correcte pour les clients
      setClients(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await fetchData(PRODUCT_URL); // Remplacez par l'URL correcte pour les produits
      setProducts(
        data.map((product) => ({
         id: product.id,
          nom: product.nom,
          cout_unitaire: product.cout_unitaire,
          quantite: product.quantite,
        }))
      );

    } catch (error) {
      console.error("Erreur lors de la récupération des produits", error);
    }
  };

  // Filtrer les options de produits pour exclure les produits déjà sélectionnés
  const availableProductOptions = products.filter(product => 
    !formData.products.some(selectedProduct => selectedProduct.id === product.id)
  ).map(product => ({
    value: product.id,
    label: product.nom,
    cout_unitaire: product.cout_unitaire,
    quantite: product.quantite,
  }));

  const handleInputChange = (e, index = null, product = null) => {
    // console.log(product);
    // console.log(e);
    // const { name, value } = e.target;
    if (product) {
      // Lorsqu'un produit est sélectionnéa
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        produit_id: product.value,
        label: product.nom,
        cout_unitaire: product.cout_unitaire,
        cout_total: product.cout_unitaire * updatedProducts[index].quantit,
      };
      setFormData({ ...formData, products: updatedProducts });
    } else if(e){
      const { name, value } = e.target;
      console.log(name, value);
     if (name === "quantity") {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantite: value,
        cout_total: value * updatedProducts[index].cout_unitaire,
      };
      setFormData({ ...formData, products: updatedProducts });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { produit_id: "", quantite: 1, cout_unitaire: 0, cout_total: 0 },
      ],
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const calculateOrderTotalCost = () => {
    return formData.products.reduce(
      (total, product) => total + product.cout_total,
      0
    );
  };

  const handleClientSelection = (e) => {
    const clientId = e.target.value;
    if (clientId === "new") {
      setSelectedClient(null);
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        products: [{ id: "", quantity: 1, price: 0, totalCost: 0 }],
        status: "pending",
        date: "",
      });
    } else {
      const client = clients.find((c) => c.id === parseInt(clientId));
      setSelectedClient(client);
      setFormData({
        customerName: client.name,
        customerEmail: client.email,
        customerPhone: client.phone,
        products: [{ id: "", quantite: 1, cout_unitaire: 0, cout_total: 0 }],
        status: "pending",
        date: "",
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let customerId = selectedClient ? selectedClient.id : null;

    if (!customerId) {
      // Si aucun client n'est sélectionné, créer un nouveau client
      try {
        const clientResponse = await createItem(USER_CREATE_URL, {
          first_name: formData.customerName,
          last_name: formData.customerName,
          email: formData.customerEmail,
          phone_number: formData.customerPhone,
          username: formData.customerName+"0"+formData.customerPhone,
          password: formData.customerPhone+"1702",
          user_type:"client",
        });
        customerId = clientResponse.id;
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du client", error);
        return;
      }
    }

    const newOrder = {
      // ...formData,
      user: customerId,
      cout_total: calculateOrderTotalCost(),
      date: new Date(formData.date).toISOString().split("T")[0],
      produits: formData.products,
    };
    console.log(newOrder);
    try {
      const data = await createItem(COMMANDE_URL, newOrder); // Remplacez par l'URL correcte
      setOrders([...orders, data]);
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        products: [{ id: "", quantite: 1, cout_unitaire: 0, cout_total: 0 }],
        statut: "pending",
        date: "",
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la commande", error);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (filter === "all" ||
        order.statut.toLowerCase() === filter.toLowerCase()) //&&
      // (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
      // (filter === "all" || order.date.includes(searchTerm))
  );

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="orders-container">
      <h2>Gestion des commandes</h2>

      <button
        className="toggle-form-button"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        {isFormVisible
          ? "Cacher le formulaire"
          : "Ajouter une nouvelle commande"}
      </button>

      {isFormVisible && (
        <form className="order-form" onSubmit={handleFormSubmit}>
          <h3>Enregistrer une nouvelle commande</h3>

          <select onChange={handleClientSelection}>
            <option value="">Sélectionnez un client existant</option>
            <option value="new">Nouveau client</option>
            {clients
              .filter((client) => client.user_type === "client")
              .map((client) => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name}
                </option>
              ))}
          </select>

          {!selectedClient && (
            <>
              <input
                type="text"
                name="customerName"
                placeholder="Nom du client"
                value={formData.customerName}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="customerEmail"
                placeholder="Email du client"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="customerPhone"
                placeholder="Téléphone du client"
                value={formData.customerPhone}
                onChange={handleInputChange}
                required
              />
            </>
          )}

          {formData.products.map((product, index) => (
            <div key={index} className="product-selection">
              <Select
                options={availableProductOptions} 
                onChange={(selectedProduct) => handleInputChange(null, index, selectedProduct)}
                value={availableProductOptions.find(option => option.value === product.id)} 
                required
              />
              <input
                type="number"
                name="quantity"
                // value={product.quantite}
                onChange={(e) => handleInputChange(e, index)}
                min="1"
                max={product.quantite} // Définir la quantité maximale
                placeholder="Quantité"
              />
              <span className="product-price">
                Prix: {parseFloat(product.cout_unitaire).toFixed(2)} XOF
              </span>
              <span className="product-total-cost">
                Coût Total: {parseFloat(product.cout_total).toFixed(2)} XOF
              </span>
              {formData.products.length > 1 && (
                <button
                  type="button"
                  className="remove-product-button"
                  onClick={() => handleRemoveProduct(index)}
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="add-product-button"
            onClick={handleAddProduct}
          >
            Ajouter un produit
          </button>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />

          <button type="submit" className="submit-order-button">
            Enregistrer la commande
          </button>
        </form>
      )}

      <div className="orders-filter">
        <input
          type="text"
          placeholder="Rechercher une commande"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Toutes les commandes</option>
          <option value="pending">En attente</option>
          <option value="shipped">Expédiée</option>
          <option value="completed">Complétée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Statut</th>
            <th>Coût total</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} onClick={() => handleOrderClick(order)}>
              <td>{order.date_commande}</td>
              <td>{order.customerName}</td>
              <td>{order.statut}</td>
              <td>{order.cout_total.toFixed(2)} XOF</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && selectedOrder && (
        <Commande isOpen={true} commande={selectedOrder} onClose={closePopup} />
      )}
    </div>
  );
};

export default Orders;



