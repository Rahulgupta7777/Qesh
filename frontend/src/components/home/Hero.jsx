import { useNavigate } from "react-router-dom";
import { MapPin, Sparkles } from "lucide-react";
import { qeshImg } from "../../utils/pollinations";

const heroPortrait = qeshImg(
  "serene woman portrait at a luxury salon, eyes closed, relaxed expression, soft golden-hour lighting, pastel neutral tones",
  { width: 900, height: 1100, seed: 12 },
);

const Hero = () => {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col md:flex-row justify-between flex-1 w-full max-w-full overflow-hidden">
      <div className="flex-1 flex flex-col justify-center text-center items-center pt-2 md:pt-0">
        <div className="neu-chip inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6">
          <Sparkles size={14} className="text-brown-600" />
          <span className="text-[11px] font-semibold tracking-[0.3em] text-brown-700 uppercase">
            Qesh · v1.2 · Soft UI
          </span>
        </div>

        <h1 className="font-serif text-6xl md:text-[5rem] lg:text-[7rem] font-semibold text-brown-900 leading-none tracking-[-2px] mb-2 px-4">
          Qesh
        </h1>
        <h2 className="font-sans text-3xl md:text-4xl lg:text-[3.5rem] font-light text-brown-700 leading-[1.2] mb-6 md:mb-10 tracking-[1px]">
          The family salon
        </h2>
        <p
          className="text-base md:text-lg text-brown-700 mb-6 tracking-[2px]"
          style={{ fontFamily: "'Louis George Cafe', sans-serif" }}
        >
          Transforming Beauty, Transforming You
        </p>

        <div className="neu-pressed inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 md:mb-12">
          <MapPin size={14} className="text-brown-700" />
          <span className="text-sm text-brown-700 tracking-wide">
            Dhanori, Pune · Maharashtra
          </span>
        </div>

        <button
          onClick={() => navigate("/services")}
          className="neu-btn text-brown-900 px-10 py-4 md:px-12 md:py-4 rounded-full text-base md:text-lg font-medium tracking-wide w-fit z-10"
        >
          Explore Services
        </button>
      </div>

      {/* Neumorphic portrait frame with Pollinations-generated portrait */}
      <div className="flex-1 flex justify-center md:justify-end items-end h-[50vh] md:h-full relative mt-8 md:mt-0 w-full md:pr-12">
        <div className="w-[85%] md:w-auto md:aspect-[5/6] h-full md:h-[min(600px,80vh)] neu-raised-lg rounded-t-[150px] md:rounded-t-[250px] relative overflow-hidden">
          <img
            src={heroPortrait}
            alt="Qesh salon portrait"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </header>
  );
};

export default Hero;
