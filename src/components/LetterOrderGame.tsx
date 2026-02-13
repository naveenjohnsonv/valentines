"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

const TARGET_WORD = "LOVEME";

type LetterOrderGameProps = {
  onComplete: () => void;
};

export default function LetterOrderGame({ onComplete }: LetterOrderGameProps) {
  const [letters, setLetters] = useState<string[]>(TARGET_WORD.split("").map(() => ""));
  const [showError, setShowError] = useState(false);

  const handleLetterChange = useCallback((index: number, value: string) => {
    const char = value.slice(-1).toUpperCase();
    if (!char || /[A-Z]/.test(char)) {
      setLetters((prev) => {
        const newLetters = [...prev];
        newLetters[index] = char;
        return newLetters;
      });
      setShowError(false);

      if (char && index < 5) {
        (document.querySelector(`[data-order-idx="${index + 1}"]`) as HTMLInputElement)?.focus();
      }
    }
  }, []);

  const currentWord = letters.join("");
  const isComplete = currentWord.length === 6;
  const isCorrect = currentWord === TARGET_WORD;

  const handleSubmit = useCallback(() => {
    if (!isComplete) return;

    if (isCorrect) {
      onComplete();
    } else {
      setShowError(true);
    }
  }, [isComplete, isCorrect, onComplete]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isComplete) handleSubmit();
    } else if (e.key === "Backspace" && !letters[index] && index > 0) {
      const prev = index - 1;
      (document.querySelector(`[data-order-idx="${prev}"]`) as HTMLInputElement)?.focus();
    }
  }, [isComplete, handleSubmit, letters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center px-4 py-8"
    >
      <h2
        className="text-2xl lg:text-3xl font-semibold text-white mb-2 font-display"
      >
        Arrange the letters in order
      </h2>
      <p className="text-gray-400 text-sm lg:text-base mb-8">
        Put the 6 letters in the correct sequence
      </p>

      <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mb-8">
        {letters.map((letter, index) => (
          <motion.input
            key={index}
            type="text"
            maxLength={1}
            value={letter}
            onChange={(e) => handleLetterChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            data-order-idx={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`w-12 h-12 lg:w-14 lg:h-14 text-center text-xl font-bold rounded-xl border-2 bg-black/50 text-white transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 ${
              showError && isComplete ? "border-red-500" : "border-gray-600"
            }`}
          />
        ))}
      </div>

      {showError && isComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm mb-4"
        >
          Not quite right. Try again!
        </motion.p>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        onClick={handleSubmit}
        disabled={!isComplete}
        className={`px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
          isComplete
            ? "text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 shadow-lg cursor-pointer"
            : "text-gray-500 bg-gray-700 cursor-not-allowed"
        }`}
      >
        Unlock
      </motion.button>
    </motion.div>
  );
}
