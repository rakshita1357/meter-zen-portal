import { useState, useEffect } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUsers, simulateApiCall } from "@/data/mockData";
import { Eye, Pencil, Ban, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterActive, setFilterActive] = useState("all");

  useEffect(() => { simulateApiCall(null).then(() => setLoading(false)); }, []);

  const filtered = users.filter(u => {
    if (filterStatus !== "all" && u.status !== filterStatus) return false;
    if (filterActive === "active" && !u.active) return false;
    if (filterActive === "inactive" && u.active) return false;
    return true;
  });

  const columns = [
    { key: "id", header: "User ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "meterId", header: "Meter ID" },
    { key: "phone", header: "Phone" },
    { key: "billAmount", header: "Bill (₹)", sortable: true, render: (u: typeof mockUsers[0]) => `₹${u.billAmount.toLocaleString()}` },
    { key: "lastPayment", header: "Last Payment", sortable: true },
    {
      key: "status", header: "Status",
      render: (u: typeof mockUsers[0]) => (
        <Badge variant={u.status === "Paid" ? "default" : u.status === "Overdue" ? "destructive" : "secondary"}>
          {u.status}
        </Badge>
      ),
    },
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
          <>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </>
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

      {/* View Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>User Details</SheetTitle></SheetHeader>
          {selectedUser && (
            <div className="mt-6 space-y-4">
              {Object.entries({
                "User ID": selectedUser.id, Name: selectedUser.name, "Meter ID": selectedUser.meterId,
                Phone: selectedUser.phone, Email: selectedUser.email, Region: selectedUser.region,
                "Bill Amount": `₹${selectedUser.billAmount}`, "Last Payment": selectedUser.lastPayment,
                Status: selectedUser.status, Active: selectedUser.active ? "Yes" : "No",
              }).map(([k, v]) => (
                <div key={k}><p className="text-xs font-medium text-muted-foreground">{k}</p><p className="text-sm font-medium">{v}</p></div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          {selectedUser && (
            <form onSubmit={e => { e.preventDefault(); toast.success("User updated!"); setEditOpen(false); }} className="space-y-4">
              <div><Label>Name</Label><Input defaultValue={selectedUser.name} /></div>
              <div><Label>Phone</Label><Input defaultValue={selectedUser.phone} /></div>
              <div><Label>Email</Label><Input defaultValue={selectedUser.email} /></div>
              <div><Label>Region</Label><Input defaultValue={selectedUser.region} /></div>
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
