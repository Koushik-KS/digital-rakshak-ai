import { createFileRoute } from "@tanstack/react-router";
import { Users, Activity, AlertTriangle, ShieldCheck, FileText, Upload, Percent } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { mockFraudTrends, mockUserGrowth } from "@/data/mockData";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line,
} from "recharts";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin Overview — DigitalRakshak" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">System-wide fraud monitoring & analytics.</p>
      </header>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value="6,284" icon={Users} accent="primary" />
        <StatCard label="Total Scans" value="48,917" icon={Activity} accent="accent" />
        <StatCard label="High Risk Tx" value="312" icon={AlertTriangle} accent="destructive" />
        <StatCard label="Fraud Reports" value="142" icon={FileText} accent="warning" />
        <StatCard label="CSV Files Processed" value="58" icon={Upload} accent="primary" />
        <StatCard label="Frauds Detected" value="894" icon={AlertTriangle} accent="destructive" />
        <StatCard label="Genuine Transactions" value="42,103" icon={ShieldCheck} accent="success" />
        <StatCard label="Detection Accuracy" value="98.4%" icon={Percent} accent="accent" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Daily fraud activity</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockFraudTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.035 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Bar dataKey="scams" fill="oklch(0.65 0.24 25)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="blocked" fill="oklch(0.72 0.18 195)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">User growth</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockUserGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="month" stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.035 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="users" stroke="oklch(0.78 0.16 220)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
