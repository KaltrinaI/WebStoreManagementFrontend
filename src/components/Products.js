import React, { useState, useEffect } from "react";
import "../style/ProductStyles.css";
import "../style/AuthFormStyles.css";
import "../style/HeaderStyles.css";
import logo from "../images/design.png";
import { useNavigate } from "react-router-dom";
import config from "../config";;

function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Internal query string based on filter selections.
  const [searchQuery, setSearchQuery] = useState("");

  // Combined filter state (including priceMin and priceMax)
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    brand: "",
    size: "",
    color: "",
    inStock: "",
    minPrice: "",
    maxPrice: "",
  });

  // For collapsing/expanding filter sections
  const [expandedSections, setExpandedSections] = useState({
    Brands: true,
    Categories: true,
    Colors: true,
    Sizes: true,
    Genders: true,
    PriceRange: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchFilters();
    // Initially fetch all products (an empty query string returns all)
    fetchAllProducts("");
  }, []);

  // Fetch filter options from the API
  const fetchFilters = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${config.backendUrl}/api/v1/brands`),
        fetch(`${config.backendUrl}/api/v1/categories`),
        fetch(`${config.backendUrl}/api/v1/colors`),
        fetch(`${config.backendUrl}/api/v1/sizes`),
        fetch(`${config.backendUrl}/api/v1/genders`),
      ]);

      const [brandsData, categoriesData, colorsData, sizesData, gendersData] =
        await Promise.all(
          responses.map((res) => (res.ok ? res.json() : []))
        );

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

  
  const fetchAllProducts = async (queryParams = "") => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.backendUrl}/api/v1/products/search?${queryParams}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("No products found.");

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      setError(undefined)
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Build a query string from the filters object.
  const generateSearchQuery = (fltr) => {
    return Object.entries(fltr)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(
        ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  };

  // Called when a filter option is selected. It toggles the filter value,
  // updates the filters state, and regenerates the internal search query.
  // (Note: For radio buttons, clicking an already selected option won't clear it,
  // so you can rely on the Reset Filters button to clear all selections.)
  const handleFilterClick = (type, value) => {
    const newFilter = {
      ...filters,
      [type]: value,
    };
    setFilters(newFilter);
    setSearchQuery(generateSearchQuery(newFilter));
  };

  // Reset all filters and the internal search query.
  const handleResetFilters = () => {
    const resetFilters = {
      category: "",
      gender: "",
      brand: "",
      size: "",
      color: "",
      inStock: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(resetFilters);
    setSearchQuery("");
  };

  // Trigger a search using the current internal query string.
  const handleSearch = async (e) =>  {
    e.preventDefault();
    await fetchAllProducts(searchQuery);
  };

  // Map UI labels to the filter keys in our state.
  const filterKeyMapping = {
    Brands: "brand",
    Categories: "category",
    Colors: "color",
    Sizes: "size",
    Genders: "gender",
  };

  return (
    <div className="products-container">
      <div className="header">
        <img src={logo} alt="Logo" className="auth-logo" width="25" />
        <button
          type="button"
          className="btn-login"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
      <div className="content">
        <div className="filters-section">
          {/* Filter groups rendered as radio button groups */}
          <form onSubmit={handleSearch} className="search-form">
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          {[
            ["Brands", brands],
            ["Categories", categories],
            ["Colors", colors],
            ["Sizes", sizes],
            ["Genders", genders],
          ].map(([label, items]) => (
            <div key={label} className="filter-group">
              <h3
                onClick={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    [label]: !prev[label],
                  }))
                }
                className="filter-header"
              >
                {label} <span>{expandedSections[label] ? "▲" : "▼"}</span>
              </h3>
              {expandedSections[label] && (
                <div className="filter-options">
                  {items.map((item) => (
                    <label key={item} className="filter-option">
                      <input
                        type="radio"
                        name={label}
                        value={item}
                        checked={filters[filterKeyMapping[label]] === item}
                        onChange={() =>
                          handleFilterClick(filterKeyMapping[label], item)
                        }
                      />
                      {item}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Price Range Filter */}
          <div className="filter-group">
            <h3
              onClick={() =>
                setExpandedSections((prev) => ({
                  ...prev,
                  PriceRange: !prev.PriceRange,
                }))
              }
              className="filter-header"
            >
              Price Range <span>{expandedSections.PriceRange ? "▲" : "▼"}</span>
            </h3>
            {expandedSections.PriceRange && (
              <div className="filter-options">
                <label>Min Price: </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => {
                    const newFilters = {
                      ...filters,
                      minPrice
                      : e.target.value,
                    };
                    setFilters(newFilters);
                    setSearchQuery(generateSearchQuery(newFilters));
                  }}
                />
                <label>Max Price: </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => {
                    const newFilters = {
                      ...filters,
                      maxPrice: e.target.value,
                    };
                    setFilters(newFilters);
                    setSearchQuery(generateSearchQuery(newFilters));
                  }}
                />
              </div>
            )}
          </div>

          <button className="reset-button" onClick={handleResetFilters}>
            Reset Filters
          </button>

          {/* Trigger search based on the internal searchQuery built from the filters */}
          
        </div>

        <div className="product-grid">
          {loading ? (
            <div className="products-loading">Loading...</div>
          ) : error ? (
            <div className="products-error">Error: {error}</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
