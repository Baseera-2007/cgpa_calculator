import VerifyCodeForm from "../components/VerifyCodeForm";
import { Box } from "@mui/material";

function VerifyCode() {
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
      <VerifyCodeForm />
    </Box>
  );
}

export default VerifyCode;