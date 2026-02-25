import { ReactNode, useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: { value: number; positive: boolean };
  loading?: boolean;
  className?: string;
}

function useCountUp(target: string, loading?: boolean) {
  const [display, setDisplay] = useState(target);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (loading || hasAnimated.current) return;
    hasAnimated.current = true;
    const numMatch = target.match(/[\d,]+\.?\d*/);
    if (!numMatch) { setDisplay(target); return; }
    const numStr = numMatch[0].replace(/,/g, "");
    const end = parseFloat(numStr);
    const prefix = target.slice(0, numMatch.index);
    const suffix = target.slice((numMatch.index || 0) + numMatch[0].length);
    const hasCommas = numMatch[0].includes(",");
    const duration = 800;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);
      const formatted = hasCommas ? current.toLocaleString() : String(current);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [loading, target]);

  return display;
}

export function StatCard({ title, value, icon, description, trend, loading, className }: StatCardProps) {
  const animatedValue = useCountUp(String(value), loading);

  if (loading) {
    return (
      <Card className={cn("card-shadow", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
          <Skeleton className="mt-3 h-8 w-20" />
          <Skeleton className="mt-2 h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("card-shadow card-hover stat-gradient animate-fade-in", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
            {icon}
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-foreground">{animatedValue}</p>
        {(description || trend) && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            {trend && (
              <span className={trend.positive ? "text-success" : "text-destructive"}>
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
