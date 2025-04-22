import Cart from "../models/cart.model.js";
import Book from "../models/book.model.js";
import { v4 as uuidv4 } from "uuid";
import Ticket from "../models/ticket.model.js";

export const createCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const existingCart = await Cart.findOne({ user: userId });

    if (existingCart) {
      return res
        .status(400)
        .json({ status: "error", message: "El usuario ya tiene un carrito." });
    }

    const cart = new Cart({ user: userId, products: [] });
    await cart.save();

    res
      .status(201)
      .json({ status: "success", message: "Carrito creado", cart });
  } catch (error) {
    next(error);
  }
};

export const getCartByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("products.book");

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    res.json({ status: "success", cart });
  } catch (error) {
    next(error);
  }
};

export const addBookToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bookId, stock } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Libro no encontrado" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.book.toString() === bookId
    );

    if (productIndex >= 0) {
      cart.products[productIndex].stock += stock;
    } else {
      cart.products.push({ book: bookId, stock });
    }

    await cart.save();
    res.json({
      status: "success",
      message: "Producto agregado al carrito",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeBookFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter((p) => p.book.toString() !== bookId);
    await cart.save();

    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const purchaseCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("products.book");

    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Carrito vacío o no encontrado" });
    }

    const totalAmount = cart.products.reduce((acc, item) => {
      const price = item.book.price;
      const stock = item.stock;

      // Verificar si el precio y la cantidad son números válidos
      if (isNaN(price) || price <= 0) {
        console.log("Precio inválido para el libro", item.book._id);
        return acc; // No sumar este libro
      }

      if (isNaN(stock) || stock <= 0) {
        console.log("Cantidad inválida para el libro", item.book._id);
        return acc; // No sumar este libro
      }

      return acc + price * stock;
    }, 0);

    // Validar que el totalAmount sea un número válido y mayor que 0
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        status: "error",
        message: "El monto de la compra es inválido",
      });
    }

    const ticket = new Ticket({
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: req.user.email,
    });

    await ticket.save();

    // Vaciar el carrito después de la compra
    cart.products = [];
    await cart.save();

    res
      .status(201)
      .json({ status: "success", message: "Compra realizada", ticket });
  } catch (error) {
    next(error);
  }
};
