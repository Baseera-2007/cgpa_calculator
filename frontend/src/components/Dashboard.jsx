import { useEffect, useState } from "react";
import {
  FaUsers,
  FaChartLine,
  FaUserGraduate,
  FaTrophy,
} from "react-icons/fa";

import "../styles/Dashboard.css";

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

  // ==========================================================
  // FETCH DASHBOARD DATA
  // ==========================================================

  useEffect(() => {
    fetchDashboard();
  }, [batch]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        `/api/dashboard?batch=${batch}`
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
    <div className="dashboard-page">

      {/* =====================================================
          DASHBOARD TITLE
      ===================================================== */}

      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Dashboard
        </h1>
      </div>

      {/* =====================================================
          OVERVIEW CARDS
      ===================================================== */}

      <div className="dashboard-cards-grid">

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

      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <div className="dashboard-bottom-grid">

        {/* ===================================================
            BATCH INSIGHTS
        =================================================== */}

        <div className="dashboard-section-card">

          <h2 className="dashboard-section-title">
            Batch Insights
          </h2>

          <Insight
            label="Batch"
            value={dashboard.batch}
          />

          <Insight
            label="Department"
            value={dashboard.department || "CSBS"}
          />

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
            last
          />

        </div>

        {/* ===================================================
            TOP 5 STUDENTS
        =================================================== */}

        <div className="dashboard-section-card">

          <h2 className="dashboard-section-title">
            Top 5 Students
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

            <p className="dashboard-no-data">
              No student data available.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}


// ==========================================================
// OVERVIEW CARD
// ==========================================================

function Card({ icon, title, value, color }) {
  return (
    <div className="dashboard-card">

      <div
        className="dashboard-card-icon"
        style={{
          background: color,
        }}
      >
        {icon}
      </div>

      <div className="dashboard-card-content">

        <div className="dashboard-card-title">
          {title}
        </div>

        <div className="dashboard-card-value">
          {value}
        </div>

      </div>

    </div>
  );
}


// ==========================================================
// BATCH INSIGHT
// ==========================================================

function Insight({ label, value, last }) {
  return (
    <div
      className={`dashboard-insight ${
        last ? "dashboard-insight-last" : ""
      }`}
    >

      <span className="dashboard-insight-label">
        {label}
      </span>

      <span className="dashboard-insight-value">
        {value}
      </span>

    </div>
  );
}


// ==========================================================
// TOP STUDENT
// ==========================================================

function TopStudent({ rank, name, cgpa }) {
  return (
    <div className="dashboard-top-student">

      <div className="dashboard-student-left">

        <div className="dashboard-rank">
          {rank}
        </div>

        <div className="dashboard-student-name">
          {name}
        </div>

      </div>

      <div className="dashboard-student-cgpa">
        {cgpa}
      </div>

    </div>
  );
}


export default Dashboard;