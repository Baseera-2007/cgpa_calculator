import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

function DeleteDialog({
  open,
  onClose,
  student,
  onDelete,
}) {
  if (!student) return null;

  const handleDelete = () => {
    onDelete(student.id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          background: "#dc2626",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Delete Student
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Typography variant="body1">
          Are you sure you want to delete this student?
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontWeight: "bold",
            color: "#1e3a8a",
          }}
        >
          {student.student_name}
        </Typography>

        <Typography color="text.secondary">
          Register No : {student.register_number}
        </Typography>

        <Typography
          sx={{
            mt: 2,
            color: "red",
            fontSize: "14px",
          }}
        >
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;