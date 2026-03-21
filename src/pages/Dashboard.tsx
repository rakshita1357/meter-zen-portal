import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import { revenueService } from "@/services/revenue";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Gauge, DollarSign, MessageSquareWarning, AlertTriangle, Wallet, CalendarDays } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { NestedDropdown } from "@/components/shared/NestedDropdown";
import { stateDiscomMap, rechargeDistribution } from "@/data/mockData";

const CHART_COLORS = ["hsl(215,65%,45%)", "hsl(174,55%,42%)", "hsl(38,88%,52%)", "hsl(152,55%,42%)"];

export default function Dashboard() {
  const [stateDiscom, setStateDiscom] = useState({ primary: "", secondary: "" });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: dashboardService.getStats,
  });

  const { data: complaintStatus, isLoading: complaintStatusLoading } = useQuery({
    queryKey: ["dashboardComplaints"],
    queryFn: dashboardService.getComplaintStatus,
  });

  const { data: monthlyRevenue, isLoading: revenueLoading } = useQuery({
    queryKey: ["monthlyRevenue"],
    queryFn: revenueService.getMonthlyRevenue,
  });

  const loading = statsLoading || complaintStatusLoading || revenueLoading;

  const complaintChartData = complaintStatus?.map((item) => ({
    name: item.status,
    value: item.count,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <NestedDropdown
            label="States"
            items={stateDiscomMap}
            value={stateDiscom}
            onChange={setStateDiscom}
          />
          <Button variant="outline" size="sm" className="transition-all duration-200 active:scale-95"><CalendarDays className="mr-2 h-4 w-4" />This Month</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard loading={loading} title="Total Users" value={stats?.total_users.toLocaleString() || "0"} icon={<Users className="h-5 w-5" />} trend={{ value: 5.2, positive: true }} description="vs last month" />
        <StatCard loading={loading} title="Active Meters" value={stats?.active_meters.toLocaleString() || "0"} icon={<Gauge className="h-5 w-5" />} trend={{ value: 2.1, positive: true }} description="vs last month" />
        <StatCard loading={loading} title="Revenue" value={`₹${stats?.total_revenue.toLocaleString() || "0"}`} icon={<DollarSign className="h-5 w-5" />} trend={{ value: 12.4, positive: true }} description="vs last month" />
        <StatCard loading={loading} title="Total Complaints" value={stats?.total_complaints.toLocaleString() || "0"} icon={<MessageSquareWarning className="h-5 w-5" />} trend={{ value: 8, positive: false }} description="vs last month" />
        <StatCard loading={loading} title="Overdue Bills" value={stats?.overdue_bills.toLocaleString() || "0"} icon={<AlertTriangle className="h-5 w-5" />} trend={{ value: 3.5, positive: false }} description="vs last month" />
        <StatCard loading={loading} title="Recharge Vol." value={stats?.recharge_volume.toLocaleString() || "0"} icon={<Wallet className="h-5 w-5" />} trend={{ value: 7.8, positive: true }} description="vs last month" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="card-shadow card-hover xl:col-span-1 animate-fade-in">
          <CardHeader><CardTitle className="text-base">Monthly Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `₹${v/1000}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Keeping Recharge Distribution mocked for now as no API endpoint provided */}
        <Card className="card-shadow card-hover animate-fade-in">
          <CardHeader><CardTitle className="text-base">Recharge Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={rechargeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow card-hover animate-fade-in">
          <CardHeader><CardTitle className="text-base">Complaint Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={complaintChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {complaintChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
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
