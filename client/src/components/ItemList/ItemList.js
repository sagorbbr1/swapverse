import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../AuthContext/AuthContext";

const ItemList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleSwapRequest = async (itemId) => {
    // if (!user) {
    //   alert("Please log in to make a swap request.");
    //   return;
    // }
    // try {
    //   const res = await axios.post(
    //     "/api/swap",
    //     { requesterItemId: itemId, targetItemId: itemId },
    //     { withCredentials: true }
    //   );
    //   alert("Swap request sent successfully!");
    // } catch (err) {
    //   console.error("Failed to send swap request:", err);
    //   alert("Failed to send swap request. Please try again.");
    // }
  };

  const handleEditSwap = async (itemId) => {
    navigate(`/edit_item/${itemId}`);
  };

  const handleDeleteSwap = async (itemId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`/api/items/${itemId}`, { withCredentials: true });
      toast.success("Item deleted successfully!");

      fetchItems();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete item. Please try again.");
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
              <div className="card-body position-relative">
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

                {item && item.user._id !== user._id && (
                  <>
                    <div className="d-flex justify-content-between align-items-center position-absolute bottom-0  py-2 bg-light">
                      <p className="mb-0">
                        <strong>Owner:</strong> {item.user.fullname}
                      </p>
                      <button
                        onClick={() => handleSwapRequest(item._id)}
                        className="btn btn-primary ms-2"
                      >
                        Swap Request
                      </button>
                    </div>
                  </>
                )}

                {item && item.user._id === user._id && (
                  <>
                    <div className="d-flex justify-content-between align-items-center position-absolute bottom-0  py-2 bg-light text-center w-75">
                      <button
                        onClick={() => handleEditSwap(item._id)}
                        className="mb-0 btn btn-primary"
                      >
                        Edit item
                      </button>
                      <button
                        onClick={() => handleDeleteSwap(item._id)}
                        className="btn btn-danger ms-2"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}

                <ToastContainer />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
