import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../AuthContext/AuthContext";
import OwnItems from "../OwnItems/OwnItems";
import { HashLoader } from "react-spinners";

const ItemList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [selectedMyItemId, setSelectedMyItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myItems, setMyItems] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

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

  const handleSwapRequest = async (targetItemId, owner) => {
    if (!selectedMyItemId) {
      return toast.error("Please select one of your items.");
    }

    try {
      const res = await axios.post(
        "/api/swap",
        {
          requesterItemId: selectedMyItemId,
          targetItemId: targetItemId,
          owner: owner,
        },
        { withCredentials: true }
      );
      toast.success("Swap request sent successfully!");

      const newRequest = {
        _id: res.data._id,
        requester: user._id,
        owner: owner,
        requesterItem: { _id: selectedMyItemId },
        targetItem: { _id: targetItemId },
        status: "Pending",
      };

      setSentRequests((prev) => [...prev, newRequest]);
    } catch (err) {
      console.error("Swap request error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Failed to send swap request."
      );
    }
  };

  const fetchRequests = async () => {
    const res = await axios.get("/api/swap-requests", {
      withCredentials: true,
    });
    setSentRequests(res.data.sent);
    setReceivedRequests(res.data.received);
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
    fetchRequests();
  }, []);

  if (loading)
    return (
      <HashLoader
        className="loader"
        color={"#36d7b7"}
        loading={loading}
        cssOverride={{
          margin: "0 auto",
          borderColor: "red",

          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

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
      <div className="d-flex justify-content-between my-4">
        <div>
          <button className="btn btn-outline-primary">All Items</button>
          <button className="btn btn-outline-primary ms-2">Swap Items</button>
          <button className="btn btn-outline-primary ms-2">My Items</button>
        </div>

        <div>
          <Link className="btn btn-outline-danger" to="/sent_request">
            Sent Request
          </Link>

          <Link className="btn btn-outline-danger ms-2" to="/received_request">
            Received Request
          </Link>

          <Link className="ms-2 btn btn-outline-primary" to="/add_item">
            Add Item
          </Link>
        </div>
      </div>

      <div className="row">
        {items &&
          items.map((item) => (
            <div className="col-md-3 mb-4" key={item._id}>
              <div className="card h-100 shadow-sm">
                {item.image && (
                  <img
                    onClick={() => navigate(`/item/${item._id}`)}
                    src={`/uploads/items/${item.image}`}
                    className="card-img-top"
                    alt={item.title}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                )}
                <div className="card-body position-relative">
                  <h5
                    onClick={() => navigate(`/item/${item._id}`)}
                    className="card-title "
                    style={{ cursor: "pointer" }}
                  >
                    {item.title}
                  </h5>
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

                  {item && item.user?._id !== user?._id && (
                    <>
                      <div className="d-flex justify-content-between align-items-center position-absolute bottom-0  py-2 bg-light">
                        <p className="mb-0">
                          <strong>Owner:</strong> {item.user.fullname}
                        </p>
                        {(() => {
                          const request = sentRequests?.find((req) => {
                            return (
                              req.requester?.toString() ===
                                user?._id?.toString() &&
                              req.targetItem?._id?.toString() ===
                                item?._id?.toString()
                            );
                          });

                          return request ? (
                            <div className="text-center">
                              <button
                                className={`btn ms-2 me-2 text-capitalize ${
                                  request.status === "accepted"
                                    ? "btn-success"
                                    : "btn-danger"
                                }`}
                              >
                                {request.status}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                handleSwapRequest(item?._id, item?.user._id)
                              }
                              className="btn btn-primary ms-2 me-2"
                            >
                              Swap
                            </button>
                          );
                        })()}
                      </div>
                    </>
                  )}

                  {item && item.user._id === user._id && (
                    <>
                      <div className="text-center position-absolute bottom-0  py-2 bg-light text-center">
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
                </div>
              </div>
            </div>
          ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ItemList;
