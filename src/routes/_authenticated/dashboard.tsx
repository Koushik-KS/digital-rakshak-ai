import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard, Wallet, Globe, MessageSquareWarning, Bot, GraduationCap, Bell, User, Shield,
} from "lucide-react";
import { SidebarShell } from "@/components/SidebarShell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/transactions", label: "Transaction Scanner", icon: Wallet },
  { to: "/dashboard/url-scanner", label: "URL Scanner", icon: Globe },
  { to: "/dashboard/scam-detector", label: "Scam Detector", icon: MessageSquareWarning },
  { to: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
  { to: "/dashboard/learning", label: "Learning Center", icon: GraduationCap },
  { to: "/admin", label: "Admin Console", icon: Shield },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

function DashboardLayout() {
  return (
    <SidebarShell title="User Console" items={items}>
      <Outlet />
    </SidebarShell>
  );
}
