import Ticket from "../models/ticket.model.js";

export default class TicketDAO {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getAll() {
    return await Ticket.find();
  }

  async getById(id) {
    return await Ticket.findById(id);
  }
}
