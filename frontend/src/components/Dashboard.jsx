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

  // ==========================================================
  // FETCH DASHBOARD DATA
  // ==========================================================

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
    <div style={styles.page}>

      {/* =====================================================
          DASHBOARD TITLE
      ===================================================== */}

      <div style={styles.header}>
        <h1 style={styles.title}>
          Dashboard
        </h1>
      </div>


      {/* =====================================================
          OVERVIEW CARDS
      ===================================================== */}

      <div style={styles.cardsGrid}>

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

      <div style={styles.bottomGrid}>

        {/* ===================================================
            BATCH INSIGHTS
        =================================================== */}

        <div style={styles.sectionCard}>

          <h2 style={styles.sectionTitle}>
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

        <div style={styles.sectionCard}>

          <h2 style={styles.sectionTitle}>
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

            <p style={styles.noData}>
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
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-4px)";

        e.currentTarget.style.boxShadow =
          "0 12px 28px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";

        e.currentTarget.style.boxShadow =
          "0 4px 16px rgba(0,0,0,0.06)";
      }}
    >

      <div
        style={{
          ...styles.cardIcon,
          background: color,
        }}
      >
        {icon}
      </div>

      <div style={styles.cardContent}>

        <div style={styles.cardTitle}>
          {title}
        </div>

        <div style={styles.cardValue}>
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
      style={{
        ...styles.insight,
        borderBottom: last
          ? "none"
          : "1px solid #eef2f7",
      }}
    >

      <span style={styles.insightLabel}>
        {label}
      </span>

      <span style={styles.insightValue}>
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
    <div style={styles.topStudent}>

      <div style={styles.studentLeft}>

        <div style={styles.rank}>
          {rank}
        </div>

        <div style={styles.studentName}>
          {name}
        </div>

      </div>

      <div style={styles.studentCgpa}>
        {cgpa}
      </div>

    </div>
  );
}


// ==========================================================
// STYLES
// ==========================================================

const styles = {

  // --------------------------------------------------------
  // PAGE
  // --------------------------------------------------------

  page: {
    padding: "28px 32px",
    minHeight: "100vh",
    background: "#f8fafc",
    boxSizing: "border-box",
    fontFamily:
      '"Segoe UI", "Inter", Arial, sans-serif',
  },

  // --------------------------------------------------------
  // HEADER
  // --------------------------------------------------------

  header: {
    marginBottom: "22px",
  },

  title: {
    margin: 0,
    color: "#1e3a8a",
    fontSize: "27px",
    fontWeight: "650",
    letterSpacing: "-0.3px",
  },

  // --------------------------------------------------------
  // OVERVIEW CARDS
  // --------------------------------------------------------

  cardsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "22px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "default",
  },

  cardIcon: {
    width: "52px",
    height: "52px",
    minWidth: "52px",
    borderRadius: "12px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  cardContent: {
    minWidth: 0,
  },

  cardTitle: {
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "5px",
    whiteSpace: "nowrap",
  },

  cardValue: {
    color: "#1e3a8a",
    fontSize: "27px",
    fontWeight: "650",
    lineHeight: "1.1",
  },

  // --------------------------------------------------------
  // BOTTOM SECTION
  // --------------------------------------------------------

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "22px",
  },

  sectionCard: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    margin: "0 0 18px",
    color: "#1e3a8a",
    fontSize: "19px",
    fontWeight: "650",
  },

  // --------------------------------------------------------
  // BATCH INSIGHTS
  // --------------------------------------------------------

  insight: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 2px",
  },

  insightLabel: {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
  },

  insightValue: {
    color: "#1e3a8a",
    fontSize: "14px",
    fontWeight: "600",
  },

  // --------------------------------------------------------
  // TOP STUDENTS
  // --------------------------------------------------------

  topStudent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 12px",
    marginBottom: "9px",
    borderRadius: "9px",
    background: "#f8fafc",
    border: "1px solid #f1f5f9",
  },

  studentLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  rank: {
    width: "32px",
    height: "32px",
    minWidth: "32px",
    borderRadius: "8px",
    background: "#1e3a8a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "600",
  },

  studentName: {
    color: "#374151",
    fontSize: "14px",
    fontWeight: "500",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  studentCgpa: {
    color: "#15803d",
    fontSize: "15px",
    fontWeight: "650",
  },

  noData: {
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },
};

export default Dashboard;