import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const CodexHeroBackground: React.FC = () => {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle drifting cosmic star particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.7),
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.15 + 0.05,
      drift: (Math.random() - 0.5) * 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render drifting stars in upper deep space
      for (const p of particles) {
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.pulsePhase) * 0.25);

        ctx.fillStyle = isDark
          ? `rgba(224, 231, 255, ${currentAlpha})`
          : `rgba(99, 102, 241, ${currentAlpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Slow celestial movement
        p.x += p.drift;
        p.y -= p.speed;

        // Wrap around
        if (p.y < 0) {
          p.y = height * 0.65;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 transition-colors duration-300">
      {/* 1. Canvas Backdrop */}
      <div className={`absolute inset-0 transition-colors duration-300 ${
        isDark ? 'bg-[#000000]' : 'bg-gradient-to-b from-[#EEF2FF] via-[#F8FAFC] to-[#FAFAFA]'
      }`} />

      {/* 2. Massive Atmospheric Planetary Glow (Codex's Signature Celestial Glow) */}
      <div className={`absolute -top-[12%] sm:-top-[8%] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1300px] lg:w-[1500px] h-[550px] sm:h-[700px] rounded-[100%] blur-[80px] sm:blur-[110px] pointer-events-none transform -translate-y-1/4 transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#5c67b8]/45 via-[#373f7c]/25 to-transparent'
          : 'bg-gradient-to-b from-[#818cf8]/25 via-[#c7d2fe]/20 to-transparent'
      }`} />

      {/* 3. High-illumination Horizon Planetary Arc Rim Light */}
      <div className={`absolute -top-[60px] sm:-top-[90px] left-1/2 -translate-x-1/2 w-[1100px] sm:w-[1600px] lg:w-[1900px] h-[340px] sm:h-[460px] rounded-[100%] border-b pointer-events-none transition-all duration-300 ${
        isDark
          ? 'border-indigo-400/40 shadow-[0_12px_45px_rgba(99,102,241,0.35)] opacity-80'
          : 'border-indigo-300/50 shadow-[0_12px_45px_rgba(99,102,241,0.18)] opacity-90'
      }`} />

      {/* 4. Second Inner Precision Rim Light for Depth */}
      <div className={`absolute -top-[45px] sm:-top-[75px] left-1/2 -translate-x-1/2 w-[950px] sm:w-[1400px] lg:w-[1700px] h-[300px] sm:h-[420px] rounded-[100%] border-b pointer-events-none transition-all duration-300 ${
        isDark
          ? 'border-blue-300/30 shadow-[0_4px_25px_rgba(147,197,253,0.3)]'
          : 'border-blue-300/40 shadow-[0_4px_25px_rgba(147,197,253,0.15)]'
      }`} />

      {/* 5. Subtle Developer Grid Texture (Fades organically towards horizon) */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)',
        }}
      />

      {/* 6. Live Canvas with Drifting Star Dust & Micro-Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-75"
      />

      {/* 7. Gentle Vignette to blend into content and macOS preview below */}
      <div className={`absolute bottom-0 inset-x-0 h-40 pointer-events-none transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-t from-black via-black/80 to-transparent'
          : 'bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent'
      }`} />
    </div>
  );
};
