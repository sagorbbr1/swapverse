import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import { ArrowLeftCircle } from "react-bootstrap-icons";
const EditItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    swapWishList: "",
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`/api/items/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to fetch item:", err);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/items/${id}`, formData, {
        withCredentials: true,
      });
      toast.success("Item updated successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="container mt-4 shadow-lg p-4 rounded-1"
        style={{ maxWidth: "600px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/">
            <ArrowLeftCircle className="back-btn" />
          </Link>
          <h3 className="text-primary my-4">Edit Item</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            className="form-control mb-2"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <textarea
            name="description"
            className="form-control mb-2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            name="category"
            className="form-control mb-2"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <select
            name="condition"
            className="form-select mb-2"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Used">Used</option>
            <option value="Broken">Broken</option>
          </select>
          <input
            name="swapWishList"
            className="form-control mb-2"
            value={formData.swapWishList}
            onChange={handleChange}
            placeholder="Swap Wish List"
          />
          <button className="btn btn-primary mt-2">Update</button>
        </form>
      </div>
    </>
  );
};

export default EditItemForm;
