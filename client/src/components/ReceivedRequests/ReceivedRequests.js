import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReceivedRequests = ({ requests = [], onStatusUpdate }) => {
  const handleUpdate = async (id, status) => {
    try {
      const res = await axios.put(
        `/api/swap-requests/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Request ${status} successfully!`);
      onStatusUpdate();
    } catch (err) {
      toast.error("Failed to update request");
      console.error("Update failed:", err);
    }
  };

  if (!requests.length) return <p>No received requests.</p>;

  return (
    <div className="mt-4">
      <h4 className="text-success">Received Swap Requests</h4>
      <ul className="list-group">
        {requests.map((req) => (
          <li key={req._id} className="list-group-item">
            <p>
              <strong>From:</strong> {req.requesterItem?.user?.fullname} <br />
              <strong>Their Item:</strong> {req.requesterItem?.title} <br />
              <strong>Wants to swap with:</strong> {req.targetItem?.title}
            </p>
            <div className="btn-group">
              {req.status === "Pending" ? (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleUpdate(req._id, "Accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleUpdate(req._id, "Rejected")}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <span
                  className={`badge bg-${
                    req.status === "Accepted" ? "success" : "danger"
                  }`}
                >
                  {req.status}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceivedRequests;
