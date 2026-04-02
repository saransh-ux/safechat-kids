import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Play } from 'lucide-react';
import Home from './pages/Home';
import ChatApp from './pages/ChatApp';
import ParentDashboard from './pages/ParentDashboard';
import Buddy from './components/Buddy';

export default function App() {
  const [session, setSession] = useState(null);
  const [showBreakAlert, setShowBreakAlert] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!session) return;
    const breakTimer = setTimeout(() => {
      setShowBreakAlert(true);
    }, 30 * 60 * 1000); // 30 mins
    return () => clearTimeout(breakTimer);
  }, [session]);

  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-slate-50 text-slate-800 font-sans tracking-tight">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full min-h-screen"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/app" element={<ChatApp session={session} setSession={setSession} />} />
            <Route path="/parents" element={<ParentDashboard session={session} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* 30 minute break alert */}
      {showBreakAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 font-sans">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-xl w-full text-center border-4 border-slate-100"
          >
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner text-5xl">
              ⏰
            </div>
            <h2 className="text-4xl justify-center font-black mb-4 text-slate-800 tracking-tight">Time for a Break!</h2>
            <p className="text-xl text-slate-500 mb-10 font-medium leading-relaxed">
              You've been learning for 30 minutes! It might be a good time to stretch, play outside, or talk with your family.
            </p>
            <button
              onClick={() => setShowBreakAlert(false)}
              className="bg-orange-500 hover:bg-orange-400 text-white font-black text-2xl py-5 px-10 rounded-[2.5rem] shadow-[0_8px_0_0_rgba(194,65,12,1)] active:translate-y-[8px] active:shadow-none w-full transition-all flex items-center justify-center gap-3"
            >
              <Play size={28} className="fill-white" />
              Continue Learning
            </button>
          </motion.div>
        </div>
      )}

      {/* Global animated buddy mascot */}
      <Buddy />
    </div>
  );
}
