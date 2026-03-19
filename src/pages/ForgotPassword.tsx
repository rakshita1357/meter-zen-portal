import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("OTP sent to +91 " + phone);
      navigate("/verify-otp", { state: { phone } });
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md card-shadow-md animate-fade-in">
        <CardHeader className="items-center space-y-4 pb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Phone className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your phone number to receive OTP</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
            <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to Login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
