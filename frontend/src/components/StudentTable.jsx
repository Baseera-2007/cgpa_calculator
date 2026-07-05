import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

function StudentTable({ students, onView }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ background: "#1e3a8a" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Register No
            </TableCell>

            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Student Name
            </TableCell>

            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Department
            </TableCell>

            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              CGPA
            </TableCell>

            <TableCell
              align="center"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>{student.register_number}</TableCell>

                <TableCell>{student.student_name}</TableCell>

                <TableCell>
                  {student.department?.includes(
                    "COMPUTER SCIENCE AND BUSINESS SYSTEMS"
                  )
                    ? "CSBS"
                    : student.department}
                </TableCell>

                <TableCell>{student.current_cgpa}</TableCell>

                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onView(student)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No Students Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StudentTable;