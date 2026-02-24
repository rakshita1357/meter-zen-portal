import { useState, useEffect, useRef } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Gauge, DollarSign, MessageSquareWarning, AlertTriangle, Wallet, CalendarDays } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { monthlyRevenue, rechargeDistribution, complaintStatusData, simulateApiCall, stateDiscomMap, states } from "@/data/mockData";

const CHART_COLORS = ["hsl(215,70%,40%)", "hsl(174,60%,40%)", "hsl(38,92%,50%)", "hsl(152,60%,40%)"];

function StateDiscomDropdown({ value, onChange }: { value: { state: string; discom: string }; onChange: (v: { state: string; discom: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = value.discom || value.state || "States";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring w-44"
      >
        <span className="truncate">{label}</span>
        <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-44 rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="max-h-64 overflow-y-auto py-1">
            <button
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => { onChange({ state: "", discom: "" }); setOpen(false); }}
            >
              States
            </button>
            {states.map(s => (
              <div
                key={s}
                className="relative"
                onMouseEnter={() => setHoveredState(s)}
                onMouseLeave={() => setHoveredState(null)}
              >
                <button
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
                  onClick={() => { onChange({ state: s, discom: "" }); setOpen(false); }}
                >
                  {s}
                  <svg className="h-3 w-3 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                {hoveredState === s && (
                  <div className="absolute left-full top-0 z-50 ml-0.5 w-48 rounded-md border bg-popover text-popover-foreground shadow-md py-1">
                    {stateDiscomMap[s].map(d => (
                      <button
                        key={d}
                        className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => { onChange({ state: s, discom: d }); setOpen(false); }}
                      >
                        {d}
                      </button>
                    ))}
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

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stateDiscom, setStateDiscom] = useState({ state: "", discom: "" });

  useEffect(() => {
    simulateApiCall(null, 600).then(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <StateDiscomDropdown value={stateDiscom} onChange={setStateDiscom} />
          <Button variant="outline" size="sm"><CalendarDays className="mr-2 h-4 w-4" />This Month</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard loading={loading} title="Total Users" value="12,458" icon={<Users className="h-5 w-5" />} trend={{ value: 5.2, positive: true }} description="vs last month" />
        <StatCard loading={loading} title="Active Meters" value="11,203" icon={<Gauge className="h-5 w-5" />} trend={{ value: 2.1, positive: true }} description="vs last month" />
        <StatCard loading={loading} title="Revenue (Feb)" value="₹3.65L" icon={<DollarSign className="h-5 w-5" />} trend={{ value: 12.4, positive: true }} description="vs last month" />
        <StatCard loading={loading} title="Pending Complaints" value="60" icon={<MessageSquareWarning className="h-5 w-5" />} trend={{ value: 8, positive: false }} description="vs last month" />
        <StatCard loading={loading} title="Overdue Bills" value="1,255" icon={<AlertTriangle className="h-5 w-5" />} trend={{ value: 3.5, positive: false }} description="vs last month" />
        <StatCard loading={loading} title="Recharge Vol." value="₹8.2L" icon={<Wallet className="h-5 w-5" />} trend={{ value: 7.8, positive: true }} description="vs last month" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="card-shadow xl:col-span-1 animate-fade-in">
          <CardHeader><CardTitle className="text-base">Monthly Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `₹${v/1000}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow animate-fade-in">
          <CardHeader><CardTitle className="text-base">Recharge Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={rechargeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow animate-fade-in">
          <CardHeader><CardTitle className="text-base">Complaint Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={complaintStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {complaintStatusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
