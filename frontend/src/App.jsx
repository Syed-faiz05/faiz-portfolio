import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProjectManager from './admin/ProjectManager';
import SkillManager from './admin/SkillManager';
import ProfileManager from './admin/ProfileManager';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes - Standalone Layout */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="skills" element={<SkillManager />} />
          <Route path="profile" element={<ProfileManager />} />
        </Route>

        {/* Public Routes - Main Layout */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

// Public Layout Wrapper
const MainLayout = () => (
  <div className="relative min-h-screen text-white bg-slate-900">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
    <Footer />
  </div>
);

export default App;
