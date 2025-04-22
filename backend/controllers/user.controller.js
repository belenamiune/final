import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../services/mailer.service.js";

dotenv.config();

export const registerUser = async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "user";

    const newCart = await Cart.create({ products: [] });

    const newUser = new User({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      role: userRole,
      cartId: newCart._id,
    });

    await newUser.save();

    await sendEmail(
      newUser.email,
      "¡Bienvenido a Bookstore! 📚",
      `<h2>Hola ${newUser.first_name}!</h2>
         <p>Gracias por registrarte en nuestra tienda de libros. ¡Esperamos que encuentres historias increíbles!</p>`
    );

    res.status(201).json({
      message: "Usuario registrado con éxito",
      cartId: newUser.cartId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        cartId: user.cartId,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const currentUser = {
      id: user._id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    res.json(currentUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la información del usuario", error });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.role = user.role === "user" ? "admin" : "user";
    await user.save();

    res.json({ message: `Rol cambiado a ${user.role}` });
  } catch (error) {
    console.error("Error al cambiar el rol:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
