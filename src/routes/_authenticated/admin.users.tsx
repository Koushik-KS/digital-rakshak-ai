import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { mockUsers } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Search, ShieldOff, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "User Management — Admin" }] }),
  component: UserManagement,
});

function UserManagement() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const filtered = users.filter((u) => (u.name + u.email).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Search, view, activate, block or delete users.</p>
      </header>

      <div className="glass rounded-2xl p-5">
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2">User</th>
                <th className="text-left py-2 px-2">Role</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-left py-2 px-2">Scans</th>
                <th className="text-left py-2 px-2">Risk</th>
                <th className="text-right py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/60 hover:bg-card/40">
                  <td className="py-3 px-2">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="py-3 px-2 capitalize">{u.role}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${u.status === "active" ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/30"}`}>{u.status}</span>
                  </td>
                  <td className="py-3 px-2">{u.scans}</td>
                  <td className="py-3 px-2 capitalize">{u.riskLevel}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewing ${u.name}`)}><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => { setUsers((arr) => arr.map((x) => x.id === u.id ? { ...x, status: x.status === "active" ? "blocked" : "active" } : x)); toast.success(`User ${u.status === "active" ? "blocked" : "activated"}`); }}>
                        {u.status === "active" ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setUsers((arr) => arr.filter((x) => x.id !== u.id)); toast.success("User deleted"); }} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
