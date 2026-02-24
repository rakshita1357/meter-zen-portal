import { useState, useEffect } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Wallet, TrendingUp, Award, Download, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { revenueByState, paymentMethodData, monthlyRevenue, mockTransactions, simulateApiCall } from "@/data/mockData";
import { toast } from "sonner";

const COLORS = ["hsl(215,70%,40%)", "hsl(174,60%,40%)", "hsl(38,92%,50%)", "hsl(152,60%,40%)"];

export default function RevenuePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { simulateApiCall(null).then(() => setLoading(false)); }, []);

  const txnColumns = [
    { key: "id", header: "Txn ID", sortable: true },
    { key: "userName", header: "User", sortable: true },
    { key: "meterId", header: "Meter ID" },
    { key: "amount", header: "Amount", sortable: true, render: (t: typeof mockTransactions[0]) => `₹${t.amount.toLocaleString()}` },
    { key: "method", header: "Method" },
    { key: "date", header: "Date", sortable: true },
    { key: "status", header: "Status", render: (t: typeof mockTransactions[0]) => <Badge variant={t.status === "Success" ? "default" : t.status === "Failed" ? "destructive" : "secondary"}>{t.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Revenue & Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Export to Excel simulation")}><FileSpreadsheet className="mr-2 h-4 w-4" />Export Excel</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Download PDF simulation")}><Download className="mr-2 h-4 w-4" />Download PDF</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard loading={loading} title="Total Revenue" value="₹18.43L" icon={<DollarSign className="h-5 w-5" />} trend={{ value: 12, positive: true }} description="this quarter" />
        <StatCard loading={loading} title="Pending Revenue" value="₹4.2L" icon={<Clock className="h-5 w-5" />} />
        <StatCard loading={loading} title="Total Recharges" value="1,470" icon={<Wallet className="h-5 w-5" />} />
        <StatCard loading={loading} title="Avg Bill Value" value="₹2,850" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard loading={loading} title="Highest Payment" value="₹5,600" icon={<Award className="h-5 w-5" />} description="Arjun Reddy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="card-shadow animate-fade-in">
          <CardHeader><CardTitle className="text-base">Revenue by State</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueByState}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="state" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `₹${v/1000}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow animate-fade-in">
          <CardHeader><CardTitle className="text-base">Payment Methods</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {paymentMethodData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow animate-fade-in">
          <CardHeader><CardTitle className="text-base">Monthly Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `₹${v/1000}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader><CardTitle className="text-base">Recharge History</CardTitle></CardHeader>
        <CardContent>
          <DataTable data={mockTransactions} columns={txnColumns} searchKey="userName" searchPlaceholder="Search transactions..." loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
