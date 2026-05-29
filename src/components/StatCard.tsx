import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label, value, icon: Icon, hint, accent = "primary",
}: { label: string; value: string | number; icon: LucideIcon; hint?: string; accent?: "primary" | "accent" | "success" | "warning" | "destructive" }) {
  const ring: Record<string, string> = {
    primary: "from-primary/30 to-primary/0",
    accent: "from-accent/30 to-accent/0",
    success: "from-success/30 to-success/0",
    warning: "from-warning/30 to-warning/0",
    destructive: "from-destructive/30 to-destructive/0",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass rounded-xl p-5 relative overflow-hidden"
    >
      <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${ring[accent]} blur-2xl`} />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1.5">{value}</p>
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
        <div className="h-10 w-10 rounded-lg gradient-primary grid place-items-center shadow-glow-cyan">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
