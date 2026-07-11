import { Routes, Route } from "react-router-dom";
import Attendance from "./pages/Attendance";

import MainLayout from "./layouts/MainLayout";

// Authentication
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

// Staff Pages
import Home from "./pages/Home";
import Students from "./pages/Students";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Student Pages
import UploadResult from "./pages/UploadResult";
import StudentProfile from "./pages/StudentProfile";

function App() {
  return (
    <Routes>

      {/* Authentication */}
      <Route path="/" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      {/* Staff Portal */}
      <Route path="/staff" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="students" element={<Students />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Student Portal */}
      <Route path="/student" element={<MainLayout />}>
        <Route index element={<UploadResult />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

    </Routes>
  );
}

export default App;