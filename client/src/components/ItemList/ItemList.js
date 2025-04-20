import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../AuthContext/AuthContext";
import OwnItems from "../OwnItems/OwnItems";

const ItemList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [selectedMyItemId, setSelectedMyItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myItems, setMyItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/items", {
        withCredentials: true,
      });
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load items. Please try again.");
      console.error("Failed to fetch items:", err);
      setLoading(false);
    }
  };

  const handleSwapRequest = async (targetItemId) => {
    if (!selectedMyItemId) {
      return toast.error("Please select one of your items.");
    }

    console.log(selectedMyItemId, targetItemId);

    try {
      await axios.post(
        "/api/swap",
        {
          requesterItemId: selectedMyItemId,
          targetItemId: targetItemId,
        },
        { withCredentials: true }
      );
      toast.success("Swap request sent successfully!");
    } catch (err) {
      console.error("Swap request error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Failed to send swap request."
      );
    }
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
      <OwnItems
        selectedMyItemId={selectedMyItemId}
        setSelectedMyItemId={setSelectedMyItemId}
        myItems={myItems}
        setMyItems={setMyItems}
      />

      <h3 className="text-primary">Items Available for Swap</h3>
      <div className="d-flex justify-content-end my-3">
        <Link className="btn btn-outline-primary" to="/add_item">
          Add Item
        </Link>
      </div>

      <div className="row">
        {items.map((item) => (
          <div className="col-md-3 mb-4" key={item._id}>
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
