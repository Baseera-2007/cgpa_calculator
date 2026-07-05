import SigninForm from "../components/SigninForm";

function Signin() {
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
      <SigninForm />
    </div>
  );
}

export default Signin;