import { createFileRoute } from "@tanstack/react-router";
import { mockFraudTrends, mockUserGrowth } from "@/data/mockData";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Admin" }] }),
  component: Analytics,
});

const risk = [
  { name: "Low", value: 65 },
  { name: "Medium", value: 22 },
  { name: "High", value: 13 },
];
const COLORS = ["oklch(0.74 0.18 155)", "oklch(0.82 0.17 85)", "oklch(0.65 0.24 25)"];

function Analytics() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Fraud trends, user growth and risk distribution.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Fraud trend (area)</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <AreaChart data={mockFraudTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.035 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Area dataKey="scams" stroke="oklch(0.65 0.24 25)" fill="oklch(0.65 0.24 25 / 0.4)" />
                <Area dataKey="blocked" stroke="oklch(0.72 0.18 195)" fill="oklch(0.72 0.18 195 / 0.4)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Risk distribution</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={risk} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {risk.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.035 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-semibold">User growth</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <BarChart data={mockUserGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="month" stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.035 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Bar dataKey="users" fill="oklch(0.78 0.16 220)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
