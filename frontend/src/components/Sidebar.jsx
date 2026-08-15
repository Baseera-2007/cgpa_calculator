import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const role = (localStorage.getItem("role") || "").toLowerCase();

  const handleNavigation = () => {
    // Close the mobile sidebar after selecting a page
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* MOBILE CLOSE BUTTON */}
        <button
          className="sidebar-close-button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation menu"
        >
          ✕
        </button>


        <div className="sidebar-menu">

          <ul>

            {role === "staff" ? (
              <>

                <li>
                  <NavLink
                    to="/staff"
                    end
                    onClick={handleNavigation}
                  >
                    <span className="menu-icon">🏠</span>
                    <span>Dashboard</span>
                  </NavLink>
                </li>


                <li>
                  <NavLink
                    to="/staff/students"
                    onClick={handleNavigation}
                  >
                    <span className="menu-icon">👨‍🎓</span>
                    <span>Students</span>
                  </NavLink>
                </li>


                <li>
                  <NavLink
                    to="/staff/my-subjects"
                    onClick={handleNavigation}
                  >
                    <span className="menu-icon">📘</span>
                    <span>My Subjects</span>
                  </NavLink>
                </li>


                <li>
                  <NavLink
                    to="/staff/subject-attendance"
                    onClick={handleNavigation}
                  >
                    <span className="menu-icon">📚</span>
                    <span>Subject Attendance</span>
                  </NavLink>
                </li>


                <li>
                  <NavLink
                    to="/staff/attendance"
                    onClick={handleNavigation}
                  >
                    <span className="menu-icon">📋</span>
                    <span>Attendance</span>
                  </NavLink>
                </li>


                <li>
                  <NavLink
                    to="/staff/reports"
                    onClick={handleNavigation}
                  >
                    <span className="menu-icon">📄</span>
                    <span>Reports</span>
                  </NavLink>
                </li>

              </>
            ) : (
              <>

                <li>
                  <NavLink
                    to="/student"
                    end
                    onClick={handleNavigation}
                  >
                    <span className="menu-icon">📤</span>
                    <span>Upload Results</span>
                  </NavLink>
                </li>


                <li>
                  <NavLink
                    to="/student/profile"
                    onClick={handleNavigation}
                  >
                    <span className="menu-icon">👤</span>
                    <span>My Profile</span>
                  </NavLink>
                </li>

              </>
            )}

          </ul>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;