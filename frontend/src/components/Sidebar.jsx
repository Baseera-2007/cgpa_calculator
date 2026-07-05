import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {

  const role = (localStorage.getItem("role") || "").toLowerCase();

  return (
    <aside className="sidebar">
      <ul>

        {role === "staff" ? (
          <>
            <li>
              <NavLink to="/staff">
                🏠 Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/staff/students">
                👨‍🎓 Students
              </NavLink>
            </li>

            <li>
              <NavLink to="/staff/reports">
                📄 Reports
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/student">
                📤 Upload Results
              </NavLink>
            </li>

            <li>
              <NavLink to="/student/profile">
                👤 My Profile
              </NavLink>
            </li>
          </>
        )}

      </ul>
    </aside>
  );
}

export default Sidebar;