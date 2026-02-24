import { useState, useEffect } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { mockUsers, mockSmsLogs, smsTemplates, simulateApiCall } from "@/data/mockData";
import { Send, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function SmsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [messagePreview, setMessagePreview] = useState("");
  const [bulkCategory, setBulkCategory] = useState("all");
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState(mockSmsLogs);

  useEffect(() => { simulateApiCall(null).then(() => setLoading(false)); }, []);

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    const tpl = smsTemplates.find(t => String(t.id) === id);
    if (tpl) setMessagePreview(tpl.body);
  };

  const handleSend = () => {
    setSending(true);
    simulateApiCall(null, 1200).then(() => { setSending(false); toast.success("Message sent successfully!"); });
  };

  const handleBulkSend = () => {
    setSending(true);
    simulateApiCall(null, 1500).then(() => { setSending(false); toast.success(`Bulk SMS sent to ${bulkSelected.length || "all"} users!`); });
  };

  const toggleBulkUser = (id: string) => {
    setBulkSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const smsColumns = [
    { key: "id", header: "Message ID", sortable: true },
    { key: "userName", header: "User", sortable: true },
    { key: "type", header: "Type" },
    { key: "status", header: "Status", render: (r: typeof mockSmsLogs[0]) => <Badge variant={r.status === "Delivered" ? "default" : r.status === "Failed" ? "destructive" : "secondary"}>{r.status}</Badge> },
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
                <label className="text-sm font-medium">Select User</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger><SelectValue placeholder="Choose user" /></SelectTrigger>
                  <SelectContent>{mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name} ({u.id})</SelectItem>)}</SelectContent>
                </Select>
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
              <Button onClick={handleSend} disabled={!selectedUser || !messagePreview || sending}>
                <Send className="mr-2 h-4 w-4" />{sending ? "Sending..." : "Send Message"}
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
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="overdue">Overdue Only</SelectItem>
                    <SelectItem value="pending">Pending Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 rounded border p-3">
                {mockUsers.filter(u => bulkCategory === "all" || u.status === (bulkCategory === "overdue" ? "Overdue" : "Pending")).map(u => (
                  <label key={u.id} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={bulkSelected.includes(u.id)} onCheckedChange={() => toggleBulkUser(u.id)} />
                    {u.name} - {u.id}
                  </label>
                ))}
              </div>
              <Button onClick={handleBulkSend} disabled={sending}>
                <Send className="mr-2 h-4 w-4" />{sending ? "Sending..." : "Send Bulk SMS"}
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
            loading={loading}
            actions={(r) => (
              r.status === "Failed" ? (
                <Button variant="ghost" size="sm" onClick={() => { toast.success("Retrying..."); setLogs(prev => prev.map(l => l.id === r.id ? { ...l, status: "Pending" } : l)); }}>
                  <RotateCcw className="mr-1 h-3 w-3" />Retry
                </Button>
              ) : null
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
