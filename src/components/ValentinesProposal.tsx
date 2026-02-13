"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { shuffleArray } from "@/utils/shuffle";

// Lazy-load Fireworks — only needed after the user clicks "Yes"
const Fireworks = dynamic(() => import("@fireworks-js/react").then((m) => m.default), {
  ssr: false,
});

const FLEE_DISTANCE = 180;
const MOVE_SPEED = 20;
const TELEPORT_MARGIN = 80;

// 59 images
const images = Array.from({ length: 59 }, (_, i) => `/game-photos/${i + 1}.avif`);

// Heart layout grid (11 columns) using 59 photo slots, null = empty
const heartLayout: (number | null)[][] = [
  [null, null, 0,    1,    null, null, null, 2,    3,    null, null],
  [null, 4,    5,    6,    7,    null, 8,    9,    10,   11,   null],
  [12,   13,   14,   15,   16,   17,   18,   19,   20,   21,   22  ],
  [23,   24,   25,   26,   27,   28,   29,   30,   31,   32,   33  ],
  [null, 34,   35,   36,   37,   38,   39,   40,   41,   42,   null],
  [null, null, 43,   44,   45,   46,   47,   48,   49,   null, null],
  [null, null, null, 50,   51,   52,   53,   54,   null, null, null],
  [null, null, null, null, 55,   56,   57,   null, null, null, null],
  [null, null, null, null, null, 58,   null, null, null, null, null],
];

// Pre-flatten the heart layout to avoid recalculating on every render
const flatHeartLayout = heartLayout.flat();

/** Return a random position within the viewport, respecting margins. */
function randomSafePosition(btnWidth: number, btnHeight: number) {
  const x = TELEPORT_MARGIN + Math.random() * (window.innerWidth - btnWidth - TELEPORT_MARGIN * 2);
  const y = TELEPORT_MARGIN + Math.random() * (window.innerHeight - btnHeight - TELEPORT_MARGIN * 2);
  return { x: Math.max(10, x), y: Math.max(10, y) };
}

export default function ValentinesProposal() {
  const [step, setStep] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [shuffledImages] = useState(() => shuffleArray(images));
  const noButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (step < 2) {
      const timer = setTimeout(() => setStep((s) => s + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step !== 2) setNoButtonPos(null);
  }, [step]);

  const fleeToRandomPosition = useCallback(() => {
    if (typeof window === "undefined") return;
    setNoButtonPos(randomSafePosition(140, 44));
  }, []);

  const handlePointerMove = useCallback(
    (e: Event) => {
      const ev = e as MouseEvent & { touches?: TouchList; changedTouches?: TouchList };
      const clientX = ev.touches?.[0]?.clientX ?? ev.changedTouches?.[0]?.clientX ?? ev.clientX;
      const clientY = ev.touches?.[0]?.clientY ?? ev.changedTouches?.[0]?.clientY ?? ev.clientY;
      if (clientX == null || clientY == null) return;
      if (step !== 2 || !noButtonRef.current) return;

      const rect = noButtonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dx = clientX - btnCenterX;
      const dy = clientY - btnCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < FLEE_DISTANCE) {
        setNoButtonPos((prev) => {
          // Teleport if cursor is right on the button
          if (distance < 5) return randomSafePosition(rect.width, rect.height);

          const baseX = prev ? prev.x : rect.left;
          const baseY = prev ? prev.y : rect.top;

          const ratio = MOVE_SPEED / distance;
          const newX = Math.max(10, Math.min(window.innerWidth - rect.width - 10, baseX - dx * ratio));
          const newY = Math.max(10, Math.min(window.innerHeight - rect.height - 10, baseY - dy * ratio));

          // Teleport if stuck at edge
          if (Math.abs(newX - baseX) < 2 && Math.abs(newY - baseY) < 2) {
            return randomSafePosition(rect.width, rect.height);
          }
          return { x: newX, y: newY };
        });
      }
    },
    [step]
  );

  const handleNoButtonAttempt = useCallback(
    (e: React.MouseEvent | React.PointerEvent | React.TouchEvent | React.KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      fleeToRandomPosition();
    },
    [fleeToRandomPosition]
  );

  const handleNoKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") handleNoButtonAttempt(e);
    },
    [handleNoButtonAttempt]
  );

  useEffect(() => {
    if (step === 2) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("touchmove", handlePointerMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("touchmove", handlePointerMove);
      };
    }
  }, [step, handlePointerMove]);

  const handleYesClick = useCallback(() => {
    setShowFireworks(true);
    setStep(3);
  }, []);

  // Memoize the heart grid to avoid re-rendering 63+ elements on unrelated state changes
  const heartGrid = useMemo(
    () =>
      flatHeartLayout.map((photoIdx, cellIdx) =>
        photoIdx !== null ? (
          <motion.div
            key={cellIdx}
            className="relative aspect-square rounded-sm overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: cellIdx * 0.01 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shuffledImages[photoIdx]}
              alt={`Photo ${photoIdx + 1}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div key={cellIdx} />
        )
      ),
    [shuffledImages]
  );

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.h2
            key="step-0"
            className="text-4xl font-semibold mb-4 font-display"
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Congratulations, my love! You were right, uh, I mean, you win!
          </motion.h2>
        )}
        {step === 1 && (
          <motion.h2
            key="step-1"
            className="text-4xl font-semibold mb-4 font-display"
            transition={{ duration: 1.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            I have a surprise for you!
          </motion.h2>
        )}
        {step === 2 && (
          <motion.div
            key="step-2"
            transition={{ duration: 1.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center overflow-y-auto max-h-[90vh] px-6 lg:px-10 py-6 w-full max-w-4xl scrollbar-hide"
          >
            {/* Image Grid Background */}
            <div className="absolute inset-0 grid grid-cols-7 opacity-10 pointer-events-none">
              {images.map((src, index) => (
                <div key={index} className="relative h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Memory ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Letter — replace with your own personal message */}
            <div className="relative z-10 text-white/95 text-base lg:text-lg leading-relaxed w-full max-w-3xl mb-8 font-display space-y-4">
              <p>Hi,</p>
              <p>
                Write your personal letter here. Tell them how you feel,
                what they mean to you, and why this Valentine&rsquo;s Day
                is special.
              </p>
              <p>Will you be my valentine, now and always?</p>
              <p>
                Love,<br />
                Your name
              </p>
            </div>

            <h2 className="relative z-10 text-4xl lg:text-5xl font-semibold mb-6 font-display">
              Will you be my Valentine?
            </h2>
            <Image
              src="/sad_hamster.png"
              alt="Sad Hamster"
              width={200}
              height={200}
              className="relative z-10"
            />
            <div className="flex flex-nowrap gap-4 mt-8 relative z-10 items-center justify-center">
              <button
                className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={handleYesClick}
              >
                Yes, I will! 🥰
              </button>
              <button
                ref={noButtonRef}
                type="button"
                className={`px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl hover:from-gray-600 hover:to-gray-700 hover:scale-95 transition-transform duration-100 shadow-lg select-none ${noButtonPos ? "fixed" : "relative"}`}
                style={
                  noButtonPos
                    ? { left: `${noButtonPos.x}px`, top: `${noButtonPos.y}px` }
                    : undefined
                }
                onClick={handleNoButtonAttempt}
                onMouseDown={handleNoButtonAttempt}
                onPointerDown={handleNoButtonAttempt}
                onTouchStart={handleNoButtonAttempt}
                onKeyDown={handleNoKeyDown}
              >
                No, I won&apos;t 😢
              </button>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step-3"
            className="flex flex-col justify-center items-center font-display overflow-y-auto max-h-[95vh] scrollbar-hide px-4 py-6 w-full relative z-20"
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-3xl lg:text-4xl font-semibold mb-6 text-center">
              YAY! You said yes all by yourself. I love you!
            </h2>
            <Image
              src="/hamster_jumping.gif"
              alt="Happy Hamster"
              width={150}
              height={150}
              unoptimized
              className="mb-6"
            />

            {/* Heart-shaped photo grid */}
            <div className="grid gap-1 lg:gap-1.5 w-full max-w-3xl mx-auto" style={{ gridTemplateColumns: "repeat(11, 1fr)" }}>
              {heartGrid}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <Fireworks
            options={{ autoresize: true }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
