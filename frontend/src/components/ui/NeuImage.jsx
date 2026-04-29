import { useState } from "react";
import { ImageIcon } from "lucide-react";

// Neumorphic image wrapper. Shows a soft skeleton while loading and a
// neumorphic icon fallback when the source 404s or times out (Pollinations
// occasionally fails — we don't want the layout to collapse).
const NeuImage = ({
  src,
  alt = "",
  className = "",
  fallbackIcon: FallbackIcon = ImageIcon,
  iconSize = 56,
}) => {
  const [status, setStatus] = useState("loading"); // loading | loaded | error

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status !== "loaded" && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream">
          <div className="neu-pressed w-24 h-24 rounded-full flex items-center justify-center">
            <FallbackIcon
              className={`text-brown-500 ${status === "loading" ? "animate-pulse" : ""}`}
              size={iconSize}
              strokeWidth={1.25}
            />
          </div>
        </div>
      )}
      {status !== "error" && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
};

export default NeuImage;
