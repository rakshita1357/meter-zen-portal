import { useState, useEffect } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, Gauge, DollarSign, MessageSquareWarning, AlertTriangle, Wallet, CalendarDays } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { monthlyRevenue, rechargeDistribution, complaintStatusData, simulateApiCall, states, discoms } from "@/data/mockData";

const CHART_COLORS = ["hsl(215,70%,40%)", "hsl(174,60%,40%)", "hsl(38,92%,50%)", "hsl(152,60%,40%)"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    simulateApiCall(null, 600).then(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-36"><SelectValue placeholder="State" /></SelectTrigger>
            <SelectContent>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}<SelectItem value="all">All States</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40"><SelectValue placeholder="DISCOM" /></SelectTrigger>
            <SelectContent>{discoms.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}<SelectItem value="all">All DISCOMs</SelectItem></SelectContent>
          </Select>
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
