"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LetterCollectGame from "@/components/LetterCollectGame";
import LetterOrderGame from "@/components/LetterOrderGame";
import ValentinesProposal from "@/components/ValentinesProposal";
import TextFooter from "@/components/TextFooter";
import OrientationGuard from "@/components/OrientationGuard";

const ANIM_DURATION = 0.5;

type Phase = "collect" | "order" | "proposal";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("collect");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLettersComplete = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase("order");
      setIsTransitioning(false);
    }, ANIM_DURATION * 1000);
  }, []);

  const handleOrderComplete = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase("proposal");
      setIsTransitioning(false);
    }, ANIM_DURATION * 1000);
  }, []);

  return (
    <OrientationGuard>
      <main className="flex items-center justify-center min-h-screen bg-black overflow-hidden relative">
        <AnimatePresence mode="wait">
          {phase === "collect" && (
            <motion.div
              key="collect"
              initial={{ opacity: 1 }}
              animate={{ opacity: isTransitioning ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: ANIM_DURATION }}
              className="flex flex-col items-center"
            >
              <LetterCollectGame onComplete={handleLettersComplete} />
              <div className="mt-4 md:mt-0">
                <TextFooter phase="collect" />
              </div>
            </motion.div>
          )}
          {phase === "order" && (
            <motion.div
              key="order"
              initial={{ opacity: 0 }}
              animate={{ opacity: isTransitioning ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: ANIM_DURATION }}
              className="flex flex-col items-center"
            >
              <LetterOrderGame onComplete={handleOrderComplete} />
              <div className="mt-4 md:mt-0">
                <TextFooter phase="order" />
              </div>
            </motion.div>
          )}
          {phase === "proposal" && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: ANIM_DURATION }}
            >
              <ValentinesProposal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </OrientationGuard>
  );
}
