import React, { useState, useEffect } from "react";
import "../style/CatalogsStyles.css";
import config from "../config";;

function Catalogs() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState({});
  const [newEntry, setNewEntry] = useState({});
  const [editingItem, setEditingItem] = useState({});
  const [editEntry, setEditEntry] = useState({});

  const fetchCatalogData = async (endpoint, setData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.backendUrl}/api/v1/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }

      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData("brands", setBrands);
    fetchCatalogData("categories", setCategories);
    fetchCatalogData("colors", setColors);
    fetchCatalogData("sizes", setSizes);
    fetchCatalogData("genders", setGenders);
  }, []);

  const handleAdd = (type) => {
    setShowAddForm((prev) => ({ ...prev, [type]: !prev[type] }));
    setNewEntry({});
  };

  const handleSave = async (type, endpoint) => {
    const token = localStorage.getItem("token");

    if (!newEntry[type] || !token) {
      setError(`Please enter a valid ${type} value.`);
      return;
    }

    let bodyContent = { name: newEntry[type] };
    if (type === "sizes") bodyContent = { label: newEntry[type] };

    try {
      const response = await fetch(`${config.backendUrl}/api/v1/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyContent),
      });

      if (response.ok) {
        alert(`${type} added successfully`);
        setNewEntry({});
        setShowAddForm((prev) => ({ ...prev, [type]: false }));
        fetchCatalogData(endpoint, getTypeSetter(type));
      } else {
        throw new Error(`Failed to add ${type}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem((prev) => ({ ...prev, [type]: item.id }));
    setEditEntry((prev) => ({ ...prev, [type]: item.name || item.label }));
  };

  const handleUpdate = async (id, type, endpoint) => {
    const token = localStorage.getItem("token");

    if (!editEntry[type] || !token) {
      setError(`Please enter a valid ${type} value.`);
      return;
    }

    let bodyContent = { name: editEntry[type] };
    if (type === "sizes") bodyContent = { label: editEntry[type] };

    try {
      const response = await fetch(
        `${config.backendUrl}/api/v1/${endpoint}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyContent),
        }
      );

      if (response.ok) {
        alert(`${type} updated successfully`);
        setEditingItem((prev) => ({ ...prev, [type]: null }));
        fetchCatalogData(endpoint, getTypeSetter(type));
      } else {
        throw new Error(`Failed to update ${type}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, type, endpoint) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${config.backendUrl}/api/v1/${endpoint}/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert(`${type} deleted successfully`);
        fetchCatalogData(endpoint, getTypeSetter(type));
      } else {
        throw new Error(`Failed to delete ${type}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getTypeSetter = (type) => {
    switch (type) {
      case "brands":
        return setBrands;
      case "categories":
        return setCategories;
      case "colors":
        return setColors;
      case "sizes":
        return setSizes;
      case "genders":
        return setGenders;
      default:
        return () => {};
    }
  };

  const renderSection = (data, type, endpoint) => (
    <div className={`catalog-section ${type}-section`}>
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <button onClick={() => handleAdd(type)} className="btn-add">
        Add {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
      {showAddForm[type] && (
        <form className="add-form">
          <input
            type="text"
            placeholder={`Enter new ${type} name`}
            value={newEntry[type] || ""}
            onChange={(e) =>
              setNewEntry({ ...newEntry, [type]: e.target.value })
            }
            className="input-add"
          />
          <button
            type="button"
            onClick={() => handleSave(type, endpoint)}
            className="btn-save"
          >
            Save
          </button>
        </form>
      )}
      <ul className={`catalog-list ${type}-list`}>
        {data.map((item) => (
          <li key={item.id} className={`catalog-item ${type}-item`}>
            {editingItem[type] === item.id ? (
              <>
                <input
                  type="text"
                  value={editEntry[type] || ""}
                  onChange={(e) =>
                    setEditEntry({ ...editEntry, [type]: e.target.value })
                  }
                  className="input-edit"
                />
                <button
                  onClick={() => handleUpdate(item.id, type, endpoint)}
                  className="btn-done"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <span>{item.name || item.label}</span>
                <div className="catalog-actions">
                  <button
                    onClick={() => handleEdit(item, type)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, type, endpoint)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="catalogs-container">
      {renderSection(brands, "brands", "brands")}
      {renderSection(categories, "categories", "categories")}
      {renderSection(colors, "colors", "colors")}
      {renderSection(sizes, "sizes", "sizes")}
      {renderSection(genders, "genders", "genders")}
    </div>
  );
}

export default Catalogs;
