import React from "react";
import { useNavigate } from "react-router";

const AllFetchItems = ({
  items,
  user,
  sentRequests,
  handleSwapRequest,
  handleDeleteSwap,
  handleEditSwap,
  getSearchItems,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {items &&
        getSearchItems.map((item) => (
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
                  className="card-title "
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

                {item && item.user?._id !== user?._id && (
                  <>
                    <div className="d-flex justify-content-between align-items-center position-absolute bottom-0  py-2 bg-light">
                      <p className="mb-0">
                        <strong>Owner:</strong> {item.user.fullname}
                      </p>
                      {(() => {
                        const request = sentRequests?.find((req) => {
                          return (
                            req.requester?.toString() ===
                              user?._id?.toString() &&
                            req.targetItem?._id?.toString() ===
                              item?._id?.toString()
                          );
                        });

                        return request ? (
                          <div className="text-center">
                            <button
                              className={`btn ms-2 me-2 text-capitalize ${
                                request.status === "accepted"
                                  ? "btn-success"
                                  : "btn-danger"
                              }`}
                            >
                              {request.status}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleSwapRequest(item?._id, item?.user._id)
                            }
                            className="btn btn-primary ms-2 me-2"
                          >
                            Swap
                          </button>
                        );
                      })()}
                    </div>
                  </>
                )}

                {item && item.user._id === user._id && (
                  <>
                    <div className="text-center position-absolute bottom-0  py-2 bg-light text-center">
                      <button
                        onClick={() => handleEditSwap(item._id)}
                        className="mb-0 btn btn-primary"
                      >
                        Edit item
                      </button>
                      <button
                        onClick={() => handleDeleteSwap(item._id)}
                        className="btn btn-danger ms-2"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default AllFetchItems;
