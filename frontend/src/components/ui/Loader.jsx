import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Wind, Sparkles } from "lucide-react";

const slides = [
  { icon: Scissors, text: "Premium Hair Styling" },
  { icon: Wind, text: "Luxury Blowouts" },
  { icon: Sparkles, text: "Exquisite Nail Care" },
];

const Loader = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("images");

  useEffect(() => {
    if (currentIndex < slides.length - 1) {
      const timer = setTimeout(() => setCurrentIndex((prev) => prev + 1), 800);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setPhase("transition"), 800);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (phase === "transition") {
      const timer = setTimeout(() => setPhase("logo"), 600);
      return () => clearTimeout(timer);
    }
    if (phase === "logo") {
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const ActiveIcon = slides[currentIndex].icon;

  return (
    <motion.div
      className="fixed inset-0 z-100 bg-cream flex items-center justify-center overflow-hidden"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <AnimatePresence mode="wait">
        {phase === "images" && (
          <motion.div
            key="images-container"
            className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-10"
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentIndex}
                className="flex flex-col items-center justify-center gap-10"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="neu-raised-lg rounded-full w-52 h-52 md:w-72 md:h-72 flex items-center justify-center">
                  <div className="neu-pressed rounded-full w-[80%] h-[80%] flex items-center justify-center">
                    <ActiveIcon
                      className="text-brown-700"
                      size={72}
                      strokeWidth={1.2}
                    />
                  </div>
                </div>
                <p className="text-brown-900 text-xl md:text-2xl font-serif tracking-wide text-center">
                  {slides[currentIndex].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {(phase === "transition" || phase === "logo") && (
          <motion.div
            key="logo-container"
            className="relative z-10 flex flex-col items-center justify-center"
          >
            <div className="neu-raised-lg px-10 py-6 rounded-3xl flex items-center gap-1">
              <motion.span
                className="font-serif text-6xl md:text-9xl text-brown-900 tracking-tighter inline-block"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Q
              </motion.span>
              <motion.span
                className="font-serif text-6xl md:text-9xl text-brown-900 tracking-tighter inline-block"
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              >
                e
              </motion.span>
              <motion.span
                className="font-serif text-6xl md:text-9xl text-brown-900 tracking-tighter inline-block"
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                s
              </motion.span>
              <motion.span
                className="font-serif text-6xl md:text-9xl text-brown-900 tracking-tighter inline-block"
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
              >
                h
              </motion.span>
            </div>

            <motion.div
              className="neu-chip mt-6 px-4 py-1.5 rounded-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <span className="text-[11px] font-semibold tracking-[0.3em] text-brown-700 uppercase">
                v1.2 · Soft UI
              </span>
            </motion.div>

            <motion.div
              className="overflow-hidden mt-4"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-brown-600 text-sm md:text-lg font-medium tracking-[0.5em] uppercase whitespace-nowrap text-center px-2">
                The Family Salon
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Loader;
