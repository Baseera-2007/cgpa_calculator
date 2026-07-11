import { useState } from "react";
import "../styles/Attendance.css";

function Attendance() {

  const [students, setStudents] = useState([]);

  const [batch, setBatch] = useState("All");
  const [section, setSection] = useState("All");
  const [classBatch, setClassBatch] = useState("All");
  const [gender, setGender] = useState("All");

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});

  const loadStudents = async () => {

    try {

      const response = await fetch("http://127.0.0.1:8000/students");
      let data = await response.json();

      if (batch !== "All") {
        data = data.filter(student => student.batch === batch);
      }

      if (section !== "All") {
        data = data.filter(student => student.section === section);
      }

      if (classBatch !== "All") {
        data = data.filter(student => student.class_batch === classBatch);
      }

      if (gender !== "All") {
        data = data.filter(student => student.gender === gender);
      }

      setStudents(data);

    } catch (error) {
      console.log(error);
      alert("Unable to load students.");
    }

  };

  const markAttendance = (studentId, status) => {

    setAttendance({
      ...attendance,
      [studentId]: status
    });

  };

  return (

    <div className="attendance-container">

      <h2>📅 Attendance Management</h2>

      <div className="filter-card">

        <div className="field">
          <label>Batch</label>

          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          >
            <option value="All">All</option>
            <option value="2023-2027">2023-2027</option>
            <option value="2024-2028">2024-2028</option>
          </select>

        </div>

        <div className="field">

          <label>Section</label>

          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            <option value="All">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>

        </div>

        <div className="field">

          <label>Class Batch</label>

          <select
            value={classBatch}
            onChange={(e) => setClassBatch(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Batch I">Batch I</option>
            <option value="Batch II">Batch II</option>
          </select>

        </div>

        <div className="field">

          <label>Gender</label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Female">Girls</option>
            <option value="Male">Boys</option>
          </select>

        </div>

        <div className="field">

          <label>Date</label>

          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />

        </div>

      </div>

      <button
        className="load-btn"
        onClick={loadStudents}
      >
        Load Students
      </button>

      <div className="attendance-table">

        <table>

          <thead>

            <tr>
              <th>Reg No</th>
              <th>Student Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>OD</th>
            </tr>

          </thead>

          <tbody>

            {students.length === 0 ? (

              <tr>
                <td colSpan="5">
                  No Students Loaded
                </td>
              </tr>

            ) : (

              students.map((student) => (

                <tr key={student.id}>

                  <td>{student.register_number}</td>

                  <td>{student.student_name}</td>

                  <td>
                    <input
                      type="radio"
                      checked={attendance[student.id] === "Present"}
                      onChange={() =>
                        markAttendance(student.id, "Present")
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="radio"
                      checked={attendance[student.id] === "Absent"}
                      onChange={() =>
                        markAttendance(student.id, "Absent")
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="radio"
                      checked={attendance[student.id] === "OD"}
                      onChange={() =>
                        markAttendance(student.id, "OD")
                      }
                    />
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <br />

      <button className="load-btn">
        Save Attendance
      </button>

    </div>

  );

}

export default Attendance;