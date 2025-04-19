import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../AuthContext/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  return (
    <>
      {!user && (
        <>
          <div>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-light py-5 text-center">
              <div className="container">
                <h1 className="display-5 fw-bold text-primary">
                  Welcome to SwapVerse
                </h1>
                <p className="lead text-muted">
                  A community-driven platform to trade your everyday items with
                  ease.
                </p>
                <Link
                  to="/register"
                  className="btn btn-info text-white fw-semibold px-4 mt-3"
                >
                  Get Started
                </Link>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-5 bg-white">
              <div className="container">
                <h2 className="text-center mb-4">How It Works</h2>
                <div className="row text-center">
                  <div className="col-md-4 mb-4">
                    <i className="bi bi-box-arrow-in-down fs-1 text-info"></i>
                    <h5 className="mt-3">List Your Items</h5>
                    <p className="text-muted">
                      Upload your items with details and wishlist swaps.
                    </p>
                  </div>
                  <div className="col-md-4 mb-4">
                    <i className="bi bi-search fs-1 text-info"></i>
                    <h5 className="mt-3">Browse & Search</h5>
                    <p className="text-muted">
                      Explore listings by category, condition, or location.
                    </p>
                  </div>
                  <div className="col-md-4 mb-4">
                    <i className="bi bi-arrow-left-right fs-1 text-info"></i>
                    <h5 className="mt-3">Swap & Enjoy</h5>
                    <p className="text-muted">
                      Request swaps and complete trades with real-time updates.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call-to-Action */}
            <section className="bg-info text-white py-5 text-center">
              <div className="container">
                <h3>Ready to trade your items?</h3>
                <p>Sign up now and join the SwapVerse community!</p>
                <Link
                  to="/register"
                  className="btn btn-light fw-bold px-4 mt-2"
                >
                  Create Account
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
      {user && (
        <>
          <Navbar />
        </>
      )}
    </>
  );
};

export default HomePage;
