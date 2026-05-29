import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Wallet, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiskBadge } from "@/components/RiskBadge";
import verified from "@/data/verifiedTransactions.json";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/transactions")({
  head: () => ({ meta: [{ title: "Transaction Scanner — DigitalRakshak" }] }),
  component: TxScanner,
});

type Verdict = {
  status: "Genuine" | "Suspicious" | "Fake";
  score: number;
  reason: string;
  action: string;
};

function analyze(upi: string, receiver: string): Verdict {
  const u = upi.toLowerCase().trim();
  const r = receiver.toLowerCase().trim();
  const exact = (verified as any[]).find((v) => v.upiId.toLowerCase() === u && v.receiverName.toLowerCase() === r);
  if (exact) return { status: "Genuine", score: 5 + Math.floor(Math.random() * 15), reason: `Verified merchant: ${exact.receiverName} (${exact.category}).`, action: "Safe to proceed." };
  const partial = (verified as any[]).find((v) => v.upiId.toLowerCase() === u || v.receiverName.toLowerCase().includes(r) || r.includes(v.receiverName.toLowerCase().split(" ")[0]));
  if (partial) return { status: "Suspicious", score: 40 + Math.floor(Math.random() * 30), reason: "Partial match with verified records. Receiver name or UPI ID differs slightly — possible impersonation.", action: "Double-check with the recipient via a trusted channel before paying." };
  return { status: "Fake", score: 80 + Math.floor(Math.random() * 20), reason: "No matching record found in DigitalRakshak's verified merchant database.", action: "Do NOT proceed. Report this UPI ID to your bank." };
}

function TxScanner() {
  const [upi, setUpi] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Verdict | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upi || !name) return toast.error("UPI ID and Receiver Name are required");
    setLoading(true); setResult(null);
    await new Promise((r) => setTimeout(r, 900));
    const v = analyze(upi, name);
    setResult(v);
    const history = storage.get<any[]>("dr_tx_history", []);
    history.unshift({ id: Date.now(), upi, name, amount, purpose, ...v, ts: new Date().toISOString() });
    storage.set("dr_tx_history", history.slice(0, 25));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Transaction Verification</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-screens every UPI payment against verified merchant records.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-5">
        <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-accent text-sm"><Wallet className="h-4 w-4" /> Payment details</div>
          <div className="space-y-1.5">
            <Label>UPI ID</Label>
            <Input placeholder="e.g. amazon@apl" value={upi} onChange={(e) => setUpi(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Receiver name</Label>
            <Input placeholder="e.g. Amazon India" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input type="number" placeholder="1499" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Purpose</Label>
              <Input placeholder="Shopping" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow-cyan">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify with AI"}
          </Button>
          <div className="text-xs text-muted-foreground">Try: <code className="text-accent">amazon@apl</code>, <code className="text-accent">kycupdate@hdfc</code>, or any unknown UPI for FAKE detection.</div>
        </form>

        <div className="glass rounded-2xl p-6">
          {loading && (
            <div className="h-full grid place-items-center text-muted-foreground">
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full gradient-primary grid place-items-center animate-pulse-glow">
                  <ShieldCheck className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="mt-4 text-sm">Cross-checking verified registry…</p>
              </div>
            </div>
          )}
          {!loading && !result && (
            <div className="h-full grid place-items-center text-muted-foreground text-sm text-center">
              <div>
                <ShieldCheck className="h-10 w-10 mx-auto opacity-60" />
                <p className="mt-3">AI verdict will appear here.</p>
              </div>
            </div>
          )}
          {!loading && result && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {result.status === "Fake" && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-destructive text-sm mb-4 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> Warning: This transaction appears to be fake or unauthorized.
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI Verdict</h3>
                <RiskBadge level={result.status} score={result.score} />
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Risk score</p>
                  <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${result.status === "Genuine" ? "bg-success" : result.status === "Suspicious" ? "bg-warning" : "bg-destructive"}`} style={{ width: `${result.score}%` }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Explanation</p>
                  <p className="mt-1">{result.reason}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Recommended action</p>
                  <p className="mt-1">{result.action}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
