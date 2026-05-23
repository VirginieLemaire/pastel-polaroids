import { useEffect, useRef, useState } from "react";
import { Menu, X, Check } from "lucide-react";
import {
  MOCK_SCENARIOS,
  getStoredScenarioId,
  setStoredScenarioId,
} from "./mockScenarios";
import { DEV_SCENARIO_CHANGE_EVENT } from "@/context/ContestContext";

const DevMenu = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>(() => getStoredScenarioId());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!import.meta.env.DEV) return null;

  const select = (id: string) => {
    setCurrent(id);
    setStoredScenarioId(id);
    window.dispatchEvent(new CustomEvent(DEV_SCENARIO_CHANGE_EVENT, { detail: id }));
    setOpen(false);
  };

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50 font-mono">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu développeur"
        className="brutal-btn bg-pastel-butter w-11 h-11 rounded-full p-0 inline-flex items-center justify-center"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 brutal-border bg-background p-3 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
          <p className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">
            Dev · Scénarios mock
          </p>
          <ul className="space-y-1">
            {MOCK_SCENARIOS.map((s) => {
              const active = s.id === current;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => select(s.id)}
                    className={`w-full text-left px-2 py-2 brutal-border text-sm flex items-start gap-2 ${
                      active ? "bg-pastel-mint" : "bg-background hover:bg-pastel-sky"
                    }`}
                  >
                    <span className="mt-0.5 w-4 shrink-0">
                      {active && <Check size={14} />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-bold">{s.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {s.description}
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

export default DevMenu;
