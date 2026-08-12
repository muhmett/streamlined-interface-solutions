import { useState } from "react";
import type { Category } from "@/data/categories";
import { cn } from "@/lib/utils";

/**
 * A craft's visual: the generated tool render, with the line icon as a
 * guaranteed fallback. The photo is only revealed once it has actually
 * decoded, so a blocked or slow CDN degrades to the icon instead of an
 * empty box.
 */
export function CategoryVisual({
  category,
  className,
  iconClassName,
}: {
  category: Category;
  className?: string;
  iconClassName?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const Icon = category.icon;

  return (
    <span className={cn("relative block overflow-hidden", className)}>
      {!failed && (
        <img
          src={category.photo}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {(!loaded || failed) && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Icon className={cn("h-7 w-7", iconClassName)} />
        </span>
      )}
    </span>
  );
}
