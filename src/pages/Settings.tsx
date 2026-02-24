import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { smsTemplates } from "@/data/mockData";
import { toast } from "sonner";

export default function SettingsPage() {
  const [templates, setTemplates] = useState(smsTemplates);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="billing">
        <TabsList>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="templates">SMS Templates</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="mt-4">
          <Card className="card-shadow max-w-xl">
            <CardHeader><CardTitle className="text-base">Billing Configuration</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={e => { e.preventDefault(); toast.success("Billing settings saved!"); }} className="space-y-4">
                <div><Label>Billing Cycle (days)</Label><Input type="number" defaultValue={30} /></div>
                <div><Label>Late Fee (%)</Label><Input type="number" defaultValue={2} /></div>
                <div><Label>Grace Period (days)</Label><Input type="number" defaultValue={7} /></div>
                <div><Label>Currency</Label><Input defaultValue="INR (₹)" disabled /></div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="space-y-4 max-w-xl">
            {templates.map((tpl, i) => (
              <Card key={tpl.id} className="card-shadow">
                <CardHeader><CardTitle className="text-sm">{tpl.name}</CardTitle></CardHeader>
                <CardContent>
                  <Textarea
                    value={tpl.body}
                    onChange={e => setTemplates(prev => prev.map((t, j) => j === i ? { ...t, body: e.target.value } : t))}
                    rows={3}
                  />
                  <Button size="sm" className="mt-2" onClick={() => toast.success(`Template "${tpl.name}" saved!`)}>Save</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <Card className="card-shadow max-w-xl">
            <CardHeader><CardTitle className="text-base">Admin Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={e => { e.preventDefault(); toast.success("Profile updated!"); }} className="space-y-4">
                <div><Label>Full Name</Label><Input defaultValue="Admin User" /></div>
                <div><Label>Email</Label><Input defaultValue="admin@smartmeter.gov" /></div>
                <div><Label>Phone</Label><Input defaultValue="+91 98765 00000" /></div>
                <div><Label>Department</Label><Input defaultValue="Smart Metering Division" /></div>
                <Button type="submit">Update Profile</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <Card className="card-shadow max-w-xl">
            <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={e => { e.preventDefault(); toast.success("Password changed!"); }} className="space-y-4">
                <div><Label>Current Password</Label><Input type="password" /></div>
                <div><Label>New Password</Label><Input type="password" /></div>
                <div><Label>Confirm New Password</Label><Input type="password" /></div>
                <Button type="submit">Change Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="card-shadow max-w-xl">
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Email notifications for new complaints", def: true },
                { label: "SMS alerts for overdue payments", def: true },
                { label: "Daily summary report", def: false },
                { label: "Weekly analytics digest", def: true },
                { label: "System maintenance alerts", def: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <Switch defaultChecked={item.def} onCheckedChange={() => toast.success("Preference updated")} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
