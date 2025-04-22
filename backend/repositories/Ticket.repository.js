import TicketDAO from "../dao/Ticket.dao.js";

const ticketDAO = new TicketDAO();

export default class TicketRepository {
  async createTicket(data) {
    return await ticketDAO.create(data);
  }

  async getTicketById(id) {
    return await ticketDAO.getById(id);
  }

  async getAllTickets() {
    return await ticketDAO.getAll();
  }
}
