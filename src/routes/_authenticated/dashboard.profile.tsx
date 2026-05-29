import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, Mail, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — DigitalRakshak" }] }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and security settings.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-6 text-center">
          <div className="h-20 w-20 rounded-full gradient-primary grid place-items-center text-2xl font-bold text-primary-foreground mx-auto shadow-glow-cyan">
            {(user?.name?.[0] ?? "U").toUpperCase()}
          </div>
          <h3 className="mt-3 font-semibold">{user?.name}</h3>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
            <BadgeCheck className="h-3 w-3" /> {user?.role === "admin" ? "Administrator" : "Verified User"}
          </span>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }} className="glass rounded-2xl p-6 space-y-4 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Name</Label><Input defaultValue={user?.name} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={user?.email} type="email" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Phone</Label><Input placeholder="+91 ••••• •••••" /></div>
            <div className="space-y-1.5"><Label>Preferred UPI app</Label><Input placeholder="GPay / PhonePe / Paytm" /></div>
          </div>
          <div className="flex items-center justify-between rounded-xl p-3 bg-card/40 border border-border">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /><span className="text-sm">2-Factor Authentication</span></div>
            <span className="text-xs text-success">Enabled</span>
          </div>
          <div className="flex items-center justify-between rounded-xl p-3 bg-card/40 border border-border">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /><span className="text-sm">Email alerts</span></div>
            <span className="text-xs text-accent">On</span>
          </div>
          <Button className="gradient-primary text-primary-foreground shadow-glow-cyan">Save changes</Button>
        </form>
      </div>
    </div>
  );
}
