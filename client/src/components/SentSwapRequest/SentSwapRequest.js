import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { Link } from "react-router";
import Navbar from "../Navbar/Navbar";

const SentSwapRequest = () => {
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get("/api/swap-requests", {
        withCredentials: true,
      });
      setSentRequests(res.data.sent);
    } catch (err) {
      console.error("Failed to fetch sent swap requests:", err);
      toast.error("Failed to load sent requests.");
    }
  };

  useEffect(() => {
    fetchSentRequests();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex align-items-center">
          <Link to="/">
            <ArrowLeftCircle className="back-btn" />
          </Link>

          <h3 className="text-primary my-4 ms-3">Sent Swap Requests</h3>
        </div>

        <div className="row">
          {sentRequests.length === 0 ? (
            <p>No sent swap requests.</p>
          ) : (
            sentRequests.map((req) => (
              <div className="col-md-4 mb-4" key={req._id}>
                <div className="card shadow-sm">
                  {req.targetItem?.image && (
                    <img
                      src={`/uploads/items/${req.targetItem.image}`}
                      className="card-img-top"
                      alt={req.targetItem.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{req.targetItem?.title}</h5>
                    <p>
                      <strong>Swap Wish:</strong> {req.targetItem?.swapWishList}
                    </p>
                    <p>
                      <strong>Owner:</strong> {req.targetItem?.user?.fullname}
                    </p>
                    <p>
                      <strong>Status:</strong> {req.status}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default SentSwapRequest;
