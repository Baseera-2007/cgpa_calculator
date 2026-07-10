import SignupForm from "../components/SignupForm";

function Signup() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <SignupForm />
    </div>
  );
}

export default Signup;