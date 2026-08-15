import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 70px)",
          background: "#f5f7fb",
        }}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div
          style={{
            flex: 1,
            padding: "30px",
            minHeight: "calc(100vh - 70px)",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MainLayout;