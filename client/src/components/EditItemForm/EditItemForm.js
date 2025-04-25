import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { HashLoader } from "react-spinners";
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(
          `https://swapverse-back.vercel.app/api/items/${id}`
        );
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch item:", err);
        toast.error("Failed to fetch item.");
        setLoading(false);
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
      await axios.put(
        `https://swapverse-back.vercel.app/api/items/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success("Item updated successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

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

        <div className="my-4 d-flex justify-content-between align-items-center">
          <div className=" shadow-sm w-25">
            <img
              className="w-75"
              src={`${process.env.REACT_APP_API_URL}/uploads/items/${formData.image}`}
              alt="swapImage"
            />
          </div>
          <h4 className=" text-primary text-center w-75">
            {formData && formData.title}
          </h4>
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
