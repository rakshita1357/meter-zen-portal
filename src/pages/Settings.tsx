import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService, BillingSettings, AdminProfile, NotificationSettings } from "@/services/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { smsTemplates } from "@/data/mockData";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [templates, setTemplates] = useState(smsTemplates);

  // Billing Query & Mutation
  const { data: billing, isLoading: billingLoading } = useQuery({
    queryKey: ['billingSettings'],
    queryFn: settingsService.getBilling
  });

  const updateBillingMutation = useMutation({
    mutationFn: settingsService.updateBilling,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billingSettings'] });
      toast.success("Billing settings saved!");
    },
    onError: () => toast.error("Failed to save billing settings")
  });

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    updateBillingMutation.mutate({
      billing_cycle_days: Number(formData.get("billing_cycle_days")),
      late_fee_amount: Number(formData.get("late_fee_amount")),
      grace_period_days: Number(formData.get("grace_period_days")),
      auto_disconnect_enabled: billing?.auto_disconnect_enabled ?? true
    });
  };

  // Profile Query & Mutation
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: settingsService.getProfile
  });

  const updateProfileMutation = useMutation({
    mutationFn: settingsService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProfile'] });
      toast.success("Profile/Password updated!");
      // Clear password fields if any
    },
    onError: () => toast.error("Update failed")
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    updateProfileMutation.mutate({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone") as string,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const pass = formData.get("new_password") as string;
    const confirm = formData.get("confirm_password") as string;

    if (pass !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    
    updateProfileMutation.mutate({
      // Assuming backend handles partial updates or I need to send current profile too?
      // Typically PUT replaces, PATCH updates. But doc says PUT /api/admin/profile.
      // I'll send current profile data + new password
      name: profile?.name || "",
      email: profile?.email || "",
      phone_number: profile?.phone_number || "",
      password: pass
    });
  };

  // Notifications Query & Mutation
  const { data: notifications, isLoading: notifyLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: settingsService.getNotifications
  });

  const updateNotifyMutation = useMutation({
    mutationFn: settingsService.updateNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
      toast.success("Preferences updated");
    },
    onError: () => toast.error("Failed to update preferences")
  });

  const toggleNotification = (key: keyof NotificationSettings) => {
    if (!notifications) return;
    updateNotifyMutation.mutate({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  if (billingLoading || profileLoading || notifyLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

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
              <form onSubmit={handleBillingSubmit} className="space-y-4">
                <div><Label htmlFor="billing_cycle_days">Billing Cycle (days)</Label><Input id="billing_cycle_days" name="billing_cycle_days" type="number" defaultValue={billing?.billing_cycle_days} /></div>
                <div><Label htmlFor="late_fee_amount">Late Fee (₹)</Label><Input id="late_fee_amount" name="late_fee_amount" type="number" defaultValue={billing?.late_fee_amount} /></div>
                <div><Label htmlFor="grace_period_days">Grace Period (days)</Label><Input id="grace_period_days" name="grace_period_days" type="number" defaultValue={billing?.grace_period_days} /></div>
                
                <div className="flex items-center justify-between">
                  <Label>Auto Disconnect</Label>
                  <Switch 
                    checked={billing?.auto_disconnect_enabled} 
                    onCheckedChange={(checked) => updateBillingMutation.mutate({ ...billing!, auto_disconnect_enabled: checked })} 
                  />
                </div>
                
                <Button type="submit" disabled={updateBillingMutation.isPending}>
                  {updateBillingMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
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
                  <Button size="sm" className="mt-2" onClick={() => toast.success(`Template "${tpl.name}" saved locally!`)}>Save</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <Card className="card-shadow max-w-xl">
            <CardHeader><CardTitle className="text-base">Admin Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" name="name" defaultValue={profile?.name} /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" name="email" defaultValue={profile?.email} /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" defaultValue={profile?.phone_number} /></div>
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <Card className="card-shadow max-w-xl">
            <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div><Label htmlFor="new_password">New Password</Label><Input type="password" id="new_password" name="new_password" required /></div>
                <div><Label htmlFor="confirm_password">Confirm New Password</Label><Input type="password" id="confirm_password" name="confirm_password" required /></div>
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="card-shadow max-w-xl">
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "SMS Alerts Enabled", key: "sms_alerts_enabled" as const },
                { label: "Email Alerts Enabled", key: "email_alerts_enabled" as const },
                { label: "Outage Notifications", key: "outage_notifications" as const },
                { label: "Billing Notifications", key: "billing_notifications" as const },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <Switch 
                     checked={notifications?.[item.key]} 
                     onCheckedChange={() => toggleNotification(item.key)} 
                     disabled={updateNotifyMutation.isPending}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
