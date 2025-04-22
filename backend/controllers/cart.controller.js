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
    const { bookId, quantity } = req.body;

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
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ book: bookId, quantity });
    }

    await cart.save();
    await cart.populate("products.book");

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
    await cart.populate("products.book");

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

    let totalAmount = 0;

    for (const item of cart.products) {
      const book = item.book;
      const quantity = item.quantity;

      if (
        !book ||
        typeof book.price !== "number" ||
        isNaN(book.price) ||
        book.price <= 0
      ) {
        return res.status(400).json({
          status: "error",
          message: `Precio inválido para el libro con ID ${book?._id}`,
        });
      }

      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          status: "error",
          message: `Cantidad inválida para el libro con ID ${book._id}`,
        });
      }

      if (quantity > book.stock) {
        return res.status(400).json({
          status: "error",
          message: `No hay suficiente stock para el libro "${book.title}". Stock disponible: ${book.stock}, solicitado: ${quantity}`,
        });
      }

      totalAmount += book.price * quantity;
    }

    for (const item of cart.products) {
      const book = item.book;
      book.stock -= item.quantity;
      await book.save();
    }

    const ticket = new Ticket({
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: req.user.email,
    });

    await ticket.save();

    cart.products = [];
    await cart.save();

    res.status(201).json({
      status: "success",
      message: "Compra realizada exitosamente",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};
