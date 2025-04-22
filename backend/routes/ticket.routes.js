import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
} from "../controllers/ticket.controller.js";
import { isAuthenticated } from "../config/passport.config.js";

const router = Router();

// Crear un ticket (requiere autenticación)
router.post("/", isAuthenticated, createTicket);

// Obtener todos los tickets (solo admin)
router.get("/", isAuthenticated, getAllTickets);

// Obtener tickets del usuario autenticado
router.get("/my", isAuthenticated, getMyTickets);

// Obtener un ticket por ID (requiere autenticación)
router.get("/:tid", isAuthenticated, getTicketById);

export default router;
