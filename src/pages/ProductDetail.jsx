import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Cpu, Zap, ShieldCheck, Wrench, FlaskConical, Truck } from "lucide-react";
import { Nav } from "../App.jsx";
import { useAuth } from "../auth.jsx";
import { MetroHero } from "@/components/ui/scroll-locked-video-hero";
import { Button } from "@/components/ui/button";
import { getProduct, formatBDT, DEFAULT_IMAGE } from "@/data/products";

const ICONS = [Cpu, Zap, ShieldCheck];
const INCLUDED = [
  { icon: Wrench, title: "Hand-assembled", text: "Built and cable-managed by our technicians." },
  { icon: FlaskConical, title: "Stress-tested", text: "Tested under load before it leaves the lab." },
  { icon: Truck, title: "Delivered", text: "Packed and delivered to your door." },
];

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.6 } };

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const p = getProduct(slug);
  if (!p) return <Navigate to="/products" replace />;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30"><Nav /></div>

      {/* key remounts the hero (and resets the scroll lock) when switching products */}
      <MetroHero
        key={p.slug}
        videoSrc={p.video}
        imageSrc={p.video ? undefined : p.image ?? DEFAULT_IMAGE}
        title={p.name.toUpperCase()}
        tagline={p.tagline}
        scrollHint="SCROLL TO EXPLORE"
        signature={false}
      />

      <main className="mx-auto max-w-6xl px-[6vw] py-16 md:px-6">
        <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white">
          <ArrowLeft className="h-4 w-4" /> All products
        </Link>

        <motion.section {...fade} className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{p.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{p.summary}</p>
          </div>
          <div className="h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="mt-1 text-4xl font-bold">{formatBDT(p.price)}</p>
            <div className="group mt-6 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 p-px">
              <Button asChild size="lg" className="h-12 w-full rounded-[1.15rem] bg-gradient-to-r from-[#0b84e3] to-[#3b4fd8] text-base font-semibold text-white hover:opacity-95">
                <Link to={user ? "/dashboard" : "/register"}>
                  Request this build <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">Final price depends on current part availability.</p>
          </div>
        </motion.section>

        <motion.section {...fade} className="mt-20 grid gap-5 md:grid-cols-3">
          {p.highlights.map((h, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={h.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Icon className="h-7 w-7 text-sky-400" />
                <h3 className="mt-4">{h.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{h.text}</p>
              </div>
            );
          })}
        </motion.section>

        <motion.section {...fade} className="mt-20">
          <h2 className="text-2xl md:text-3xl">Specifications</h2>
          <dl className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            {p.specs.map((s, i) => (
              <div key={s.label} className={`grid grid-cols-[140px_1fr] gap-4 px-5 py-4 sm:grid-cols-[220px_1fr] ${i % 2 ? "bg-white/[0.03]" : ""}`}>
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </motion.section>

        <motion.section {...fade} className="mt-20">
          <h2 className="text-2xl md:text-3xl">Included with every build</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {INCLUDED.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-sky-400" />
                <div><h3>{title}</h3><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className="footer">© PC Lab Bangladesh</footer>
    </>
  );
}
