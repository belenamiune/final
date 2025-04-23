import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import AdminPanel from "./pages/AdminPanel";
import { PrivateRoute, AdminRoute } from "./components/PrivateRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Tickets from "./pages/Tickets";
import Books from "./pages/Books";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/tickets"
              element={
                <PrivateRoute>
                  <Tickets />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            <Route path="/books" element={<Books />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
