import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Box,
} from "@mui/material";

import StudentTable from "../components/StudentTable";
import StudentDialog from "../components/StudentDialog";
import EditDialog from "../components/EditDialog";
import DeleteDialog from "../components/DeleteDialog";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.student_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      student.register_number?.includes(search)
  );

  // VIEW
  const handleView = (student) => {
    setSelectedStudent(student);
    setOpenView(true);
  };

  // EDIT
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setOpenEdit(true);
  };

  const handleSave = async (updatedStudent) => {
    await fetch(`http://127.0.0.1:8000/student/${updatedStudent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStudent),
    });

    setOpenEdit(false);
    loadStudents();
  };

  // DELETE
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setOpenDelete(true);
  };

  const handleDelete = async (student) => {
    await fetch(`http://127.0.0.1:8000/student/${student.id}`, {
      method: "DELETE",
    });

    setOpenDelete(false);
    loadStudents();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h4"
        sx={{
          color: "#1e3a8a",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        👨‍🎓 Students
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            label="Search Student"
            placeholder="Register No or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 350 }}
          />

          <Typography
            sx={{
              fontWeight: "bold",
              color: "#1e3a8a",
            }}
          >
            Total Students : {filteredStudents.length}
          </Typography>
        </Box>

        <StudentTable
          students={filteredStudents}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </Paper>

      <StudentDialog
        open={openView}
        onClose={() => setOpenView(false)}
        student={selectedStudent}
        refreshStudents={loadStudents}
      />

      <EditDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        student={selectedStudent}
        onSave={handleSave}
      />

      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        student={selectedStudent}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Students;