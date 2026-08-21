import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { Box } from "@mui/material";

function ForgotPassword() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        px: 2,
      }}
    >
      <ForgotPasswordForm />
    </Box>
  );
}

export default ForgotPassword;