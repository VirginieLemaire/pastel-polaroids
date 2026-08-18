import { Link, useLocation } from "@/lib/router-compat";
import { Home, Info, Trophy } from "lucide-react";

const linkClass = (isActive: boolean) =>
  `flex-1 flex flex-col items-center justify-center gap-1 font-mono text-xs font-bold ${
    isActive ? "bg-pastel-mint" : "bg-background"
  }`;

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-[var(--bottom-nav-h)]">
      <nav aria-label="Navigation principale" className="brutal-border border-l-0 border-r-0 border-b-0 bg-background flex h-full">
        <Link to="/" className={linkClass(pathname === "/")}>
          <Home size={20} aria-hidden="true" />
          <span>Accueil</span>
        </Link>
        <Link to="/photos" className={linkClass(pathname.startsWith("/photos"))} title="photos des concours clos">
          <Trophy size={20} aria-hidden="true" />
          <span>Résultats</span>
        </Link>
        <Link to="/about" className={linkClass(pathname.startsWith("/about"))}>
          <Info size={20} aria-hidden="true" />
          <span>À propos</span>
        </Link>
      </nav>
    </footer>
  );
};

export default BottomNav;
