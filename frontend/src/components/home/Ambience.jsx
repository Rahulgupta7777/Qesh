import { useState } from 'react';
import { X } from 'lucide-react';
import { qeshImg } from '../../utils/pollinations';

const images = [
    qeshImg("luxury modern salon interior, styling stations, warm wood tones, golden hour light", { width: 900, height: 900, seed: 31 }),
    qeshImg("spa treatment room with soft lighting, white drapes, orchid flowers, calm atmosphere", { width: 900, height: 900, seed: 32 }),
    qeshImg("salon reception desk with marble counter, fresh flowers, elegant minimal decor", { width: 900, height: 900, seed: 33 }),
    qeshImg("manicure station with pastel tools, soft pink chair, natural daylight", { width: 900, height: 900, seed: 34 }),
    qeshImg("cozy waiting lounge at a luxury salon, plush seating, candles, serene mood", { width: 900, height: 900, seed: 35 }),
    qeshImg("hair wash basin area in a luxury salon, gentle lighting, clean modern design", { width: 900, height: 900, seed: 36 }),
];

const AmbienceCard = ({ image, onClick }) => (
    <div
        onClick={() => onClick(image)}
        className="relative group overflow-hidden rounded-[2rem] cursor-pointer neu-raised hover:-translate-y-1 transition-all duration-500 w-full h-full"
    >
        <img
            src={image}
            alt="Salon Ambience"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110 opacity-95 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <span className="text-white font-light tracking-widest text-sm uppercase">View</span>
            </div>
        </div>
    </div>
);

const MobileAmbienceCard = ({ image, onClick }) => (
    <div
        onClick={() => onClick(image)}
        className="relative group overflow-hidden rounded-[2rem] cursor-pointer flex-shrink-0 w-[85vw] snap-center h-[450px] neu-raised"
    >
        <img
            src={image}
            alt="Ambience"
            loading="lazy"
            className="w-full h-full object-cover"
        />
    </div>
);

const Ambience = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section id="ambience" className="relative w-full bg-cream h-screen flex flex-col justify-center snap-start overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
                <div className="text-center mb-20">
                    <span className="text-xs font-semibold tracking-[0.3em] text-brown-600 uppercase mb-4 block">
                        A Sanctuary of Calm
                    </span>
                    <h2 className="font-serif text-4xl md:text-6xl text-brown-900 mb-6 tracking-tight">
                        Our Ambience
                    </h2>
                    <div className="w-16 h-px bg-brown-900/30 mx-auto"></div>
                </div>

                <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-4 h-[532px]">
                    {images.map((img, index) => (
                        <AmbienceCard key={index} image={img} onClick={setSelectedImage} />
                    ))}
                </div>

                <div className="md:hidden flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                    {images.map((img, index) => (
                        <MobileAmbienceCard key={index} image={img} onClick={setSelectedImage} />
                    ))}
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={40} strokeWidth={1} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full size ambience"
                        className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default Ambience;
