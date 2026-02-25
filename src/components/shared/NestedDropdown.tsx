import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface NestedDropdownProps {
  label: string;
  items: Record<string, string[]>;
  value: { primary: string; secondary: string };
  onChange: (v: { primary: string; secondary: string }) => void;
  className?: string;
}

export function NestedDropdown({ label, items, value, onChange, className }: NestedDropdownProps) {
  const [open, setOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setExpandedKey(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayLabel = value.secondary || value.primary || label;

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        onClick={() => { setOpen(!open); setExpandedKey(null); }}
        className="inline-flex items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm font-medium text-foreground ring-offset-background transition-all duration-200 hover:bg-accent/10 hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-ring/30 w-44"
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-48 rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-lg animate-fade-in overflow-hidden">
          <div className="max-h-72 overflow-y-auto py-1.5">
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent/10 transition-colors duration-150 text-muted-foreground"
              onClick={() => { onChange({ primary: "", secondary: "" }); setOpen(false); setExpandedKey(null); }}
            >
              {label}
            </button>
            {Object.keys(items).map(key => (
              <div key={key} className="relative">
                <button
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors duration-150",
                    expandedKey === key ? "bg-primary/8 text-primary" : "hover:bg-accent/10"
                  )}
                  onClick={() => setExpandedKey(expandedKey === key ? null : key)}
                >
                  <span>{key}</span>
                  <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", expandedKey === key && "rotate-90")} />
                </button>
                {expandedKey === key && (
                  <div className="absolute left-full top-0 z-50 ml-1 w-52 rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-lg animate-fade-in overflow-hidden">
                    <div className="py-1.5">
                      {items[key].map(sub => (
                        <button
                          key={sub}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-primary/8 hover:text-primary transition-colors duration-150"
                          onClick={() => { onChange({ primary: key, secondary: sub }); setOpen(false); setExpandedKey(null); }}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
