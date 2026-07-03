import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px",
            background: "#f5f7fb",
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MainLayout;