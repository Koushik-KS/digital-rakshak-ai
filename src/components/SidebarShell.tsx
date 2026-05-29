import { Link, useRouterState } from "@tanstack/react-router";
import { type LucideIcon, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

export type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean };

export function SidebarShell({
  items, title, children,
}: { items: NavItem[]; title: string; children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="p-5 border-b border-sidebar-border">
          <Logo />
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-2">{title}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
            return (
              <Link key={it.to} to={it.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-glow-cyan/40"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <it.icon className={cn("h-4 w-4", active && "text-accent")} />
                <span>{it.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-glow-cyan" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/40">
            <div className="h-9 w-9 rounded-full gradient-primary grid place-items-center text-sm font-bold text-primary-foreground">
              {(user?.name?.[0] ?? "U").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.name ?? "Guest"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => { logout(); navigate({ to: "/" }); }}
              className="p-2 rounded-md hover:bg-destructive/20 hover:text-destructive transition"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar">
          <Logo size="sm" />
          <button onClick={() => { logout(); navigate({ to: "/" }); }} className="text-xs text-muted-foreground">Logout</button>
        </div>
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
