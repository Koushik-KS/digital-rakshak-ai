import { cn } from "@/lib/utils";

export type RiskLevel = "Genuine" | "Suspicious" | "Fake" | "Safe" | "Dangerous";

export function RiskBadge({ level, score }: { level: string; score?: number }) {
  const map: Record<string, string> = {
    Genuine: "bg-success/15 text-success border-success/30",
    Safe: "bg-success/15 text-success border-success/30",
    Suspicious: "bg-warning/15 text-warning border-warning/30",
    Fake: "bg-destructive/15 text-destructive border-destructive/40",
    Dangerous: "bg-destructive/15 text-destructive border-destructive/40",
  };
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      map[level] ?? "bg-muted text-foreground border-border",
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level}{typeof score === "number" ? ` · ${score}` : ""}
    </span>
  );
}
