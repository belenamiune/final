import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setMessage("❌ No hay carrito en localStorage.");
        return;
      }

      try {
        const res = await api.get("/carts/");
        if (res.data && res.data.cart) {
          setCart(res.data.cart);
        } else {
          setMessage("❌ El carrito no contiene productos.");
        }
      } catch (err) {
        setMessage("❌ Error al cargar el carrito.");
      }
    };

    fetchCart();
  }, []);

  const handleRemoveBookFromCart = async (bookId) => {
    try {
      const res = await api.delete(`/carts/remove/${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(res.data.cart);
    } catch (err) {
      setMessage("❌ Error al eliminar el libro del carrito.");
    }
  };

  const handlePurchase = async () => {
    try {
      const res = await api.post(
        "/carts/purchase",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("✅ ¡Compra exitosa! Redirigiendo a tus tickets...");
      setCart(null);

      setTimeout(() => {
        navigate("/tickets");
      }, 1500);
    } catch (err) {
      setMessage("❌ Error al finalizar la compra.");
    }
  };

  if (!cart) {
    return <div class="container">Cargando carrito o carrito vacío...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>🛒 Carrito de compras</h1>
      {cart.products.length === 0 ? (
        <p style={{ textAlign: "center" }}>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.products.map(({ book, quantity }, index) => {
              if (!book) return null;

              return (
                <li
                  key={book._id || index}
                  style={{
                    marginBottom: "1rem",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "1rem",
                  }}
                >
                  <strong>{book.title}</strong> — {book.author} | 💲{book.price}{" "}
                  × {quantity}
                  <button
                    onClick={() => handleRemoveBookFromCart(book._id)}
                    style={{ marginLeft: "1rem", color: "white" }}
                  >
                    Eliminar
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={handlePurchase} style={{ marginTop: "1rem" }}>
            Finalizar compra
          </button>
        </>
      )}
    </div>
  );
}
