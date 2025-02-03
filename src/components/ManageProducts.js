import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/ManageProductsStyles.css";

function ManageProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetchWithAuth("https://localhost:7059/api/v1/products");
      setProducts(response);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
  
    try {
      const response = await fetch(`https://localhost:7059/api/v1/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
  
      if (response.ok) {
        alert("Product deleted successfully");
        fetchProducts(); // Refresh product list after deletion
      } else {
        const errorData = await response.json();
        alert(`Failed to delete product: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the product.");
    }
  };
  

  return (
    <div className="manage-products-container">
      <h1 className="manage-products-title">Manage Products</h1>
      {error && <p className="error">{error}</p>}

      <button className="btn-add-product" onClick={() => navigate("/add-product")}>
        Add Product
      </button>
      <button
            type="button"
            className="btn-back"
            onClick={() => navigate("/welcome")}
          >Go Back</button>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                  <button
                      className="btn-details"
                      onClick={() => navigate(`/products/view/${product.id}`)}
                    >
                      Details
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageProducts;
