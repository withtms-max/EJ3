import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Interactive button with glow effect
 * Design: Minimalist Tech Elegance with cyan glow
 */
export function GlowButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: GlowButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 rounded-lg font-semibold overflow-hidden group ${
        isPrimary
          ? "bg-primary text-primary-foreground"
          : "border border-primary text-primary"
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect background */}
      <motion.div
        className={`absolute inset-0 rounded-lg ${
          isPrimary
            ? "bg-gradient-to-r from-primary via-primary to-primary"
            : "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20"
        }`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow shadow */}
      <motion.div
        className={`absolute inset-0 rounded-lg blur-xl ${
          isPrimary ? "bg-primary/50" : "bg-primary/30"
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
