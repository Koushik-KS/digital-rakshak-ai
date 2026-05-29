import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard, Users, BarChart3, Bell, Upload, FileText, ShieldCheck,
} from "lucide-react";
import { SidebarShell } from "@/components/SidebarShell";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/alerts", label: "Alerts", icon: Bell },
  { to: "/admin/csv-detection", label: "CSV Detection", icon: Upload },
  { to: "/admin/reports", label: "Reports", icon: FileText },
  { to: "/dashboard", label: "User Console", icon: ShieldCheck },
];

function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Admin access required");
      navigate({ to: "/dashboard" });
    }
  }, [user, navigate]);
  return (
    <SidebarShell title="Admin Console" items={items}>
      <Outlet />
    </SidebarShell>
  );
}
