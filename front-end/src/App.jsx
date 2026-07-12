import { useState } from 'react';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Homepage from './pages/Homepage';
import CookieBanner from './Components/CookieBanner';
import AuthModal from './Components/AuthModal';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Url_backend = 'http://localhost:4000';

const App = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="bg-zinc-950 min-h-screen">
      <ToastContainer
        position="top-right"
        toastClassName="!bg-zinc-900 !text-white !border !border-zinc-700 !rounded-xl !text-sm"
        progressClassName="!bg-emerald-500"
      />

      <Navbar onAuthOpen={() => setAuthOpen(true)} />

      <Routes>
        <Route path="/" element={<Homepage onAuthRequired={() => setAuthOpen(true)} />} />
      </Routes>

      <Footer />
      <CookieBanner />

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
};

export default App;
