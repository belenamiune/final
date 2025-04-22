import { Router } from "express";
import {
  createCart,
  getCartByUser,
  addBookToCart,
  removeBookFromCart,
  purchaseCart,
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../config/passport.config.js";

const router = Router();

// Crear un carrito
router.post("/", isAuthenticated, createCart);

// Obtener el carrito del usuario
router.get("/", isAuthenticated, getCartByUser);

// Agregar libro al carrito
router.post("/add", isAuthenticated, addBookToCart);

// Eliminar libro del carrito
router.delete("/remove/:bookId", isAuthenticated, removeBookFromCart);

// Finalizar compra
router.post("/purchase", isAuthenticated, purchaseCart);

export default router;
