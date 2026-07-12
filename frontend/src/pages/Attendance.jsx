import { useState } from "react";
import "../styles/Attendance.css";

function Attendance() {

  const [students, setStudents] = useState([]);

  const [batch, setBatch] = useState("");
  
  const [classBatch, setClassBatch] = useState("All");
  const [gender, setGender] = useState("All");

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});

  const [saved, setSaved] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState(""); 

  const loadStudents = async () => {

    try {

      const response = await fetch("http://127.0.0.1:8000/students");
      let data = await response.json();

      if (batch !== "") {
      data = data.filter(student => student.batch === batch);
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
  const saveAttendance = async () => {

  const present = students.filter(
    s => attendance[s.id] === "Present"
  );

  const absent = students.filter(
    s => attendance[s.id] === "Absent" || !attendance[s.id]
  );

  const od = students.filter(
    s => attendance[s.id] === "OD"
  );

  const message =
`📅 Attendance Report

Date: ${attendanceDate}
Batch: ${batch}

✅ Present (${present.length})
${present.map(s => `${s.register_number} - ${s.student_name}`).join("\n")}

❌ Absent (${absent.length})
${absent.map(s => `${s.register_number} - ${s.student_name}`).join("\n")}

🟡 OD (${od.length})
${od.map(s => `${s.register_number} - ${s.student_name}`).join("\n")}
`;
setAttendanceMessage(message);

try {

  for (const student of students) {

    const status = attendance[student.id] || "Absent";

    await fetch("http://127.0.0.1:8000/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: student.id,
        attendance_date: attendanceDate,
        status: status,
        marked_by: "Staff",
      }),
    });

  }

  setSaved(true);

  alert("✅ Attendance Saved Successfully!");

} catch (error) {

  console.log(error);

  alert("❌ Unable to save attendance.");

}

};

const copyAttendance = async () => {

  await navigator.clipboard.writeText(attendanceMessage);

  alert("📋 Attendance Copied Successfully!");

  window.open(
    `https://web.whatsapp.com/send?text=${encodeURIComponent(attendanceMessage)}`,
    "_blank"
  );

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
            <option value="">Select Batch</option>
            <option value="2023-2027">2023-2027</option>
            <option value="2024-2028">2024-2028</option>
            <option value="2025-2029">2025-2029</option>
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

      <button className="load-btn" onClick={saveAttendance}>
        Save Attendance
      </button>

      {saved && (
      <button className="load-btn" onClick={copyAttendance} style={{ marginLeft: "15px" }}>
       📋 Copy Attendance
      </button>
         )}

    </div>

  );

}

export default Attendance;