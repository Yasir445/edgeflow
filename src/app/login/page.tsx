"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle,#00ff9d,transparent 70%)" }} />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black ef-btn-primary text-base">E</div>
            <span className="font-black text-white text-xl tracking-tight">EdgeFlow</span>
          </div>
          <h1 className="text-2xl font-black text-white">Welcome back</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to your trading journal</p>
        </div>
        <div className="ef-card rounded-2xl p-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all text-sm font-medium mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[11px] text-white/20">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ef-input" placeholder="trader@example.com" required />
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="ef-input" placeholder="••••••••" required />
            </div>
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-xs text-white/30 hover:text-white/60 transition-colors">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="ef-btn-primary w-full py-3 rounded-xl text-sm">
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
          <p className="text-center text-xs text-white/30 mt-6">
            No account?{" "}
            <Link href="/register" className="text-accent-green hover:underline font-medium">Start free trial</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
