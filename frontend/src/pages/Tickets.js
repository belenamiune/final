import React, { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Tickets() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await api.get("/tickets/my");
      setTickets(res.data.tickets);
    };
    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Mis tickets</h2>
      {tickets.map((ticket) => (
        <div key={ticket._id}>
          Código: {ticket.code} - Monto: ${ticket.amount} - Fecha:{" "}
          {new Date(ticket.purchase_datetime).toLocaleString()}
        </div>
      ))}
    </div>
  );
}
