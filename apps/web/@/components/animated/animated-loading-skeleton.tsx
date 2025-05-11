"use client";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

// Interface for grid configuration structure
interface GridConfig {
  numCards: number; // Total number of cards to display
  cols: number; // Number of columns in the grid
  xBase: number; // Base x-coordinate for positioning
  yBase: number; // Base y-coordinate for positioning
  xStep: number; // Horizontal step between cards
  yStep: number; // Vertical step between cards
}

const AnimatedLoadingSkeleton = ({ className }: { className?: string }) => {
  const [windowWidth, setWindowWidth] = useState(0); // State to store window width for responsiveness
  const controls = useAnimation(); // Controls for Framer Motion animations

  // Dynamically calculates grid configuration based on window width
  const getGridConfig = (width: number): GridConfig => {
    const numCards = 6; // Fixed number of cards
    const cols = width >= 1024 ? 3 : width >= 640 ? 2 : 1; // Set columns based on screen width
    return {
      numCards,
      cols,
      xBase: 40, // Starting x-coordinate
      yBase: 60, // Starting y-coordinate
      xStep: 210, // Horizontal spacing
      yStep: 230, // Vertical spacing
    };
  };

  // Generates random animation paths for the search icon
  const generateSearchPath = (config: GridConfig) => {
    const { numCards, cols, xBase, yBase, xStep, yStep } = config;
    const rows = Math.ceil(numCards / cols); // Calculate rows based on cards and columns
    const allPositions = [];

    // Generate grid positions for cards
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (row * cols + col < numCards) {
          allPositions.push({
            x: xBase + col * xStep,
            y: yBase + row * yStep,
          });
        }
      }
    }

    // Shuffle positions to create random animations
    const numRandomCards = 4;
    const shuffledPositions = allPositions
      .sort(() => Math.random() - 0.5)
      .slice(0, numRandomCards);

    // Ensure loop completion by adding the starting position
    shuffledPositions.push(shuffledPositions[0]);

    return {
      x: shuffledPositions.map((pos) => pos.x),
      y: shuffledPositions.map((pos) => pos.y),
      scale: Array(shuffledPositions.length).fill(1.2),
      transition: {
        duration: shuffledPositions.length * 2,
        repeat: Number.POSITIVE_INFINITY, // Loop animation infinitely
        ease: [0.4, 0, 0.2, 1], // Ease function for smooth animation
        times: shuffledPositions.map(
          (_, i) => i / (shuffledPositions.length - 1),
        ),
      },
    };
  };

  // Handles window resize events and updates the window width
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Updates animation path whenever the window width changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const config = getGridConfig(windowWidth);
    controls.start(generateSearchPath(config));
  }, [windowWidth, controls]);

  // Variants for frame animations
  const frameVariants = {
    hidden: { opacity: 0, scale: 0.95 }, // Initial state (hidden)
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }, // Transition to visible state
  };

  // Variants for individual card animations
  const cardVariants = {
    hidden: { y: 20, opacity: 0 }, // Initial state (off-screen)
    visible: (i: number) => ({
      // Animate based on card index
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.4 }, // Staggered animation
    }),
  };

  // Glow effect variants for the search icon
  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.2)",
        "0 0 35px rgba(59, 130, 246, 0.4)",
        "0 0 20px rgba(59, 130, 246, 0.2)",
      ],
      scale: [1, 1.1, 1], // Pulsating effect
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut", // Smooth pulsation
      },
    },
  };

  const config = getGridConfig(windowWidth); // Get current grid configuration

  return (
    <motion.div
      className={cn(
        "w-full max-w-4xl mx-auto p-6 bg-white dark:bg-transparent rounded-xl shadow-lg",
        className,
      )}
      variants={frameVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative overflow-hidden rounded-lg p-8">
        {/* Search icon with animation */}
        <motion.div
          className="absolute z-10 pointer-events-none"
          animate={controls}
          style={{ left: 24, top: 24 }}
        >
          <motion.div
            className="bg-blue-500/20 p-3 rounded-full backdrop-blur-sm"
            variants={glowVariants}
            animate="animate"
          >
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Search</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Grid of animated cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(config.numCards)].map((_, i) => (
            <motion.div
              key={`animated.loading.skeleton-card-${i.toString()}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i} // Index-based animation delay
              whileHover={{ scale: 1.02 }} // Slight scale on hover
              className="bg-white dark:bg-black rounded-lg shadow-sm p-4"
            >
              {/* Card placeholders */}
              <motion.div
                className="h-32 bg-white/10 rounded-md mb-3"
                animate={{
                  background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="h-3 w-3/4 bg-white/10 rounded mb-2"
                animate={{
                  background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="h-3 w-1/2 bg-white/10 rounded"
                animate={{
                  background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedLoadingSkeleton;
