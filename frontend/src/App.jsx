import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddQuiz from './pages/admin/AddQuiz';
import ResultList from './pages/admin/ResultList';
import UserDashboard from './pages/user/UserDashboard';
import UserQuiz from './pages/user/UserQuiz';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import UserAttempts from './pages/user/UserAttempts';
import AdminUserList from './pages/admin/AdminUserList';
import AdminEmailSender from './pages/admin/AdminEmailSender';
import AdminReschedule from './pages/admin/AdminReschedule';
import Navbar from './components/Navbar';
import EditQuiz from './pages/admin/UpdateQuize';

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="add-quiz" element={<AddQuiz />} />
          <Route path="results" element={<ResultList />} />
          <Route path="all-user" element={<AdminUserList />} />
          <Route path="resedhule-quiz" element={<AdminReschedule />} />
          <Route path="email-send" element={<AdminEmailSender />} />
          <Route path="update/:quizId" element={<EditQuiz/>} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={
          <ProtectedRoute allowedRole="user">
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<UserDashboard />} />
          <Route path="attempts" element={<UserAttempts />} />
          <Route path="quiz/:quizId" element={<UserQuiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
