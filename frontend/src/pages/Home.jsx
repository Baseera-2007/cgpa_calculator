import FilterBar from "../components/FilterBar";
import Dashboard from "../components/Dashboard";

function Home() {
  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1
        style={{
          color: "#1e3a8a",
          marginBottom: "10px",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        🎓 CSBS Academic Management System
      </h1>

      <p
        style={{
          color: "#555",
          fontSize: "17px",
          marginBottom: "30px",
          lineHeight: "28px",
        }}
      >
        Manage student records, upload semester results, calculate SGPA &
        CGPA, and generate academic reports from one platform.
      </p>

      {/* Only Batch Selection */}
      <FilterBar />

      {/* Dashboard */}
      <Dashboard />
    </div>
  );
}

export default Home;