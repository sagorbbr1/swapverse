import React from "react";
import { useNavigate } from "react-router";

const MySwapItems = ({ items, userId, handleEditSwap, handleDeleteSwap }) => {
  const navigate = useNavigate();
  const myItems = items?.filter((item) => item?.user?._id === userId);

  return (
    <>
      {myItems &&
        myItems.map((item) => (
          <div className="col-md-3 mb-4" key={item._id}>
            <div className="card h-100 shadow-sm">
              {item.image && (
                <img
                  onClick={() => navigate(`/item/${item._id}`)}
                  src={`/uploads/items/${item.image}`}
                  className="card-img-top"
                  alt={item.title}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              )}
              <div className="card-body position-relative">
                <h5
                  onClick={() => navigate(`/item/${item._id}`)}
                  className="card-title"
                  style={{ cursor: "pointer" }}
                >
                  {item.title}
                </h5>
                <p className="card-text">{item.description}</p>
                <p>
                  <strong>Category:</strong> {item.category}
                </p>
                <p>
                  <strong>Condition:</strong> {item.condition}
                </p>
                <p>
                  <strong>Swap Wish:</strong> {item.swapWishList}
                </p>

                <div className="d-flex justify-content-between align-items-center position-absolute bottom-0 py-2 bg-light w-100 px-3">
                  <button
                    onClick={() => handleEditSwap(item._id)}
                    className="btn btn-primary "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSwap(item._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default MySwapItems;
