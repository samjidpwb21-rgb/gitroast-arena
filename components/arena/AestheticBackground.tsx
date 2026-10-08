"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface AestheticBackgroundProps {
  cursorPos?: { x: number; y: number };
}

export const AestheticBackground: React.FC<AestheticBackgroundProps> = ({ cursorPos }) => {
  const shouldReduceMotion = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 18 subtle floating ambient particles
    const generated: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage across width
      size: Math.random() * 3 + 2, // 2px to 5px
      duration: Math.random() * 8 + 10, // 10s to 18s drift
      delay: Math.random() * 6,
      opacity: Math.random() * 0.4 + 0.15,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none">
      {/* 1. Base Midnight Gradient */}
      <div className="absolute inset-0 bg-[#080b12]" />

      {/* 2. Cyber Engineering Grid with Radial Fade Mask */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(249, 115, 22, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(249, 115, 22, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 40%, transparent 85%)",
        }}
      />

      {/* 3. Ambient Pulsating Radial Mesh Orbs */}
      {/* Top Center Fiery Aura */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.15, 1],
                opacity: [0.18, 0.28, 0.18],
              }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full bg-gradient-to-b from-orange-500/25 via-amber-600/15 to-transparent blur-[140px]"
      />

      {/* Bottom Left Deep Accent */}
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[160px]" />

      {/* Bottom Right Warm Glow */}
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[160px]" />

      {/* 4. Interactive Cursor Spotlight */}
      {cursorPos && (
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-orange-500/8 blur-[130px] transition-all duration-300 ease-out"
          style={{
            left: `${cursorPos.x - 300}px`,
            top: `${cursorPos.y - 300}px`,
          }}
        />
      )}

      {/* 5. Floating Ambient Embers / Cyber Dust Particles */}
      {!shouldReduceMotion &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "105vh", opacity: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, p.opacity, p.opacity, 0],
              x: ["-10px", "10px", "-10px"],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            className="rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
          />
        ))}
    </div>
  );
};
