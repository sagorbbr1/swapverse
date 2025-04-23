import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../AuthContext/AuthContext";
import { Link, useNavigate } from "react-router";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import Navbar from "../Navbar/Navbar";
import { HashLoader } from "react-spinners";
import { startChat } from "../ChatRoom/chatHelpers";

const ReceivedSwapRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStartChat = async (userId) => {
    try {
      const chat = await startChat(userId);
      navigate(`/chat/${chat._id}`);
    } catch (err) {
      toast.error("Failed to start chat.");
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const res = await axios.get("/api/swap-requests", {
        withCredentials: true,
      });
      setReceivedRequests(res.data.received || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch received requests:", err);
      toast.error("Could not load received swap requests.");
      setLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    try {
      await axios.put(
        `/api/swap-requests/${requestId}`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Request ${status}`);
      fetchReceivedRequests();
    } catch (err) {
      console.error("Error updating request:", err);
      toast.error("Failed to update swap request.");
    }
  };

  useEffect(() => {
    fetchReceivedRequests();
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

  if (receivedRequests.length === 0) {
    return <p>No received swap requests.</p>;
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container mt-4">
        <div className="d-flex align-items-center">
          <Link to="/">
            <ArrowLeftCircle className="back-btn" />
          </Link>

          <h3 className="text-primary my-4 ms-3">Received Swap Requests</h3>
        </div>

        <div className="row">
          {receivedRequests.map((req) => (
            <div className="col-md-4 mb-4" key={req._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    Requester: {req.requester.fullname}
                  </h5>
                  <p>
                    <strong>Their Item:</strong> {req.requesterItem?.title}
                  </p>
                  <p>
                    <strong>Your Item:</strong> {req.targetItem?.title}
                  </p>
                  <p>
                    <strong>Status:</strong> {req.status}
                  </p>
                  {req.status === "pending" && (
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-success"
                        onClick={() => handleAction(req._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleAction(req._id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {req.status === "accepted" && (
                    <button
                      onClick={() => handleStartChat(req.requester._id)}
                      className=" btn btn-success"
                    >
                      Chat
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReceivedSwapRequests;
