import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeRedirect from "../src/routes/HomePageRedirect";
import VisitorForm from "./pages/VisitorForm";
import Visitors from "./pages/Visitors"
import AppointmentForm from "./pages/AppointmentForm";
import ActivePasses from "./pages/ActivePasses";
import ScanPage from "./pages/ScanPage";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import ProtectedRoute  from "./components/protectedRoute";
import Navbar from "./components/navbar";
import ApprovedAppointments from "./pages/ApprovedAppointments";
import Logs from "./pages/Logs"
import WalkInVisitor from "./pages/CreatePass";
import Report from "./pages/Report"
function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointment" element={<AppointmentForm />} />
        <Route path="/create-pass" element={<WalkInVisitor />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-visitor"
            element={
              <ProtectedRoute roles={["employee"]}>
                <VisitorForm  />
              </ProtectedRoute>
            }
          />

          <Route
            path="appointments"
            element={
              <ProtectedRoute roles={["employee"]}>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="visitors"
            element={
              <ProtectedRoute roles={["employee"]}>
                <Visitors />
              </ProtectedRoute>
            }
          />
          
          {/* <Route path="/visit-request" element={
            <ProtectedRoute roles={["employee"]}>
                <VisitorForm />
              </ProtectedRoute>
              }
               /> */}
          <Route
            path="create-pass"
            element={
              <ProtectedRoute roles={["security"]}>
                <WalkInVisitor />
              </ProtectedRoute>
            }
          />
          <Route
            path="active-passes"
            element={
              <ProtectedRoute roles={["security", "admin"]}>
                <ActivePasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="approved-appointments"
            element={
              <ProtectedRoute roles={["security"]}>
                <ApprovedAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="logs"
            element={
              <ProtectedRoute roles={["security"]}>
                < Logs/>
              </ProtectedRoute>
            }
          />

          <Route
            path="scan"
            element={
              <ProtectedRoute roles={["security"]}>
                <ScanPage />
              </ProtectedRoute>
            }
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;