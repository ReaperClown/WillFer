'use client';
import { useEffect, useRef, useState } from "react";

interface SkyBackgroundProps {
  date: Date;
  latitude: number;
  longitude: number;
  message?: string;
}

export default function SkyBackground({ date, latitude, longitude, message }: SkyBackgroundProps) {
  const skyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [tooltip, setTooltip] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  // Load VirtualSky script dynamically and initialize it
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://slowe.github.io/VirtualSky/virtualsky.min.js";
    script.async = true;
    script.onload = () => {
      if (skyRef.current) {
        skyRef.current.innerHTML = "";
        // @ts-expect-error
        window.virtualsky({
          id: skyRef.current,
          width: window.innerWidth,
          height: window.innerHeight,
          longitude,
          latitude,
          projection: "stereo",
          clock: date,
          showposition: true,
          showdate: true,
          showtime: true,
          showconstellations: true,
          showconstellationlabels: true,
          showstarlabels: true,
          showplanets: true,
          showgrid: false,
          transparent: true,
          negative: false,
          cardinalpoints: true,
          ground: false,
          meteorshowers: true,
          mouse: true,
          zoom: true,
          controls: true,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [date, latitude, longitude]);

  // Handle click on sky for tooltip interaction
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!skyRef.current) return;

      const bounds = skyRef.current.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      setTooltip({ x, y, visible: true });

      setTimeout(() => {
        setTooltip(prev => ({ ...prev, visible: false }));
      }, 2000); // Hide after 2s
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Shooting stars and twinkling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrame: number;
    let stars: { x: number, y: number, r: number, tw: number }[] = [];
    let shooting: { x: number, y: number, vx: number, vy: number, life: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      tw: Math.random() * Math.PI * 2,
    }));

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let s of stars) {
        s.tw += 0.02 + Math.random() * 0.01;
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(s.tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      if (Math.random() < 0.008) {
        const angle = Math.random() * Math.PI / 3 - Math.PI / 6;
        shooting.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          vx: Math.cos(angle) * 8,
          vy: Math.sin(angle) * 8,
          life: 0,
        });
      }
      for (let i = shooting.length - 1; i >= 0; i--) {
        let s = shooting[i];
        ctx.save();
        ctx.globalAlpha = 1 - s.life / 40;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 4, s.y - s.vy * 4);
        ctx.stroke();
        ctx.restore();
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        if (s.life > 40) shooting.splice(i, 1);
      }

      animationFrame = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  function MoonPhase() {
    return (
      <svg width="60" height="60" style={{
        position: "absolute", top: 40, right: 60, zIndex: 10, opacity: 0.7,
      }}>
        <circle cx="30" cy="30" r="25" fill="#fffbe6" />
        <ellipse cx="38" cy="30" rx="20" ry="25" fill="#23213a" />
      </svg>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        ref={skyRef}
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <MoonPhase />
      {message && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            fontSize: "1.2rem",
            background: "rgba(30,0,50,0.4)",
            padding: "10px 24px",
            borderRadius: 16,
            zIndex: 10,
            letterSpacing: 1,
            fontWeight: 500,
            textShadow: "0 2px 8px #000",
            pointerEvents: "none",
          }}
        >
          {message}
        </div>
      )}
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            transform: "translate(-50%, -120%)",
            background: "rgba(0,0,0,0.8)",
            padding: "6px 12px",
            borderRadius: 8,
            color: "#fff",
            zIndex: 15,
            fontSize: 14,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          ✨ Céu tocado
        </div>
      )}
    </div>
  );
}
