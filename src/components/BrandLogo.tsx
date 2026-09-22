interface BrandLogoProps {
  size?: "sm" | "md";
  className?: string;
}

export function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  const isSm = size === "sm";

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div
        className={`rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-violet-500/25 shrink-0 ${
          isSm ? "w-5 h-5 rounded-md" : "w-7 h-7 rounded-lg"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"}
          aria-hidden="true"
        >
          <path d="M7.5 5.5v13l11-6.5-11-6.5z" />
        </svg>
      </div>

      <span
        className={`font-black tracking-tight text-white ${
          isSm ? "text-sm" : "text-base sm:text-lg"
        }`}
      >
        stofy<span className="text-violet-400">.ai</span>
      </span>
    </div>
  );
}
