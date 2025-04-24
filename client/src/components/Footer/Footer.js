import React from "react";
import "./Footer.css";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-5">
      <div className="container">
        <p className="mb-1">
          &copy; {new Date().getFullYear()} SwapVerse. All rights reserved.
        </p>
        <small>
          Built with ❤️ by{" "}
          <Link
            className="text-primary"
            target="_blank"
            to={`https://www.linkedin.com/in/sagorbbr1/`}
          >
            Sagor
          </Link>{" "}
        </small>
      </div>
    </footer>
  );
};

export default Footer;
