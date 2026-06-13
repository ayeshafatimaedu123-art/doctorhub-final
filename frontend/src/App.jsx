import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Public
import Home from './pages/Home';
import DoctorSearch from './pages/DoctorSearch';
import DoctorDetail from './pages/DoctorDetail';

// Layouts
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';
import AssistantLayout from './layouts/AssistantLayout';
import AdminLayout from './layouts/AdminLayout';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientAppointments from './pages/patient/Appointments';
import BookAppointment from './pages/patient/BookAppointment';
import PatientHistory from './pages/patient/MedicalHistory';
import PatientProfile from './pages/patient/Profile';
import PatientPrescriptions from './pages/patient/Prescriptions';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPatients from './pages/doctor/Patients';
import DoctorProfile from './pages/doctor/Profile';
import DoctorClinics from './pages/doctor/Clinics';
import AddPrescription from './pages/doctor/AddPrescription';

// Assistant Pages
import AssistantDashboard from './pages/assistant/Dashboard';
import PaymentVerification from './pages/assistant/PaymentVerification';
import AppointmentQueue from './pages/assistant/AppointmentQueue';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDoctors from './pages/admin/ManageDoctors';
import AuditLogs from './pages/admin/AuditLogs';
import SystemSettings from './pages/superadmin/SystemSettings';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<DoctorSearch />} />
      <Route path="/doctors/:id" element={<DoctorDetail />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDashboard(user?.role)} /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to={getDashboard(user?.role)} /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
        <Route element={<PatientLayout />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/book/:doctorId" element={<BookAppointment />} />
          <Route path="/patient/history" element={<PatientHistory />} />
          <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
        </Route>
      </Route>

      {/* Doctor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
        <Route element={<DoctorLayout />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/clinics" element={<DoctorClinics />} />
          <Route path="/doctor/prescription/:appointmentId" element={<AddPrescription />} />
        </Route>
      </Route>

      {/* Assistant Routes */}
      <Route element={<ProtectedRoute allowedRoles={['assistant']} />}>
        <Route element={<AssistantLayout />}>
          <Route path="/assistant/dashboard" element={<AssistantDashboard />} />
          <Route path="/assistant/payments" element={<PaymentVerification />} />
          <Route path="/assistant/queue" element={<AppointmentQueue />} />
        </Route>
      </Route>

      {/* Admin / Superadmin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/doctors" element={<ManageDoctors />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
          <Route path="/admin/system-settings" element={<SystemSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function getDashboard(role) {
  const paths = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', assistant: '/assistant/dashboard', admin: '/admin/dashboard', superadmin: '/admin/dashboard' };
  return paths[role] || '/';
}

export default App;
