import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

function AddStudentDialog({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Add New Student
      </DialogTitle>

      <DialogContent>

        <Grid container spacing={2} sx={{ mt: 1 }}>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Register Number"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Student Name"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Gender"
              defaultValue="Male"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Batch"
              defaultValue="2023-2027"
            >
              <MenuItem value="2023-2027">2023-2027</MenuItem>
              <MenuItem value="2024-2028">2024-2028</MenuItem>
              <MenuItem value="2025-2029">2025-2029</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Semester"
              defaultValue="Semester 1"
            >
              <MenuItem value="Semester 1">Semester 1</MenuItem>
              <MenuItem value="Semester 2">Semester 2</MenuItem>
              <MenuItem value="Semester 3">Semester 3</MenuItem>
              <MenuItem value="Semester 4">Semester 4</MenuItem>
              <MenuItem value="Semester 5">Semester 5</MenuItem>
              <MenuItem value="Semester 6">Semester 6</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Section"
              defaultValue="A"
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
            />
          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          color="error"
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button variant="contained">
          Save Student
        </Button>

      </DialogActions>

    </Dialog>
  );
}

export default AddStudentDialog;