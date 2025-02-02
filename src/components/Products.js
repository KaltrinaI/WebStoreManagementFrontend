import React, { useState, useEffect } from "react";
import "../style/ProductStyles.css";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    brand: "",
    size: "",
    color: "",
    inStock: "",
    priceMin: "",
    priceMax: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchFilters();
    fetchAllProducts();
  }, []);

  const fetchFilters = async () => {
    try {
      const responses = await Promise.all([
        fetch("https://localhost:7059/api/v1/brands"),
        fetch("https://localhost:7059/api/v1/categories"),
        fetch("https://localhost:7059/api/v1/colors"),
        fetch("https://localhost:7059/api/v1/sizes"),
        fetch("https://localhost:7059/api/v1/genders"),
      ]);

      const [brandsData, categoriesData, colorsData, sizesData, gendersData] =
        await Promise.all(responses.map((res) => (res.ok ? res.json() : [])));

      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setColors(Array.isArray(colorsData) ? colorsData : []);
      setSizes(Array.isArray(sizesData) ? sizesData : []);
      setGenders(Array.isArray(gendersData) ? gendersData : []);
    } catch (err) {
      console.error("Error fetching filters:", err);
      setError("Failed to load filters.");
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://localhost:7059/api/v1/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `https://localhost:7059/api/v1/products/search?${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("No products found.");
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (type, value) => {
    var newFilter = {
      ...filters,
      [type]: filters[type] === value ? "" : value,
    }
    setFilters(newFilter);

    function generateSearchQuery(fltr){
      return Object.entries(fltr)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '') // Skip unassigned values
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    }


    setSearchQuery(generateSearchQuery(newFilter))
  };

  const handleResetFilters = () => {
    setFilters({
      category: "",
      gender: "",
      brand: "",
      size: "",
      color: "",
      inStock: "",
      priceMin: "",
      priceMax: "",
    });
    setSearchQuery("");
  };

  if (loading) return <div className="products-loading">Loading...</div>;
  if (error) return <div className="products-error">Error: {error}</div>;

  return (
    <div className="products-container">
      <h1 className="products-title">Product List</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <div className="filters-container">
        {renderFilterSection("Categories", categories, "category")}
        {renderFilterSection("Brands", brands, "brand")}
        {renderFilterSection("Genders", genders, "gender")}
        {renderFilterSection("Colors", colors, "color")}
        {renderFilterSection("Sizes", sizes, "size")}
        <button className="reset-button" onClick={handleResetFilters}>Reset Filters</button>
      </div>

      {renderProductTable()}
    </div>
  );

  function renderFilterSection(title, items, type) {
    if (!Array.isArray(items)) return <p>Loading {title}...</p>;
    return (
      <div className="filter-group">
        <h3>{title}</h3>
        {items.length > 0 ? (
          items.map((item, index) => (
            <button key={index} className="filter-btn" onClick={() => handleFilterClick(type, item)}>
              {item}
            </button>
          ))
        ) : (
          <p>No {title.toLowerCase()} available.</p>
        )}
      </div>
    );
  }

  function renderProductTable() {
    return products.length > 0 ? (
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    ) : (
      <p>No products available.</p>
    );
  }
}

export default Products;
