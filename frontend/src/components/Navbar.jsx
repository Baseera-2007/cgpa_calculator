import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>🎓 CGPA Calculator</h2>
      </div>

      <div className="navbar-right">
        <span>Welcome, Admin 👋</span>
      </div>
    </nav>
  );
}

export default Navbar;