import { useEffect, useState } from "react";
import {
  FaUsers,
  FaChartLine,
  FaUserGraduate,
  FaTrophy,
} from "react-icons/fa";

function Dashboard({ batch }) {

  const [dashboard, setDashboard] = useState({
    total_students: 0,
    average_cgpa: 0,
    highest_cgpa: 0,
    above9: 0,
    batch: batch,
    department: "CSBS",
    lowest_cgpa: 0,
    pass_percentage: 100,
    top_students: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, [batch]);

  const fetchDashboard = async () => {
    try {

      const response = await fetch(
        `http://127.0.0.1:8000/dashboard?batch=${batch}`
      );

      const data = await response.json();

      setDashboard({
        ...data,
        batch: batch,
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ marginTop: "25px" }}>

      <h2
        style={{
          color: "#1e3a8a",
          marginBottom: "25px",
          fontWeight: "700",
        }}
      >
        📊 Staff Dashboard
      </h2>

      {/* Dashboard Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "22px",
        }}
      >

        <Card
          color="#2563eb"
          icon={<FaUsers />}
          title="Total Students"
          value={dashboard.total_students}
        />

        <Card
          color="#7c3aed"
          icon={<FaChartLine />}
          title="Average CGPA"
          value={dashboard.average_cgpa}
        />

        <Card
          color="#10b981"
          icon={<FaUserGraduate />}
          title="Highest CGPA"
          value={dashboard.highest_cgpa}
        />

        <Card
          color="#f59e0b"
          icon={<FaTrophy />}
          title="Above 9 CGPA"
          value={dashboard.above9}
        />

      </div>

      {/* Bottom Section */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "25px",
          marginTop: "35px",
        }}
      >

        {/* Batch Insights */}

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,.08)",
          }}
        >

          <h2
            style={{
              color: "#1e3a8a",
              marginBottom: "25px",
            }}
          >
            📋 Batch Insights
          </h2>

          <Insight label="Batch" value={dashboard.batch} />

          <Insight label="Department" value="CSBS" />

          <Insight
            label="Total Students"
            value={dashboard.total_students}
          />

          <Insight
            label="Average CGPA"
            value={dashboard.average_cgpa}
          />

          <Insight
            label="Highest CGPA"
            value={dashboard.highest_cgpa}
          />

          <Insight
            label="Lowest CGPA"
            value={dashboard.lowest_cgpa}
          />

          

        </div>

        {/* Top Students */}

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,.08)",
          }}
        >

          <h2
            style={{
              color: "#1e3a8a",
              marginBottom: "25px",
            }}
          >
            🏆 Top 5 Students
          </h2>

          {dashboard.top_students &&
          dashboard.top_students.length > 0 ? (

            dashboard.top_students.map((student, index) => (

              <TopStudent
                key={index}
                rank={index + 1}
                name={student.student_name}
                cgpa={student.current_cgpa}
              />

            ))

          ) : (

            <p
              style={{
                color: "#666",
              }}
            >
              No student data available.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

function Card({ icon, title, value, color }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        transition: "0.3s",
        cursor: "pointer",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow =
          "0 18px 35px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(0,0,0,0.08)";
      }}
    >

      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: color,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: "28px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#666",
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "15px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "38px",
          fontWeight: "bold",
          color: "#1e3a8a",
        }}
      >
        {value}
      </div>

    </div>
  );
}

function Insight({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid #ececec",
      }}
    >
      <span
        style={{
          color: "#666",
          fontWeight: "600",
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#1e3a8a",
          fontWeight: "bold",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function TopStudent({ rank, name, cgpa }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        marginBottom: "12px",
        borderRadius: "12px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "#1e3a8a",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {rank}
        </div>

        <div
          style={{
            fontWeight: "bold",
            color: "#222",
          }}
        >
          {name}
        </div>
      </div>

      <div
        style={{
          color: "green",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        {cgpa}
      </div>
    </div>
  );
}

export default Dashboard;