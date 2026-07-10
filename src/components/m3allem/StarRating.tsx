import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  /** Interactive mode: renders tappable stars and calls onChange. */
  onChange?: (value: number) => void;
  size?: "sm" | "lg";
  className?: string;
}

export function StarRating({ value, onChange, size = "sm", className }: StarRatingProps) {
  const interactive = Boolean(onChange);
  const starClass = size === "lg" ? "h-9 w-9" : "h-4 w-4";

  return (
    <div className={cn("flex items-center gap-1", interactive && "gap-2", className)} dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const StarEl = (
          <Star
            className={cn(
              starClass,
              "transition-colors",
              filled ? "fill-secondary text-secondary" : "fill-muted text-muted-foreground/30",
            )}
          />
        );
        if (!interactive) return <span key={star}>{StarEl}</span>;
        return (
          <motion.button
            key={star}
            type="button"
            aria-label={`${star}/5`}
            whileTap={{ scale: 0.7 }}
            whileHover={{ scale: 1.15, rotate: filled ? 0 : -8 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            onClick={() => onChange?.(star)}
          >
            {StarEl}
          </motion.button>
        );
      })}
    </div>
  );
}
