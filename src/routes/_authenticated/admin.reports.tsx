import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { storage } from "@/lib/storage";
import { mockTransactions, mockUsers } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Download, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Admin" }] }),
  component: Reports,
});

function Reports() {
  const [history] = useState(() => storage.get<any[]>("dr_csv_history", []));
  const [results] = useState(() => storage.get<any[]>("dr_csv_results", []));
  const exportAs = (data: any[], name: string) => {
    saveAs(new Blob([Papa.unparse(data)], { type: "text/csv;charset=utf-8" }), name);
    toast.success(`Exported ${name}`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Export data and review past CSV detection runs.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { t: "Transactions", d: mockTransactions, f: "transactions.csv" },
          { t: "Fraud Reports", d: results.length ? results : mockTransactions.filter((t) => t.status !== "Genuine"), f: "fraud_reports.csv" },
          { t: "User Data", d: mockUsers, f: "users.csv" },
        ].map((c) => (
          <div key={c.t} className="glass rounded-2xl p-5">
            <FileText className="h-6 w-6 text-accent" />
            <h3 className="mt-3 font-semibold">{c.t}</h3>
            <p className="text-xs text-muted-foreground mt-1">{c.d.length} records ready to export.</p>
            <Button onClick={() => exportAs(c.d, c.f)} className="mt-4 gradient-primary text-primary-foreground w-full">
              <Download className="h-4 w-4 mr-1" /> Export CSV
            </Button>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent CSV analyses</h3>
          <Link to="/admin/csv-detection"><Button size="sm" variant="outline"><Upload className="h-4 w-4 mr-1" /> New upload</Button></Link>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-4">No uploads yet. Run a detection from the CSV Detection page.</p>
        ) : (
          <table className="w-full text-sm mt-3">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border"><th className="text-left py-2 px-2">File</th><th className="text-left py-2 px-2">Rows</th><th className="text-left py-2 px-2">When</th></tr>
            </thead>
            <tbody>
              {history.map((h: any) => (
                <tr key={h.id} className="border-b border-border/60">
                  <td className="py-2 px-2">{h.file}</td>
                  <td className="py-2 px-2">{h.count}</td>
                  <td className="py-2 px-2 text-muted-foreground">{new Date(h.ts).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
