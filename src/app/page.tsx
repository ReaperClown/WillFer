"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { PolaroidCarousel } from "../../components/PolaroidCarousel";
import SkyBackground from "../../components/SkyBackground";
import defaultMessage from "@/utils/message";
import { motion, AnimatePresence } from "framer-motion";
import DragonDivider from "../../components/DragonDivider";
import TypewriterMessage from "../../components/TypewriterMessage"

interface TimeDiff {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FormatTimeInput extends TimeDiff {}

export default function CouplePage() {
  const [showButton, setShowButton] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [buttonLeaving, setButtonLeaving] = useState(false);
  const [togetherTime, setTogetherTime] = useState<FormatTimeInput | null>(
    null
  );
  const [metTime, setMetTime] = useState<FormatTimeInput | null>(null);
  const searchParams = useSearchParams();

  const name = searchParams.get("names") || "Willian & Fernanda";
  const startDate = new Date("2025-06-05T21:15:37-03:00");
  const metDate = new Date("2025-04-13T21:56:57-03:00");
  const message = searchParams.get("msg") || defaultMessage;
  const videoId = searchParams.get("yt") || "kPa7bsKwL-c";
  const images = [
    "/images/img1.jpg",
    "/images/img2.jpg",
    "/images/img3.jpg",
    "/images/img4.jpg",
    "/images/img5.jpg",
  ];

  const latitude = -23.5505;
  const longitude = -46.6333;
  const [showMet, setShowMet] = useState(true);

  const calculateTime = (start: Date): TimeDiff => {
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += previousMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  useEffect(() => {
    const update = () => {
      setTogetherTime(calculateTime(startDate));
      setMetTime(calculateTime(metDate));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMet((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (t: FormatTimeInput): string => {
    const parts = [];
    if (t.years > 0) parts.push(`${t.years} ano${t.years > 1 ? "s" : ""}`);
    if (t.months > 0) parts.push(`${t.months} mês${t.months > 1 ? "es" : ""}`);
    if (t.days > 0) parts.push(`${t.days} dia${t.days > 1 ? "s" : ""}`);
    if (t.hours > 0) parts.push(`${t.hours} hora${t.hours > 1 ? "s" : ""}`);
    if (t.minutes > 0)
      parts.push(`${t.minutes} minuto${t.minutes > 1 ? "s" : ""}`);
    parts.push(`${t.seconds} segundo${t.seconds !== 1 ? "s" : ""}`);
    return parts.join(" ");
  };

  const handleClick = () => {
    setButtonLeaving(true);
    setTimeout(() => {
      setShowButton(false);
      setShowContent(true);
    }, 400);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans">
      <SkyBackground date={metDate} latitude={latitude} longitude={longitude} />

      {showButton && (
        <button
          onClick={handleClick}
          className={`
            px-8 py-4 text-xl md:text-2xl font-bold bg-white/80 hover:bg-white/90 backdrop-blur-md text-rose-700 rounded-full shadow-lg transition-all duration-400
            ${buttonLeaving ? "opacity-0 scale-90" : "opacity-100 scale-100"}
          `}
        >
          💌 Clique em mim 💌
        </button>
      )}

      {showContent && (
        <div className="w-full flex flex-col items-center animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-bold text-center mt-6 drop-shadow">
            {name}
          </h1>

          {metTime && togetherTime && (
            <div className="relative w-full min-h-[5rem] flex flex-col items-center justify-center text-base md:text-lg mt-4">
              <AnimatePresence mode="wait">
                {showMet ? (
                  <motion.div
                    key="met"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-full text-center"
                  >
                    <p>🫶 Desde que se conheceram:</p>
                    <p>
                      <strong>{formatTime(metTime)}</strong>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="together"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-full text-center"
                  >
                    <p>💖 Juntos oficialmente há:</p>
                    <p>
                      <strong>{formatTime(togetherTime)}</strong>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="w-full max-w-2xl mt-6">
            <PolaroidCarousel images={images} />
          </div>

          <DragonDivider />

          <div className="mt-6 bg-white/60 backdrop-blur-sm p-4 md:p-6 rounded-xl max-w-4xl shadow-md">
  <TypewriterMessage message={message} />
</div>

          <DragonDivider />

          <div className="mt-8 w-full max-w-2xl aspect-video">
            <iframe
              className="w-full h-full rounded-xl shadow-md"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}`}
              title="Nossa Música"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>

          <footer className="text-sm text-center mt-12 text-rose-500 opacity-70">
            Feito com 💘 por alguém que te ama muito
          </footer>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease forwards;
        }
      `}</style>
    </div>
  );
}
