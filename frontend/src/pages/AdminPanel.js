import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
  });
  const [message, setMessage] = useState("");
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

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

  const handleEditClick = (book) => {
    setEditingBook(book);
  };

  const handleEditChange = (e) => {
    setEditingBook({ ...editingBook, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/book/${editingBook._id}`, editingBook);
      setMessage("✏️ Libro actualizado");
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      setMessage("❌ Error al actualizar libro");
    }
  };

  const handleAddToCart = async (bookId) => {
    const cartId = localStorage.getItem("cartId");
    try {
      await api.post("/carts/add", { bookId, cartId, quantity: 1 });
      setMessage("✅ Producto agregado al carrito");
    } catch (err) {
      setMessage("❌ Error al agregar al carrito");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "white",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Panel de administrador</h1>

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
          Agregar libro
        </button>
      </form>
      <hr />
      {editingBook && (
        <form
          onSubmit={handleUpdateSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "2rem",
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3>Editar libro</h3>
          <input
            name="title"
            placeholder="Título"
            value={editingBook.title}
            onChange={handleEditChange}
            required
          />
          <input
            name="author"
            placeholder="Autor"
            value={editingBook.author}
            onChange={handleEditChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Precio"
            value={editingBook.price}
            onChange={handleEditChange}
            required
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={editingBook.stock}
            onChange={handleEditChange}
            required
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.5rem",
                backgroundColor: "#1976D2",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => setEditingBook(null)}
              style={{
                padding: "0.5rem",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="books-container">
        <h3>Lista de libros</h3>
        {books.length === 0 ? (
          <p>No hay libros cargados.</p>
        ) : (
          <ul className="books-list">
            {books.map((book) => (
              <li key={book._id}>
                <div className="book-info">
                  <strong>{book.title}</strong> — {book.author}
                  <span>
                    💲 {book.price} | 📦 {book.stock}
                  </span>
                </div>
                <div className="book-buttons">
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(book)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteBook(book._id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(book._id)}
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
