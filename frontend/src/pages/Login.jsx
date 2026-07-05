import LoginForm from "../components/LoginForm";

function Login() {
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
      <LoginForm />
    </div>
  );
}

export default Login;