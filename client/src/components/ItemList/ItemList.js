import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../AuthContext/AuthContext";
import OwnItems from "../OwnItems/OwnItems";
import { HashLoader } from "react-spinners";
import AllFetchItems from "../AllFetchItems/AllFetchItems";
import AvailableSwapItems from "../AvailableSwapItems/AvailableSwapItems";
import MySwapItems from "../MySwapItems/MySwapItems";
import GlobalItemSearch from "../GlobalItemSearch/GlobalItemSearch";

const ItemList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [selectedMyItemId, setSelectedMyItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myItems, setMyItems] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [selected, setSelected] = useState(0);

  const [getSearchItems, setGetSearchItems] = useState([]);

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
        <div className="container d-flex justify-content-end">
          {" "}
          <Link className="btn btn-outline-primary" to="/add_item">
            Add Item
          </Link>
        </div>
        <div className="d-flex justify-content-center align-items-center ">
          <h3 className="text-primary">No items available to swap.</h3>{" "}
        </div>
      </>
    );

  return (
    <>
      <div className="container mt-4 ">
        <OwnItems
          selectedMyItemId={selectedMyItemId}
          setSelectedMyItemId={setSelectedMyItemId}
          myItems={myItems}
          setMyItems={setMyItems}
        />

        <h3 className="text-primary">Items Available for Swap</h3>
        <div className="d-flex justify-content-between align-items-md-center  my-4">
          <div className="d-flex align-items-start align-items-md-center flex-column flex-md-row gap-2">
            <button
              onClick={() => setSelected(0)}
              className={`btn ${
                selected === 0 ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelected(1)}
              className={`btn ${
                selected === 1 ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              Swap Items
            </button>
            <button
              onClick={() => setSelected(2)}
              className={`btn ${
                selected === 2 ? "btn-primary" : "btn-outline-primary"
              } `}
            >
              My Items
            </button>
          </div>

          <div className="d-none d-md-flex align-items-center">
            <GlobalItemSearch
              className="global-search-inpu"
              getSearchItems={getSearchItems}
              setGetSearchItems={setGetSearchItems}
            />
          </div>

          <div className="d-flex align-items-end align-items-md-center flex-column flex-md-row gap-2">
            <Link className="btn btn-outline-danger" to="/sent_request">
              Sent Request
            </Link>

            <Link className="btn btn-outline-danger " to="/received_request">
              Received Request
            </Link>

            <Link className=" btn btn-outline-primary" to="/add_item">
              Add Item
            </Link>
          </div>
        </div>

        <div className="row">
          {selected === 0 && (
            <AllFetchItems
              items={items}
              getSearchItems={getSearchItems}
              user={user}
              sentRequests={sentRequests}
              handleSwapRequest={handleSwapRequest}
              handleEditSwap={handleEditSwap}
              handleDeleteSwap={handleDeleteSwap}
            />
          )}
          {selected === 1 && (
            <AvailableSwapItems
              items={items}
              userId={user && user?._id}
              handleDeleteSwap={handleDeleteSwap}
              handleEditSwap={handleEditSwap}
              handleSwapRequest={handleSwapRequest}
              sentRequests={sentRequests}
              getSearchItems={getSearchItems}
            />
          )}
          {selected === 2 && (
            <MySwapItems
              items={items}
              userId={user && user?._id}
              handleSwapRequest={handleSwapRequest}
              sentRequests={sentRequests}
              getSearchItems={getSearchItems}
              handleEditSwap={handleEditSwap}
              handleDeleteSwap={handleDeleteSwap}
            />
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ItemList;
