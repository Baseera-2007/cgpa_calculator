import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const displayName = username || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <nav className="navbar">

      {/* LEFT SIDE */}
      <div className="navbar-left">

        <h2>
          🎓{" "}
          {role === "staff"
            ? "Staff Portal"
            : "Student Portal"}
        </h2>

      </div>


      {/* RIGHT SIDE */}
      <div className="navbar-right">

        <span className="welcome-text">
          Welcome,{" "}
        </span>


        {/* PROFILE / NAME DROPDOWN */}
        <div
          className="profile-wrapper"
          ref={menuRef}
        >

          <button
            className="profile-button"
            onClick={() =>
              setMenuOpen((previous) => !previous)
            }
          >

            <span className="username">
              {displayName}
            </span>

            <span
              className={`dropdown-arrow ${
                menuOpen ? "arrow-up" : ""
              }`}
            >
              ▼
            </span>

          </button>


          {/* DROPDOWN */}
          {menuOpen && (
            <div className="profile-dropdown">

              <button
                className="logout-dropdown-btn"
                onClick={handleLogout}
              >
                <span>↪</span>
                Logout
              </button>

            </div>
          )}

        </div>

        <span className="wave">
          👋
        </span>

      </div>

    </nav>
  );
}

export default Navbar;