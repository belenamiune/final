import React, { useState } from "react";
import api from "../services/api";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/users/register", form);
      alert("¡Usuario registrado con éxito!");
      const user = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("cartId", res.data.cartId);
      localStorage.setItem("userId", res.data.id);
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Nombre:
          <input
            name="name"
            placeholder="Tu nombre"
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            name="email"
            type="email"
            placeholder="tu@email.com"
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña:
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Rol (user o admin):
          <input
            name="role"
            placeholder="user o admin"
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Registrarse</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
