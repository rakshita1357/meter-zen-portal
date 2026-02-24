import { useState, useEffect } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUsers, simulateApiCall, states, stateDiscomMap } from "@/data/mockData";
import { Eye, Pencil, Ban, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type BalanceTimePeriod = "today" | "lastWeek" | "lastMonth" | "year";

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [filterActive, setFilterActive] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [filterDiscom, setFilterDiscom] = useState("all");
  const [filterAmount, setFilterAmount] = useState("all");
  const [customAmount, setCustomAmount] = useState("");
  const [balanceTimePeriod, setBalanceTimePeriod] = useState<BalanceTimePeriod>("lastMonth");

  useEffect(() => { simulateApiCall(null).then(() => setLoading(false)); }, []);

  const availableDiscoms = filterState !== "all" ? stateDiscomMap[filterState] || [] : [];

  const filtered = users.filter(u => {
    if (filterActive === "active" && !u.active) return false;
    if (filterActive === "inactive" && u.active) return false;
    if (filterState !== "all" && u.state !== filterState) return false;
    if (filterDiscom !== "all" && u.discom !== filterDiscom) return false;
    const amountThreshold = filterAmount === "custom" ? Number(customAmount) : filterAmount !== "all" ? Number(filterAmount) : 0;
    if (amountThreshold > 0 && u.billAmount < amountThreshold) return false;
    return true;
  });

  const columns = [
    { key: "id", header: "User ID", sortable: true },
    { key: "consumerId", header: "Consumer ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "meterId", header: "Meter ID" },
    { key: "phone", header: "Phone" },
    { key: "state", header: "State" },
    { key: "discom", header: "DISCOM" },
    { key: "billAmount", header: "Bill (₹)", sortable: true, render: (u: typeof mockUsers[0]) => `₹${u.billAmount.toLocaleString()}` },
    { key: "lastPayment", header: "Last Payment", sortable: true },
    { key: "activeComplaint", header: "Active Complaint", render: (u: typeof mockUsers[0]) => u.activeComplaint ? <Badge variant="destructive">Yes</Badge> : <Badge variant="secondary">No</Badge> },
    { key: "complaintId", header: "Complaint ID", render: (u: typeof mockUsers[0]) => u.activeComplaint ? u.complaintId : "—" },
    { key: "remainingBalance", header: "Remaining Bal.", sortable: true, render: (u: typeof mockUsers[0]) => `₹${u.remainingBalance.toLocaleString()}` },
    { key: "balanceUsed", header: "Balance Used", sortable: true, render: (u: typeof mockUsers[0]) => `₹${u.balanceUsedByTime[balanceTimePeriod].toLocaleString()}` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <DataTable
        data={filtered}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search users..."
        loading={loading}
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterState} onValueChange={(v) => { setFilterState(v); setFilterDiscom("all"); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Select State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select State</SelectItem>
                {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterDiscom} onValueChange={setFilterDiscom} disabled={filterState === "all"}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Select DISCOM" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select DISCOM</SelectItem>
                {availableDiscoms.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Select Users" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAmount} onValueChange={setFilterAmount}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Select Amount" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Amount</SelectItem>
                <SelectItem value="100">₹100+</SelectItem>
                <SelectItem value="500">₹500+</SelectItem>
                <SelectItem value="1000">₹1,000+</SelectItem>
                <SelectItem value="5000">₹5,000+</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {filterAmount === "custom" && (
              <Input
                type="number"
                placeholder="Min amount"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className="w-28"
              />
            )}
            <Select value={balanceTimePeriod} onValueChange={(v) => setBalanceTimePeriod(v as BalanceTimePeriod)}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Balance Used" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        actions={(user) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setDrawerOpen(true); }}><Eye className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setEditOpen(true); }}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => {
              setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
              toast.success(`User ${user.active ? "blocked" : "unblocked"}`);
            }}><Ban className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => toast.info("Navigating to user portal...")}><ExternalLink className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>User Details</SheetTitle></SheetHeader>
          {selectedUser && (
            <div className="mt-6 space-y-4">
              {Object.entries({
                "User ID": selectedUser.id, "Consumer ID": selectedUser.consumerId, Name: selectedUser.name, "Meter ID": selectedUser.meterId,
                Phone: selectedUser.phone, Email: selectedUser.email, State: selectedUser.state, DISCOM: selectedUser.discom,
                "Bill Amount": `₹${selectedUser.billAmount}`, "Last Payment": selectedUser.lastPayment,
                "Active Complaint": selectedUser.activeComplaint ? "Yes" : "No",
                ...(selectedUser.activeComplaint ? { "Complaint ID": selectedUser.complaintId } : {}),
                "Remaining Balance": `₹${selectedUser.remainingBalance}`,
                Active: selectedUser.active ? "Yes" : "No",
              }).map(([k, v]) => (
                <div key={k}><p className="text-xs font-medium text-muted-foreground">{k}</p><p className="text-sm font-medium">{v}</p></div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          {selectedUser && (
            <form onSubmit={e => { e.preventDefault(); toast.success("User updated!"); setEditOpen(false); }} className="space-y-4">
              <div><Label>Name</Label><Input defaultValue={selectedUser.name} /></div>
              <div><Label>Phone</Label><Input defaultValue={selectedUser.phone} /></div>
              <div><Label>Email</Label><Input defaultValue={selectedUser.email} /></div>
              <div><Label>State</Label><Input defaultValue={selectedUser.state} /></div>
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
