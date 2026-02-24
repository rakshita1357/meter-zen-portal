import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md card-shadow-md animate-fade-in">
        <CardHeader className="items-center space-y-4 pb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Zap className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">WattWise Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your admin portal</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" placeholder="admin@wattwise.gov" defaultValue="admin@wattwise.gov" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input type="password" placeholder="••••••••" defaultValue="password123" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Demo credentials pre-filled. Click Sign In to continue.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
