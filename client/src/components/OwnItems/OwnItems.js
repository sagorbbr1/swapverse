// OwnItems.js
import React, { useEffect } from "react";
import axios from "axios";

const OwnItems = ({
  selectedMyItemId,
  setSelectedMyItemId,
  myItems,
  setMyItems,
}) => {
  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const res = await axios.get("/api/my-items/items", {
          withCredentials: true,
        });
        setMyItems(res.data);
      } catch (err) {
        console.error("Failed to fetch your items:", err);
      }
    };
    fetchMyItems();
  }, [setMyItems]);

  return (
    <div className="mb-3">
      <label htmlFor="myItemSelect" className="form-label">
        Select your item to swap:
      </label>
      <select
        id="myItemSelect"
        className="form-select"
        value={selectedMyItemId || ""}
        onChange={(e) => setSelectedMyItemId(e.target.value)}
      >
        <option value="">-- Select an item --</option>
        {myItems.map((item) => (
          <option key={item._id} value={item._id}>
            {item.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OwnItems;
