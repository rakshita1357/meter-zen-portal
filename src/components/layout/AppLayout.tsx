import { useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService, NotificationResponse } from "@/services/notifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard, Users, MessageSquareWarning, MessageCircle,
  DollarSign, Settings, Menu, X, Bell, Search, ChevronRight,
  Moon, Sun, LogOut, CheckCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import wattwiseLogo from "@/assets/wattwise-logo.png";
import api from "@/lib/api";

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
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getLatest(10)
  });

  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ['notificationsUnread'],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 60000 // Poll every minute
  });

  const markReadMutation = useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationsUnread'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationsUnread'] });
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (location.pathname === "/") navigate("/dashboard", { replace: true });
  }, [location.pathname, navigate]);

  useEffect(() => {
    // Ping mechanism to keep Render server awake
    const interval = setInterval(() => {
      api.get('/').catch(() => {}); // Fire and forget, ignore errors
    }, 9 * 60 * 1000); // 9 minutes

    return () => clearInterval(interval);
  }, []);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-4">
        <img
          src={wattwiseLogo}
          alt="WattWise Logo"
          className="h-9 w-9 object-contain transition-transform duration-300 hover:scale-110"
        />
        {sidebarOpen && <span className="text-lg font-bold text-sidebar-foreground tracking-tight">WattWise</span>}
      </div>
      <nav className="mt-6 flex-1 space-y-1.5 px-3">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-accent text-sidebar-primary sidebar-active-indicator"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5", sidebarOpen ? "" : "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            A
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Admin User</p>
              <p className="truncate text-xs text-sidebar-foreground/50">admin@wattwise.gov</p>
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
        "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64" : "w-[72px]"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 h-full w-64 bg-sidebar animate-slide-in-right">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/60 bg-card/80 backdrop-blur-md px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-transform duration-200 active:scale-95"
            onClick={() => { if (window.innerWidth < 1024) setMobileOpen(!mobileOpen); else setSidebarOpen(!sidebarOpen); }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="relative hidden flex-1 sm:block max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search anything..." className="pl-9 bg-muted/40 border-none rounded-lg" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="transition-all duration-200 hover:bg-accent/10 active:scale-95" onClick={() => setDark(!dark)}>
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative transition-all duration-200 hover:bg-accent/10 active:scale-95">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <h4 className="font-semibold">Notifications</h4>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-auto text-xs text-muted-foreground" onClick={() => markAllReadMutation.mutate()}>
                      <CheckCheck className="mr-1 h-3 w-3" /> Mark all read
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[300px]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          className={cn(
                            "flex flex-col items-start gap-1 p-4 text-left hover:bg-muted/50 transition-colors border-b last:border-0",
                            !n.is_read && "bg-muted/20"
                          )}
                          onClick={() => !n.is_read && markReadMutation.mutate(n.id)}
                        >
                          <div className="flex w-full items-start justify-between gap-2">
                            <span className="font-medium text-sm">{n.title}</span>
                            {!n.is_read && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                A
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
            <Button variant="ghost" size="icon" className="transition-all duration-200 hover:bg-destructive/10 active:scale-95" onClick={() => { logout(); navigate("/login"); }} title="Logout">
              <LogOut className="h-5 w-5 text-destructive" />
            </Button>
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
