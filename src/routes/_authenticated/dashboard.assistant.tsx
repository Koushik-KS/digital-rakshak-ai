import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiKnowledge, aiSuggestedQuestions } from "@/data/mockData";

export const Route = createFileRoute("/_authenticated/dashboard/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — DigitalRakshak" }] }),
  component: Assistant,
});

type Msg = { role: "user" | "ai"; content: string };

function answer(q: string) {
  const s = q.toLowerCase();
  if (s.includes("otp")) return aiKnowledge.otp;
  if (s.includes("phish")) return aiKnowledge.phishing;
  if (s.includes("upi")) return aiKnowledge.upi;
  if (s.includes("kyc")) return aiKnowledge.kyc;
  if (s.includes("qr")) return aiKnowledge.qr;
  if (s.includes("lottery") || s.includes("prize") || s.includes("won")) return aiKnowledge.lottery;
  if (s.includes("website") || s.includes("url") || s.includes("link") || s.includes("genuine")) return aiKnowledge.website;
  return aiKnowledge.default;
}

function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", content: "Hi! I'm your DigitalRakshak AI assistant. Ask me anything about UPI safety, phishing, OTPs or scams." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, typing]);

  const send = async (q?: string) => {
    const text = (q ?? input).trim(); if (!text) return;
    setMsgs((m) => [...m, { role: "user", content: text }]); setInput(""); setTyping(true);
    await new Promise((r) => setTimeout(r, 700));
    setMsgs((m) => [...m, { role: "ai", content: answer(text) }]);
    setTyping(false);
  };

  return (
    <div className="space-y-4 h-[calc(100vh-160px)] flex flex-col">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-accent" /> AI Fraud Assistant</h1>
        <p className="text-sm text-muted-foreground mt-1">Beginner-friendly answers to fraud and security questions.</p>
      </header>

      <div className="glass rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 rounded-full grid place-items-center shrink-0 ${m.role === "ai" ? "gradient-primary shadow-glow-cyan" : "bg-muted"}`}>
                {m.role === "ai" ? <Bot className="h-4 w-4 text-primary-foreground" /> : <UserIcon className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "ai" ? "bg-card/70 border border-border" : "gradient-primary text-primary-foreground"}`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full gradient-primary grid place-items-center"><Bot className="h-4 w-4 text-primary-foreground" /></div>
              <div className="bg-card/70 border border-border rounded-2xl px-4 py-2.5 flex gap-1">
                <span className="h-2 w-2 rounded-full bg-accent animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:120ms]" />
                <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:240ms]" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {aiSuggestedQuestions.map((q) => (
              <button key={q} onClick={() => send(q)} className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-muted border border-border hover:bg-accent/20 hover:text-accent transition">
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about UPI safety, OTPs, phishing…" />
            <Button type="submit" className="gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </div>
  );
}
