import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiskBadge } from "@/components/RiskBadge";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/url-scanner")({
  head: () => ({ meta: [{ title: "URL Scanner — DigitalRakshak" }] }),
  component: URLScanner,
});

const BAD_KEYWORDS = ["login", "verify", "kyc", "secure", "update", "wallet", "free", "win", "prize", "refund", "otp"];
const TRUSTED_TLDS = [".gov.in", ".nic.in", ".rbi.org.in"];
const KNOWN_GOOD = ["amazon.in", "flipkart.com", "hdfcbank.com", "icicibank.com", "irctc.co.in", "sbi.co.in"];

function scanURL(input: string) {
  let host = "";
  try { host = new URL(input.startsWith("http") ? input : `https://${input}`).hostname.toLowerCase(); } catch { host = input.toLowerCase(); }
  if (KNOWN_GOOD.some((g) => host === g || host.endsWith("." + g))) {
    return { level: "Safe", score: 5 + Math.floor(Math.random() * 10), reason: "Domain matches a known trusted entity.", indicators: ["HTTPS", "Verified domain", "Clean reputation"] };
  }
  if (TRUSTED_TLDS.some((t) => host.endsWith(t))) {
    return { level: "Safe", score: 10, reason: "Government / RBI domain.", indicators: ["Government TLD", "Verified registry"] };
  }
  const hits = BAD_KEYWORDS.filter((k) => host.includes(k));
  const hasDash = host.split(".").some((p) => p.includes("-"));
  const punycode = host.startsWith("xn--");
  const score = Math.min(99, hits.length * 25 + (hasDash ? 15 : 0) + (punycode ? 30 : 0) + (host.length > 30 ? 10 : 0));
  if (score >= 70) return { level: "Dangerous", score, reason: "Multiple phishing indicators detected in domain.", indicators: [...(hits.length ? ["Suspicious keywords"] : []), hasDash && "Hyphenated domain", punycode && "Punycode/Unicode trick"].filter(Boolean) as string[] };
  if (score >= 30) return { level: "Suspicious", score, reason: "Some risk indicators present. Verify before sharing data.", indicators: hits.length ? ["Suspicious keywords"] : ["Unverified domain"] };
  return { level: "Safe", score: Math.max(8, score), reason: "No major risk indicators detected.", indicators: ["No known phishing patterns"] };
}

function URLScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<ReturnType<typeof scanURL> | null>(null);
  const [history, setHistory] = useState(() => storage.get<any[]>("dr_url_history", []));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return toast.error("Enter a URL");
    setLoading(true); setRes(null);
    await new Promise((r) => setTimeout(r, 800));
    const r = scanURL(url);
    setRes(r);
    const next = [{ id: Date.now(), url, ...r, ts: new Date().toISOString() }, ...history].slice(0, 12);
    setHistory(next); storage.set("dr_url_history", next);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Phishing URL Scanner</h1>
        <p className="text-sm text-muted-foreground mt-1">Detect fake banking, refund and KYC sites before they steal credentials.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-6 lg:col-span-2 space-y-4">
          <form onSubmit={submit} className="space-y-3">
            <Label>URL to scan</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="hdfc-secure-login.co/verify" value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="gradient-primary text-primary-foreground">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Scan"}
              </Button>
            </div>
          </form>

          {/* Radar */}
          <div className="relative h-64 rounded-xl overflow-hidden glass-strong grid place-items-center">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <motion.div
              animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute h-48 w-48 rounded-full border border-accent/40"
              style={{ background: "conic-gradient(from 0deg, transparent 0deg 320deg, oklch(0.72 0.18 195 / 0.4) 360deg)" }}
            />
            <div className="absolute h-48 w-48 rounded-full border border-accent/20" />
            <div className="absolute h-32 w-32 rounded-full border border-accent/20" />
            <div className="absolute h-16 w-16 rounded-full border border-accent/30" />
            <div className="relative z-10 text-center">
              {res ? (
                <>
                  <p className="text-3xl font-bold">{res.score}</p>
                  <p className="text-xs text-muted-foreground">risk score</p>
                </>
              ) : <p className="text-sm text-muted-foreground">Awaiting scan…</p>}
            </div>
          </div>

          {res && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {res.level === "Dangerous" && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-destructive text-sm flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> Warning: this URL appears to be malicious. Do not visit or share data.
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Verdict</h3>
                <RiskBadge level={res.level} score={res.score} />
              </div>
              <p className="text-sm text-muted-foreground">{res.reason}</p>
              <div className="flex flex-wrap gap-2">
                {res.indicators.map((i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted border border-border">{i}</span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Scan history</h3>
          <ul className="mt-3 space-y-2">
            {history.length === 0 && <p className="text-xs text-muted-foreground">No scans yet.</p>}
            {history.map((h: any) => (
              <li key={h.id} className="text-xs rounded-lg p-2.5 bg-card/40 border border-border">
                <p className="truncate font-medium">{h.url}</p>
                <div className="flex justify-between items-center mt-1">
                  <RiskBadge level={h.level} score={h.score} />
                  <span className="text-muted-foreground">{new Date(h.ts).toLocaleTimeString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
