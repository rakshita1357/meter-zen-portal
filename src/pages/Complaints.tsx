import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complaintService, Complaint } from "@/services/complaints";
import { dashboardService } from "@/services/dashboard";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Clock, CheckCircle, AlertTriangle, Eye, MessageSquare } from "lucide-react";
import { toast } from "sonner";

type Status = "Open" | "In Progress" | "Resolved" | "Escalated";

const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Low: "secondary", Medium: "default", High: "destructive",
};

export default function ComplaintsPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [note, setNote] = useState("");

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['complaints', filterStatus, filterPriority],
    queryFn: () => complaintService.getAll({
       status: filterStatus === "all" ? undefined : filterStatus,
       priority: filterPriority === "all" ? undefined : filterPriority
    })
  });

  const { data: complaintStats = [] } = useQuery({
    queryKey: ['complaintStats'],
    queryFn: dashboardService.getComplaintStatus
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: Status }) => complaintService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaintStats'] });
      toast.success(`Status updated to ${variables.status}`);
    },
    onError: () => toast.error("Failed to update status")
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string, note: string }) => complaintService.addNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success("Note added");
      setNote("");
      setNoteOpen(false);
      // Ideally refresh selected complaint details too if needed, but current UI uses 'complaints' list for details
    },
    onError: () => toast.error("Failed to add note")
  });

  const stats = {
    open: complaintStats.find(s => s.status.toLowerCase() === "open")?.count || 0,
    inProgress: complaintStats.find(s => s.status.toLowerCase().includes("progress"))?.count || 0,
    resolved: complaintStats.find(s => s.status.toLowerCase() === "resolved")?.count || 0,
    escalated: complaintStats.find(s => s.status.toLowerCase() === "escalated")?.count || 0,
  };

  const columns = [
    { key: "id", header: "Complaint ID", sortable: true },
    { key: "userName", header: "User", sortable: true },
    { key: "issueType", header: "Issue Type" },
    { key: "priority", header: "Priority", render: (c: Complaint) => <Badge variant={priorityColors[c.priority] || "default"}>{c.priority}</Badge> },
    {
      key: "status", header: "Status",
      render: (c: Complaint) => (
        <Select 
          value={c.status} 
          onValueChange={(v) => updateStatusMutation.mutate({ id: c.id, status: v as Status })}
          disabled={updateStatusMutation.isPending}
        >
          <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(["Open", "In Progress", "Resolved", "Escalated"] as Status[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      ),
    },
    { key: "agent", header: "Agent" },
    { key: "created", header: "Created", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Complaints Management</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard loading={isLoading} title="Open" value={stats.open.toString()} icon={<AlertCircle className="h-5 w-5" />} description="active" />
        <StatCard loading={isLoading} title="In Progress" value={stats.inProgress.toString()} icon={<Clock className="h-5 w-5" />} description="ongoing" />
        <StatCard loading={isLoading} title="Resolved" value={stats.resolved.toString()} icon={<CheckCircle className="h-5 w-5" />} description="closed" />
        <StatCard loading={isLoading} title="Escalated" value={stats.escalated.toString()} icon={<AlertTriangle className="h-5 w-5" />} description="needs review" />
      </div>

      <DataTable
        data={complaints}
        columns={columns}
        searchKey="userName"
        searchPlaceholder="Search complaints..."
        loading={isLoading}
        filters={
          <>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Status</SelectItem>
                {(["Open","In Progress","Resolved","Escalated"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Select Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Priority</SelectItem>
                {(["Low","Medium","High"] as const).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
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
              {Object.entries({ "Complaint ID": selected.id, User: selected.userName, "Issue Type": selected.issueType, Priority: selected.priority, Status: selected.status, Agent: selected.agent, Created: selected.created }).map(([k, v]) => (
                <div key={k}><p className="text-xs font-medium text-muted-foreground">{k}</p><p className="text-sm font-medium">{String(v)}</p></div>
              ))}
              {selected.notes && selected.notes.length > 0 && (
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
          <Button 
            onClick={() => {
              if (selected && note.trim()) {
                addNoteMutation.mutate({ id: selected.id, note: note.trim() });
              }
            }}
            disabled={addNoteMutation.isPending || !note.trim()}
          >
            {addNoteMutation.isPending ? "Adding..." : "Add Note"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
