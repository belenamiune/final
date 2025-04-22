import React, { useState, useEffect } from "react";
import api from "../services/api";

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
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tickets-page">
      <h2>Mis Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tienes tickets.</p>
      ) : (
        <div>
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket">
              <h3>Ticket {ticket.code}</h3>
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

              <h4>Productos Comprados:</h4>
              <ul>
                {ticket.products.map((item, index) => (
                  <li key={index}>
                    <p>
                      <strong>{item.productId.title}</strong> — {item.quantity}{" "}
                      unidades
                    </p>
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
