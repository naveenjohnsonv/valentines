"use client";

import { useState } from "react";

const CLUE = "Your clue goes here — replace with the real clue for this tag.";
const LETTER = "X";

export default function Home() {
  const [revealed, setRevealed] = useState(false);

  return (
    <main className="flex items-center justify-center min-h-screen bg-black px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        <p className="text-gray-400 text-sm">Your letter is</p>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border-2 border-pink-500 bg-pink-500/10">
          <span className="text-4xl font-bold text-pink-400 font-display">
            {LETTER}
          </span>
        </div>
        <p className="text-gray-500 text-xs">
          Type in the letter into the game page!
        </p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Reveal Next Clue
          </button>
        ) : (
          <blockquote className="text-white/90 text-lg lg:text-xl italic font-display leading-relaxed">
            &ldquo;{CLUE}&rdquo;
          </blockquote>
        )}
      </div>
    </main>
  );
}
