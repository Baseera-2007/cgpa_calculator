import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">

        <h2>
          🎓 {role === "staff"
            ? "Staff Portal"
            : "Student Portal"}
        </h2>

      </div>

      <div
        className="navbar-right"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >

        <span>
          Welcome, {username} 👋
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;