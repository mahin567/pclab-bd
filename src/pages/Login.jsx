import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Nav } from "../App.jsx";
import { useAuth } from "../auth.jsx";
import { errMsg } from "../api";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await login(f.email, f.password); nav("/dashboard"); }
    catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <>
      <Nav />
      <BackgroundPaths className="min-h-[calc(100vh-74px)]" pathClassName="text-sky-400">
        <main className="flex items-center justify-center px-4 py-10">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-md flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-xl"
          >
            <img src="/logo.png" alt="PC Lab Bangladesh" className="mx-auto h-20" />
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Log in to track your orders and requests.</p>
            </div>

            {err && <div className="error" role="alert">{err}</div>}

            <label>
              Email
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="email" required autoComplete="email" placeholder="you@example.com"
                  className="w-full pl-10" value={f.email} onChange={set("email")} />
              </span>
            </label>

            <label>
              Password
              <span className="relative block">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type={show ? "text" : "password"} required autoComplete="current-password" placeholder="••••••••"
                  className="w-full pl-10 pr-10" value={f.password} onChange={set("password")} />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            <div className="group mt-2 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 p-px">
              <Button type="submit" size="lg" disabled={busy}
                className="h-12 w-full rounded-[1.15rem] bg-gradient-to-r from-[#0b84e3] to-[#3b4fd8] text-base font-semibold text-white hover:opacity-95">
                {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</>
                      : <>Log in<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
              </Button>
            </div>

            <p className="muted text-sm">No account? <Link to="/register">Sign up</Link></p>
          </motion.form>
        </main>
      </BackgroundPaths>
    </>
  );
}
