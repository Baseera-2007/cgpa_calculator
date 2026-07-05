import { useEffect, useState } from "react";
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

function Dashboard() {

  const [dashboard, setDashboard] = useState({
    total_students: 0,
    average_cgpa: 0,
    highest_cgpa: 0,
    above9: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/dashboard"
      );

      const data = await response.json();

      setDashboard(data);

      if (data.chart_data) {
        setChartData(data.chart_data);
      }

    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div style={{ marginTop: "25px" }}>

      <h2
        style={{
          color: "#1e3a8a",
          marginBottom: "20px",
        }}
      >
        📊 Staff Dashboard
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
          value={dashboard.total_students}
        />

        <Card
          icon={<FaChartLine />}
          title="Average CGPA"
          value={dashboard.average_cgpa}
        />

        <Card
          icon={<FaUserGraduate />}
          title="Highest CGPA"
          value={dashboard.highest_cgpa}
        />

        <Card
          icon={<FaTrophy />}
          title="Above 9 CGPA"
          value={dashboard.above9}
        />

      </div>

      {/* Graph + Activity */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "35px",
        }}
      >

        {/* Graph */}

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
            Average CGPA by Batch
          </h3>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={chartData}>

              <XAxis dataKey="batch" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="cgpa"
                fill="#1e3a8a"
                radius={[8, 8, 0, 0]}
              />

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
            Summary
          </h3>

          <Activity
            text={`Total Students : ${dashboard.total_students}`}
          />

          <Activity
            text={`Average CGPA : ${dashboard.average_cgpa}`}
          />

          <Activity
            text={`Highest CGPA : ${dashboard.highest_cgpa}`}
          />

          <Activity
            text={`Students Above 9 CGPA : ${dashboard.above9}`}
          />

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