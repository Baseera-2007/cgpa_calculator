import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <div className="card">
        <h3>👨‍🎓 Total Students</h3>
        <h1>120</h1>
      </div>

      <div className="card">
        <h3>📚 Total Subjects</h3>
        <h1>8</h1>
      </div>

      <div className="card">
        <h3>🎯 Average CGPA</h3>
        <h1>8.45</h1>
      </div>

      <div className="card">
        <h3>🏆 Highest CGPA</h3>
        <h1>9.82</h1>
      </div>

    </div>
  );
}

export default Dashboard;