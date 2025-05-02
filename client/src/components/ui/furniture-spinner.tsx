import { cn } from "@/lib/utils";

interface FurnitureSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FurnitureSpinner({ className, size = "md" }: FurnitureSpinnerProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative", sizes[size], className)}>
      {/* Chair base */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-3/5 border-4 border-primary rounded-t-3xl animate-pulse" />
      </div>

      {/* Chair legs */}
      <div className="absolute bottom-0 left-1/4 w-1/10 h-1/3 bg-primary rounded-b-sm animate-bounce" style={{ animationDuration: "1.5s", animationDelay: "0.1s" }} />
      <div className="absolute bottom-0 right-1/4 w-1/10 h-1/3 bg-primary rounded-b-sm animate-bounce" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />

      {/* Chair back */}
      <div className="absolute top-0 left-1/4 right-1/4 h-1/5 bg-primary rounded-t-md animate-pulse" />

      {/* Spinning overlay */}
      <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}

export function TableSpinner({ className, size = "md" }: FurnitureSpinnerProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative", sizes[size], className)}>
      {/* Table top */}
      <div className="absolute inset-x-0 top-1/4 h-1/8 bg-primary rounded-md animate-pulse" />

      {/* Table legs */}
      <div className="absolute top-1/3 bottom-0 left-1/5 w-1/10 bg-primary animate-bounce" style={{ animationDuration: "1.5s" }} />
      <div className="absolute top-1/3 bottom-0 right-1/5 w-1/10 bg-primary animate-bounce" style={{ animationDuration: "1.5s", animationDelay: "0.2s" }} />

      {/* Spinning overlay */}
      <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}

export function SofaSpinner({ className, size = "md" }: FurnitureSpinnerProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative", sizes[size], className)}>
      {/* Sofa base */}
      <div className="absolute inset-x-0 bottom-1/4 h-1/3 bg-primary rounded-md animate-pulse" />

      {/* Sofa back */}
      <div className="absolute inset-x-0 top-1/4 bottom-1/2 bg-primary rounded-t-md animate-pulse" style={{ animationDelay: "0.3s" }} />

      {/* Sofa arms */}
      <div className="absolute bottom-1/4 left-0 w-1/8 h-1/4 bg-primary rounded-l-md animate-bounce" style={{ animationDuration: "1.5s" }} />
      <div className="absolute bottom-1/4 right-0 w-1/8 h-1/4 bg-primary rounded-r-md animate-bounce" style={{ animationDuration: "1.5s", animationDelay: "0.2s" }} />

      {/* Spinning overlay */}
      <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}

export function FurnitureLoading({ className, text = "Loading..." }: { className?: string, text?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <div className="flex space-x-4">
        <FurnitureSpinner size="md" />
        <TableSpinner size="md" />
        <SofaSpinner size="md" />
      </div>
      <p className="mt-4 text-primary font-medium">{text}</p>
    </div>
  );
}