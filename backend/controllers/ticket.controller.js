import Ticket from "../models/ticket.model.js";
import nodemailer from "nodemailer";

export const createTicket = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ message: "El ticket debe contener productos." });
    }

    const newTicket = new Ticket({
      userId: req.user.id,
      products,
      status: "pendiente",
    });

    const savedTicket = await newTicket.save();

    await sendPurchaseConfirmation(savedTicket);

    res.status(201).json({ ticket: savedTicket });
  } catch (error) {
    next(error);
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().populate("products.productId");
    res.status(200).json({ tickets });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id }).populate(
      "products.productId"
    );
    res.status(200).json({ tickets });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const { tid } = req.params;

    const ticket = await Ticket.findById(tid).populate("products.productId");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    next(error);
  }
};

const sendPurchaseConfirmation = async (ticket) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ticket.userId.email,
      subject: "Confirmación de Compra",
      text: `Hola ${
        ticket.userId.first_name
      },\n\nTu compra ha sido registrada con éxito. El número de tu ticket es ${
        ticket._id
      }. Aquí están los productos comprados:\n\n${ticket.products
        .map(
          (product) =>
            `${product.productId.name} - ${product.quantity} x $${product.productId.price}`
        )
        .join("\n")}\n\nGracias por tu compra.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de confirmación:", error);
  }
};
