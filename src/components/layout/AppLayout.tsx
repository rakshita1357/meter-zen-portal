import { useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard, Users, MessageSquareWarning, MessageCircle,
  DollarSign, Settings, Menu, X, Bell, Search, ChevronRight,
  Moon, Sun, Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/users", icon: Users },
  { label: "Complaints", path: "/complaints", icon: MessageSquareWarning },
  { label: "SMS & Notifications", path: "/sms", icon: MessageCircle },
  { label: "Revenue & Reports", path: "/revenue", icon: DollarSign },
  { label: "Settings", path: "/settings", icon: Settings },
];

function getBreadcrumbs(pathname: string) {
  const item = navItems.find((n) => pathname.startsWith(n.path));
  if (!item) return [{ label: "Home", path: "/" }];
  return [{ label: "Home", path: "/" }, { label: item.label, path: item.path }];
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const breadcrumbs = getBreadcrumbs(location.pathname);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (location.pathname === "/") navigate("/dashboard", { replace: true });
  }, [location.pathname, navigate]);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Zap className="h-5 w-5" />
        </div>
        {sidebarOpen && <span className="text-lg font-bold text-sidebar-foreground">WattWise</span>}
      </div>
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2", sidebarOpen ? "" : "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            A
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Admin User</p>
              <p className="truncate text-xs text-sidebar-foreground/60">admin@wattwise.gov</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        sidebarOpen ? "w-64" : "w-[72px]"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 h-full w-64 bg-sidebar animate-slide-in-right">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 card-shadow lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => { if (window.innerWidth < 1024) setMobileOpen(!mobileOpen); else setSidebarOpen(!sidebarOpen); }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="relative hidden flex-1 sm:block max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search anything..." className="pl-9 bg-muted/50 border-none" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                A
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 px-4 py-3 text-sm text-muted-foreground lg:px-6">
          {breadcrumbs.map((b, i) => (
            <span key={b.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{b.label}</span>
              ) : (
                <Link to={b.path} className="hover:text-foreground transition-colors">{b.label}</Link>
              )}
            </span>
          ))}
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 pb-8 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
