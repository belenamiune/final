import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/users/register", form);
      alert("¡Usuario registrado con éxito!");
      const user = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("cartId", res.data.cartId);
      localStorage.setItem("userId", res.data.id);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="role"
          placeholder="Role: user o admin"
          value={form.role}
          onChange={handleChange}
          required
          className="input"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
