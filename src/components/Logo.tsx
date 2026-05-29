import { ShieldCheck } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2">
      <div className={`${dim} rounded-xl gradient-primary grid place-items-center shadow-glow-cyan`}>
        <ShieldCheck className="h-1/2 w-1/2 text-primary-foreground" strokeWidth={2.4} />
      </div>
      <span className={`${text} font-bold tracking-tight`}>
        Digital<span className="text-gradient">Rakshak</span>
      </span>
    </div>
  );
}
