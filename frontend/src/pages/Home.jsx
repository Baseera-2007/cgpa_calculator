import FilterBar from "../components/FilterBar";
import Dashboard from "../components/Dashboard";
import StudentTable from "../components/StudentTable";

function Home() {
  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1 style={{ color: "#1e3a8a", marginBottom: "10px" }}>
        🎓 CSBS Academic Management System
      </h1>

      <p
        style={{
          color: "#555",
          fontSize: "17px",
          marginBottom: "25px",
        }}
      >
        Manage student records, upload semester results, calculate SGPA &
        CGPA, and generate academic reports from one platform.
      </p>

      <FilterBar />

      <Dashboard />

      <StudentTable />
    </div>
  );
}

export default Home;