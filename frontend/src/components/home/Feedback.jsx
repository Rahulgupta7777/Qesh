import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const reviews = [
    {
        id: 1,
        name: "Shweta Adey",
        rating: 5,
        review: "Highly recommend Sagar Salon & Spa to anyone looking for a luxurious yet homely self-care experience. The service, the comfort, and the love they put into their work is felt in every moment.",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38vG1mj8aOBLGXVnVvHnJYCsOzOK7A5c3UkTohupL19cycOZadqXEccIsiH6-ruwN1XnVCMWbbN57iFOlt5kZtE_tO6s5-R_ebPhrBWK7aMvPGR6ExbkHgSKB-7KQIWUuvOpWJDa_U3IKyMe=s250-p-k-rw",
    },
    {
        id: 2,
        name: "Riddhi Barge",
        rating: 5,
        review: "Had such a lovely experience at the salon! The staff were really polite and made me feel so comfortable. Service was smooth, professional, and perfectly done.",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38sNzZvVw6c3J6zoRJSkFCgtkrvSuwmcwdTF8Ii9JC51X1p8xqGp4ghKTAJVwjcye7Be5zAKz6hCp6D9zUYm-wBu64SP4tMeJD6U5Dt1wWz8CXbWiAv4uw4jPfg-JxkfLZy9IfGcGsqJl3cZ=s250-p-k-rw",
    },
    {
        id: 3,
        name: "Aditi Yedlawar",
        rating: 5,
        review: "The best part about the salon is that the artists are well trained and they keep complete track of the hygiene and cleanliness which give a more luxurious experience.",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38sBxqcdpGB9oMSu-NY6t3R0U9bJceZ7jIZ5t1U_hLqNGRGLAW8L3BF4rXc73aztGxzcqPTj-632-O1RBvPr8T3Kbvpd3BvRWtYSi6IIPrTzhp38oAYyWzDKXNZLi_okxnJ5JW80wEah52ga=s250-p-k-rw",
    },
    {
        id: 4,
        name: "Nikita Nongrum",
        rating: 5,
        review: "Sagaa Salon: Hair Color Perfection! I am absolutely blown away by the results. This is, without a doubt, the best hair color I have ever had!",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38vH98bAPmrtk4lbCSFRO7hFMHCIH_hw2zGiqhDjknb8xRhPWTcAsidYyz4KwreljJ0ucb4ejR_2wSINja6OXSuyzItB2G3trHhHV_KGzJvYHYFo3mrBTeP4udK0_G5Tlsam2UUGEFoHct27=s250-p-k-rw",
    },
    {
        id: 5,
        name: "Shambhavi Saxena",
        rating: 5,
        review: "I got my nails done from here and showed them the design I wanted. Even though they didn’t have the charms, they still managed to recreate the look by hand-painting it!",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38vG1mj8aOBLGXVnVvHnJYCsOzOK7A5c3UkTohupL19cycOZadqXEccIsiH6-ruwN1XnVCMWbbN57iFOlt5kZtE_tO6s5-R_ebPhrBWK7aMvPGR6ExbkHgSKB-7KQIWUuvOpWJDa_U3IKyMe=s250-p-k-rw",
    },
    {
        id: 6,
        name: "Piya Batra",
        rating: 5,
        review: "I recently got a cat-eye nail art done at Saagaa Salon, and it was absolutely fantastic! ✨ I loved the result and would definitely recommend Saagaa to anyone.",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38sNzZvVw6c3J6zoRJSkFCgtkrvSuwmcwdTF8Ii9JC51X1p8xqGp4ghKTAJVwjcye7Be5zAKz6hCp6D9zUYm-wBu64SP4tMeJD6U5Dt1wWz8CXbWiAv4uw4jPfg-JxkfLZy9IfGcGsqJl3cZ=s250-p-k-rw",
    },
    {
        id: 7,
        name: "Ankit Tomar",
        rating: 5,
        review: "From the moment you enter the salon, you’re greeted with such warmth and good vibes. The salon is so beautifully designed in itself and the ambiance is too good.",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38sW-YcmhTPo_FkO-LFcdH9N8aYHftK_xgtjQPxSO1trBPB2gOH7LFXjVuyPB922-KfsQ5APWFwPo-GvVJRwthOzigmQWdpEB8YQFqB_P7_0i14Bkemfj9B3fBhdRnZbMMUB912LWfMxcEo=s250-p-k-rw",
    },
    {
        id: 8,
        name: "Apeksha Shetty",
        rating: 5,
        review: "✨ Absolutely Loved My Experience at Saagaa Salon! ✨ I recently got my hair done at Saagaa Salon and I couldn’t be happier with the results! The staff was warm and welcoming.",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38vH98bAPmrtk4lbCSFRO7hFMHCIH_hw2zGiqhDjknb8xRhPWTcAsidYyz4KwreljJ0ucb4ejR_2wSINja6OXSuyzItB2G3trHhHV_KGzJvYHYFo3mrBTeP4udK0_G5Tlsam2UUGEFoHct27=s250-p-k-rw",
    },
    {
        id: 9,
        name: "Sikander Siku",
        rating: 5,
        review: "Amazing experience at Saagaa Salon! The staff is very professional, friendly, and skilled. The ambience is clean and relaxing. I’m extremely satisfied with the service quality.",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38sBxqcdpGB9oMSu-NY6t3R0U9bJceZ7jIZ5t1U_hLqNGRGLAW8L3BF4rXc73aztGxzcqPTj-632-O1RBvPr8T3Kbvpd3BvRWtYSi6IIPrTzhp38oAYyWzDKXNZLi_okxnJ5JW80wEah52ga=s250-p-k-rw",
    },
    {
        id: 10,
        name: "Ashish Yelgate",
        rating: 5,
        review: "The staff greeted me warmly, explained everything clearly, and made sure I was comfortable. The stylist understood exactly the look I wanted and delivered it perfectly.",
        image: "https://lh3.googleusercontent.com/geougc-cs/AMBA38vG1mj8aOBLGXVnVvHnJYCsOzOK7A5c3UkTohupL19cycOZadqXEccIsiH6-ruwN1XnVCMWbbN57iFOlt5kZtE_tO6s5-R_ebPhrBWK7aMvPGR6ExbkHgSKB-7KQIWUuvOpWJDa_U3IKyMe=s250-p-k-rw",
    },
];

const Feedback = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const getVisibleReview = (index) => {
        return reviews[(currentIndex + index + reviews.length) % reviews.length];
    };

    return (
        <section className="relative w-full bg-cream h-screen flex flex-col justify-center snap-start overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-xs font-semibold tracking-[0.3em] text-brown-400 uppercase mb-4 block">Testimonials</span>
                    <h2 className="font-serif text-4xl md:text-6xl text-brown-900 mb-6 tracking-tight">
                        Client Stories
                    </h2>
                    <div className="w-16 h-px bg-brown-900/30 mx-auto"></div>
                </div>

                {/* Carousel */}
                <div className="relative h-[450px] md:h-[400px] flex items-center justify-center perspective-1000">
                    {/* Far Left Card (-2) */}
                    <motion.div
                        className="absolute hidden lg:block w-[400px] opacity-20 blur-[2px] scale-75 -translate-x-[500px] z-0 pointer-events-none"
                        animate={{
                            x: -500,
                            scale: 0.75,
                            opacity: 0.15
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <ReviewCard review={getVisibleReview(-2)} />
                    </motion.div>

                    {/* Left Card (-1) */}
                    <motion.div
                        className="absolute hidden md:block w-[400px] opacity-40 blur-[1px] scale-90 -translate-x-[280px] z-10 cursor-pointer"
                        onClick={prevSlide}
                        animate={{
                            x: -280,
                            scale: 0.85,
                            opacity: 0.4
                        }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 0.87, opacity: 0.5 }}
                    >
                        <ReviewCard review={getVisibleReview(-1)} />
                    </motion.div>

                    {/* Active Card (Center) */}
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            className="absolute z-20 w-full max-w-lg md:max-w-xl px-4"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <ReviewCard review={getVisibleReview(0)} active={true} />
                        </motion.div>
                    </AnimatePresence>

                    {/* Right Card (+1) */}
                    <motion.div
                        className="absolute hidden md:block w-[400px] opacity-40 blur-[1px] scale-90 translate-x-[280px] z-10 cursor-pointer"
                        onClick={nextSlide}
                        animate={{
                            x: 280,
                            scale: 0.85,
                            opacity: 0.4
                        }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 0.87, opacity: 0.5 }}
                    >
                        <ReviewCard review={getVisibleReview(1)} />
                    </motion.div>

                    {/* Far Right Card (+2) */}
                    <motion.div
                        className="absolute hidden lg:block w-[400px] opacity-20 blur-[2px] scale-75 translate-x-[500px] z-0 pointer-events-none"
                        animate={{
                            x: 500,
                            scale: 0.75,
                            opacity: 0.15
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <ReviewCard review={getVisibleReview(2)} />
                    </motion.div>
                </div>

                {/* Navigation & Controls */}
                <div className="flex flex-col items-center gap-8 mt-12">
                    {/* Arrows */}
                    <div className="flex gap-4">
                        <button
                            onClick={prevSlide}
                            className="neu-btn p-4 rounded-full text-brown-700"
                            aria-label="Previous review"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="neu-btn p-4 rounded-full text-brown-700"
                            aria-label="Next review"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-brown-800 w-6"
                                    : "bg-brown-300/40 hover:bg-brown-400"
                                    }`}
                                aria-label={`Go to review ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const ReviewCard = ({ review, active = false }) => (
    <div className={`p-8 md:p-10 rounded-3xl ${active ? 'neu-raised-lg' : 'neu-flat opacity-60 grayscale'}`}>
        <div className="flex flex-col items-center text-center">
            {/* Image */}
            <div className="relative mb-6">
                <div className="neu-pressed w-24 h-24 rounded-full flex items-center justify-center">
                    <img
                        src={review.image}
                        alt={review.name}
                        className="w-20 h-20 rounded-full object-cover relative z-10"
                    />
                </div>
                <div className="absolute -bottom-2 -right-2 neu-chip px-2 py-1 rounded-full flex items-center gap-1 z-20">
                    <Star size={10} fill="#B45309" className="text-amber-700" />
                    <span className="text-[10px] font-bold text-brown-900">5.0</span>
                </div>
            </div>

            {/* Quote */}
            <Quote className="text-brown-100 w-8 h-8 mb-4 rotate-180" />

            {/* Text */}
            <p className={`font-serif text-xl md:text-2xl text-brown-900 leading-relaxed mb-6 ${active ? 'line-clamp-none' : 'line-clamp-3'}`}>
                "{review.review}"
            </p>

            {/* Name */}
            <div>
                <h4 className="font-sans font-bold text-sm tracking-widest text-brown-900 uppercase">
                    {review.name}
                </h4>
                <div className="h-px w-8 bg-brown-200 mx-auto mt-2"></div>
            </div>
        </div>
    </div>
);

export default Feedback;
