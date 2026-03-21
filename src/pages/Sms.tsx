import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { smsService, SMSLog } from "@/services/sms";
import { userService, User } from "@/services/users";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { smsTemplates } from "@/data/mockData";
import { Send, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function UserIdSearch({ value, onChange, users }: { value: string; onChange: (v: string) => void, users: User[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.length > 0
    ? users.filter(u => u.id.toLowerCase().includes(query.toLowerCase()) || u.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const selectedUser = users.find(u => u.id === value);

  return (
    <div className="relative" ref={ref}>
      <Input
        placeholder="Type User ID..."
        value={query || (selectedUser ? `${selectedUser.id} — ${selectedUser.name}` : "")}
        onChange={e => { setQuery(e.target.value); onChange(""); setOpen(true); }}
        onFocus={() => { if (query.length > 0) setOpen(true); }}
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md py-1 max-h-48 overflow-y-auto">
          {filtered.map(u => (
            <button
              key={u.id}
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => { onChange(u.id); setQuery(""); setOpen(false); }}
            >
              <span className="font-medium">{u.id}</span> — {u.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SmsPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [messagePreview, setMessagePreview] = useState("");
  const [bulkCategory, setBulkCategory] = useState("all");
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [bulkMessage, setBulkMessage] = useState("");

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll()
  });

  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['smsLogs'],
    queryFn: smsService.getLogs
  });

  const sendSingleMutation = useMutation({
    mutationFn: smsService.sendSingle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smsLogs'] });
      toast.success("Message sent successfully!");
    },
    onError: () => toast.error("Failed to send message")
  });

  const sendBulkMutation = useMutation({
    mutationFn: smsService.sendBulk,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['smsLogs'] });
      toast.success(`Bulk SMS sent: ${data.sent} sent, ${data.failed} failed`);
    },
    onError: () => toast.error("Failed to send bulk SMS")
  });

  const retryMutation = useMutation({
    mutationFn: smsService.retry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smsLogs'] });
      toast.success("Retrying SMS...");
    },
    onError: () => toast.error("Retry failed")
  });

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    const tpl = smsTemplates.find(t => String(t.id) === id);
    if (tpl) setMessagePreview(tpl.body);
  };

  const handleSend = () => {
    if (!selectedUser || !messagePreview) return;
    sendSingleMutation.mutate({
      user_id: selectedUser,
      message: messagePreview
    });
  };

  const handleBulkSend = () => {
    const category = bulkSelected.length > 0 ? "selected_users" : bulkCategory;
    if (category === "all" && bulkSelected.length === 0) {
      toast.error("Please select a category or specific users. 'All' is not supported for bulk send.");
      return;
    }
    
    sendBulkMutation.mutate({
      category: category as any,
      message: bulkMessage || "Notification", // Default message or add input for bulk message
      user_ids: bulkSelected.length > 0 ? bulkSelected : undefined
    });
  };

  const toggleBulkUser = (id: string) => {
    setBulkSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const smsColumns = [
    { key: "id", header: "Message ID", sortable: true },
    { key: "userName", header: "User", sortable: true },
    { key: "type", header: "Type" },
    { key: "status", header: "Status", render: (r: SMSLog) => <Badge variant={r.status === "Delivered" ? "default" : r.status === "Failed" ? "destructive" : "secondary"}>{r.status}</Badge> },
    { key: "sentDate", header: "Sent Date", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">SMS & Notifications</h1>

      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="bulk">Bulk SMS</TabsTrigger>
          <TabsTrigger value="logs">SMS Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-4">
          <Card className="card-shadow max-w-xl">
            <CardHeader><CardTitle className="text-base">Send Individual Reminder</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">User ID</label>
                <UserIdSearch value={selectedUser} onChange={setSelectedUser} users={users} />
              </div>
              <div>
                <label className="text-sm font-medium">Template</label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger><SelectValue placeholder="Choose template" /></SelectTrigger>
                  <SelectContent>{smsTemplates.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Message Preview</label>
                <Textarea value={messagePreview} onChange={e => setMessagePreview(e.target.value)} rows={4} />
              </div>
              <Button onClick={handleSend} disabled={!selectedUser || !messagePreview || sendSingleMutation.isPending}>
                <Send className="mr-2 h-4 w-4" />{sendSingleMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="mt-4">
          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-base">Bulk SMS</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={bulkCategory} onValueChange={setBulkCategory}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Select Users (Manual)</SelectItem>
                    <SelectItem value="overdue">Overdue Only</SelectItem>
                    <SelectItem value="pending">Pending Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                   value={bulkMessage} 
                   onChange={e => setBulkMessage(e.target.value)} 
                   placeholder="Enter message for bulk SMS..."
                   rows={3}
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 rounded border p-3">
                {users.filter(u => bulkCategory === "all" || u.status === (bulkCategory === "overdue" ? "Overdue" : "Pending")).map(u => (
                  <label key={u.id} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={bulkSelected.includes(u.id)} onCheckedChange={() => toggleBulkUser(u.id)} />
                    {u.name} - {u.id}
                  </label>
                ))}
              </div>
              <Button onClick={handleBulkSend} disabled={sendBulkMutation.isPending || !bulkMessage}>
                <Send className="mr-2 h-4 w-4" />{sendBulkMutation.isPending ? "Sending..." : "Send Bulk SMS"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <DataTable
            data={logs}
            columns={smsColumns}
            searchKey="userName"
            searchPlaceholder="Search SMS logs..."
            loading={logsLoading}
            actions={(r) => (
              r.status === "Failed" ? (
                <Button variant="ghost" size="sm" onClick={() => retryMutation.mutate(r.id)} disabled={retryMutation.isPending}>
                  {retryMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin"/> : <RotateCcw className="mr-1 h-3 w-3" />}Retry
                </Button>
              ) : null
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
