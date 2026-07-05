import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";

function EditDialog({ open, onClose, student, onSave }) {
  const [formData, setFormData] = useState({
    student_name: "",
    department: "",
    batch: "",
    section: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        student_name: student.student_name || "",
        department: student.department || "",
        batch: student.batch || "",
        section: student.section || "A",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/student/${student.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      const updatedStudent = {
        ...student,
        ...formData,
      };

      onSave(updatedStudent);
    } catch (error) {
      console.error(error);
      alert("Unable to update student.");
    }
  };

  if (!student) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          background: "#f59e0b",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Edit Student
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Student Name"
              name="student_name"
              value={formData.student_name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditDialog;