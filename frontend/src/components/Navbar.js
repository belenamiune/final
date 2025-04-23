import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {user && <Link to="/books">Books</Link>}
      {user?.role === "admin" && <Link to="/admin">Admin</Link>}

      {user && <Link to="/cart">Carrito</Link>}
      {user && <Link to="/tickets">Mis Tickets</Link>}

      {user ? (
        <button onClick={handleLogout}>Salir</button>
      ) : (
        <>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
}
