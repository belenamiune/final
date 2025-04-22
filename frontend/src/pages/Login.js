import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Hacer una petición GET para obtener los productos del backend
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los productos:", error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de Libros</h1>
      <div>
        {products.map((product) => (
          <div key={product._id}>
            <h3>{product.title}</h3>
            <p>{product.author}</p>
            <Link to={`/products/${product._id}`}>Ver detalles</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
