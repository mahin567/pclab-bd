import { Link } from "react-router-dom";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { MessageSquare, Cpu, Wrench, ShieldCheck, PackageCheck } from "lucide-react";
import { Nav } from "../App.jsx";
import { useAuth } from "../auth.jsx";

const U = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const services = [
  ["🖥️", "Custom PC Builds", "Gaming, workstation and office rigs tuned to your budget."],
  ["🔧", "Repair & Upgrades", "Diagnostics, part swaps and performance upgrades."],
  ["🧩", "Components", "Genuine CPUs, GPUs, RAM, storage and peripherals."],
  ["🛡️", "Support", "Warranty help and after-sales support you can reach."],
];

const mk = (id, title, icon, content, relatedIds, energy) => ({
  id, title, icon, content, relatedIds, energy, date: `Step ${id}`, category: "Process", status: "completed",
});
const timelineData = [
  mk(1, "Consult", MessageSquare, "Tell us your budget and how you'll use the PC.", [2], 100),
  mk(2, "Select Parts", Cpu, "We pick compatible, genuine components for you.", [1, 3], 90),
  mk(3, "Assemble", Wrench, "Clean build, cable management and BIOS setup.", [2, 4], 80),
  mk(4, "Test", ShieldCheck, "Stress tests and thermals checked before handover.", [3, 5], 70),
  mk(5, "Deliver", PackageCheck, "Hand-off with warranty and support.", [4], 60),
];

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <Nav />
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={U("photo-1587202372775-e229f172b9d7", 1600)}
        bgImageSrc={U("photo-1518770660439-4636190af475", 1920)}
        title="PC Lab Bangladesh"
        date="Build • Upgrade • Repair"
        scrollToExpand="Scroll to explore"
      >
        <div id="services" className="max-w-5xl mx-auto w-full">
          <h2 className="text-3xl text-center">What we do</h2>
          <div className="grid">
            {services.map(([i, t, d]) => (
              <div className="card" key={t}><div className="ico">{i}</div><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
          <h2 className="text-3xl text-center mt-16">How we work</h2>
          <RadialOrbitalTimeline timelineData={timelineData} />
          <div id="contact" className="cta section">
            <h2>Ready to power up?</h2>
            <p>Create an account to track orders and requests.</p>
            <Link to={user ? "/dashboard" : "/register"} className="btn big">{user ? "Go to dashboard" : "Create account"}</Link>
          </div>
          <footer className="footer">© {new Date().getFullYear()} PC Lab Bangladesh. All rights reserved.</footer>
        </div>
      </ScrollExpandMedia>
    </>
  );
}
