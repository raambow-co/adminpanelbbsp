import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Automatically transition to login after animation
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 15 }}
        animate={{ 
          opacity: 1, 
          scale: [0.7, 1.05, 1],
          y: 0
        }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative flex items-center justify-center cursor-pointer"
        onClick={onComplete}
      >
        {/* Soft Ambient Radial Glow Behind Logo */}
        <motion.div
          animate={{
            scale: [0.9, 1.15, 0.9],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#A5CEE0]/30 blur-2xl pointer-events-none"
        />

        {/* Logo Container - Only the logo */}
        <div className="relative w-40 h-40 sm:w-52 sm:h-52 p-4 flex items-center justify-center">
          <motion.img
            src="/build-bharat-logo.png"
            alt="Build Bharat Logo"
            className="w-full h-full object-contain filter drop-shadow-md"
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
