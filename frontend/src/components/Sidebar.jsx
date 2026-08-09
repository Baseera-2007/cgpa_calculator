import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  const role = (localStorage.getItem("role") || "").toLowerCase();

  return (
    <aside className="sidebar">

      <div className="sidebar-menu">

        <ul>

          {role === "staff" ? (
            <>
              <li>
                <NavLink to="/staff" end>
                  <span className="menu-icon">🏠</span>
                  <span>Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/staff/students">
                  <span className="menu-icon">👨‍🎓</span>
                  <span>Students</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/staff/my-subjects">
                  <span className="menu-icon">📘</span>
                  <span>My Subjects</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/staff/subject-attendance">
                  <span className="menu-icon">📚</span>
                  <span>Subject Attendance</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/staff/attendance">
                  <span className="menu-icon">📋</span>
                  <span>Attendance</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/staff/reports">
                  <span className="menu-icon">📄</span>
                  <span>Reports</span>
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/student" end>
                  <span className="menu-icon">📤</span>
                  <span>Upload Results</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/student/profile">
                  <span className="menu-icon">👤</span>
                  <span>My Profile</span>
                </NavLink>
              </li>
            </>
          )}

        </ul>

      </div>

    </aside>
  );
}

export default Sidebar;