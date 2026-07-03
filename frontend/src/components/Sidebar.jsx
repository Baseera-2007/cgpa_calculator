import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li>
          <NavLink to="/">🏠 Dashboard</NavLink>
        </li>

        <li>
          <NavLink to="/students">👨‍🎓 Students</NavLink>
        </li>

        <li>
          <NavLink to="/reports">📄 Reports</NavLink>
        </li>

        <li>
          <NavLink to="/upload-results">📤 Upload Results</NavLink>
        </li>

        <li>
          <NavLink to="/settings">⚙️ Settings</NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;