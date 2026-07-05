import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Button,
  Divider,
  Box,
} from "@mui/material";

function StudentDialog({
  open,
  onClose,
  student,
}) {
  if (!student) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          background: "#1e3a8a",
          color: "white",
          fontWeight: "bold",
          fontSize: 24,
        }}
      >
        Student Details
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>

        <Grid container spacing={3}>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Register Number
            </Typography>

            <Typography>
              {student.register_number}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Student Name
            </Typography>

            <Typography>
              {student.student_name}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Department
            </Typography>

            <Typography>
              CSBS
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Batch
            </Typography>

            <Typography>
              {student.batch || "2023-2027"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Section
            </Typography>

            <Typography>
              {student.section || "A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Current CGPA
            </Typography>

            <Typography>
              {student.current_cgpa}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Current Semester
            </Typography>

            <Typography>
              Semester {student.current_semester}
            </Typography>
          </Grid>

        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#1e3a8a",
            mb: 2,
          }}
        >
          Uploaded Semester Results
        </Typography>

        <Box
          sx={{
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            background: "#fafafa",
          }}
        >
          <Typography>
            Semester {student.current_semester} Result Uploaded
          </Typography>

          <Typography color="text.secondary">
            More semester details will be connected from the database in the next step.
          </Typography>
        </Box>

      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          justifyContent: "space-between",
        }}
      >
        <Box>

          <Button
            variant="contained"
            color="warning"
            sx={{ mr: 1 }}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            color="error"
          >
            Delete
          </Button>

        </Box>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            background: "#1e3a8a",
          }}
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>
  );
}

export default StudentDialog;