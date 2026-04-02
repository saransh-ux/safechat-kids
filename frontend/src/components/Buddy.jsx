import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function Buddy() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState('right');
  const location = useLocation();
  
  // Refs to hold timeouts so we can clear them easily
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // Check if user is in the assistant/chat page (/app)
  const isUsingAssistant = location.pathname.includes('/app');

  // Buddy Appearance Logic
  useEffect(() => {
    // If using the assistant, hide the buddy and stop scheduling
    if (isUsingAssistant) {
      setIsVisible(false);
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      return;
    }

    const scheduleNextAppearance = (isFirstTime) => {
      // First time delay: 5-10s, subsequent delay: 8-12s
      const delay = isFirstTime
        ? 5000 + Math.random() * 5000 // 5000 - 10000ms
        : 8000 + Math.random() * 4000; // 8000 - 12000ms

      showTimeoutRef.current = setTimeout(() => {
        // Randomize position
        setPosition(Math.random() > 0.5 ? 'left' : 'right');
        setIsVisible(true);

        // Hide after 6 seconds
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          // Recursively schedule next appearance
          scheduleNextAppearance(false);
        }, 6000);
        
      }, delay);
    };

    // Start scheduling
    scheduleNextAppearance(true);

    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isUsingAssistant]);

  // Framer Motion Variants
  const variants = {
    hidden: { 
      x: position === 'left' ? -150 : 150, 
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    },
    exit: { 
      x: position === 'left' ? -150 : 150, 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="buddy-mascot"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }} // Bouncy playfulness on hover
          className={`fixed bottom-6 z-50 cursor-pointer ${
            position === 'left' ? 'left-6' : 'right-6'
          }`}
        >
          {/* Subtle drop shadow and soft background to pop */}
          <div className="relative flex flex-col items-center">

            
            <img 
              src="/buddy_mascot_v2.png" 
              alt="Friendly Mascot" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl filter"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
