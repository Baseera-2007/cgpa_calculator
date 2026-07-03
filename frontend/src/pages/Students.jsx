import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Students() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [students] = useState([
    { id: 1, name: "Student A", reg: "921724113001", cgpa: 8.5 },
    { id: 2, name: "Student B", reg: "921724113002", cgpa: 9.1 },
  ]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>👨‍🎓 Students List</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
        }}
      />

      {/* TABLE */}
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Name</th>
            <th>CGPA</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students
            .filter((s) =>
              s.name.toLowerCase().includes(search.toLowerCase()) ||
              s.reg.includes(search)
            )
            .map((s) => (
              <tr key={s.id}>
                <td>{s.reg}</td>
                <td>{s.name}</td>
                <td>{s.cgpa}</td>
                <td>
                  <button onClick={() => navigate("/student-details")}>
                    View
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;