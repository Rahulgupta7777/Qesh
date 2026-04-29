import { useState } from 'react';
import { X, Leaf, Flower, Flame, Wind, Droplets, Sparkles } from 'lucide-react';
import { qeshImg } from '../../utils/pollinations';
import NeuImage from '../ui/NeuImage';

const tiles = [
    { icon: Leaf, src: qeshImg("luxury modern salon interior, styling stations, warm wood tones, golden hour light", { width: 900, height: 900, seed: 31 }) },
    { icon: Flower, src: qeshImg("spa treatment room with soft lighting, white drapes, orchid flowers, calm atmosphere", { width: 900, height: 900, seed: 32 }) },
    { icon: Flame, src: qeshImg("salon reception desk with marble counter, fresh flowers, elegant minimal decor", { width: 900, height: 900, seed: 33 }) },
    { icon: Wind, src: qeshImg("manicure station with pastel tools, soft pink chair, natural daylight", { width: 900, height: 900, seed: 34 }) },
    { icon: Droplets, src: qeshImg("cozy waiting lounge at a luxury salon, plush seating, candles, serene mood", { width: 900, height: 900, seed: 35 }) },
    { icon: Sparkles, src: qeshImg("hair wash basin area in a luxury salon, gentle lighting, clean modern design", { width: 900, height: 900, seed: 36 }) },
];

const AmbienceCard = ({ tile, onClick }) => (
    <div
        onClick={() => onClick(tile.src)}
        className="relative group rounded-[2rem] cursor-pointer neu-raised hover:-translate-y-1 transition-all duration-500 w-full h-full overflow-hidden"
    >
        <NeuImage
            src={tile.src}
            alt="Salon Ambience"
            fallbackIcon={tile.icon}
            iconSize={48}
            className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-500"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
                <span className="text-white font-light tracking-widest text-sm uppercase">View</span>
            </div>
        </div>
    </div>
);

const MobileAmbienceCard = ({ tile, onClick }) => (
    <div
        onClick={() => onClick(tile.src)}
        className="relative rounded-[2rem] cursor-pointer flex-shrink-0 w-[85vw] snap-center h-[450px] neu-raised overflow-hidden"
    >
        <NeuImage
            src={tile.src}
            alt="Salon Ambience"
            fallbackIcon={tile.icon}
            iconSize={64}
            className="w-full h-full"
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
                    {tiles.map((t, i) => (
                        <AmbienceCard key={i} tile={t} onClick={setSelectedImage} />
                    ))}
                </div>

                <div className="md:hidden flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                    {tiles.map((t, i) => (
                        <MobileAmbienceCard key={i} tile={t} onClick={setSelectedImage} />
                    ))}
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white"
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
