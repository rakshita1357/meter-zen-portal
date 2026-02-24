import { useState, useEffect } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { mockComplaints, agents, simulateApiCall } from "@/data/mockData";
import { AlertCircle, Clock, CheckCircle, AlertTriangle, Eye, MessageSquare } from "lucide-react";
import { toast } from "sonner";

type Complaint = typeof mockComplaints[0];
type Status = "Open" | "In Progress" | "Resolved" | "Escalated";
type Priority = "Low" | "Medium" | "High";

const statusColors: Record<string, string> = {
  Open: "destructive", "In Progress": "default", Resolved: "secondary", Escalated: "outline",
};

const priorityColors: Record<string, string> = {
  Low: "secondary", Medium: "default", High: "destructive",
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Array<{ id: string; userName: string; issueType: string; priority: string; status: string; agent: string; created: string; notes: string[] }>>(mockComplaints);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string; userName: string; issueType: string; priority: string; status: string; agent: string; created: string; notes: string[] } | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => { simulateApiCall(null).then(() => setLoading(false)); }, []);

  const stats = {
    open: complaints.filter(c => c.status === "Open").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
    escalated: complaints.filter(c => c.status === "Escalated").length,
  };

  const filtered = complaints.filter(c => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterPriority !== "all" && c.priority !== filterPriority) return false;
    return true;
  });

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const columns = [
    { key: "id", header: "Ticket ID", sortable: true },
    { key: "userName", header: "User", sortable: true },
    { key: "issueType", header: "Issue Type" },
    { key: "priority", header: "Priority", render: (c: Complaint) => <Badge variant={priorityColors[c.priority] as any}>{c.priority}</Badge> },
    {
      key: "status", header: "Status",
      render: (c: Complaint) => (
        <Select value={c.status} onValueChange={(v) => { updateComplaint(c.id, { status: v as Status }); toast.success(`Status updated to ${v}`); }}>
          <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(["Open", "In Progress", "Resolved", "Escalated"] as Status[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "agent", header: "Agent",
      render: (c: Complaint) => (
        <Select value={c.agent} onValueChange={v => { updateComplaint(c.id, { agent: v }); toast.success(`Assigned to ${v}`); }}>
          <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{agents.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
        </Select>
      ),
    },
    { key: "created", header: "Created", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Complaints Management</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard loading={loading} title="Open" value={stats.open} icon={<AlertCircle className="h-5 w-5" />} />
        <StatCard loading={loading} title="In Progress" value={stats.inProgress} icon={<Clock className="h-5 w-5" />} />
        <StatCard loading={loading} title="Resolved" value={stats.resolved} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard loading={loading} title="Escalated" value={stats.escalated} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKey="userName"
        searchPlaceholder="Search tickets..."
        loading={loading}
        filters={
          <>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Status</SelectItem>{(["Open","In Progress","Resolved","Escalated"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Priority</SelectItem>{(["Low","Medium","High"] as const).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </>
        }
        actions={(c) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => { setSelected(c); setDetailOpen(true); }}><Eye className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => { setSelected(c); setNoteOpen(true); }}><MessageSquare className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>Complaint Details</SheetTitle></SheetHeader>
          {selected && (
            <div className="mt-6 space-y-4">
              {Object.entries({ "Ticket ID": selected.id, User: selected.userName, "Issue Type": selected.issueType, Priority: selected.priority, Status: selected.status, Agent: selected.agent, Created: selected.created }).map(([k, v]) => (
                <div key={k}><p className="text-xs font-medium text-muted-foreground">{k}</p><p className="text-sm font-medium">{String(v)}</p></div>
              ))}
              {selected.notes.length > 0 && (
                <div><p className="text-xs font-medium text-muted-foreground mb-2">Internal Notes</p>{selected.notes.map((n, i) => <p key={i} className="text-sm bg-muted p-2 rounded mb-1">{n}</p>)}</div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Internal Note</DialogTitle></DialogHeader>
          <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Write a note..." rows={4} />
          <Button onClick={() => {
            if (selected && note.trim()) {
              updateComplaint(selected.id, { notes: [...selected.notes, note.trim()] });
              toast.success("Note added");
              setNote(""); setNoteOpen(false);
            }
          }}>Add Note</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
