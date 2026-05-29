import { createFileRoute } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { mockLearningModules } from "@/data/mockData";

export const Route = createFileRoute("/_authenticated/dashboard/learning")({
  head: () => ({ meta: [{ title: "Learning Center — DigitalRakshak" }] }),
  component: Learning,
});

function Learning() {
  const avg = Math.round(mockLearningModules.reduce((a, m) => a + m.progress, 0) / mockLearningModules.length);
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Learning Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Bite-sized lessons that make you fraud-proof.</p>
        </div>
        <div className="glass rounded-xl px-4 py-2 text-sm">
          <span className="text-muted-foreground">Overall progress</span>{" "}
          <span className="font-bold text-gradient">{avg}%</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockLearningModules.map((m) => {
          const Icon = (Icons as any)[m.icon] as Icons.LucideIcon;
          return (
            <div key={m.id} className="glass rounded-2xl p-5 hover:shadow-glow-cyan transition group">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${m.color} grid place-items-center shadow-glow-cyan`}>
                {Icon && <Icon className="h-5 w-5 text-primary-foreground" />}
              </div>
              <h3 className="mt-4 font-semibold">{m.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">Difficulty · {m.difficulty}</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs"><span>Progress</span><span className="text-muted-foreground">{m.progress}%</span></div>
                <Progress value={m.progress} className="mt-1.5 h-1.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
