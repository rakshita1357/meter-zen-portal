import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserPlus, Copy, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

function generateId() {
  return "USR-" + String(Math.floor(1000 + Math.random() * 9000));
}
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [credentials, setCredentials] = useState<{ userId: string; password: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(phone)) e.phone = "Enter 10-digit number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setCredentials({ userId: generateId(), password: generatePassword() });
      setLoading(false);
      toast.success("Registration successful!");
    }, 1500);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (credentials) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-md card-shadow-md animate-fade-in">
          <CardHeader className="items-center space-y-4 pb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">
              <Check className="h-7 w-7" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Registration Successful</h1>
              <p className="text-sm text-muted-foreground mt-1">Save your credentials securely</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "User ID", value: credentials.userId, field: "userId" },
              { label: "Password", value: credentials.password, field: "password" },
            ].map(({ label, value, field }) => (
              <div key={field} className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-mono font-semibold text-foreground">{value}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(value, field)}>
                  {copiedField === field ? <Check className="h-4 w-4 text-[hsl(var(--success))]" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ))}
            <Link to="/login">
              <Button className="w-full mt-2">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md card-shadow-md animate-fade-in">
        <CardHeader className="items-center space-y-4 pb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <UserPlus className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Register for WattWise Admin Portal</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Name", value: name, set: setName, type: "text", placeholder: "Full name", key: "name" },
              { label: "Email", value: email, set: setEmail, type: "email", placeholder: "you@example.com", key: "email" },
              { label: "Phone Number", value: phone, set: setPhone, type: "tel", placeholder: "10-digit number", key: "phone" },
            ].map(({ label, value, set, type, placeholder, key }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <Input type={type} placeholder={placeholder} value={value} onChange={(e) => { set(e.target.value); setErrors((p) => ({ ...p, [key]: undefined })); }} />
                {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
