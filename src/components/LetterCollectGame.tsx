"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Valid letters for LOVE ME - input can be in any order (2 E's, 1 L, 1 O, 1 V, 1 M)
const VALID_LETTERS = ["E", "E", "L", "M", "O", "V"];

const FIRST_CLUE =
  "Replace this with your first clue for the NFC tag hunt.";

const isValidLetterSet = (letters: string[]): boolean => {
  const sorted = [...letters].map((l) => l.toUpperCase()).sort().join("");
  const expected = [...VALID_LETTERS].sort().join("");
  return sorted === expected;
};

type LetterCollectGameProps = {
  onComplete: () => void;
};

export default function LetterCollectGame({ onComplete }: LetterCollectGameProps) {
  const [letters, setLetters] = useState<string[]>(Array(6).fill(""));
  const [showError, setShowError] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const errorTriggeredRef = useRef(false);

  const handleLetterChange = useCallback((index: number, value: string) => {
    const char = value.slice(-1).toUpperCase();
    if (!char || /[A-Z]/.test(char)) {
      setLetters((prev) => {
        const newLetters = [...prev];
        newLetters[index] = char;
        return newLetters;
      });
      if (index < 5) {
        setTimeout(() => {
          (document.querySelector(`[data-letter-idx="${index + 1}"]`) as HTMLInputElement)?.focus();
        }, 0);
      }
    }
  }, []);

  const allFilled = letters.every((l) => l);
  const isValid = allFilled && isValidLetterSet(letters);

  useEffect(() => {
    if (!allFilled || isValid || errorTriggeredRef.current) return;

    errorTriggeredRef.current = true;
    setShowError(true);

    const timer = setTimeout(() => {
      setLetters(Array(6).fill(""));
      setShowError(false);
      errorTriggeredRef.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, [allFilled, isValid]);

  const handleComplete = useCallback(() => {
    if (isValid) {
      onComplete();
    }
  }, [isValid, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center px-4 py-8"
    >
      {/* Main poem */}
      <p
        className="mb-6 text-center text-white text-lg lg:text-xl leading-relaxed max-w-lg font-display"
      >
        My love, here&rsquo;s a game for you.
        <br />
        Hunt the tags down and I&rsquo;ll propose to you.
        <br />
        If you don&rsquo;t know, what&rsquo;s to be found,
        <br />
        maybe you should click around.
      </p>

      {/* Question mark to reveal first clue */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setShowClue(!showClue)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-pink-500/30 text-white text-xl font-bold flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
          aria-label="Show first clue"
        >
          ?
        </button>
      </div>

      <AnimatePresence>
        {showClue && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-6 w-full max-w-xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center text-white/95 text-base lg:text-lg font-display"
            >
              Here&rsquo;s your first clue:
            </motion.p>
            <motion.blockquote
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="mt-2 text-center text-white/90 text-base lg:text-lg italic font-display"
            >
              &ldquo;{FIRST_CLUE}&rdquo;
            </motion.blockquote>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-gray-400 text-sm lg:text-base mb-8">
        Enter the 6 letters you find
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-2xl">
        {letters.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="flex flex-col items-center"
          >
            <input
              type="text"
              maxLength={1}
              value={letters[index]}
              onChange={(e) => handleLetterChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (isValid) handleComplete();
                } else if (e.key === "Backspace" && !letters[index]) {
                  const prev = (index - 1 + 6) % 6;
                  (document.querySelector(`[data-letter-idx="${prev}"]`) as HTMLInputElement)?.focus();
                }
              }}
              data-letter-idx={index}
              className={`w-14 h-14 lg:w-16 lg:h-16 text-center text-2xl font-bold rounded-xl border-2 bg-black/50 text-white transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                showError
                  ? "border-red-500 text-red-400"
                  : letters[index]
                    ? "border-green-500 text-green-400"
                    : "border-gray-600 text-gray-300"
              }`}
            />
          </motion.div>
        ))}
      </div>

      {isValid && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleComplete}
          className="mt-8 px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Continue
        </motion.button>
      )}
    </motion.div>
  );
}
