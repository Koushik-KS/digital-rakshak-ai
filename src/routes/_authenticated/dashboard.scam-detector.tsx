import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MessageSquareWarning, Upload, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RiskBadge } from "@/components/RiskBadge";
import { scamPatterns } from "@/data/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/scam-detector")({
  head: () => ({ meta: [{ title: "Scam Detector — DigitalRakshak" }] }),
  component: ScamDetector,
});

function detect(text: string) {
  const t = text.toLowerCase();
  const hits: { category: string; keyword: string }[] = [];
  for (const p of scamPatterns) for (const k of p.keywords) if (t.includes(k)) hits.push({ category: p.category, keyword: k });
  const score = Math.min(99, hits.length * 22 + (t.includes("click") || t.includes("http") ? 18 : 0) + (t.includes("urgent") ? 12 : 0));
  const level: "Safe" | "Suspicious" | "Fake" = score >= 70 ? "Fake" : score >= 35 ? "Suspicious" : "Safe";
  const categories = Array.from(new Set(hits.map((h) => h.category)));
  const keywords = Array.from(new Set(hits.map((h) => h.keyword)));
  return { score, level, categories: categories.length ? categories : ["Generic"], keywords };
}

function ScamDetector() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<ReturnType<typeof detect> | null>(null);

  const submit = async () => {
    if (!text.trim() && !file) return toast.error("Paste a message or upload a screenshot");
    setLoading(true); setRes(null);
    await new Promise((r) => setTimeout(r, 800));
    setRes(detect(text || (file ? `screenshot: ${file.name} otp lottery winner kyc click http` : "")));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Scam Message Detector</h1>
        <p className="text-sm text-muted-foreground mt-1">Paste a suspicious message or upload a screenshot. Detects OTP / Lottery / KYC / UPI / Job scams.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-6 space-y-4">
          <Textarea rows={7} placeholder="Paste suspicious SMS, email, WhatsApp message…" value={text} onChange={(e) => setText(e.target.value)} />
          <label className="block">
            <div className="rounded-xl border-2 border-dashed border-border p-5 text-center cursor-pointer hover:border-accent transition">
              <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
              <p className="text-xs text-muted-foreground mt-2">{file ? file.name : "Drop a screenshot or click to upload (mock OCR)"}</p>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </label>
          <Button onClick={submit} disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow-cyan">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze with AI"}
          </Button>
        </div>

        <div className="glass rounded-2xl p-6">
          {!res && !loading && (
            <div className="h-full grid place-items-center text-muted-foreground text-sm text-center">
              <div>
                <MessageSquareWarning className="h-10 w-10 mx-auto opacity-60" />
                <p className="mt-3">AI threat analysis will appear here.</p>
              </div>
            </div>
          )}
          {loading && <p className="text-sm text-muted-foreground text-center mt-10">Scanning message patterns…</p>}
          {res && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {res.level === "Fake" && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-destructive text-sm flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> High-confidence scam detected. Do not click links or share OTP/PIN.
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Threat analysis</h3>
                <RiskBadge level={res.level} score={res.score} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Scam probability</p>
                <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${res.level === "Safe" ? "bg-success" : res.level === "Suspicious" ? "bg-warning" : "bg-destructive"}`} style={{ width: `${res.score}%` }} />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Categories</p>
                <div className="flex gap-2 flex-wrap mt-1">{res.categories.map((c) => <span key={c} className="text-xs px-2 py-1 rounded-full bg-muted border border-border">{c}</span>)}</div>
              </div>
              {res.keywords.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Suspicious keywords</p>
                  <div className="flex gap-2 flex-wrap mt-1">{res.keywords.map((k) => <span key={k} className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/30">{k}</span>)}</div>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Safety recommendations</p>
                <ul className="mt-2 text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Never share OTP, PIN, or CVV — even with bank staff.</li>
                  <li>Do not click unknown links. Verify by visiting the official app.</li>
                  <li>Report scams to 1930 (cybercrime helpline).</li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
