import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Activity, AlertTriangle, TrendingUp, Wallet, BellRing } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { mockAlerts, mockFraudTrends, mockTransactions } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — DigitalRakshak" }] }),
  component: Overview,
});

function Overview() {
  const safetyScore = 92;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Your security dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Realtime fraud verdicts, scans and alerts at a glance.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Safety Score" value={`${safetyScore}/100`} icon={ShieldCheck} accent="success" hint="Above average" />
        <StatCard label="Scans this week" value={47} icon={Activity} accent="primary" hint="+12% vs last" />
        <StatCard label="Threats blocked" value={6} icon={AlertTriangle} accent="destructive" hint="2 critical" />
        <StatCard label="Verified payments" value={"₹38,420"} icon={Wallet} accent="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Fraud trends</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockFraudTrends}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.16 220)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.78 0.16 220)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 195)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.03 230)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.035 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="scams" stroke="oklch(0.78 0.16 220)" fill="url(#g1)" />
                <Area type="monotone" dataKey="blocked" stroke="oklch(0.72 0.18 195)" fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent alerts</h3>
            <BellRing className="h-4 w-4 text-warning" />
          </div>
          <ul className="mt-3 space-y-3">
            {mockAlerts.slice(0, 4).map((a) => (
              <li key={a.id} className="rounded-lg p-3 bg-card/40 border border-border">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{a.title}</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-semibold">Recent transactions</h3>
          <div className="mt-3 divide-y divide-border">
            {mockTransactions.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.receiverName}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.upiId} · {t.purpose}</p>
                </div>
                <p className="text-sm font-semibold">₹{t.amount.toLocaleString("en-IN")}</p>
                <RiskBadge level={t.status} score={t.risk} />
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold">Cybersecurity tips</h3>
          {[
            { t: "Never share OTP", p: 100 },
            { t: "Verify UPI ID before paying", p: 75 },
            { t: "Avoid public Wi-Fi for banking", p: 60 },
            { t: "Enable 2FA everywhere", p: 90 },
          ].map((x) => (
            <div key={x.t}>
              <div className="flex justify-between text-xs"><span>{x.t}</span><span className="text-muted-foreground">{x.p}%</span></div>
              <Progress value={x.p} className="mt-1.5 h-1.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
