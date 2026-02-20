"use client";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export default function LoadingSpinner({
  size = "md",
  color = "border-main-blue",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          ${color}
          animate-spin
          rounded-full
          border-t-transparent
        `}
        role="status"
        aria-label="loading"
      />
    </div>
  );
}
