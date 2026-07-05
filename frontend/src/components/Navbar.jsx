import "../styles/Navbar.css";

function Navbar() {

  const username = localStorage.getItem("username");

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>🎓 CGPA Calculator</h2>
      </div>

      <div className="navbar-right">
        <span>
          Welcome, {username} 👋
        </span>
      </div>
    </nav>
  );
}

export default Navbar;