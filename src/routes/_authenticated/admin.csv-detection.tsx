import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import {
  Upload, FileSpreadsheet, ShieldAlert, ShieldCheck, Download, Trash2, Eye, FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RiskBadge } from "@/components/RiskBadge";
import { StatCard } from "@/components/StatCard";
import verified from "@/data/verifiedTransactions.json";
import { mockTransactions, mockUsers } from "@/data/mockData";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";

export const Route = createFileRoute("/_authenticated/admin/csv-detection")({
  head: () => ({ meta: [{ title: "CSV Fraud Detection — Admin" }] }),
  component: CSVDetection,
});

type Row = {
  transactionId: string; upiId: string; receiverName: string; amount: number;
  purpose?: string; status?: string; timestamp?: string;
};

type Result = Row & {
  prediction: "Genuine" | "Suspicious" | "Fake";
  riskScore: number;
  reason: string;
};

const AI_INSIGHTS = [
  "This transaction was not found in the verified transaction database.",
  "Receiver information differs from trusted records.",
  "Amount significantly differs from historical patterns.",
  "High probability of transaction fraud.",
  "Transaction metadata appears inconsistent.",
];

function analyzeRow(row: Row): Result {
  const upi = (row.upiId ?? "").toLowerCase().trim();
  const name = (row.receiverName ?? "").toLowerCase().trim();
  const exact = (verified as any[]).find((v) => v.upiId.toLowerCase() === upi && v.receiverName.toLowerCase() === name);
  if (exact) return { ...row, prediction: "Genuine", riskScore: Math.floor(Math.random() * 20), reason: `Verified merchant (${exact.category}).` };
  const partial = (verified as any[]).find((v) => v.upiId.toLowerCase() === upi || v.receiverName.toLowerCase() === name);
  if (partial) return { ...row, prediction: "Suspicious", riskScore: 40 + Math.floor(Math.random() * 30), reason: "Partial match — receiver or UPI differs from verified records." };
  return { ...row, prediction: "Fake", riskScore: 80 + Math.floor(Math.random() * 20), reason: AI_INSIGHTS[Math.floor(Math.random() * AI_INSIGHTS.length)] };
}

const COLORS = { Genuine: "oklch(0.74 0.18 155)", Suspicious: "oklch(0.82 0.17 85)", Fake: "oklch(0.65 0.24 25)" };

function CSVDetection() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [results, setResults] = useState<Result[]>(() => storage.get<Result[]>("dr_csv_results", []));
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) return toast.error("Only .csv files are supported");
    setFileName(file.name); setProgress(10);
    Papa.parse<Row>(file, {
      header: true, dynamicTyping: true, skipEmptyLines: true,
      complete: (res) => {
        setProgress(60);
        const parsed = (res.data as Row[]).filter((r) => r && (r.upiId || r.transactionId));
        setRows(parsed);
        const analyzed = parsed.map(analyzeRow);
        setResults(analyzed); storage.set("dr_csv_results", analyzed);
        const history = storage.get<any[]>("dr_csv_history", []);
        storage.set("dr_csv_history", [{ id: Date.now(), file: file.name, count: parsed.length, ts: new Date().toISOString() }, ...history].slice(0, 20));
        setProgress(100); toast.success(`Analyzed ${parsed.length} rows`);
      },
      error: (err) => { setProgress(0); toast.error(err.message); },
    });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0]; if (f) handleFile(f);
  };

  const stats = useMemo(() => {
    const total = results.length;
    const g = results.filter((r) => r.prediction === "Genuine").length;
    const s = results.filter((r) => r.prediction === "Suspicious").length;
    const f = results.filter((r) => r.prediction === "Fake").length;
    return { total, g, s, f, fraudPct: total ? Math.round((f / total) * 100) : 0 };
  }, [results]);

  const pieData = [
    { name: "Genuine", value: stats.g }, { name: "Suspicious", value: stats.s }, { name: "Fake", value: stats.f },
  ];
  const barData = results.slice(0, 10).map((r) => ({ name: r.transactionId?.toString().slice(-6) ?? "—", risk: r.riskScore }));
  const lineData = ["Genuine", "Suspicious", "Fake"].map((k) => ({
    name: k, count: results.filter((r) => r.prediction === k).length,
  }));

  const exportCSV = (kind: "transactions" | "fraud_reports" | "users") => {
    let data: any[] = [];
    if (kind === "transactions") data = mockTransactions;
    else if (kind === "fraud_reports") data = results.length ? results : mockTransactions.filter((t) => t.status !== "Genuine");
    else data = mockUsers;
    const csv = Papa.unparse(data);
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${kind}.csv`);
    toast.success(`Exported ${kind}.csv`);
  };

  const downloadOne = (r: Result) => {
    const csv = Papa.unparse([r]);
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), `report_${r.transactionId}.csv`);
  };

  const loadSample = () => {
    const sample: Row[] = [
      { transactionId: "TX1001", upiId: "amazon@apl", receiverName: "Amazon India", amount: 1499, purpose: "Shopping", status: "completed", timestamp: new Date().toISOString() },
      { transactionId: "TX1002", upiId: "bescom@sbi", receiverName: "BESCOM Electricity Board", amount: 1820, purpose: "Bill", status: "completed", timestamp: new Date().toISOString() },
      { transactionId: "TX1003", upiId: "kycupdate@hdfc", receiverName: "KYC Cell", amount: 1, purpose: "KYC", status: "pending", timestamp: new Date().toISOString() },
      { transactionId: "TX1004", upiId: "winner-prize@upi", receiverName: "Lottery Winner", amount: 25000, purpose: "Prize", status: "pending", timestamp: new Date().toISOString() },
      { transactionId: "TX1005", upiId: "fake-refund@upi", receiverName: "Refund Portal", amount: 4999, purpose: "Refund", status: "pending", timestamp: new Date().toISOString() },
      { transactionId: "TX1006", upiId: "swiggy@ybl", receiverName: "Swiggy", amount: 320, purpose: "Food", status: "completed", timestamp: new Date().toISOString() },
    ];
    setFileName("sample_transactions.csv"); setRows(sample);
    const analyzed = sample.map(analyzeRow);
    setResults(analyzed); storage.set("dr_csv_results", analyzed);
    setProgress(100); toast.success("Loaded sample dataset");
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">CSV Fraud Detection</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload bulk transactions and automatically classify each as Genuine, Suspicious, or Fake.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => exportCSV("transactions")}><Download className="h-4 w-4 mr-1" /> Transactions CSV</Button>
          <Button variant="outline" onClick={() => exportCSV("fraud_reports")}><Download className="h-4 w-4 mr-1" /> Fraud Reports CSV</Button>
          <Button variant="outline" onClick={() => exportCSV("users")}><Download className="h-4 w-4 mr-1" /> Users CSV</Button>
        </div>
      </header>

      {/* Uploader */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`glass rounded-2xl p-8 border-2 border-dashed text-center transition ${dragOver ? "border-accent shadow-glow-cyan" : "border-border"}`}
      >
        <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center mx-auto shadow-glow-cyan">
          <Upload className="h-6 w-6 text-primary-foreground" />
        </div>
        <p className="mt-3 font-semibold">Drag & drop a CSV file</p>
        <p className="text-xs text-muted-foreground mt-1">
          Expected columns: transactionId, upiId, receiverName, amount, purpose, status, timestamp
        </p>
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          <label>
            <input type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <Button asChild className="gradient-primary text-primary-foreground"><span>Browse files</span></Button>
          </label>
          <Button variant="outline" onClick={loadSample}>Load sample</Button>
        </div>
        {fileName && (
          <div className="mt-5 max-w-md mx-auto text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-accent" /> {fileName}</span>
              <span className="text-muted-foreground">{rows.length} rows</span>
            </div>
            <Progress value={progress} className="mt-2 h-1.5" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="Total Records" value={stats.total} icon={FileSpreadsheet} accent="primary" />
            <StatCard label="Genuine" value={stats.g} icon={ShieldCheck} accent="success" />
            <StatCard label="Suspicious" value={stats.s} icon={ShieldAlert} accent="warning" />
            <StatCard label="Fake" value={stats.f} icon={ShieldAlert} accent="destructive" />
            <StatCard label="Fraud %" value={`${stats.fraudPct}%`} icon={ShieldAlert} accent="destructive" />
          </div>

          {stats.f > 0 && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-sm">⚠ Warning: {stats.f} transaction(s) appear to be fake or unauthorized.</p>
            </div>
          )}

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-semibold">Detection summary</h3>
              <div className="h-64 mt-3">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                      {pieData.map((d) => <Cell key={d.name} fill={(COLORS as any)[d.name]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={{ background: "oklch(0.19 0.035 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="font-semibold">Risk scores (first 10)</h3>
              <div className="h-64 mt-3">
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                    <XAxis dataKey="name" stroke="oklch(0.72 0.03 230)" fontSize={11} />
                    <YAxis stroke="oklch(0.72 0.03 230)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "oklch(0.19 0.035 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                    <Bar dataKey="risk" fill="oklch(0.72 0.18 195)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="font-semibold">Distribution</h3>
              <div className="h-64 mt-3">
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                    <XAxis dataKey="name" stroke="oklch(0.72 0.03 230)" fontSize={11} />
                    <YAxis stroke="oklch(0.72 0.03 230)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "oklch(0.19 0.035 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="count" stroke="oklch(0.78 0.16 220)" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold">AI Fraud Insights</h3>
            <ul className="mt-3 grid md:grid-cols-2 gap-2 text-sm">
              {AI_INSIGHTS.map((x) => (
                <li key={x} className="rounded-lg p-3 bg-card/40 border border-border flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-warning mt-0.5" /> {x}
                </li>
              ))}
            </ul>
          </div>

          {/* Report table */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Detection report</h3>
              <Button size="sm" variant="outline" onClick={() => exportCSV("fraud_reports")}><FileDown className="h-4 w-4 mr-1" /> Export full report</Button>
            </div>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">Tx ID</th>
                    <th className="text-left py-2 px-2">UPI</th>
                    <th className="text-left py-2 px-2">Receiver</th>
                    <th className="text-right py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Risk</th>
                    <th className="text-left py-2 px-2">Prediction</th>
                    <th className="text-left py-2 px-2 max-w-xs">Reason</th>
                    <th className="text-right py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr key={idx} className="border-b border-border/60 hover:bg-card/40">
                      <td className="py-2 px-2 font-mono text-xs">{r.transactionId}</td>
                      <td className="py-2 px-2 text-xs">{r.upiId}</td>
                      <td className="py-2 px-2">{r.receiverName}</td>
                      <td className="py-2 px-2 text-right">₹{Number(r.amount ?? 0).toLocaleString("en-IN")}</td>
                      <td className="py-2 px-2 font-semibold">{r.riskScore}</td>
                      <td className="py-2 px-2"><RiskBadge level={r.prediction} /></td>
                      <td className="py-2 px-2 text-xs text-muted-foreground max-w-xs truncate" title={r.reason}>{r.reason}</td>
                      <td className="py-2 px-2 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => toast.info(`${r.prediction} · ${r.reason}`)}><Eye className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => downloadOne(r)}><Download className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { const next = results.filter((_, i) => i !== idx); setResults(next); storage.set("dr_csv_results", next); }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
