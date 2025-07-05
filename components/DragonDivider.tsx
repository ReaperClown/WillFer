import React from "react";

export default function DragonDivider() {
  return (
    <div className="flex items-center justify-center my-8 select-none">
      <div className="flex-grow border-t border-cyan-500 opacity-40"></div>

      <div className="relative mx-6 w-16 h-16 cursor-pointer group">
        {/* Dragão estilizado */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="cyan"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-fly transition-transform duration-700 ease-in-out group-hover:translate-x-1"
        >
          {/* Corpo sinuoso */}
          <path
            d="M8 32c6-10 20-10 28 0 4 6 4 16 0 22"
            stroke="cyan"
            fill="none"
          />
          {/* Cabeça com chifres */}
          <circle cx="36" cy="32" r="4" fill="cyan" />
          <path d="M36 28l2-4" stroke="cyan" />
          <path d="M36 36l2 4" stroke="cyan" />

          {/* Bigodes */}
          <path d="M32 34l-6 2" stroke="cyan" />
          <path d="M32 30l-6-2" stroke="cyan" />
        </svg>

        {/* Fogo animado */}
        <div className="absolute top-6 left-full ml-1 w-6 h-6 origin-left scale-0 group-hover:scale-100 transition-transform duration-300">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="cyan"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-fire"
          >
            <path d="M12 2c2 4-1 7-1 11 0 5 6 5 6 0 0-4-3-7-5-11z" />
            <path d="M12 10c1 2-1 3-1 5 0 3 4 3 4 0 0-2-2-3-3-5z" />
          </svg>
        </div>
      </div>

      <div className="flex-grow border-t border-cyan-500 opacity-40"></div>

      <style jsx>{`
        @keyframes fly {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px) rotate(2deg);
          }
        }

        @keyframes fire {
          0%,
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          50% {
            opacity: 0.7;
            transform: translateX(3px) scale(1.1);
          }
        }

        .animate-fly {
          animation: fly 3s ease-in-out infinite;
        }
        .animate-fire {
          animation: fire 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
