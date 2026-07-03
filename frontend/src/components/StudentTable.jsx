import { useState } from "react";
import "../styles/StudentTable.css";
import AddStudentDialog from "./AddStudentDialog";

function StudentTable() {

  const [open, setOpen] = useState(false);

  const students = [
    {
      regNo: "23CSBS001",
      name: "Aisha",
      section: "A",
      sgpa: 8.92,
      cgpa: 9.15,
    },
    {
      regNo: "23CSBS002",
      name: "Rahul",
      section: "A",
      sgpa: 8.51,
      cgpa: 8.72,
    },
    {
      regNo: "23CSBS003",
      name: "Priya",
      section: "A",
      sgpa: 9.42,
      cgpa: 9.41,
    },
    {
      regNo: "23CSBS004",
      name: "Arun",
      section: "B",
      sgpa: 8.74,
      cgpa: 8.96,
    },
  ];

  return (
    <div className="student-table-container">

      <div className="student-header">

        <h2>Student Management</h2>

        <button
          className="add-btn"
          onClick={() => setOpen(true)}
        >
          + Add Student
        </button>

      </div>

      <input
        type="text"
        placeholder="🔍 Search Student..."
        className="search-box"
      />

      <table className="student-table">

        <thead>
          <tr>
            <th>Register No</th>
            <th>Student Name</th>
            <th>Section</th>
            <th>SGPA</th>
            <th>CGPA</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.regNo}>

              <td>{student.regNo}</td>

              <td>{student.name}</td>

              <td>{student.section}</td>

              <td>{student.sgpa}</td>

              <td>{student.cgpa}</td>

              <td>

                <button className="edit-btn">
                  Edit
                </button>

                <button className="delete-btn">
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <AddStudentDialog
        open={open}
        handleClose={() => setOpen(false)}
      />

    </div>
  );
}

export default StudentTable;