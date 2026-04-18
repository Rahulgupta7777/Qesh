import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import ServicesFull from "./pages/Services";
import Schedule from "./pages/Schedule";
import Offers from "./pages/Offers";
import Shop from "./pages/Shop";
import Legal from "./pages/Legal";
import Loader from './components/ui/Loader';

function App() {
  const { pathname, hash, key } = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hash === "") {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [pathname, hash, key]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesFull />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </>
  )
}

export default App;
