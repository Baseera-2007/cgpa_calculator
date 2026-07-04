import {
  FaUsers,
  FaChartLine,
  FaUserGraduate,
  FaTrophy,
  FaCheckCircle,
} from "react-icons/fa";

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
    <div style={{ marginTop: "25px" }}>
      <h2
        style={{
          color: "#1e3a8a",
          marginBottom: "20px",
        }}
      >
        📊 Dashboard Overview
      </h2>

      {/* Dashboard Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >
        <Card
          icon={<FaUsers />}
          title="Total Students"
          value="450"
        />

        <Card
          icon={<FaChartLine />}
          title="Average CGPA"
          value="8.72"
        />

        <Card
          icon={<FaUserGraduate />}
          title="Top CGPA"
          value="9.91"
        />

        <Card
          icon={<FaTrophy />}
          title="Above 9 CGPA"
          value="120"
        />
      </div>

      {/* Graph + Recent Activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "35px",
        }}
      >
        {/* Chart */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: "#1e3a8a",
              marginBottom: "20px",
            }}
          >
            Semester Performance
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cgpa" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: "#1e3a8a",
              marginBottom: "20px",
            }}
          >
            Recent Activity
          </h3>

          <Activity text="Semester 3 Result Uploaded" />

          <Activity text="450 Students Processed" />

          <Activity text="Average CGPA Updated" />

          <Activity text="Reports Ready" />
        </div>
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
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          fontSize: "30px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          marginTop: "18px",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      <h1>{value}</h1>
    </div>
  );
}

function Activity({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "18px",
        color: "#444",
      }}
    >
      <FaCheckCircle color="green" />

      <span>{text}</span>
    </div>
  );
}

export default Dashboard;