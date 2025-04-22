import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminPanel() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
  });
  const [message, setMessage] = useState("");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/book");
      setBooks(res.data);
    } catch (err) {
      console.error("Error cargando libros", err);
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/book", form);
      setForm({ title: "", author: "", price: "", stock: "" });
      setMessage("📚 ¡Libro creado con éxito!");
      fetchBooks();
    } catch (err) {
      setMessage("❌ Error al crear el libro");
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await api.delete(`/book/${bookId}`);
      setMessage("🗑️ Libro eliminado");
      fetchBooks();
    } catch (err) {
      setMessage("❌ Error al eliminar libro");
    }
  };

  const handleUpdateBook = async (book) => {
    const newTitle = prompt("Nuevo título:", book.title);
    if (!newTitle || newTitle.trim() === "") return;

    try {
      await api.put(`/book/${book._id}`, { ...book, title: newTitle });
      setMessage("✏️ Libro actualizado");
      fetchBooks();
    } catch (err) {
      setMessage("❌ Error al actualizar libro");
    }
  };

  const handleAddToCart = async (bookId) => {
    const cartId = localStorage.getItem("cartId");
    try {
      await api.post("/carts/add", { bookId, cartId });
      setMessage("✅ Producto agregado al carrito");
    } catch (err) {
      setMessage("❌ Error al agregar al carrito");
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Panel de administrador</h2>

      <form
        onSubmit={handleCreateBook}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h3>Agregar libro</h3>
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          name="author"
          placeholder="Autor"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Crear libro
        </button>
      </form>

      <div>
        <h3>Lista de libros</h3>
        {books.length === 0 ? (
          <p>No hay libros cargados.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {books.map((book) => (
              <li
                key={book._id}
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div>
                  <strong>{book.title}</strong> — {book.author} | 💲{book.price}{" "}
                  | 📦 {book.stock}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleUpdateBook(book)}
                    style={{
                      backgroundColor: "#1976D2",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "0.3rem 0.8rem",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "0.3rem 0.8rem",
                    }}
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleAddToCart(book._id)}
                    style={{
                      backgroundColor: "#FFA500",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "0.3rem 0.8rem",
                    }}
                  >
                    🛒 Agregar al carrito
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {message && (
        <p
          style={{ marginTop: "1rem", textAlign: "center", fontWeight: "bold" }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
