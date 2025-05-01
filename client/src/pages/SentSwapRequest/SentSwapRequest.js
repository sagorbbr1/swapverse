import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router";
import Navbar from "../Navbar/Navbar";
import { HashLoader } from "react-spinners";
import { startChat } from "../../pages/ChatRoom/chatHelpers";

const SentSwapRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStartChat = async (userId) => {
    try {
      const chat = await startChat(userId);
      navigate(`/chat/${chat._id}`);
    } catch (err) {
      toast.error("Failed to start chat.");
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/swap/swap-requests`,
        {
          withCredentials: true,
        }
      );
      setSentRequests(res.data.sent);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Failed to fetch sent swap requests:", err);
      toast.error("Failed to load sent requests.");
    }
  };

  useEffect(() => {
    fetchSentRequests();
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
            <div className="text-primary d-flex justify-content-center align-items-center flex-column">
              <h4>No sent swap requests</h4>
            </div>
          ) : (
            sentRequests.map((req) => (
              <div className="col-md-4 mb-4" key={req._id}>
                <div className="card shadow-sm">
                  {req.targetItem?.image && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/items/${req.targetItem.image}`}
                      className="card-img-top"
                      alt={req.targetItem.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{req.targetItem?.title}</h5>
                    <p>
                      <strong>Details:</strong> {req.targetItem?.description}
                    </p>
                    <p>
                      <strong>Swap Wish:</strong> {req.targetItem?.swapWishList}
                    </p>
                    <p>
                      <strong>Status:</strong> {req.status}
                    </p>

                    {req.status === "accepted" && (
                      <button
                        onClick={() => handleStartChat(req.owner?._id)}
                        className=" btn btn-success"
                      >
                        Chat
                      </button>
                    )}
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
