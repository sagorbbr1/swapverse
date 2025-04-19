import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/items", {
        withCredentials: true,
      });
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p>Loading items...</p>;

  if (items.length === 0)
    return (
      <>
        <p>No items available to swap.</p>{" "}
        <Link className="btn btn-outline-primary" to="/add_item">
          Add Item
        </Link>
      </>
    );

  return (
    <div className="container mt-4 ">
      <h3 className="text-primary">Items Available for Swap</h3>
      <div className="d-flex justify-content-end my-3">
        <Link className="btn btn-outline-primary" to="/add_item">
          Add Item
        </Link>
      </div>

      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <div className="card h-100 shadow-sm">
              {item.image && (
                <img
                  src={`/uploads/items/${item.image}`}
                  className="card-img-top"
                  alt={item.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
                <p>
                  <strong>Category:</strong> {item.category}
                </p>
                <p>
                  <strong>Condition:</strong> {item.condition}
                </p>
                <p>
                  <strong>Swap Wish:</strong> {item.swapWishList}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
