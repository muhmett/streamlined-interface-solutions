import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/** Shared easing — a soft "luxury" decelerate used across the app. */
export const EASE = [0.22, 1, 0.36, 1] as const;

// No `filter` here on purpose: a residual filter (even blur(0px)) makes the
// page wrapper a containing block, which re-anchors every position:fixed
// child (bottom nav, modals, fullscreen map) to the page instead of the viewport.
const pageVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
    transitionEnd: { transform: "none" },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

/** Wrap every routed page so AnimatePresence can orchestrate transitions. */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="enter" exit="exit" className={className}>
      {children}
    </motion.main>
  );
}

/** Stagger container + item for lists (artisan cards, categories…). */
export const staggerContainer: Variants = {
  initial: {},
  enter: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};
