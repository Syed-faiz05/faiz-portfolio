import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import AchievementsPage from './pages/Achievements';
import BlogsPage from './pages/Blogs';
import BlogPostPage from './pages/BlogPost';
import ScrollToTop from './components/ScrollToTop';

// Admin

import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import ProjectManager from './admin/pages/ProjectManager';
import AboutManager from './admin/pages/AboutManager';
import SkillManager from './admin/pages/SkillManager';
// Achievements map to AboutManager for timeline items currently
// Or we can just reuse AboutManager for achievements. Let's redirect or use AboutManager.
import Blog from './admin/pages/Blog';
import Messages from './admin/pages/Messages';
import Settings from './admin/pages/Settings';
import Login from './admin/pages/Login';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="bottom-right" />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectManager />} />
            <Route path="about" element={<AboutManager />} />
            <Route path="skills" element={<SkillManager />} />
            <Route path="achievements" element={<AboutManager />} />
            <Route path="blog" element={<Blog />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Public Routes - Main Layout */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Public Layout Wrapper
const MainLayout = () => (
  <div className="relative min-h-screen text-white bg-slate-900">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/blogs/:slug" element={<BlogPostPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
    <Footer />
  </div>
);

export default App;
