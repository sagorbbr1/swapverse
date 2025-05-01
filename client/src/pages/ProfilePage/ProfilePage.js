import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { XOctagon } from "react-bootstrap-icons";
import { Link } from "react-router";
import { HashLoader } from "react-spinners";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    avatar: null,
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
        setFormData({
          bio: res.data.bio || "",
          location: res.data.location || "",
          avatar: null,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append("bio", formData.bio);
    updateData.append("location", formData.location);
    if (formData.avatar) {
      updateData.append("avatar", formData.avatar);
    }

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/profile`,
        updateData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data);
      setFormData({
        bio: res.data.bio || "",
        location: res.data.location || "",
        avatar: null,
      });
      setEditMode(false);
    } catch (err) {
      console.error("Profile update failed:", err);
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
  if (!user) return <div>No user found.</div>;

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="d-flex justify-content-center">
          <div className="col-md-6 shadow-lg p-4 rounded bg-white d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h2 className="m-0 text-primary">User Profile</h2>

              <Link className="me-2" to="/">
                <XOctagon className=" close-btn text-danger" />
              </Link>
            </div>
            <div className="d-flex align-items-center gap-3 mb-3">
              <img
                src={
                  `${process.env.REACT_APP_API_URL}${user.avatar}` ||
                  "https://i.postimg.cc/hvvfhPTG/avater.png"
                }
                alt="avatar"
                className="rounded-circle"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <div>
                <h4>{user.fullname}</h4>
                <p className="mb-0">Email: {user.email}</p>
              </div>
            </div>

            {editMode ? (
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    className="form-control"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Avatar</label>
                  <input
                    type="file"
                    name="avatar"
                    className="form-control"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-success me-2">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p className="mt-3">
                  <strong>Bio:</strong> {user.bio || "N/A"}
                </p>
                <p>
                  <strong>Location:</strong> {user.location || "N/A"}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
