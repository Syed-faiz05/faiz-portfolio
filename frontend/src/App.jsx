import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

// Lazy load public pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AchievementsPage = lazy(() => import('./pages/Achievements'));
const BlogsPage = lazy(() => import('./pages/Blogs'));
const BlogPostPage = lazy(() => import('./pages/BlogPost'));

// Lazy load admin pages
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ProjectManager = lazy(() => import('./admin/pages/ProjectManager'));
const AboutManager = lazy(() => import('./admin/pages/AboutManager'));
const SkillManager = lazy(() => import('./admin/pages/SkillManager'));
const Blog = lazy(() => import('./admin/pages/Blog'));
const Messages = lazy(() => import('./admin/pages/Messages'));
const Settings = lazy(() => import('./admin/pages/Settings'));
const Login = lazy(() => import('./admin/pages/Login'));

// Prefetch component to load all pages in background
const PrefetchPages = () => {
  useEffect(() => {
    const pagesToPrefetch = [
      () => import('./pages/About'),
      () => import('./pages/SkillsPage'),
      () => import('./pages/ProjectsPage'),
      () => import('./pages/ContactPage'),
      () => import('./pages/Achievements'),
      () => import('./pages/Blogs'),
    ];

    // Delay prefetching to ensure home page loads first
    const timer = setTimeout(() => {
      pagesToPrefetch.forEach(prefetch => prefetch());
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="w-12 h-12 border-4 rounded-full border-cyan-500 border-t-transparent animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="bottom-right" />
        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

// Public Layout Wrapper
const MainLayout = () => (
  <div className="relative min-h-screen text-white bg-slate-900">
    <PrefetchPages />
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

