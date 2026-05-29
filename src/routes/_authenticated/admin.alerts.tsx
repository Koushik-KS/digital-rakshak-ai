import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { mockAlerts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/alerts")({
  head: () => ({ meta: [{ title: "Alerts — Admin" }] }),
  component: Alerts,
});

function Alerts() {
  const [list, setList] = useState(mockAlerts);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sev, setSev] = useState("medium");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return toast.error("Fill title and body");
    setList((l) => [{ id: "a" + Date.now(), title, body, severity: sev, time: "just now" }, ...l]);
    setTitle(""); setBody("");
    toast.success("Alert broadcast");
  };
  const sevColor: any = { critical: "destructive", high: "warning", medium: "accent", low: "success" };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">Broadcast critical security alerts to all users.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <form onSubmit={add} className="glass rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold flex items-center gap-2"><Bell className="h-4 w-4 text-accent" /> New broadcast</h3>
          <Input placeholder="Alert title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea rows={4} placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} />
          <select value={sev} onChange={(e) => setSev(e.target.value)} className="w-full rounded-md bg-input/20 border border-border px-3 py-2 text-sm">
            <option value="low">Low</option><option value="medium">Medium</option>
            <option value="high">High</option><option value="critical">Critical</option>
          </select>
          <Button className="w-full gradient-primary text-primary-foreground">Send alert</Button>
        </form>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-semibold">Alert history</h3>
          <ul className="mt-3 space-y-3">
            {list.map((a: any) => (
              <li key={a.id} className="rounded-lg p-3 bg-card/40 border border-border flex items-start gap-3">
                <span className={`mt-1 h-2 w-2 rounded-full bg-${sevColor[a.severity] ?? "accent"}`} />
                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium text-sm">{a.title}</p>
                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.body}</p>
                </div>
                <button onClick={() => setList((l) => l.filter((x) => x.id !== a.id))} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
