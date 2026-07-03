import { FaUsers, FaChartLine, FaUserGraduate, FaTrophy } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Sem 1", cgpa: 8.2 },
  { name: "Sem 2", cgpa: 8.5 },
  { name: "Sem 3", cgpa: 8.9 },
  { name: "Sem 4", cgpa: 9.1 },
];

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      {/* TITLE */}
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        📊 Dashboard Overview
      </h1>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <Card icon={<FaUsers />} title="Students" value="450" />
        <Card icon={<FaChartLine />} title="Average CGPA" value="8.72" />
        <Card icon={<FaUserGraduate />} title="Topper CGPA" value="9.91" />
        <Card icon={<FaTrophy />} title="Above 9 CGPA" value="120" />
      </div>

      {/* CHART */}
      <div
        style={{
          marginTop: "40px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Semester Performance</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cgpa" fill="#1e3a8a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div
      style={{
        background: "#1e3a8a",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ fontSize: "30px" }}>{icon}</div>

      <h3 style={{ marginTop: "15px", marginBottom: "10px" }}>
        {title}
      </h3>

      <h1 style={{ margin: 0 }}>
        {value}
      </h1>
    </div>
  );
}

export default Dashboard;