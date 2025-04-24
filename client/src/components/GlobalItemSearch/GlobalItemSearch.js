import React, { useState, useEffect } from "react";
import axios from "axios";

const GlobalItemSearch = ({ getSearchItems, setGetSearchItems }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`/api/search?search=${searchTerm}`);
        setGetSearchItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search items globally..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default GlobalItemSearch;
