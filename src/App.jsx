import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Instructions from './pages/Instructions';
import Downloads from './pages/Downloads';
import Changelogs from './pages/Changelogs';
import Troubleshooting from './pages/Troubleshooting';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15, ease: "linear" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function AnimatedContent() {
  const location = useLocation();
  
  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route index element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="instructions" element={<PageWrapper><Instructions /></PageWrapper>} />
          <Route path="downloads" element={<PageWrapper><Downloads /></PageWrapper>} />
          <Route path="changelogs" element={<PageWrapper><Changelogs /></PageWrapper>} />
          <Route path="support" element={<PageWrapper><Troubleshooting /></PageWrapper>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedContent />
    </Router>
  );
}

export default App;
