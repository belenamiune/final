import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

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
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        📚 Listado de libros
      </h2>

      {books.length === 0 ? (
        <p style={{ textAlign: "center" }}>No hay libros disponibles.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {books.map((book) => (
            <div
              key={book._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Titulo: {book.title}</h3>
              <p>
                <strong>Autor:</strong> {book.author}
              </p>
              <p>
                <strong>Precio:</strong> 💲{book.price}
              </p>
              <p>
                <strong>Stock:</strong> 📦 {book.stock}
              </p>
              <button
                onClick={() => handleAddToCart(book._id)}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "0.3rem 0.8rem",
                }}
              >
                🛒 Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
