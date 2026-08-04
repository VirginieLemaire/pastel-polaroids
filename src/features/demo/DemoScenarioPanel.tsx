import { useEffect, useRef, useState } from "react";
import { FlaskConical, X } from "lucide-react";

import {
  DEMO_SCENARIOS,
  getStoredScenarioId,
  setStoredScenarioId,
} from "./scenarios";
import { DEV_SCENARIO_CHANGE_EVENT } from "@/features/contests";

const PANEL_ID = "demo-scenario-panel";

const DemoScenarioPanel = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>(() => getStoredScenarioId());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selectScenario = (id: string) => {
    setCurrent(id);
    setStoredScenarioId(id);
    window.dispatchEvent(new CustomEvent(DEV_SCENARIO_CHANGE_EVENT, { detail: id }));
    setOpen(false);
  };

  return (
    <div ref={ref} className="fixed top-3 right-3 z-50 font-mono">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        className="brutal-btn bg-pastel-butter inline-flex items-center gap-2 px-3 py-2 text-sm font-bold"
      >
        <FlaskConical aria-hidden="true" className="w-4 h-4" />
        Mode démo
      </button>

      {open && (
        <div
          id={PANEL_ID}
          className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] brutal-border bg-background p-3 shadow-[4px_4px_0_0_hsl(var(--foreground))] max-h-[70vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Tester l'application
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le panneau de démonstration"
              className="brutal-border bg-background hover:bg-pastel-peach p-1"
            >
              <X aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            Démonstration avec des données fictives : aucun compte n'est requis et tout
            est réinitialisé au rechargement de la page. Choisissez une situation pour
            explorer les différentes phases d'un concours.
          </p>

          <ul className="space-y-1">
            {DEMO_SCENARIOS.map((scenario) => {
              const isActive = scenario.id === current;
              return (
                <li key={scenario.id}>
                  <button
                    type="button"
                    onClick={() => selectScenario(scenario.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`w-full text-left px-2 py-2 brutal-border text-sm flex items-start gap-2 ${
                      isActive ? "bg-pastel-mint" : "bg-background hover:bg-pastel-sky"
                    }`}
                  >
                    <span aria-hidden="true" className="mt-0.5 w-4 shrink-0 text-center">
                      {isActive ? "✓" : ""}
                    </span>
                    <span className="flex-1">
                      <span className="block font-bold">
                        {scenario.label}
                        {isActive && <span className="sr-only"> (situation active)</span>}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {scenario.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DemoScenarioPanel;
