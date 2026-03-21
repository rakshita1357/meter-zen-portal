import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, User } from "@/services/users";
import { referenceService } from "@/services/reference";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Pencil, Ban, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type BalanceTimePeriod = "today" | "lastWeek" | "lastMonth" | "year";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  
  // Filters state
  const [filterActive, setFilterActive] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [filterDiscom, setFilterDiscom] = useState("all");
  const [filterAmount, setFilterAmount] = useState("all");
  const [customAmount, setCustomAmount] = useState("");
  const [balanceTimePeriod, setBalanceTimePeriod] = useState<BalanceTimePeriod>("lastMonth");

  // Fetch Reference Data
  const { data: statesList = [] } = useQuery({
    queryKey: ['states'],
    queryFn: referenceService.getStates
  });

  const { data: discomsList = [] } = useQuery({
    queryKey: ['discoms', filterState],
    queryFn: () => referenceService.getDiscoms(filterState !== "all" ? statesList.find(s => s.name === filterState)?.id : undefined),
    enabled: true // Always fetch, API handles optional state_id
  });

  // Fetch Users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', filterState, filterDiscom, filterActive, filterAmount, customAmount],
    queryFn: () => userService.getAll({
       state: filterState,
       discom: filterDiscom,
       active: filterActive === "all" ? undefined : filterActive === "active",
       amount_gt: filterAmount === "custom" ? Number(customAmount) : filterAmount !== "all" ? Number(filterAmount) : undefined
    })
  });

  const toggleActiveMutation = useMutation({
    mutationFn: userService.toggleActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User status updated");
    },
    onError: () => toast.error("Failed to update status")
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<User> }) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditOpen(false);
      toast.success("User updated successfully");
    },
    onError: () => toast.error("Failed to update user")
  });

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    updateUserMutation.mutate({
      id: selectedUser.id,
      data: {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        state: formData.get('state') as string,
      }
    });
  };

  const columns = [
    { key: "id", header: "User ID", sortable: true },
    { key: "consumerId", header: "Consumer ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "meterId", header: "Meter ID" },
    { key: "phone", header: "Phone" },
    { key: "state", header: "State" },
    { key: "discom", header: "DISCOM" },
    { key: "billAmount", header: "Bill (₹)", sortable: true, render: (u: User) => `₹${u.billAmount.toLocaleString()}` },
    { key: "lastPayment", header: "Last Payment", sortable: true },
    { key: "activeComplaint", header: "Active Complaint", render: (u: User) => u.activeComplaint ? <Badge variant="destructive">Yes</Badge> : <Badge variant="secondary">No</Badge> },
    { key: "complaintId", header: "Complaint ID", render: (u: User) => u.activeComplaint ? u.complaintId : "—" },
    { key: "remainingBalance", header: "Remaining Bal.", sortable: true, render: (u: User) => `₹${u.remainingBalance.toLocaleString()}` },
    { key: "balanceUsed", header: "Balance Used", sortable: true, render: (u: User) => `₹${u.balanceUsedByTime?.[balanceTimePeriod]?.toLocaleString() ?? 0}` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <DataTable
        data={users}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search users..."
        loading={isLoading}
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterState} onValueChange={(v) => { setFilterState(v); setFilterDiscom("all"); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Select State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select State</SelectItem>
                {statesList.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterDiscom} onValueChange={setFilterDiscom} disabled={filterState === "all"}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Select DISCOM" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select DISCOM</SelectItem>
                {discomsList.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
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
            <Button variant="ghost" size="icon" onClick={() => toggleActiveMutation.mutate(user.id)} disabled={toggleActiveMutation.isPending}>
               {toggleActiveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className={`h-4 w-4 ${!user.active ? "text-destructive" : ""}`} />}
            </Button>
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
                "Remaining Balance": `₹${selectedUser.remainingBalance}`,
                Active: selectedUser.active ? "Yes" : "No",
              }).map(([k, v]) => (
                <div key={k}><p className="text-xs font-medium text-muted-foreground">{k}</p><p className="text-sm font-medium">{v}</p></div>
              ))}
              {selectedUser.activeComplaint && selectedUser.complaintId && (
                 <div><p className="text-xs font-medium text-muted-foreground">Complaint ID</p><p className="text-sm font-medium">{selectedUser.complaintId}</p></div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          {selectedUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={selectedUser.name} /></div>
              <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" defaultValue={selectedUser.phone} /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" defaultValue={selectedUser.email} /></div>
              <div><Label htmlFor="state">State</Label><Input id="state" name="state" defaultValue={selectedUser.state} /></div>
              <Button type="submit" className="w-full" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
