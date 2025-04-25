import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import { Link, useNavigate } from "react-router";
import { XOctagon } from "react-bootstrap-icons";

const ItemForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    swapWishList: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.condition.trim())
      newErrors.condition = "Condition is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("condition", formData.condition);
    data.append("swapWishList", formData.swapWishList);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await axios.post(
        `https://swapverse-back.vercel.app/api/items`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        condition: "",
        swapWishList: "",
        image: null,
      });
      toast.success("Item created successfully!");
      setPreview(null);
      setErrors({});
      navigate("/");
    } catch (err) {
      toast.error("Error creating item. Please try again.");
      console.error("Error creating item:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-4" style={{ maxWidth: "600px" }}>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h3 className="text-primary">Create New Item</h3>
          <Link className="me-2" to="/">
            <XOctagon className=" close-btn text-danger" />
          </Link>
        </div>

        <form
          className="shadow-lg p-4 rounded bg-white"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="mb-3 ">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <div className="text-danger">{errors.title}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <div className="text-danger">{errors.description}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            />
            {errors.category && (
              <div className="text-danger">{errors.category}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Condition</label>
            <select
              name="condition"
              className="form-select"
              value={formData.condition}
              onChange={handleChange}
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Used">Used</option>
              <option value="Broken">Broken</option>
            </select>
            {errors.condition && (
              <div className="text-danger">{errors.condition}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Swap Wish</label>
            <input
              type="text"
              name="swapWishList"
              className="form-control"
              value={formData.swapWishList}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          {preview && (
            <div className="mb-3">
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default ItemForm;
