import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./Tickets.css";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("tickets/my");
        setTickets(response.data.tickets);
      } catch (err) {
        setError("No se pudieron cargar los tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (error) {
    return <div className="message error">{error}</div>;
  }

  if (loading) {
    return <div className="message loading">Cargando...</div>;
  }

  return (
    <div className="tickets-page">
      <h2 className="page-title">Mis Tickets</h2>
      {tickets.length === 0 ? (
        <p className="no-tickets">No tienes tickets.</p>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <h3 className="ticket-code">Ticket {ticket.code}</h3>
              <p>
                <strong>Fecha de compra:</strong>{" "}
                {new Date(ticket.purchase_datetime).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> ${ticket.amount}
              </p>
              <p>
                <strong>Comprador:</strong> {ticket.purchaser}
              </p>

              <h4 className="products-title">Productos Comprados:</h4>
              <ul className="product-list">
                {ticket.products.map((item, index) => (
                  <li key={index} className="product-item">
                    <strong>{item.productId.title}</strong> — {item.quantity}{" "}
                    unidades
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
