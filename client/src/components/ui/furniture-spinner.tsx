import { cn } from "@/lib/utils";

interface FurnitureSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FurnitureSpinner({ text, size = "md", className }: FurnitureSpinnerProps) {
  // Size mapping
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {/* Furniture icon animation */}
      <div 
        className={cn(
          "relative animate-bounce rounded-full border-2 border-primary", 
          sizeClasses[size]
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Furniture icon - simple chair shape */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="w-2/3 h-2/3 text-primary"
          >
            <path d="M20 10V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
            <path d="M4 19v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
            <path d="M4 10h16" />
            <path d="M8 19v-9" />
            <path d="M16 19v-9" />
          </svg>
        </div>
      </div>
      
      {/* Optional loading text */}
      {text && (
        <p className="mt-3 text-sm text-center text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

export function FurnitureLoading({ text, size, className }: FurnitureSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <FurnitureSpinner text={text} size={size} className={className} />
    </div>
  );
}