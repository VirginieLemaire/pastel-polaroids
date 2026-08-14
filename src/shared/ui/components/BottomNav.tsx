import { NavLink } from "@/lib/router-compat";
import { Home, Trophy } from "lucide-react";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex-1 flex flex-col items-center justify-center gap-1 font-mono text-xs font-bold ${
    isActive ? "bg-pastel-mint" : "bg-background"
  }`;

const BottomNav = () => (
  <nav
    aria-label="Navigation principale"
    className="fixed bottom-0 left-0 right-0 z-40 h-[var(--bottom-nav-h)] brutal-border border-l-0 border-r-0 border-b-0 bg-background flex"
  >

    <NavLink to="/" end className={linkClass}>
      <Home size={20} aria-hidden="true" />
      <span>Accueil</span>
    </NavLink>
    <NavLink to="/photos" className={linkClass} title="photos des concours clos">
      <Trophy size={20} aria-hidden="true" />
      <span>Résultats</span>
    </NavLink>
  </nav>
);

export default BottomNav;
