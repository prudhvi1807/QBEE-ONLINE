import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { StoreProvider, useStore } from './lib/store';
import Home from './pages/Home';

const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Programs = lazy(() => import('./pages/Programs'));
const Kits = lazy(() => import('./pages/Kits'));
const Internships = lazy(() => import('./pages/Internships'));
const Placements = lazy(() => import('./pages/Placements'));
const Institutions = lazy(() => import('./pages/Institutions'));
const Companies = lazy(() => import('./pages/Companies'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Policies = lazy(() => import('./pages/Policies'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PortalLayout = lazy(() => import('./pages/portal/PortalLayout'));
const Dashboard = lazy(() => import('./pages/portal/Dashboard'));
const MyCourse = lazy(() => import('./pages/portal/MyCourse'));
const Labs = lazy(() => import('./pages/portal/Labs'));
const Assignments = lazy(() => import('./pages/portal/Assignments'));
const KitTracking = lazy(() => import('./pages/portal/KitTracking'));
const Booking = lazy(() => import('./pages/portal/Booking'));
const Certificates = lazy(() => import('./pages/portal/Certificates'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function SiteLayout() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

function RequireStudent() {
  const { student } = useStore();
  const loc = useLocation();
  if (!student) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />;
  return <Outlet />;
}

export default function App() {
  // HashRouter keeps deep links working on static hosting and in the preview.
  // Switch to BrowserRouter once the host rewrites all paths to index.html (Vercel/Netlify do).
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:slug" element={<CourseDetail />} />
            <Route path="programs" element={<Programs />} />
            <Route path="kits" element={<Kits />} />
            <Route path="internships" element={<Internships />} />
            <Route path="placements" element={<Placements />} />
            <Route path="institutions" element={<Institutions />} />
            <Route path="companies" element={<Companies />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="policies" element={<Policies />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route element={<RequireStudent />}>
              <Route path="portal" element={<PortalLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="course/:code" element={<MyCourse />} />
                <Route path="labs" element={<Labs />} />
                <Route path="labs/:labId" element={<Labs />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="kits" element={<KitTracking />} />
                <Route path="booking" element={<Booking />} />
                <Route path="certificates" element={<Certificates />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
