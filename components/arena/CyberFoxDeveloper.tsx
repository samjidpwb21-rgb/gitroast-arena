"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Terminal, Check, Loader2 } from "lucide-react";

interface CyberFoxDeveloperProps {
  speech?: string;
  className?: string;
}

export function CyberFoxDeveloper({
  speech = "Let's see what you've been shipping...",
  className = "",
}: CyberFoxDeveloperProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative flex flex-col items-center lg:items-end justify-center select-none ${className}`}>
      {/* Ambient Cyber Neon Underglow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/20 via-amber-500/15 to-transparent rounded-3xl blur-3xl pointer-events-none -z-10" />

      {/* Floating Speech Bubble */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-20 mb-3 max-w-[260px] px-3.5 py-2.5 bg-zinc-950/90 border-2 border-orange-500/60 rounded-2xl shadow-[0_0_25px_rgba(249,115,22,0.3)] backdrop-blur-md self-center lg:self-start lg:ml-8"
      >
        <p className="text-xs sm:text-sm font-bold text-foreground leading-snug flex items-center gap-1.5">
          <span>{speech}</span>
          <span className="inline-block w-2 h-3.5 bg-orange-500 animate-pulse" />
        </p>
        {/* Tail pointing down toward fox mouth */}
        <div className="absolute -bottom-2.5 left-10 w-0 h-0 border-t-[10px] border-t-orange-500/60 border-r-[10px] border-r-transparent border-l-[3px] border-l-transparent" />
        <div className="absolute -bottom-2 left-10 w-0 h-0 border-t-[8px] border-t-zinc-950 border-r-[8px] border-r-transparent border-l-[2px] border-l-transparent" />
      </motion.div>

      {/* Main Illustration Container */}
      <div className="relative w-full max-w-[460px] flex items-end justify-center">
        {/* Floating Holographic Terminal HUD on the left */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute -left-2 sm:-left-4 top-16 z-20 hidden sm:flex flex-col gap-1 p-2.5 bg-zinc-950/80 border border-orange-500/30 rounded-xl backdrop-blur-md shadow-lg font-mono text-[10px] text-zinc-300 pointer-events-none"
        >
          <div className="flex items-center gap-1.5 pb-1 border-b border-zinc-800 text-orange-400 font-bold">
            <Terminal className="w-3 h-3" />
            <span>gitroast_core.sh</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <Check className="w-2.5 h-2.5" />
            <span>Connecting to GitHub...</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <Check className="w-2.5 h-2.5" />
            <span>Fetching profile...</span>
          </div>
          <div className="flex items-center gap-1 text-orange-400">
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
            <span>Scanning repos...</span>
          </div>
          <div className="text-zinc-400 opacity-60">
            <span>&gt; Analyzing code patterns...</span>
          </div>
          <div className="text-zinc-400 opacity-60">
            <span>&gt; Preparing the roast...</span>
          </div>
        </motion.div>

        {/* Detailed Full Body Cyber Fox Developer SVG */}
        <svg
          viewBox="0 0 460 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
          aria-label="Cyberpunk Fox Developer Mascot at desk with laptop"
        >
          <defs>
            {/* Fox Orange Gradient */}
            <linearGradient id="cfFoxOrange" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="40%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>

            {/* Dark Fur Shading */}
            <linearGradient id="cfFurDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#9A3412" />
            </linearGradient>

            {/* Techwear Jacket Gradient */}
            <linearGradient id="cfTechJacket" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#27272A" />
              <stop offset="50%" stopColor="#18181B" />
              <stop offset="100%" stopColor="#09090B" />
            </linearGradient>

            {/* Desk Surface Gradient */}
            <linearGradient id="cfDeskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18181B" />
              <stop offset="50%" stopColor="#27272A" />
              <stop offset="100%" stopColor="#09090B" />
            </linearGradient>

            {/* Neon Orange Glow Filter */}
            <filter id="cfOrangeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <radialGradient id="cfAura" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#F97316" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Fox Aura */}
          <circle cx="230" cy="180" r="160" fill="url(#cfAura)" />

          {/* ======================================================== */}
          {/* BACKGROUND DESK & TECH GEAR */}
          {/* ======================================================== */}
          {/* Desk Base Surface */}
          <path
            d="M20 340 L440 340 L450 395 L10 395 Z"
            fill="url(#cfDeskGrad)"
            stroke="#27272A"
            strokeWidth="3"
          />
          {/* Neon Orange Desk Edge Trim */}
          <line x1="15" y1="340" x2="445" y2="340" stroke="#F97316" strokeWidth="3" filter="url(#cfOrangeGlow)" />
          <line x1="20" y1="344" x2="440" y2="344" stroke="#FB923C" strokeWidth="1.5" />

          {/* Stack of Code Modules on the Left ("ANALYZE", "ROAST", "IMPROVE", "REPEAT") */}
          <g id="code-blocks">
            {/* Block 4: REPEAT */}
            <rect x="25" y="322" width="70" height="16" rx="3" fill="#18181B" stroke="#F97316" strokeWidth="1.5" />
            <text x="35" y="333" fill="#FB923C" fontSize="8" fontFamily="monospace" fontWeight="bold">REPEAT</text>

            {/* Block 3: IMPROVE */}
            <rect x="28" y="304" width="68" height="16" rx="3" fill="#18181B" stroke="#27272A" strokeWidth="1.5" />
            <text x="36" y="315" fill="#A1A1AA" fontSize="8" fontFamily="monospace" fontWeight="bold">IMPROVE</text>

            {/* Block 2: ROAST */}
            <rect x="25" y="286" width="72" height="16" rx="3" fill="#18181B" stroke="#F97316" strokeWidth="1.5" />
            <text x="38" y="297" fill="#F97316" fontSize="8" fontFamily="monospace" fontWeight="bold">ROAST</text>

            {/* Block 1: ANALYZE */}
            <rect x="30" y="268" width="65" height="16" rx="3" fill="#18181B" stroke="#27272A" strokeWidth="1.5" />
            <text x="38" y="279" fill="#A1A1AA" fontSize="8" fontFamily="monospace" fontWeight="bold">ANALYZE</text>
          </g>

          {/* Coffee Mug on Desk ("BAD CODE GOOD ROASTS") */}
          <g id="coffee-mug" transform="translate(305, 275)">
            {/* Mug Body */}
            <rect x="0" y="10" width="38" height="48" rx="4" fill="#18181B" stroke="#27272A" strokeWidth="2" />
            {/* Mug Handle */}
            <path d="M38 18 C48 18, 48 40, 38 40" stroke="#27272A" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Mug Fox Crest */}
            <polygon points="19,22 23,28 19,34 15,28" fill="#F97316" />
            <text x="5" y="44" fill="#F97316" fontSize="5.5" fontFamily="monospace" fontWeight="900">BAD CODE</text>
            <text x="3" y="51" fill="#FB923C" fontSize="5" fontFamily="monospace" fontWeight="900">GOOD ROASTS</text>
            {/* Steam rising */}
            <path d="M14 6 Q12 1 15 -3" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M22 6 Q25 0 21 -4" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* ======================================================== */}
          {/* FOX BODY, HOODIE & TECHWEAR JACKET */}
          {/* ======================================================== */}
          <g id="mascot-torso">
            {/* Upper Torso & Broad Shoulders */}
            <path
              d="M100 340 C100 240, 140 210, 230 210 C320 210, 360 240, 360 340 Z"
              fill="url(#cfTechJacket)"
              stroke="#09090B"
              strokeWidth="4"
            />

            {/* Techwear Jacket Collar / Cowl Neck */}
            <path
              d="M165 210 C165 245, 230 255, 230 255 C230 255, 295 245, 295 210 C280 230, 180 230, 165 210 Z"
              fill="#18181B"
              stroke="#09090B"
              strokeWidth="3"
            />

            {/* Glowing Neon Orange Jacket Trims & Harness Straps */}
            <path d="M175 220 L155 340" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" filter="url(#cfOrangeGlow)" />
            <path d="M285 220 L305 340" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" filter="url(#cfOrangeGlow)" />
            <path d="M190 245 L175 340" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" />
            <path d="M270 245 L285 340" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" />

            {/* Techwear Fox Badge / Emblem on Chest */}
            <g transform="translate(230, 275)">
              <polygon points="0,-16 12,-4 0,8 -12,-4" fill="#09090B" stroke="#F97316" strokeWidth="2" />
              {/* Fox Silhouette Inside Badge */}
              <polygon points="0,-12 8,-3 0,5 -8,-3" fill="#F97316" filter="url(#cfOrangeGlow)" />
              <circle cx="-3" cy="-4" r="1" fill="#09090B" />
              <circle cx="3" cy="-4" r="1" fill="#09090B" />
            </g>

            {/* White Chest Fur showing at collar */}
            <path
              d="M205 212 C210 230, 230 235, 230 235 C230 235, 250 230, 255 212 C245 222, 215 222, 205 212 Z"
              fill="#F8FAFC"
            />
          </g>

          {/* ======================================================== */}
          {/* CYBERPUNK DEVELOPER FOX HEAD & EXPRESSION */}
          {/* ======================================================== */}
          <g id="mascot-head" transform="translate(0, -10)">
            {/* EARS */}
            {/* Left Ear */}
            <g id="left-ear">
              {/* Outer Ear */}
              <path
                d="M135 155 C115 85, 140 25, 185 45 C200 52, 198 115, 185 155 Z"
                fill="url(#cfFoxOrange)"
                stroke="#09090B"
                strokeWidth="4"
              />
              {/* Black Cyber Tip */}
              <path d="M150 65 C145 42, 160 28, 185 45 C180 58, 165 65, 150 65 Z" fill="#09090B" />
              {/* Inner White Fluff */}
              <path
                d="M150 140 C140 100, 155 75, 178 82 C186 88, 184 118, 172 140 Z"
                fill="#F8FAFC"
              />
              {/* Inner Spikes */}
              <path d="M155 125 L168 115 L162 135 L178 125" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Right Ear */}
            <g id="right-ear">
              {/* Outer Ear */}
              <path
                d="M325 155 C345 85, 320 25, 275 45 C260 52, 262 115, 275 155 Z"
                fill="url(#cfFoxOrange)"
                stroke="#09090B"
                strokeWidth="4"
              />
              {/* Black Cyber Tip */}
              <path d="M310 65 C315 42, 300 28, 275 45 C280 58, 295 65, 310 65 Z" fill="#09090B" />
              {/* Inner White Fluff */}
              <path
                d="M310 140 C320 100, 305 75, 282 82 C274 88, 276 118, 288 140 Z"
                fill="#F8FAFC"
              />
              {/* Inner Spikes */}
              <path d="M305 125 L292 115 L298 135 L282 125" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Spiky Anime Hair Tufts (Top of Head) */}
            <g id="hair-tufts">
              <path
                d="M185 75 L205 32 L225 60 L242 22 L260 55 L278 36 L280 80 Z"
                fill="url(#cfFoxOrange)"
                stroke="#09090B"
                strokeWidth="4"
              />
              <path d="M210 50 L228 32 L240 50 L250 36 L262 60" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Head Silhouette Base */}
            <path
              d="M155 145 C145 95, 315 95, 305 145 C318 180, 298 225, 230 235 C162 225, 142 180, 155 145 Z"
              fill="url(#cfFoxOrange)"
              stroke="#09090B"
              strokeWidth="4.5"
            />

            {/* Fluffy White Cheeks */}
            {/* Left Cheek */}
            <path
              d="M152 148 C130 155, 112 175, 130 190 C148 205, 180 205, 198 215 C180 195, 162 170, 152 148 Z"
              fill="#F8FAFC"
              stroke="#09090B"
              strokeWidth="3"
            />
            {/* Right Cheek */}
            <path
              d="M308 148 C330 155, 348 175, 330 190 C312 205, 280 205, 262 215 C280 195, 298 170, 308 148 Z"
              fill="#F8FAFC"
              stroke="#09090B"
              strokeWidth="3"
            />

            {/* White Muzzle / Snout Base */}
            <path
              d="M192 170 C192 155, 268 155, 268 170 C268 210, 230 228, 230 228 C230 228, 192 210, 192 170 Z"
              fill="#F8FAFC"
              stroke="#09090B"
              strokeWidth="3.5"
            />

            {/* Glossy Black Fox Nose */}
            <path
              d="M218 170 C222 165, 238 165, 242 170 C245 178, 236 184, 230 185 C224 184, 215 178, 218 170 Z"
              fill="#09090B"
            />
            <ellipse cx="226" cy="172" rx="3" ry="1.5" fill="#FFFFFF" opacity="0.8" />

            {/* EYES (Sharp, Sly, Glowing Developer Fox Gaze) */}
            {/* Left Eye */}
            <g id="left-eye">
              {/* Eyeliner Wing */}
              <path d="M174 140 C178 120, 212 126, 218 144 C212 152, 184 152, 174 140 Z" fill="#09090B" />
              {/* White Sclera */}
              <path d="M178 140 C182 126, 208 130, 214 142 C210 148, 186 148, 178 140 Z" fill="#FFFFFF" />
              {/* Amber Glowing Iris */}
              <ellipse cx="200" cy="139" rx="8.5" ry="9" fill="#F97316" filter="url(#cfOrangeGlow)" />
              <ellipse cx="200" cy="139" rx="6.5" ry="7.5" fill="#EA580C" />
              {/* Pupil */}
              <ellipse cx="201" cy="139" rx="4.5" ry="7" fill="#09090B" />
              {/* Gloss Catchlights */}
              <circle cx="198" cy="135" r="2.5" fill="#FFFFFF" />
              <circle cx="203" cy="142" r="1.2" fill="#FFFFFF" />
            </g>

            {/* Right Eye */}
            <g id="right-eye">
              {/* Eyeliner Wing */}
              <path d="M286 140 C282 120, 248 126, 242 144 C248 152, 276 152, 286 140 Z" fill="#09090B" />
              {/* White Sclera */}
              <path d="M282 140 C278 126, 252 130, 246 142 C250 148, 274 148, 282 140 Z" fill="#FFFFFF" />
              {/* Amber Glowing Iris */}
              <ellipse cx="260" cy="139" rx="8.5" ry="9" fill="#F97316" filter="url(#cfOrangeGlow)" />
              <ellipse cx="260" cy="139" rx="6.5" ry="7.5" fill="#EA580C" />
              {/* Pupil */}
              <ellipse cx="259" cy="139" rx="4.5" ry="7" fill="#09090B" />
              {/* Gloss Catchlights */}
              <circle cx="257" cy="135" r="2.5" fill="#FFFFFF" />
              <circle cx="262" cy="142" r="1.2" fill="#FFFFFF" />
            </g>

            {/* EYEBROWS (Confident, Smug Arches) */}
            <path d="M174 120 Q196 108, 216 124" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M286 122 Q264 112, 244 126" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />

            {/* MOUTH (Iconic Sarcastic/Smug Smirk with White Fang) */}
            <g id="smirk-mouth">
              <path
                d="M210 194 Q232 206, 254 191"
                stroke="#09090B"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Cute white fang */}
              <polygon points="244,192 250,201 254,191" fill="#FFFFFF" stroke="#09090B" strokeWidth="1.5" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* ARMS & GLOVES (Posed on desk & chin) */}
          {/* ======================================================== */}
          {/* Left Arm & Cyber Glove (Thoughtfully resting on chin) */}
          <g id="left-arm-chin">
            {/* Jacket Sleeve */}
            <path
              d="M130 310 C145 270, 185 240, 205 215 L225 235 C205 260, 175 295, 160 330 Z"
              fill="url(#cfTechJacket)"
              stroke="#09090B"
              strokeWidth="3.5"
            />
            {/* Cyber Orange Wrist Strap */}
            <polygon points="198,225 218,210 224,218 204,233" fill="#F97316" />

            {/* Black Cyber Glove / Paw resting under chin */}
            <g id="left-glove">
              {/* Hand base */}
              <path
                d="M205 215 C205 198, 222 195, 230 205 C235 212, 228 228, 218 228 Z"
                fill="#18181B"
                stroke="#09090B"
                strokeWidth="3"
              />
              {/* Knuckle armor accents */}
              <circle cx="218" cy="208" r="2.5" fill="#F97316" />
              <circle cx="225" cy="204" r="2.5" fill="#F97316" />
              {/* Claws / Finger tips touching chin */}
              <path d="M228 198 L232 204" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>

          {/* Right Arm (Resting forward on desk) */}
          <g id="right-arm-desk">
            <path
              d="M330 310 C315 280, 275 290, 260 335 L285 340 C295 310, 320 300, 345 325 Z"
              fill="url(#cfTechJacket)"
              stroke="#09090B"
              strokeWidth="3.5"
            />
            {/* Cyber Orange Wrist Strap */}
            <polygon points="262,328 282,328 282,336 262,336" fill="#F97316" />
            {/* Right Glove Paw on desk */}
            <path
              d="M255 332 C250 332, 245 338, 252 342 L275 342 C280 342, 280 332, 272 332 Z"
              fill="#18181B"
              stroke="#09090B"
              strokeWidth="2.5"
            />
            <circle cx="258" cy="336" r="1.5" fill="#F97316" />
            <circle cx="266" cy="336" r="1.5" fill="#F97316" />
          </g>

          {/* ======================================================== */}
          {/* LAPTOP WITH GLOWING FOX LOGO */}
          {/* ======================================================== */}
          <g id="developer-laptop" transform="translate(100, 240)">
            {/* Laptop Screen Lid Angle */}
            <polygon
              points="15,40 120,40 105,100 0,100"
              fill="#18181B"
              stroke="#27272A"
              strokeWidth="3"
            />
            {/* Screen Bezel & Back Trim */}
            <polygon points="18,43 117,43 103,97 4,97" fill="#09090B" />

            {/* Glowing Neon Fox Logo on Laptop Lid */}
            <g transform="translate(58, 68)" filter="url(#cfOrangeGlow)">
              <polygon points="0,-16 12,-4 0,8 -12,-4" fill="#F97316" />
              {/* Cutouts for ears/eyes on logo */}
              <polygon points="-4,-6 0,-1 4,-6 0,-12" fill="#09090B" />
              <circle cx="-4" cy="-2" r="1.5" fill="#09090B" />
              <circle cx="4" cy="-2" r="1.5" fill="#09090B" />
            </g>

            {/* Laptop Base / Keyboard Deck */}
            <polygon
              points="-10,100 115,100 135,108 -30,108"
              fill="#27272A"
              stroke="#09090B"
              strokeWidth="2"
            />
            {/* Laptop Front Orange Light Strip */}
            <line x1="-25" y1="107" x2="130" y2="107" stroke="#F97316" strokeWidth="2" filter="url(#cfOrangeGlow)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
