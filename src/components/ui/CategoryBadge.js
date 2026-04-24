import Link from "next/link";
import { getCategoryColor, getCategoryLabel, cn } from "@/lib/utils";

export default function CategoryBadge({
  category,
  linked = true,
  size = "sm",
  className = "",
}) {
  const colorClass = getCategoryColor(category);
  const label = getCategoryLabel(category);

  const sizeClass = size === "lg"
    ? "text-xs px-3 py-1.5"
    : "text-2xs px-2.5 py-1";

  const badge = (
    <span className={cn("cat-badge", colorClass, sizeClass, className)}>
      {label}
    </span>
  );

  if (!linked) return badge;

  return (
    <Link
      href={`/news?category=${category}`}
      className="hover:opacity-80 transition-opacity"
    >
      {badge}
    </Link>
  );
}
