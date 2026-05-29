// Centralized mock datasets for DigitalRakshak (frontend-only)

export const mockUsers = [
  { id: "u1", name: "Aarav Sharma", email: "aarav@example.com", role: "user", status: "active", joined: "2025-02-12", scans: 42, riskLevel: "low" },
  { id: "u2", name: "Priya Iyer", email: "priya@example.com", role: "user", status: "active", joined: "2025-03-01", scans: 18, riskLevel: "medium" },
  { id: "u3", name: "Rohan Mehta", email: "rohan@example.com", role: "user", status: "blocked", joined: "2024-12-19", scans: 7, riskLevel: "high" },
  { id: "u4", name: "Sneha Reddy", email: "sneha@example.com", role: "user", status: "active", joined: "2025-04-22", scans: 63, riskLevel: "low" },
  { id: "u5", name: "Vikram Singh", email: "vikram@example.com", role: "user", status: "active", joined: "2025-05-10", scans: 12, riskLevel: "medium" },
  { id: "u6", name: "Admin Root", email: "admin@digitalrakshak.in", role: "admin", status: "active", joined: "2024-10-01", scans: 0, riskLevel: "low" },
];

export const mockTransactions = [
  { id: "t1", upiId: "amazon@apl", receiverName: "Amazon India", amount: 1499, purpose: "Shopping", status: "Genuine", risk: 8, ts: "2026-05-28T10:21:00Z" },
  { id: "t2", upiId: "winner-prize@upi", receiverName: "Lottery Winner", amount: 25000, purpose: "Prize Claim", status: "Fake", risk: 96, ts: "2026-05-28T11:01:00Z" },
  { id: "t3", upiId: "bescom@sbi", receiverName: "BESCOM Electricity Board", amount: 1830, purpose: "Bill Payment", status: "Genuine", risk: 5, ts: "2026-05-27T08:45:00Z" },
  { id: "t4", upiId: "kycupdate@hdfc", receiverName: "KYC Verification Cell", amount: 1, purpose: "KYC Update", status: "Suspicious", risk: 62, ts: "2026-05-27T16:11:00Z" },
  { id: "t5", upiId: "swiggy@ybl", receiverName: "Swiggy", amount: 320, purpose: "Food", status: "Genuine", risk: 6, ts: "2026-05-26T19:34:00Z" },
  { id: "t6", upiId: "refund-portal@upi", receiverName: "Refund Portal", amount: 4999, purpose: "Refund", status: "Fake", risk: 91, ts: "2026-05-26T13:20:00Z" },
];

export const mockAlerts = [
  { id: "a1", title: "High-risk UPI request blocked", severity: "critical", time: "2 min ago", body: "Blocked a UPI collect request from suspicious VPA winner-prize@upi." },
  { id: "a2", title: "Phishing URL detected", severity: "high", time: "1 hour ago", body: "Domain hdfc-secure-login.co flagged as phishing." },
  { id: "a3", title: "New scam pattern observed", severity: "medium", time: "Today", body: "Increase in fake KYC update messages across HDFC users." },
  { id: "a4", title: "Account secured", severity: "low", time: "Yesterday", body: "2FA enabled successfully." },
];

export const mockFraudTrends = [
  { day: "Mon", scams: 24, blocked: 22 },
  { day: "Tue", scams: 31, blocked: 27 },
  { day: "Wed", scams: 18, blocked: 17 },
  { day: "Thu", scams: 42, blocked: 38 },
  { day: "Fri", scams: 55, blocked: 49 },
  { day: "Sat", scams: 63, blocked: 58 },
  { day: "Sun", scams: 47, blocked: 44 },
];

export const mockUserGrowth = [
  { month: "Dec", users: 1200 },
  { month: "Jan", users: 1840 },
  { month: "Feb", users: 2620 },
  { month: "Mar", users: 3510 },
  { month: "Apr", users: 4720 },
  { month: "May", users: 6280 },
];

export const mockLearningModules = [
  { id: "m1", title: "OTP Safety", icon: "Lock", difficulty: "Beginner", progress: 100, color: "from-cyan-400 to-blue-500" },
  { id: "m2", title: "UPI Safety", icon: "Wallet", difficulty: "Beginner", progress: 75, color: "from-blue-400 to-indigo-500" },
  { id: "m3", title: "QR Code Scams", icon: "QrCode", difficulty: "Intermediate", progress: 40, color: "from-cyan-400 to-teal-500" },
  { id: "m4", title: "Banking Security", icon: "Building2", difficulty: "Intermediate", progress: 20, color: "from-indigo-400 to-blue-500" },
  { id: "m5", title: "Phishing Awareness", icon: "Mail", difficulty: "Beginner", progress: 60, color: "from-sky-400 to-cyan-500" },
  { id: "m6", title: "Password Safety", icon: "KeyRound", difficulty: "Beginner", progress: 90, color: "from-cyan-500 to-blue-600" },
  { id: "m7", title: "Social Engineering", icon: "Users", difficulty: "Advanced", progress: 10, color: "from-blue-500 to-indigo-600" },
];

export const aiSuggestedQuestions = [
  "Is this UPI request safe?",
  "What is phishing?",
  "Should I share my OTP?",
  "Is this website genuine?",
  "How do I report a scam?",
  "What are common UPI frauds?",
];

export const aiKnowledge: Record<string, string> = {
  otp: "Never share your OTP with anyone — not even bank staff. Banks, UPI apps, and the government will NEVER ask for your OTP, PIN, or CVV.",
  phishing: "Phishing is when scammers impersonate trusted brands (banks, delivery, govt) via email/SMS/calls to trick you into sharing credentials or clicking malicious links.",
  upi: "A genuine UPI request never asks you to ENTER your PIN to RECEIVE money. You only enter PIN when SENDING money. If someone insists otherwise, it's a scam.",
  kyc: "Real KYC updates happen inside the bank's official app or branch. Any KYC link sent over SMS/WhatsApp asking for personal info is fraudulent.",
  qr: "Scanning a QR code is for PAYING, not RECEIVING. If someone asks you to scan a QR to receive a refund or prize — it's a scam.",
  lottery: "If you didn't enter a lottery, you didn't win one. Lottery/prize messages asking for processing fees or KYC are always scams.",
  website: "Check the URL carefully. Real bank/govt domains use .gov.in / .bank / verified TLDs. Look for HTTPS, no typos (hdfc vs hdfcc), and avoid shortened links.",
  default: "Great question. As a rule of thumb: if a message creates urgency, asks for OTP/PIN, promises money, or pushes a link — pause, verify on the official app, and don't act under pressure.",
};

export const scamPatterns = [
  { category: "OTP Scam", keywords: ["otp", "verification code", "share otp", "tell me the code"] },
  { category: "Lottery Scam", keywords: ["winner", "lottery", "prize", "lucky draw", "congratulations you won"] },
  { category: "KYC Scam", keywords: ["kyc", "blocked", "update kyc", "account suspended", "re-verify"] },
  { category: "UPI Scam", keywords: ["collect request", "refund", "send pin", "approve request"] },
  { category: "Job Scam", keywords: ["work from home", "earn", "registration fee", "guaranteed job"] },
];
