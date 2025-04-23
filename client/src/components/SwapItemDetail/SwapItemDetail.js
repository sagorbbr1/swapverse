import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { HashLoader } from "react-spinners";
import Navbar from "../Navbar/Navbar";
import { ArrowLeftCircle } from "react-bootstrap-icons";

const SwapItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`/api/items/${id}`);
        setItem(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching item details:", err);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  console.log(item);

  if (!item)
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
        <div className="d-flex align-items-center mb-4">
          <Link to="/">
            <ArrowLeftCircle className="back-btn" />
          </Link>
          <h3 className="text-primary my-4 ms-4">Item Details</h3>
        </div>

        <div className="w-50 mx-auto border p-4 rounded shadow-sm d-flex flex-column align-items-center">
          <h3>{item.title}</h3>
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Condition:</strong> {item.condition}
          </p>
          <p>
            <strong>Description:</strong> {item.description}
          </p>
          {item.image && (
            <img
              src={`/uploads/items/${item.image}`}
              alt={item.title}
              style={{ maxWidth: "400px", borderRadius: "8px" }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SwapItemDetail;
